import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(301).json({ message: "User already exist" });
    }
    user = await User.create(req.body);
    return res.status(200).json({ message: "User created", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error });
  }
};

export const login = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    console.log(user);
    if (!user) {
      return res.status(301).json({
        message: "Unauthorized user or email or password may be wrong",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const isPasswordValid = bcrypt.compare(user?.password, salt);
    if (isPasswordValid) {
      const encodingData = jwt.sign(
        { id: user._id, email: user.email, role: user.role, name: user.name },
        "talal",
        { expiresIn: "3h" }
      );

      res.cookie("access_token", encodingData, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000 * 3,
      });

      return res.status(200).json({ token: encodingData });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error });
  }
};

export const userUpdate = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || !req.body) {
      return res
        .status(400)
        .json({ message: "User ID and update data are required" });
    }

    const updateUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      select: "email name",
    });

    if (!updateUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User updated", updateUser });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const userDelete = async (req, res) => {
  try {
    const { userId } = req.params;
    let user = await User.findByIdAndDelete(userId, { select: "email name" });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User is deleted", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error });
  }
};
