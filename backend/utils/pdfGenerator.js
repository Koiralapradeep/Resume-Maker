import PDFDocument from "pdfkit";

export const createPDFBuffer = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      doc.fontSize(20).text("Resume", { align: "center" });
      doc.moveDown();
      doc.fontSize(14).text(`Name: ${data.name}`);
      doc.text(`Email: ${data.email}`);
      doc.moveDown();
      doc.text(`Education: ${data.education}`);
      doc.moveDown();
      doc.text(`Skills: ${data.skills}`);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
