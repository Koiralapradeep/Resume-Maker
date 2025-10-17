import path from "path";
import fs from "fs";
import puppeteer from "puppeteer";
import Handlebars from "handlebars";
import dotenv from "dotenv";

dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

const esc = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

// Main Controller
export const generateResume = async (req, res) => {
  try {
    const data = req.body || {};
    const {
      personal = {},
      summary = "",
      education = [],
      experience = [],
      skills = [],
      projects = [],
      certifications = [],
      languages = [],
      interests = [],
      template = "modern",
    } = data;

    // Absolute photo path
    let photoUrl = personal?.photo || "";
    if (photoUrl && !photoUrl.startsWith("http")) {
      photoUrl = `${BACKEND_URL.replace(/\/$/, "")}/${photoUrl.replace(/^\/+/, "")}`;
    }

    // Load Template
    const templatePath = path.join(process.cwd(), "templates", `${template}Template.html`);
    const templateHtml = fs.readFileSync(templatePath, "utf8");

    // Compile template
    const compileTemplate = Handlebars.compile(templateHtml);
    const renderedHtml = compileTemplate({
      personal: { ...personal, photo: photoUrl },
      summary,
      education,
      experience,
      skills,
      projects,
      certifications,
      languages,
      interests,
    });

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Apply safe fallback for unsupported color spaces + avoid page breaks
    const safeCss = `
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-scheme: light !important;
      }
      html, body {
        margin: 0;
        padding: 0;
        background: white;
      }
      .no-break, header, .resume-header, .resume-summary {
        page-break-inside: avoid !important;
        page-break-after: avoid !important;
      }
    `;
    await page.setContent(
      `<style>${safeCss}</style>${renderedHtml}`,
      { waitUntil: "networkidle0" }
    );

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "15mm", bottom: "15mm", left: "12mm", right: "12mm" },
      preferCSSPageSize: true,
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${(personal.name || "resume")
        .replace(/\s+/g, "_")
        .toLowerCase()}.pdf`,
    });
    res.send(pdfBuffer);
  } catch (err) {
  console.error("PDF generation failed:", err);
  res.status(500).json({ error: err.message });
}

};
