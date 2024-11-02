import express from "express";
import {
  login,
  signup,
  userDelete,
  userUpdate,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";
import { roleCheck } from "../middleware/roleCheck.js";

const router = express.Router();

router.post("/signup", authMiddleware, roleCheck("super-admin"), signup);
router.post("/login", authMiddleware, roleCheck("super-admin"), login);
router.delete(
  "/user/:userId",
  authMiddleware,
  roleCheck("super-admin"),
  userDelete
);
router.patch(
  "/user/:userId",
  authMiddleware,
  roleCheck("super-admin"),
  userUpdate
);

export default router;
