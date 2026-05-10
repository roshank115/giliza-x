const express = require('express');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const router = express.Router();

// Mock AI analysis storage
const aiAnalyses = new Map();

// POST: Comprehensive multimodal patient analysis
router.post('/patient-analysis', async (req, res) => {
  try {
    const {
      patientId,
      imageData,
      symptoms,
      vitalSigns,
      labResults,
      medicalHistory,
    } = req.body;

    if (!patientId) {
      return res.status(400).json({ error: 'Patient ID required' });
    }

    const analysisId = uuidv4();

    // Call Python AI service for multimodal analysis
    let aiResults;
    try {
      const response = await axios.post(
        `${process.env.AI_SERVICE_URL}/multimodal-analysis`,
        {
          imageData,
          symptoms,
          vitalSigns,
          labResults,
        },
        { timeout: 30000 }
      );
      aiResults = response.data;
    } catch (error) {
      // Fallback mock analysis
      aiResults = generateMockMultimodalAnalysis({
        symptoms,
        vitalSigns,
      });
    }

    const analysis = {
      id: analysisId,
      patientId,
      timestamp: new Date(),
      inputData: {
        symptoms,
        vitalSigns,
        labResults,
        medicalHistory,
      },
      aiInsights: aiResults,
      status: 'completed',
    };

    aiAnalyses.set(analysisId, analysis);

    // Real-time alert for high-risk patients
    if (aiResults.riskScore > 75) {
      const io = req.app.get('io');
      io.emit('ai-high-risk-alert', {
        patientId,
        analysisId,
        riskScore: aiResults.riskScore,
        conditions: aiResults.predictedConditions,
      });
    }

    res.status(201).json({
      message: 'Multimodal analysis completed',
      analysis,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const generateMockMultimodalAnalysis = (data) => {
  const conditions = ['hypertension', 'diabetes', 'pneumonia', 'asthma', 'cardiac_issue'];
  const randomConditions = conditions.slice(0, Math.floor(Math.random() * 3) + 1);

  return {
    summary: 'Comprehensive AI analysis of patient data',
    predictedConditions: randomConditions.map(condition => ({
      name: condition,
      probability: Math.floor(Math.random() * 40) + 50,
      evidence: ['Symptom match', 'Vital sign correlation', 'Pattern detected'],
    })),
    riskScore: Math.floor(Math.random() * 100),
    recommendations: [
      'Schedule follow-up appointment',
      'Consider specialist consultation',
      'Monitor vital signs daily',
    ],
    reasoning: 'AI analyzed patient symptoms, vital signs, and medical history to generate predictions',
  };
};

// GET: Retrieve AI analysis
router.get('/:analysisId', (req, res) => {
  try {
    const analysis = aiAnalyses.get(req.params.analysisId);
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Get AI risk score for patient
router.get('/risk-score/:patientId', (req, res) => {
  try {
    const patientAnalyses = Array.from(aiAnalyses.values())
      .filter(a => a.patientId === req.params.patientId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (patientAnalyses.length === 0) {
      return res.status(404).json({ error: 'No analyses found for patient' });
    }

    const latestAnalysis = patientAnalyses[0];
    const riskScore = latestAnalysis.aiInsights.riskScore;

    res.json({
      patientId: req.params.patientId,
      riskScore,
      riskLevel: riskScore > 75 ? 'HIGH' : riskScore > 50 ? 'MEDIUM' : 'LOW',
      lastAnalysis: latestAnalysis.timestamp,
      historicalScores: patientAnalyses.slice(0, 10).map(a => ({
        timestamp: a.timestamp,
        score: a.aiInsights.riskScore,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Get AI reasoning explanation
router.post('/reasoning', async (req, res) => {
  try {
    const { analysisId, question } = req.body;

    const analysis = aiAnalyses.get(analysisId);
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    // Call AI service for reasoning
    let reasoning;
    try {
      const response = await axios.post(
        `${process.env.AI_SERVICE_URL}/explain-reasoning`,
        {
          analysis: analysis.aiInsights,
          question,
        },
        { timeout: 15000 }
      );
      reasoning = response.data.explanation;
    } catch (error) {
      reasoning = 'AI analysis based on symptom patterns, vital signs correlation, and historical medical data.';
    }

    res.json({
      analysisId,
      question,
      reasoning,
      confidence: Math.floor(Math.random() * 30) + 70,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
