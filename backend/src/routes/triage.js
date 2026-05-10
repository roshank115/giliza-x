const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const axios = require('axios');

// Mock data storage
const triageQueue = [];
const triageHistory = new Map();

// Triage assessment data structure
const createTriageAssessment = (patientData) => {
  const symptoms = patientData.symptoms || [];
  const vitalSigns = patientData.vitalSigns || {};
  
  // AI-powered urgency scoring algorithm
  let urgencyScore = 0;
  let riskFactors = [];

  // Evaluate vital signs
  if (vitalSigns.heartRate > 120 || vitalSigns.heartRate < 60) {
    urgencyScore += 30;
    riskFactors.push('Abnormal heart rate');
  }
  if (vitalSigns.bloodPressure && (vitalSigns.bloodPressure.systolic > 180 || vitalSigns.bloodPressure.systolic < 90)) {
    urgencyScore += 35;
    riskFactors.push('Critical blood pressure');
  }
  if (vitalSigns.respiratoryRate > 30 || vitalSigns.respiratoryRate < 12) {
    urgencyScore += 25;
    riskFactors.push('Abnormal respiratory rate');
  }
  if (vitalSigns.temperature > 39 || vitalSigns.temperature < 35) {
    urgencyScore += 20;
    riskFactors.push('Critical temperature');
  }
  if (vitalSigns.oxygenSaturation < 90) {
    urgencyScore += 40;
    riskFactors.push('Low oxygen saturation');
  }

  // Evaluate symptoms
  const criticalSymptoms = ['unconscious', 'severe chest pain', 'difficulty breathing', 'severe bleeding', 'poisoning'];
  const severeSymptoms = ['chest pain', 'abdominal pain', 'seizures', 'head injury', 'stroke symptoms'];
  const moderateSymptoms = ['fever', 'vomiting', 'dizziness', 'mild pain'];

  symptoms.forEach(symptom => {
    if (criticalSymptoms.includes(symptom.toLowerCase())) {
      urgencyScore += 50;
      riskFactors.push(`Critical symptom: ${symptom}`);
    } else if (severeSymptoms.includes(symptom.toLowerCase())) {
      urgencyScore += 30;
      riskFactors.push(`Severe symptom: ${symptom}`);
    } else if (moderateSymptoms.includes(symptom.toLowerCase())) {
      urgencyScore += 15;
      riskFactors.push(`Moderate symptom: ${symptom}`);
    }
  });

  // Determine urgency level
  let urgencyLevel = 'GREEN';
  let estimatedWaitTime = '60 minutes';

  if (urgencyScore >= 80) {
    urgencyLevel = 'RED';
    estimatedWaitTime = 'Immediate';
  } else if (urgencyScore >= 50) {
    urgencyLevel = 'YELLOW';
    estimatedWaitTime = '15-30 minutes';
  }

  return {
    id: uuidv4(),
    timestamp: new Date(),
    patientData,
    urgencyScore: Math.min(urgencyScore, 100),
    urgencyLevel,
    riskFactors,
    estimatedWaitTime,
    status: 'pending',
    hospitalNotified: false,
  };
};

// POST: Submit patient for triage assessment
router.post('/assess', async (req, res) => {
  try {
    const assessment = createTriageAssessment(req.body);
    
    // Add to queue
    triageQueue.push(assessment);
    triageHistory.set(assessment.id, assessment);

    // Sort queue by urgency
    triageQueue.sort((a, b) => {
      const urgencyOrder = { RED: 0, YELLOW: 1, GREEN: 2 };
      return urgencyOrder[a.urgencyLevel] - urgencyOrder[b.urgencyLevel];
    });

    // Notify via WebSocket if high urgency
    if (assessment.urgencyLevel === 'RED') {
      const io = req.app.get('io');
      io.emit('high-risk-alert', {
        id: assessment.id,
        patientName: req.body.patientName,
        urgencyLevel: assessment.urgencyLevel,
        riskFactors: assessment.riskFactors,
      });
    }

    res.status(201).json({
      message: 'Patient triaged successfully',
      assessment,
      queuePosition: triageQueue.findIndex(t => t.id === assessment.id) + 1,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Retrieve current emergency queue
router.get('/queue', (req, res) => {
  try {
    const queueStatus = triageQueue.map((item, index) => ({
      position: index + 1,
      id: item.id,
      patientName: item.patientData.patientName,
      urgencyLevel: item.urgencyLevel,
      urgencyScore: item.urgencyScore,
      estimatedWaitTime: item.estimatedWaitTime,
      timestamp: item.timestamp,
    }));

    res.json({
      totalPatients: queueStatus.length,
      queue: queueStatus,
      stats: {
        redCases: queueStatus.filter(p => p.urgencyLevel === 'RED').length,
        yellowCases: queueStatus.filter(p => p.urgencyLevel === 'YELLOW').length,
        greenCases: queueStatus.filter(p => p.urgencyLevel === 'GREEN').length,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: High-risk alerts
router.get('/alerts', (req, res) => {
  try {
    const alerts = Array.from(triageHistory.values())
      .filter(t => t.urgencyLevel === 'RED')
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 20);

    res.json({
      alerts,
      totalAlerts: alerts.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Get specific triage record
router.get('/:id', (req, res) => {
  try {
    const assessment = triageHistory.get(req.params.id);
    if (!assessment) {
      return res.status(404).json({ error: 'Triage record not found' });
    }
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT: Update triage status
router.put('/:id/status', (req, res) => {
  try {
    const assessment = triageHistory.get(req.params.id);
    if (!assessment) {
      return res.status(404).json({ error: 'Triage record not found' });
    }

    assessment.status = req.body.status;
    assessment.updatedAt = new Date();

    res.json({
      message: 'Status updated',
      assessment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
