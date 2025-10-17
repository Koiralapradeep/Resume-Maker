import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import resumeRoutes from "./routes/resumeRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS for frontend
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "https://resume-maker-online.netlify.app",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);


// Ensure JSON body parsing (and larger payloads allowed)
app.use(express.json({ limit: "10mb" }));

// Serve uploads safely
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

// Resume + Upload routes
app.use("/api/resume", resumeRoutes);
app.use("/api/upload", uploadRoutes);

// Health check route
app.get("/", (req, res) => res.send("Resume Builder backend running"));

// Handle uncaught errors gracefully (prevents premature socket close)
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  if (!res.headersSent) {
    res.status(500).json({ error: "Server Error" });
  }
});

// Launch server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(` Server running at http://localhost:${PORT}`)
);
