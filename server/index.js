const express = require('express');
const PDFDocument = require('pdfkit');

const app = express();
app.use(express.json());

app.post('/api/report', (req, res) => {
  const {
    dealerName,
    assessmentType,
    assessmentDate,
    oem,
    location,
    data,
    insights,
    summary
  } = req.body;

  const doc = new PDFDocument();
  const filename = `${dealerName || 'Dealer'}_${assessmentType || 'Assessment'}_${assessmentDate || new Date().toISOString().slice(0,10)}.pdf`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  doc.pipe(res);

  // Cover Page
  doc.fontSize(24).text('Dealership Diagnostic Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(16).text(`Dealer: ${dealerName}`);
  doc.text(`Assessment Date: ${assessmentDate}`);
  doc.text(`OEM: ${oem}`);
  doc.text(`Location: ${location}`);
  doc.moveDown();
  doc.fontSize(10).text('Confidential - For internal use only', { align: 'center' });

  doc.addPage();

  // Executive Summary
  if (summary) {
    doc.fontSize(18).text('Executive Summary');
    doc.moveDown();
    doc.fontSize(12).text(`Overall Score: ${summary.score}`);
    doc.text(`Maturity Level: ${summary.level}`);
    doc.moveDown();
    if (summary.strengths && summary.strengths.length) {
      doc.text('Key Strengths:');
      summary.strengths.forEach(s => doc.text(`- ${s}`));
      doc.moveDown();
    }
    if (summary.weaknesses && summary.weaknesses.length) {
      doc.text('Key Weaknesses:');
      summary.weaknesses.forEach(w => doc.text(`- ${w}`));
      doc.moveDown();
    }
    if (summary.recommendations && summary.recommendations.length) {
      doc.text('Priority Recommendations:');
      summary.recommendations.slice(0,5).forEach(r => doc.text(`- ${r}`));
    }
  }

  doc.addPage();

  // Section-wise Results
  doc.fontSize(18).text('Section Results');
  Object.entries(data || {}).forEach(([key, value]) => {
    doc.moveDown();
    doc.fontSize(14).text(key);
    doc.fontSize(12).text(`Selected: ${value}`);
  });

  doc.addPage();

  // KPI Dashboard (placeholder)
  doc.fontSize(18).text('Overall KPI Dashboard');
  doc.moveDown();
  doc.fontSize(12).text('KPI visualisations are not implemented in this prototype.');

  doc.addPage();

  // Appendix (placeholder)
  doc.fontSize(18).text('Appendix');
  doc.moveDown();
  doc.fontSize(12).text('Full question list and methodology will be provided in the full version.');

  doc.end();
});

app.listen(3001, () => {
  console.log('PDF report server running on port 3001');
});
