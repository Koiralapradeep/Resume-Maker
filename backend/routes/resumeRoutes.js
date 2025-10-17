import express from "express";
import { generateResume } from "../controllers/resumeController.js";

const router = express.Router();

// POST /api/resume/generate
router.post("/generate", generateResume);

export default router;
