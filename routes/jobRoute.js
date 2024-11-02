import express from "express";
import {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
} from "./controllers/jobController.js";
import { authMiddleware } from "./middleware/authMiddleware.js";

const router = express.Router();

router.post("/jobs", authMiddleware, roleCheck("admin"), createJob);
router.get("/jobs", getJobs);
router.put("/jobs/:jobId", authMiddleware, roleCheck("admin"), updateJob);
router.delete("/jobs/:jobId", authMiddleware, roleCheck("admin"), deleteJob);

export default router;
