'use client';

import React, { useState } from 'react';
import { reportAPI } from '@/lib/api';
import { StatusBadge } from '@/components/Badges';
import { FileText, Download } from 'lucide-react';

export default function ReportGenerator() {
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    analysisId: '',
    findings: [],
    severity: 'low',
    recommendations: [],
    language: 'en',
  });
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [finding, setFinding] = useState('');
  const [recommendation, setRecommendation] = useState('');

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.patientName) {
      alert('Please fill in patient information');
      return;
    }

    setLoading(true);
    try {
      const response = await reportAPI.generate(formData);
      setReport(response.data.report);
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!report) return;
    try {
      const response = await reportAPI.exportPDF(report.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${report.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentChild.removeChild(link);
    } catch (error) {
      console.error('Failed to download PDF:', error);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <FileText className="w-8 h-8 text-blue-600" />
        Medical Report Generator
      </h1>

      {/* Report Form */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-bold">Generate Report</h2>
        <form onSubmit={handleGenerateReport} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Patient ID</label>
              <input
                type="text"
                value={formData.patientId}
                onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                placeholder="Patient ID"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Patient Name</label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                placeholder="Patient Name"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-medium mb-2">Severity Level</label>
            <select
              value={formData.severity}
              onChange={(e) => setFormData({...formData, severity: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Findings */}
          <div>
            <label className="block text-sm font-medium mb-2">Findings</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={finding}
                onChange={(e) => setFinding(e.target.value)}
                placeholder="Add a finding"
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  if (finding.trim()) {
                    setFormData(prev => ({
                      ...prev,
                      findings: [...prev.findings, finding],
                    }));
                    setFinding('');
                  }
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Add
              </button>
            </div>
            <div className="space-y-1">
              {formData.findings.map((f, idx) => (
                <div key={idx} className="bg-gray-100 p-2 rounded flex justify-between">
                  <span>{f}</span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      findings: prev.findings.filter((_, i) => i !== idx),
                    }))}
                    className="text-red-600 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <label className="block text-sm font-medium mb-2">Recommendations</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                placeholder="Add a recommendation"
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  if (recommendation.trim()) {
                    setFormData(prev => ({
                      ...prev,
                      recommendations: [...prev.recommendations, recommendation],
                    }));
                    setRecommendation('');
                  }
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Add
              </button>
            </div>
            <div className="space-y-1">
              {formData.recommendations.map((r, idx) => (
                <div key={idx} className="bg-gray-100 p-2 rounded flex justify-between">
                  <span>{r}</span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      recommendations: prev.recommendations.filter((_, i) => i !== idx),
                    }))}
                    className="text-red-600 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </form>
      </div>

      {/* Report Preview */}
      {report && (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Report Preview</h2>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
          <StatusBadge status={report.status} />

          <div className="border-t pt-4 space-y-4">
            <div>
              <h3 className="font-bold text-sm">Patient Information</h3>
              <p className="text-sm text-gray-600">{report.patientName} (ID: {report.patientId})</p>
            </div>
            <div>
              <h3 className="font-bold text-sm">Findings</h3>
              <ul className="text-sm text-gray-600 ml-4">
                {report.findings.map((f, idx) => (
                  <li key={idx}>• {f}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-sm">Recommendations</h3>
              <ul className="text-sm text-gray-600 ml-4">
                {report.recommendations.map((r, idx) => (
                  <li key={idx}>• {r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
