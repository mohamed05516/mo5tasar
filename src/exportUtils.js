// exportUtils.js - Multi-format export utilities for mo5tasar
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { toPng } from 'html-to-image';

/**
 * Export summary to PDF
 * @param {Object} summary - The summary object
 * @param {string} title - Document title
 */
export const exportToPDF = async (summary, title = 'mo5tasar Summary') => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Configure RTL support for Arabic
    doc.setR2L(true);
    doc.setLanguage('ar');

    let y = 20;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;

    // Helper function to add text with auto-pagination
    const addText = (text, fontSize = 12, isBold = false) => {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, 170);
      
      lines.forEach(line => {
        if (y + lineHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        
        if (isBold) {
          doc.setFont(undefined, 'bold');
        } else {
          doc.setFont(undefined, 'normal');
        }
        
        doc.text(line, 190, y, { align: 'right' });
        y += lineHeight;
      });
    };

    // Title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('mo5tasar - مختصر', 105, y, { align: 'center' });
    y += 15;

    // Main Idea
    addText('الفكرة الرئيسية:', 14, true);
    y += 2;
    addText(summary.mainIdea, 12);
    y += 10;

    // Key Points
    addText('النقاط الأساسية:', 14, true);
    y += 2;
    summary.keyPoints.forEach((point, idx) => {
      addText(`${idx + 1}. ${point}`, 12);
      y += 2;
    });
    y += 10;

    // Expected Question
    addText('سؤال متوقع في الامتحان:', 14, true);
    y += 2;
    addText(`س: ${summary.expectedQuestion.question}`, 12, true);
    y += 2;
    addText(`ج: ${summary.expectedQuestion.answer}`, 12);
    y += 10;

    // dzexams Insights
    addText('ملاحظات من أرشيف dzexams:', 14, true);
    y += 2;
    summary.dzexamsInsights.forEach((insight, idx) => {
      addText(`• ${insight}`, 12);
      y += 2;
    });
    y += 10;

    // Disclaimer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    addText('mo5tasar: هذا التلخيص تم بواسطة الذكاء الاصطناعي للمساعدة؛ تأكد من كتابك المدرسي.', 10);

    // Save
    doc.save(`mo5tasar-summary-${Date.now()}.pdf`);
    return true;

  } catch (error) {
    console.error('PDF Export Error:', error);
    throw new Error('فشل في تصدير PDF');
  }
};

/**
 * Export summary to Word (.docx)
 * @param {Object} summary - The summary object
 * @param {string} title - Document title
 */
export const exportToWord = async (summary, title = 'mo5tasar Summary') => {
  try {
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          // Title
          new Paragraph({
            text: 'mo5tasar - مختصر',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Main Idea Section
          new Paragraph({
            text: 'الفكرة الرئيسية',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
            alignment: AlignmentType.RIGHT,
          }),
          new Paragraph({
            text: summary.mainIdea,
            spacing: { after: 240 },
            alignment: AlignmentType.RIGHT,
          }),

          // Key Points Section
          new Paragraph({
            text: 'النقاط الأساسية',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
            alignment: AlignmentType.RIGHT,
          }),
          ...summary.keyPoints.map((point, idx) => 
            new Paragraph({
              text: `${idx + 1}. ${point}`,
              spacing: { after: 120 },
              alignment: AlignmentType.RIGHT,
            })
          ),

          // Expected Question Section
          new Paragraph({
            text: 'سؤال متوقع في الامتحان',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
            alignment: AlignmentType.RIGHT,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `س: ${summary.expectedQuestion.question}`,
                bold: true,
              }),
            ],
            spacing: { after: 120 },
            alignment: AlignmentType.RIGHT,
          }),
          new Paragraph({
            text: `ج: ${summary.expectedQuestion.answer}`,
            spacing: { after: 240 },
            alignment: AlignmentType.RIGHT,
          }),

          // dzexams Insights Section
          new Paragraph({
            text: 'ملاحظات من أرشيف dzexams',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
            alignment: AlignmentType.RIGHT,
          }),
          ...summary.dzexamsInsights.map(insight => 
            new Paragraph({
              text: `• ${insight}`,
              spacing: { after: 120 },
              alignment: AlignmentType.RIGHT,
            })
          ),

          // Disclaimer
          new Paragraph({
            text: 'mo5tasar: هذا التلخيص تم بواسطة الذكاء الاصطناعي للمساعدة؛ تأكد من كتابك المدرسي.',
            spacing: { before: 400 },
            alignment: AlignmentType.CENTER,
            italics: true,
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `mo5tasar-summary-${Date.now()}.docx`);
    return true;

  } catch (error) {
    console.error('Word Export Error:', error);
    throw new Error('فشل في تصدير Word');
  }
};

/**
 * Export summary to PNG image
 * @param {HTMLElement} element - The DOM element to convert
 */
export const exportToImage = async (element) => {
  if (!element) {
    throw new Error('Element not found');
  }

  try {
    const dataUrl = await toPng(element, {
      quality: 1.0,
      backgroundColor: '#ffffff',
      pixelRatio: 2, // Higher quality
    });

    // Convert to blob and download
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    saveAs(blob, `mo5tasar-summary-${Date.now()}.png`);
    return true;

  } catch (error) {
    console.error('Image Export Error:', error);
    throw new Error('فشل في تصدير الصورة');
  }
};

/**
 * Helper to prepare summary for export
 * @param {HTMLElement} summaryElement - The summary DOM element
 * @returns {Promise<HTMLElement>} Prepared element
 */
export const prepareSummaryForExport = async (summaryElement) => {
  // Clone the element to avoid modifying the original
  const clone = summaryElement.cloneNode(true);
  
  // Remove interactive elements
  const buttons = clone.querySelectorAll('button');
  buttons.forEach(btn => btn.remove());
  
  // Ensure proper styling for export
  clone.style.padding = '20px';
  clone.style.backgroundColor = '#ffffff';
  clone.style.maxWidth = '800px';
  clone.style.margin = '0 auto';
  
  return clone;
};

// Usage example:
/*
import { exportToPDF, exportToWord, exportToImage } from './exportUtils';

// Export to PDF
await exportToPDF(summaryObject);

// Export to Word
await exportToWord(summaryObject);

// Export to Image
const summaryElement = document.getElementById('summary-container');
await exportToImage(summaryElement);
*/
