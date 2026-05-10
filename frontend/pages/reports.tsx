import React, { useState } from 'react';
import axios from 'axios';

const ReportsPage: React.FC = () => {
  const [report, setReport] = useState<any>(null);
  const [patientName, setPatientName] = useState('');
  const [findings, setFindings] = useState('');
  const [loading, setLoading] = useState(false);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const response = await api.post('/reports/generate', {
        patientId: 'patient-123',
        patientName,
        findings: findings.split(',').map(f => f.trim()),
        severity: 'moderate',
        recommendations: ['Follow-up imaging', 'Specialist consultation'],
      });
      setReport(response.data.report);
    } catch (error) {
      alert('Error generating report');
    }
    setLoading(false);
  };

  const handleExportPDF = async () => {
    if (!report) return;
    try {
      await api.get(`/reports/${report.id}/pdf`, {
        responseType: 'blob',
      });
      alert('PDF exported!');
    } catch (error) {
      alert('Error exporting PDF');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">📄 AI Medical Report Generator</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Report Form */}
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Generate Report</h2>

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
                <label className="block text-sm font-medium mb-2">Findings (comma-separated)</label>
                <textarea
                  value={findings}
                  onChange={(e) => setFindings(e.target.value)}
                  className="w-full px-4 py-2 border rounded h-24"
                  placeholder="Enter medical findings"
                />
              </div>

              <button
                onClick={handleGenerateReport}
                disabled={!patientName || !findings || loading}
                className="w-full bg-purple-600 text-white py-3 rounded font-bold hover:bg-purple-700 disabled:bg-gray-400"
              >
                {loading ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </div>

          {/* Report Display */}
          {report && (
            <div className="bg-white p-8 rounded-lg shadow border-2 border-purple-500">
              <h2 className="text-2xl font-bold mb-6">Report Preview</h2>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-gray-600">REPORT ID</p>
                  <p className="font-mono text-xs">{report.id}</p>
                </div>

                <div>
                  <p className="font-semibold text-gray-600">PATIENT</p>
                  <p>{report.patientName}</p>
                </div>

                <div>
                  <p className="font-semibold text-gray-600">FINDINGS</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {report.findings.map((f: string, idx: number) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-gray-600">STATUS</p>
                  <p className="text-blue-600">{report.status}</p>
                </div>
              </div>

              <button
                onClick={handleExportPDF}
                className="w-full mt-6 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
              >
                Export as PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
