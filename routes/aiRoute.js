import express from "express";
import { aiTextGenerator } from "../controllers/aicontentController.js";

const router = express.Router();

router.post("/aitext", aiTextGenerator);

export default router;
