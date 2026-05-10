import React, { useState } from 'react';
import axios from 'axios';

interface XRayAnalysis {
  id: string;
  findings: string[];
  severity: 'low' | 'moderate' | 'high';
  severityScore: number;
  recommendations: string[];
}

const XRayPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<XRayAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert('Please select an image');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('xray', file);
    formData.append('imageType', 'frontal');

    try {
      const response = await api.post('/xray/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAnalysis(response.data.analysis);
    } catch (error) {
      alert('Error analyzing X-Ray');
    }
    setLoading(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 border-red-500 text-red-900';
      case 'moderate':
        return 'bg-yellow-100 border-yellow-500 text-yellow-900';
      case 'low':
        return 'bg-green-100 border-green-500 text-green-900';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🫁 Chest X-Ray AI Analysis</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Upload X-Ray Image</h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {preview ? (
                <div>
                  <img src={preview} alt="Preview" className="max-h-64 mx-auto mb-4 rounded" />
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                    className="text-red-600 hover:text-red-800 underline"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">Drag and drop or click to select</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="cursor-pointer px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block">
                    Select Image
                  </label>
                </div>
              )}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Analyzing...' : 'Analyze X-Ray'}
            </button>
          </div>

          {/* Results Section */}
          {analysis && (
            <div className={`p-8 rounded-lg border-2 ${getSeverityColor(analysis.severity)}`}>
              <h2 className="text-2xl font-bold mb-6">Analysis Results</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600">SEVERITY</p>
                  <p className="text-3xl font-bold mb-2">{analysis.severity.toUpperCase()}</p>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        analysis.severityScore > 70
                          ? 'bg-red-600'
                          : analysis.severityScore > 40
                          ? 'bg-yellow-600'
                          : 'bg-green-600'
                      }`}
                      style={{ width: `${analysis.severityScore}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{analysis.severityScore}%</p>
                </div>

                <div>
                  <p className="font-semibold mb-2">Findings:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {analysis.findings.map((finding, idx) => (
                      <li key={idx} className="text-sm">
                        {finding}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-semibold mb-2">Recommendations:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {analysis.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default XRayPage;
