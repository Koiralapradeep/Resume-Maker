import PDFDocument from "pdfkit";

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
    } = data;

    const doc = new PDFDocument({ margin: 40 });
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      res
        .set({
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename=${(personal.name || "resume")
            .replace(/\s+/g, "_")
            .toLowerCase()}.pdf`,
        })
        .send(pdfBuffer);
    });

    // --- Resume Header ---
    doc.fontSize(22).text(personal.name || "Unnamed", { align: "center" });
    if (personal.email) doc.fontSize(12).text(`Email: ${personal.email}`, { align: "center" });
    if (personal.phone) doc.text(`Phone: ${personal.phone}`, { align: "center" });
    doc.moveDown();

    // --- Summary ---
    if (summary) {
      doc.fontSize(14).text("Professional Summary", { underline: true });
      doc.fontSize(12).text(summary);
      doc.moveDown();
    }

    // --- Education ---
    if (education.length) {
      doc.fontSize(14).text("Education", { underline: true });
      education.forEach((edu) => {
        doc.fontSize(12).text(`${edu.degree || ""} — ${edu.institution || ""}`);
        if (edu.year) doc.text(`Year: ${edu.year}`);
        doc.moveDown(0.5);
      });
    }

    // --- Experience ---
    if (experience.length) {
      doc.addPage();
      doc.fontSize(14).text("Experience", { underline: true });
      experience.forEach((exp) => {
        doc.fontSize(12).text(`${exp.role || ""} at ${exp.company || ""}`);
        if (exp.duration) doc.text(`Duration: ${exp.duration}`);
        if (exp.description) doc.text(exp.description);
        doc.moveDown(0.5);
      });
    }

    // --- Skills ---
    if (skills.length) {
      doc.moveDown();
      doc.fontSize(14).text("Skills", { underline: true });
      doc.fontSize(12).text(skills.join(", "));
    }

    doc.end();
  } catch (err) {
    console.error("PDF generation failed:", err);
    res.status(500).json({ error: err.message });
  }
};
