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

    // Detect correct paths
    const templatePath = path.join(__dirname, "../templates/modernTemplate.html");

    // Read and compile HTML template
    const html = fs.readFileSync(templatePath, "utf8");
    const template = handlebars.compile(html);

    // Prepare public photo URL (if any)
    let photoUrl = data.personal?.photo || null;
    if (photoUrl && photoUrl.startsWith("http://localhost")) {
      // Replace localhost URL with public backend Render URL
      const publicURL =
        process.env.BACKEND_URL?.replace(/\/$/, "") ||
        process.env.RENDER_EXTERNAL_URL?.replace(/\/$/, "") ||
        `https://${req.get("host")}`;
      photoUrl = photoUrl.replace("http://localhost:5000", publicURL);
      data.personal.photo = photoUrl;
    }

    //  Generate HTML with data
    const renderedHTML = template(data);

    //  Launch Puppeteer (Render-safe)
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(renderedHTML, { waitUntil: "networkidle0" });

    //  Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    //  Return PDF response
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${data.personal?.name || "resume"}.pdf"`,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error(" PDF generation error:", error);
    res.status(500).json({ message: "PDF generation failed", error: error.message });
  }
};
