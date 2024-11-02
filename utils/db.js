import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const mongoURI = process.env.MONGO_URI;

export const dbConnect = async () => {
  try {
    if (!mongoURI) {
      throw new Error("MONGO_URI environment variable is not defined");
    }

    await mongoose.connect(mongoURI, {
      autoIndex: true, // Add any other options if needed
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

// Mongoose connection listeners
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from DB");
});

// Handle application termination
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Mongoose disconnected on SIGINT");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await mongoose.connection.close();
  console.log("Mongoose disconnected on SIGTERM");
  process.exit(0);
});
