import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Folder where files will be saved
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename(req, file, cb) {
    const unique = `photo-${Date.now()}-${Math.floor(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, unique);
  },
});

const upload = multer({ storage });

//  POST /api/upload
router.post("/", upload.single("photo"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const baseURL =
    process.env.BACKEND_URL?.replace(/\/$/, "") || "http://localhost:5000";
  const fileUrl = `${baseURL}/uploads/${req.file.filename}`;

  console.log("File uploaded:", fileUrl);

  // Return same key consistently used by frontend
  res.status(200).json({ url: fileUrl });
});

export default router;
