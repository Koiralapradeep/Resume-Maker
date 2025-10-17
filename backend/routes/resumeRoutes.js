import express from "express";
import { generateResumePDF } from "../controllers/resumeController.js";

const router = express.Router();
router.post("/generate", generateResumePDF);
export default router;
