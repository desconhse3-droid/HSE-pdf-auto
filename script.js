
async function processPDF() {
  const fileInput = document.getElementById('pdf-upload');
  const time = document.getElementById('time').value;
  const score = document.getElementById('score').value;

  if (!fileInput.files.length) return alert("Upload a PDF first.");

  const file = fileInput.files[0];
  const existingPdfBytes = await file.arrayBuffer();
  const { PDFDocument, rgb } = PDFLib;
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();
  const lastPage = pages[pages.length - 1];

  const signatureImageBytes = await fetch('signature_resized.png').then(res => res.arrayBuffer());
  const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
  const signatureDims = signatureImage.scale(0.5);

  // Fine-tuned coordinates for HSE row inside the FIELD AUDIT table
  lastPage.drawText("Muhammad Rehan Ameen", { x: 60, y: 250, size: 10 });
  lastPage.drawImage(signatureImage, { x: 160, y: 240, width: signatureDims.width, height: signatureDims.height });
  lastPage.drawText(time, { x: 320, y: 250, size: 10 });
  lastPage.drawText(score, { x: 400, y: 250, size: 10 });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "HSE_Auto_Filled.pdf";
  link.click();
}
