import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import resumeRoutes from "./routes/resumeRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

// ----------------------
// PATH FIX (Render-safe)
// ----------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ----------------------
// CORS CONFIGURATION
// ----------------------
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "https://resume-maker-online.netlify.app", // your frontend domain
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// ----------------------
// JSON PAYLOADS
// ----------------------
app.use(express.json({ limit: "10mb" }));

// ----------------------
// STATIC FILES: uploads + templates
// ----------------------

// Serve uploads (so photos can load in PDF)
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    },
  })
);

// Allow static access to templates for debug
app.use(
  "/templates",
  express.static(path.join(__dirname, "templates"))
);

// ----------------------
// API ROUTES
// ----------------------
app.use("/api/resume", resumeRoutes);
app.use("/api/upload", uploadRoutes);

// ----------------------
// HEALTH CHECK
// ----------------------
app.get("/", (req, res) => {
  res.send(" Resume Builder backend is running successfully!");
});

// ----------------------
// ERROR HANDLER
// ----------------------
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  if (!res.headersSent) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ----------------------
// START SERVER
// ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
