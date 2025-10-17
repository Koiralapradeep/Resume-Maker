import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateResumePDF = async (req, res) => {
  try {
    const data = req.body;

    //  Template path
    const templatePath = path.join(__dirname, "../templates/modernTemplate.html");

    // Read and compile HTML template
    const html = fs.readFileSync(templatePath, "utf8");
    const template = handlebars.compile(html);

    //  Fix image URL if still localhost
    if (data.personal?.photo && data.personal.photo.includes("localhost")) {
      const publicURL =
        process.env.BACKEND_URL?.replace(/\/$/, "") ||
        process.env.RENDER_EXTERNAL_URL?.replace(/\/$/, "") ||
        `https://${req.get("host")}`;
      data.personal.photo = data.personal.photo.replace("http://localhost:5000", publicURL);
    }

    const renderedHTML = template(data);

    //  Puppeteer launch (Render-safe)
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage",
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || (await puppeteer.executablePath()),
    });

    const page = await browser.newPage();
    await page.setContent(renderedHTML, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${data.personal?.name || "resume"}.pdf"`,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error(" PDF generation error:", error);
    res.status(500).json({
      message: "PDF generation failed",
      error: error.message,
    });
  }
};
