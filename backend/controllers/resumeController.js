import axios from "axios";
import Handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Make photo URLs absolute
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
function absolutizePhoto(data) {
  const copy = { ...data, personal: { ...(data.personal || {}) } };
  const p = copy.personal?.photo;
  if (p && !/^https?:\/\//i.test(p)) {
    copy.personal.photo = `${BACKEND_URL.replace(/\/$/, "")}/${String(p).replace(/^\/+/, "")}`;
  }
  return copy;
}

export const generateResumePDF = async (req, res) => {
  try {
    // 1️⃣ Compile Handlebars template
    const htmlPath = path.join(__dirname, "../templates/modernTemplate.html");
    const html = fs.readFileSync(htmlPath, "utf-8");
    const template = Handlebars.compile(html);
    const compiledHTML = template(absolutizePhoto(req.body));

    // 2️⃣ Call html2pdf.app API
    const apiKey = process.env.HTML2PDF_KEY;
    const response = await axios.post(
      "https://api.html2pdf.app/v1/generate",
      { html: compiledHTML, apiKey },
      { responseType: "arraybuffer" }
    );

    // 3️⃣ Return PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="resume.pdf"');
    res.send(response.data);
  } catch (error) {
    console.error("PDF generation error:", error.message);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
};
