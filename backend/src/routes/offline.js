const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Mock offline data storage
const offlineData = new Map();
const syncQueues = new Map();

// POST: Store data for offline use
router.post('/store', (req, res) => {
  try {
    const { deviceId, dataType, data } = req.body;

    if (!deviceId || !dataType || !data) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const key = `${deviceId}-${dataType}`;
    const record = {
      id: uuidv4(),
      deviceId,
      dataType,
      data,
      storedAt: new Date(),
      synced: false,
    };

    if (!offlineData.has(deviceId)) {
      offlineData.set(deviceId, []);
    }

    offlineData.get(deviceId).push(record);

    res.status(201).json({
      message: 'Data stored for offline use',
      record,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Sync offline data when online
router.post('/sync', (req, res) => {
  try {
    const { deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({ error: 'Device ID required' });
    }

    const deviceData = offlineData.get(deviceId) || [];
    const unsyncedData = deviceData.filter(d => !d.synced);

    // Simulate sync
    unsyncedData.forEach(record => {
      record.synced = true;
      record.syncedAt = new Date();
    });

    res.json({
      message: 'Data synced successfully',
      syncedRecords: unsyncedData.length,
      data: unsyncedData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Get offline-enabled medical models
router.get('/models/:type', (req, res) => {
  try {
    const modelType = req.params.type;
    // In production, this would serve actual model files (ONNX, TFLite)
    const models = {
      xray: {
        name: 'Chest X-Ray Detection Model',
        version: '1.0.0',
        size: '50MB',
        format: 'ONNX',
        downloadUrl: '/api/offline/download/xray-model-v1.onnx',
      },
      triage: {
        name: 'Emergency Triage Model',
        version: '1.0.0',
        size: '5MB',
        format: 'ONNX',
        downloadUrl: '/api/offline/download/triage-model-v1.onnx',
      },
    };

    const model = models[modelType];
    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }

    res.json(model);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Get offline mode status
router.get('/status/:deviceId', (req, res) => {
  try {
    const deviceData = offlineData.get(req.params.deviceId) || [];
    const unsyncedRecords = deviceData.filter(d => !d.synced).length;

    res.json({
      deviceId: req.params.deviceId,
      offlineModeEnabled: true,
      storedRecords: deviceData.length,
      unsyncedRecords,
      lastSync: deviceData.find(d => d.syncedAt)?.syncedAt || null,
      storageUsed: `${(deviceData.length * 2).toFixed(2)} MB`,
      storageAvailable: '500 MB',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
