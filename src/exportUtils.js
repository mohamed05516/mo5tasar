// exportUtils.js - تصدير الملفات
import { jsPDF } from "jspdf";

export const exportToPDF = (title, content) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(title || "Summary", 10, 10);
  doc.setFontSize(12);
  const splitText = doc.splitTextToSize(content, 180);
  doc.text(splitText, 10, 20);
  doc.save("mo5tasar_summary.pdf");
};

export const exportToWord = (content) => {
  const blob = new Blob(['\ufeff' + content], {
    type: 'application/msword'
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'mo5tasar_summary.doc';
  link.click();
};

export const exportToImage = () => {
    alert("ميزة التصدير كصورة قيد التطوير!");
};
