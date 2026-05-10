'use client';

import React, { useState, useRef } from 'react';
import { xrayAPI } from '@/lib/api';
import { SeverityBadge, StatusBadge } from '@/components/Badges';
import { Upload, BarChart3 } from 'lucide-react';

export default function ChestXRayAI() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [patientId, setPatientId] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !patientId) {
      alert('Please select a file and enter patient ID');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('xray', file);
      formData.append('patientId', patientId);
      formData.append('imageType', 'frontal');

      const response = await xrayAPI.analyzeImage(formData);
      setResults(response.data.analysis);
      setFile(null);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to analyze X-Ray');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Chest X-Ray AI Analysis</h1>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Upload X-Ray Image</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Patient ID</label>
            <input
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Enter patient ID"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50"
            onClick={() => fileInputRef.current?.click()}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="font-semibold">{file?.name || 'Click to upload or drag and drop'}</p>
            <p className="text-sm text-gray-500">PNG, JPG, DICOM up to 50MB</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze X-Ray'}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {results && (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-bold">Analysis Results</h2>
          <StatusBadge status="completed" />

          {/* Severity */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Severity Level</span>
              <SeverityBadge severity={results.severity} />
            </div>
            <div className="text-sm text-gray-600 mt-1">Score: {results.severityScore}/100</div>
          </div>

          {/* Findings */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Findings</h3>
            <ul className="space-y-1">
              {results.findings?.pneumonia?.detected && (
                <li className="text-sm">✓ Pneumonia detected ({results.findings.pneumonia.confidence}% confidence)</li>
              )}
              {results.findings?.tb?.detected && (
                <li className="text-sm">✓ TB indicators detected ({results.findings.tb.confidence}% confidence)</li>
              )}
              {results.findings?.opacity?.detected && (
                <li className="text-sm">✓ Opacity detected in {results.findings.opacity.locations.join(', ')}</li>
              )}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Recommendations</h3>
            <ul className="space-y-1">
              {results.recommendations?.map((rec, idx) => (
                <li key={idx} className="text-sm">• {rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
