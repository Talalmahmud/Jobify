import express from "express";
import { authMiddleware } from "../middleware/auth";
import {
  createCompany,
  deleteCompany,
  getCompanies,
  updateCompany,
} from "../controllers/companyController";
import { roleCheck } from "../middleware/roleCheck";

const router = express.Router();

router.post("/companies", authMiddleware, roleCheck("admin"), createCompany);
router.get("/companies", authMiddleware, roleCheck("admin"), getCompanies);
router.put(
  "/companies/:companyId",
  roleCheck("admin"),
  authMiddleware,
  updateCompany
);
router.delete(
  "/companies/:companyId",
  roleCheck("admin"),
  authMiddleware,
  deleteCompany
);

export default router;
