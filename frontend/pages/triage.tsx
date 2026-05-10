import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaExclamationTriangle, FaAlertCircle } from 'react-icons/fa';

interface TriageAssessment {
  id: string;
  urgencyLevel: 'RED' | 'YELLOW' | 'GREEN';
  urgencyScore: number;
  estimatedWaitTime: string;
  riskFactors: string[];
  timestamp: string;
}

const TriagePage: React.FC = () => {
  const [patientName, setPatientName] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [vitalSigns, setVitalSigns] = useState({
    heartRate: 0,
    bloodPressure: { systolic: 0, diastolic: 0 },
    respiratoryRate: 0,
    temperature: 0,
    oxygenSaturation: 100,
  });
  const [queue, setQueue] = useState<TriageAssessment[]>([]);
  const [assessment, setAssessment] = useState<TriageAssessment | null>(null);
  const [loading, setLoading] = useState(false);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  const handleSubmitTriage = async () => {
    setLoading(true);
    try {
      const response = await api.post('/triage/assess', {
        patientName,
        symptoms,
        vitalSigns,
      });
      setAssessment(response.data.assessment);
      await fetchQueue();
    } catch (error) {
      alert('Error submitting triage');
    }
    setLoading(false);
  };

  const fetchQueue = async () => {
    try {
      const response = await api.get('/triage/queue');
      setQueue(response.data.queue);
    } catch (error) {
      console.error('Error fetching queue');
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'RED':
        return 'bg-red-100 border-red-500 text-red-900';
      case 'YELLOW':
        return 'bg-yellow-100 border-yellow-500 text-yellow-900';
      case 'GREEN':
        return 'bg-green-100 border-green-500 text-green-900';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🚨 Emergency Triage Engine</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Triage Form */}
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Patient Assessment</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Patient Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Enter patient name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Symptoms (comma-separated)</label>
                <input
                  type="text"
                  onChange={(e) => setSymptoms(e.target.value.split(',').map(s => s.trim()))}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="e.g., chest pain, shortness of breath"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Heart Rate</label>
                  <input
                    type="number"
                    value={vitalSigns.heartRate}
                    onChange={(e) => setVitalSigns({ ...vitalSigns, heartRate: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded"
                    placeholder="bpm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Temperature (°C)</label>
                  <input
                    type="number"
                    value={vitalSigns.temperature}
                    onChange={(e) => setVitalSigns({ ...vitalSigns, temperature: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded"
                    placeholder="°C"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Respiratory Rate</label>
                  <input
                    type="number"
                    value={vitalSigns.respiratoryRate}
                    onChange={(e) => setVitalSigns({ ...vitalSigns, respiratoryRate: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded"
                    placeholder="breaths/min"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">O₂ Saturation (%)</label>
                  <input
                    type="number"
                    value={vitalSigns.oxygenSaturation}
                    onChange={(e) => setVitalSigns({ ...vitalSigns, oxygenSaturation: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmitTriage}
                disabled={loading}
                className="w-full bg-red-600 text-white py-3 rounded font-bold hover:bg-red-700 disabled:bg-gray-400"
              >
                {loading ? 'Assessing...' : 'Submit Triage Assessment'}
              </button>
            </div>
          </div>

          {/* Assessment Result */}
          {assessment && (
            <div className={`p-8 rounded-lg border-2 ${getUrgencyColor(assessment.urgencyLevel)}`}>
              <div className="flex items-center gap-4 mb-4">
                {assessment.urgencyLevel === 'RED' && <FaExclamationTriangle className="text-3xl" />}
                {assessment.urgencyLevel === 'YELLOW' && <FaAlertCircle className="text-3xl" />}
                <h3 className="text-2xl font-bold">Urgency Level: {assessment.urgencyLevel}</h3>
              </div>

              <div className="space-y-3">
                <p className="text-lg font-semibold">Score: {assessment.urgencyScore}/100</p>
                <p className="text-lg">Estimated Wait Time: <strong>{assessment.estimatedWaitTime}</strong></p>
                <div>
                  <p className="font-semibold mb-2">Risk Factors:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {assessment.riskFactors.map((factor, idx) => (
                      <li key={idx}>{factor}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Queue Display */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Current Emergency Queue</h2>
          <div className="space-y-3">
            {queue.map((item, idx) => (
              <div key={item.id} className={`p-4 rounded border-l-4 ${getUrgencyColor(item.urgencyLevel)}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">Position #{idx + 1}</p>
                    <p className="text-sm text-gray-600">Score: {item.urgencyScore}/100</p>
                  </div>
                  <p className="font-semibold">{item.estimatedWaitTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriagePage;
