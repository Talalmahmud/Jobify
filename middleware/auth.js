import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized user" });
  }

  try {
    const decryptToken = jwt.verify(token, "talal");
    req.user = decryptToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized user" });
  }
};
