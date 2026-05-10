'use client';

import React, { useState } from 'react';
import { aiAPI, reportAPI } from '@/lib/api';
import { StatusBadge } from '@/components/Badges';
import { AlertTriangle, Brain } from 'lucide-react';

export default function MultimodalAIBrain() {
  const [patientId, setPatientId] = useState('');
  const [formData, setFormData] = useState({
    symptoms: [],
    vitalSigns: {},
    labResults: {},
  });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [symptom, setSymptom] = useState('');

  const handleAddSymptom = () => {
    if (symptom.trim()) {
      setFormData(prev => ({
        ...prev,
        symptoms: [...prev.symptoms, symptom],
      }));
      setSymptom('');
    }
  };

  const handleVitalSignChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      vitalSigns: {
        ...prev.vitalSigns,
        [key]: parseFloat(value),
      },
    }));
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!patientId) {
      alert('Please enter patient ID');
      return;
    }

    setLoading(true);
    try {
      const response = await aiAPI.analyzePatient({
        patientId,
        ...formData,
      });
      setAnalysis(response.data.analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Brain className="w-8 h-8 text-purple-600" />
        Multimodal Healthcare AI
      </h1>

      {/* Input Form */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-bold">Patient Analysis</h2>

        <div>
          <label className="block text-sm font-medium mb-2">Patient ID</label>
          <input
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            placeholder="Enter patient ID"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Symptoms */}
        <div>
          <label className="block text-sm font-medium mb-2">Symptoms</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              placeholder="Add symptom (e.g., chest pain, fever)"
              className="flex-1 px-4 py-2 border rounded-lg"
              onKeyPress={(e) => e.key === 'Enter' && handleAddSymptom()}
            />
            <button
              onClick={handleAddSymptom}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.symptoms.map((s, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {s}
                <button
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    symptoms: prev.symptoms.filter((_, i) => i !== idx),
                  }))}
                  className="ml-2 font-bold hover:text-red-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Vital Signs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Heart Rate (bpm)</label>
            <input
              type="number"
              onChange={(e) => handleVitalSignChange('heartRate', e.target.value)}
              placeholder="e.g., 72"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Temperature (°C)</label>
            <input
              type="number"
              step="0.1"
              onChange={(e) => handleVitalSignChange('temperature', e.target.value)}
              placeholder="e.g., 37.0"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Blood Pressure (Systolic)</label>
            <input
              type="number"
              onChange={(e) => handleVitalSignChange('bpSystolic', e.target.value)}
              placeholder="e.g., 120"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Oxygen Saturation (%)</label>
            <input
              type="number"
              onChange={(e) => handleVitalSignChange('oxygenSaturation', e.target.value)}
              placeholder="e.g., 98"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze Patient'}
        </button>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-bold">AI Analysis Report</h2>
          <StatusBadge status="completed" />

          {/* Risk Score */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Overall Risk Score</span>
              <span className={`text-2xl font-bold ${
                analysis.aiInsights.riskScore > 75 ? 'text-red-600' :
                analysis.aiInsights.riskScore > 50 ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {analysis.aiInsights.riskScore}/100
              </span>
            </div>
          </div>

          {/* Predicted Conditions */}
          <div className="space-y-2">
            <h3 className="font-bold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Predicted Conditions
            </h3>
            {analysis.aiInsights.predictedConditions.map((cond, idx) => (
              <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm capitalize">{cond.name.replace('_', ' ')}</span>
                  <span className="text-sm font-bold text-blue-600">{cond.probability}%</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{cond.evidence.join(' • ')}</p>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Recommendations</h3>
            <ul className="space-y-1">
              {analysis.aiInsights.recommendations.map((rec, idx) => (
                <li key={idx} className="text-sm">• {rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
