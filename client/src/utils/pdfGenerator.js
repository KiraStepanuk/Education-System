import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function generateCertificatePDF(elementId, fileName = "certificate.pdf") {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error(`Елемент з id="${elementId}" не знайдено в DOM.`);
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const canvasRatio = canvas.height / canvas.width;
    let imgWidth = pageWidth;
    let imgHeight = imgWidth * canvasRatio;

    if (imgHeight > pageHeight) {
      imgHeight = pageHeight;
      imgWidth = imgHeight / canvasRatio;
    }

    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);

    pdf.save(fileName);
  } catch (error) {
    console.error("Помилка під час генерації PDF сертифіката:", error);
    throw error;
  }
}