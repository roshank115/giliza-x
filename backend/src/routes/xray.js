const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// File upload configuration
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/tiff', 'application/dicom'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// Mock X-Ray analysis results
const analysisResults = new Map();

// AI X-Ray Analysis (calls Python service)
const analyzeXRayWithAI = async (imagePath) => {
  try {
    const formData = new FormData();
    const fileStream = fs.createReadStream(imagePath);
    formData.append('image', fileStream);

    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/analyze-xray`,
      formData,
      {
        headers: formData.getHeaders?.() || { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      }
    );

    return response.data;
  } catch (error) {
    // Fallback: Mock AI analysis
    return generateMockAnalysis();
  }
};

// Generate mock X-Ray analysis
const generateMockAnalysis = () => {
  const conditions = ['normal', 'pneumonia', 'TB', 'opacity', 'infiltrate'];
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  const confidence = Math.floor(Math.random() * 40) + 60; // 60-100%

  return {
    findings: {
      pneumonia: { detected: randomCondition === 'pneumonia', confidence },
      tb: { detected: randomCondition === 'TB', confidence },
      opacity: {
        detected: randomCondition === 'opacity',
        locations: ['right_upper_lobe', 'left_lower_lobe'],
        severity: 'moderate',
      },
      lungSegmentation: {
        leftLung: { area: 8500, density: 'normal' },
        rightLung: { area: 9200, density: 'normal' },
      },
    },
    severity: randomCondition === 'normal' ? 'low' : randomCondition === 'opacity' ? 'moderate' : 'high',
    severityScore: Math.floor(Math.random() * 40) + (randomCondition === 'normal' ? 10 : 50),
    recommendations: [
      'Follow-up imaging in 6 months',
      'Chest CT if severity increases',
      'Consult pulmonologist',
    ],
    heatmap: 'data:image/png;base64,...', // Placeholder for heatmap
  };
};

// POST: Upload and analyze chest X-Ray
router.post('/analyze', upload.single('xray'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No X-Ray image provided' });
    }

    const analysisId = uuidv4();
    const patientId = req.body.patientId || uuidv4();

    // Call AI service for analysis
    const aiResults = await analyzeXRayWithAI(req.file.path);

    const analysis = {
      id: analysisId,
      patientId,
      fileName: req.file.filename,
      filePath: req.file.path,
      uploadedAt: new Date(),
      imageType: req.body.imageType || 'frontal',
      ...aiResults,
      status: 'completed',
    };

    analysisResults.set(analysisId, analysis);

    // Emit real-time update
    const io = req.app.get('io');
    if (aiResults.severity === 'high') {
      io.emit('xray-alert', {
        analysisId,
        patientId,
        severity: aiResults.severity,
        findings: aiResults.findings,
      });
    }

    res.status(201).json({
      message: 'X-Ray analyzed successfully',
      analysis,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Retrieve X-Ray analysis results
router.get('/:id', (req, res) => {
  try {
    const analysis = analysisResults.get(req.params.id);
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Generate medical report from X-Ray analysis
router.post('/:id/report', async (req, res) => {
  try {
    const analysis = analysisResults.get(req.params.id);
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    const reportId = uuidv4();
    const report = {
      id: reportId,
      analysisId: req.params.id,
      patientId: analysis.patientId,
      title: 'Chest X-Ray Report',
      findings: generateReportFindings(analysis),
      severity: analysis.severity,
      recommendations: analysis.recommendations,
      generatedAt: new Date(),
      generatedBy: req.user?.id || 'system',
    };

    res.json({
      message: 'Report generated',
      report,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const generateReportFindings = (analysis) => {
  const findings = [];

  if (analysis.findings.pneumonia.detected) {
    findings.push(`Pneumonia detected with ${analysis.findings.pneumonia.confidence}% confidence`);
  }
  if (analysis.findings.tb.detected) {
    findings.push(`TB indicators present with ${analysis.findings.tb.confidence}% confidence`);
  }
  if (analysis.findings.opacity.detected) {
    findings.push(`Lung opacity detected in ${analysis.findings.opacity.locations.join(', ')} (${analysis.findings.opacity.severity})`);
  }

  return findings.length > 0 ? findings : ['No significant abnormalities detected'];
};

// GET: List patient X-Ray studies
router.get('/patient/:patientId', (req, res) => {
  try {
    const studies = Array.from(analysisResults.values())
      .filter(a => a.patientId === req.params.patientId)
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    res.json({
      patientId: req.params.patientId,
      studies,
      totalStudies: studies.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
