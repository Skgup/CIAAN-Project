import express from "express";
import { login, register,getUserProfile, updateUserProfile } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getUserProfile);
router.put("/me", authMiddleware, updateUserProfile);

export default router;   // ✅ Required for default import
