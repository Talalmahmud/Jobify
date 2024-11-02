import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnect } from "./utils/db.js";
import bodyParser from "body-parser";
import userRoute from "./routes/userRoute.js";
import aiRoute from "./routes/aiRoute.js";

const port = process.env.PORT;
const app = express();

dbConnect();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1", userRoute);
app.use("/api/v1", aiRoute);

app.use((err, req, res, next) => {
  res.status(500).json({ error: "Internal server error." });
});

app.use((req, res) => {
  res.status(404).json({ error: "Page not found" });
});

app.listen(port, () => console.log("sever is running"));
