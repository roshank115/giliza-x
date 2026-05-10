const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Mock patient database
const patients = new Map();

// POST: Create new patient
router.post('/', (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      dateOfBirth,
      gender,
      bloodType,
      address,
      emergencyContact,
      medicalHistory,
      allergies,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email required' });
    }

    const patientId = uuidv4();
    const patient = {
      id: patientId,
      name,
      email,
      phone,
      dateOfBirth,
      gender,
      bloodType,
      address,
      emergencyContact,
      medicalHistory: medicalHistory || [],
      allergies: allergies || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    patients.set(patientId, patient);

    res.status(201).json({
      message: 'Patient created',
      patient,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Retrieve patient
router.get('/:id', (req, res) => {
  try {
    const patient = patients.get(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT: Update patient
router.put('/:id', (req, res) => {
  try {
    const patient = patients.get(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Update fields
    Object.keys(req.body).forEach((key) => {
      if (key !== 'id' && key !== 'createdAt') {
        patient[key] = req.body[key];
      }
    });
    patient.updatedAt = new Date();

    res.json({
      message: 'Patient updated',
      patient,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: List all patients (for doctor)
router.get('/', (req, res) => {
  try {
    const patientList = Array.from(patients.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({
      patients: patientList,
      total: patientList.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
