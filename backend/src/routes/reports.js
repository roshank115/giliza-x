const express = require('express');
const { v4: uuidv4 } = require('uuid');
const PDFDocument = require('pdfkit');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Mock report storage
const reports = new Map();

// POST: Generate medical report
router.post('/generate', (req, res) => {
  try {
    const {
      patientId,
      patientName,
      analysisId,
      findings,
      severity,
      recommendations,
      language = 'en',
    } = req.body;

    const reportId = uuidv4();
    const report = {
      id: reportId,
      patientId,
      patientName,
      analysisId,
      findings,
      severity,
      recommendations,
      language,
      generatedAt: new Date(),
      generatedBy: req.user?.id || 'system',
      status: 'draft',
      doctorNotes: '',
      isApproved: false,
    };

    reports.set(reportId, report);

    res.status(201).json({
      message: 'Report generated',
      report,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Retrieve report
router.get('/:id', (req, res) => {
  try {
    const report = reports.get(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT: Edit report
router.put('/:id/edit', (req, res) => {
  try {
    const report = reports.get(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Update fields
    report.findings = req.body.findings || report.findings;
    report.doctorNotes = req.body.doctorNotes || report.doctorNotes;
    report.recommendations = req.body.recommendations || report.recommendations;
    report.updatedAt = new Date();
    report.updatedBy = req.user?.id || 'system';

    res.json({
      message: 'Report updated',
      report,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT: Approve/finalize report
router.put('/:id/approve', (req, res) => {
  try {
    const report = reports.get(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    report.isApproved = true;
    report.approvedBy = req.user?.id || 'system';
    report.approvedAt = new Date();
    report.status = 'finalized';

    res.json({
      message: 'Report approved',
      report,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Export report as PDF
router.get('/:id/pdf', (req, res) => {
  try {
    const report = reports.get(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Create PDF
    const doc = new PDFDocument();
    const filename = `report-${report.id}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    doc.pipe(res);

    // Header
    doc.fontSize(20).text('MEDICAL REPORT', { align: 'center' }).moveDown();
    doc.fontSize(12).text(`Report ID: ${report.id}`, { align: 'right' }).moveDown(0.5);
    doc.text(`Generated: ${new Date(report.generatedAt).toLocaleDateString()}`, { align: 'right' }).moveDown();

    // Patient Info
    doc.fontSize(14).text('PATIENT INFORMATION', { underline: true }).moveDown();
    doc.fontSize(11).text(`Name: ${report.patientName}`);
    doc.text(`Patient ID: ${report.patientId}`).moveDown();

    // Findings
    doc.fontSize(14).text('FINDINGS', { underline: true }).moveDown();
    report.findings.forEach((finding) => {
      doc.fontSize(11).text(`• ${finding}`);
    });
    doc.moveDown();

    // Severity
    doc.fontSize(14).text('SEVERITY ASSESSMENT', { underline: true }).moveDown();
    doc.fontSize(11).text(`Level: ${report.severity.toUpperCase()}`);
    doc.moveDown();

    // Recommendations
    doc.fontSize(14).text('RECOMMENDATIONS', { underline: true }).moveDown();
    report.recommendations.forEach((rec) => {
      doc.fontSize(11).text(`• ${rec}`);
    });
    doc.moveDown();

    // Doctor Notes
    if (report.doctorNotes) {
      doc.fontSize(14).text('DOCTOR NOTES', { underline: true }).moveDown();
      doc.fontSize(11).text(report.doctorNotes).moveDown();
    }

    // Footer
    doc.fontSize(9).text('This is an automated medical report. Review and approval by licensed medical professional required.', { align: 'center', color: '#666' });

    doc.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: List patient reports
router.get('/patient/:patientId', (req, res) => {
  try {
    const patientReports = Array.from(reports.values())
      .filter(r => r.patientId === req.params.patientId)
      .sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt));

    res.json({
      patientId: req.params.patientId,
      reports: patientReports,
      totalReports: patientReports.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
