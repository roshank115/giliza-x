import React, { useState } from 'react';
import axios from 'axios';

const AIAnalysisPage: React.FC = () => {
  const [patientId, setPatientId] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await api.post('/ai/patient-analysis', {
        patientId,
        symptoms: symptoms.split(',').map(s => s.trim()),
        vitalSigns: {
          heartRate: 75,
          bloodPressure: { systolic: 120, diastolic: 80 },
          respiratoryRate: 16,
          temperature: 37,
          oxygenSaturation: 98,
        },
      });
      setAnalysis(response.data.analysis);
    } catch (error) {
      alert('Error analyzing patient data');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🧠 Multimodal Healthcare AI Brain</h1>

        <div className="bg-white p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-6">Comprehensive Patient Analysis</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Patient ID</label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full px-4 py-2 border rounded"
                placeholder="Enter patient ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Symptoms (comma-separated)</label>
              <input
                type="text"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full px-4 py-2 border rounded"
                placeholder="e.g., fever, cough, fatigue"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!patientId || loading}
              className="w-full bg-orange-600 text-white py-3 rounded font-bold hover:bg-orange-700 disabled:bg-gray-400"
            >
              {loading ? 'Analyzing...' : 'Run AI Analysis'}
            </button>
          </div>
        </div>

        {analysis && (
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">AI Analysis Results</h2>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">RISK SCORE</p>
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold text-orange-600">{analysis.aiInsights.riskScore}</div>
                  <div>
                    <p className="text-lg font-semibold">High Risk Detected</p>
                    <p className="text-sm text-gray-600">Requires immediate attention</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-semibold mb-3">Predicted Conditions:</p>
                <div className="space-y-2">
                  {analysis.aiInsights.predictedConditions.map((condition: any, idx: number) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded border-l-4 border-orange-500">
                      <p className="font-semibold capitalize">{condition.name.replace('_', ' ')}</p>
                      <p className="text-sm text-gray-600">Probability: {condition.probability}%</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-semibold mb-3">Recommendations:</p>
                <ul className="list-disc pl-5 space-y-2">
                  {analysis.aiInsights.recommendations.map((rec: string, idx: number) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalysisPage;
