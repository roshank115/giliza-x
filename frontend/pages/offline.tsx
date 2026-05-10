import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OfflinePage: React.FC = () => {
  const [deviceId] = useState(() => `device-${Math.random().toString(36).substr(2, 9)}`);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  const fetchStatus = async () => {
    try {
      const response = await api.get(`/offline/status/${deviceId}`);
      setStatus(response.data);
    } catch (error) {
      console.error('Error fetching status');
    }
  };

  const handleSync = async () => {
    setLoading(true);
    try {
      await api.post('/offline/sync', { deviceId });
      await fetchStatus();
      alert('Data synced successfully!');
    } catch (error) {
      alert('Error syncing data');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">📱 Offline Healthcare Infrastructure</h1>

        {status && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-6">Device Status</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded border-l-4 border-green-500">
                  <p className="text-sm text-gray-600">Device ID</p>
                  <p className="text-xl font-bold">{status.deviceId}</p>
                </div>
                <div className="bg-blue-50 p-6 rounded border-l-4 border-blue-500">
                  <p className="text-sm text-gray-600">Offline Mode</p>
                  <p className="text-xl font-bold text-green-600">✓ Enabled</p>
                </div>
                <div className="bg-purple-50 p-6 rounded border-l-4 border-purple-500">
                  <p className="text-sm text-gray-600">Stored Records</p>
                  <p className="text-3xl font-bold">{status.storedRecords}</p>
                </div>
                <div className="bg-orange-50 p-6 rounded border-l-4 border-orange-500">
                  <p className="text-sm text-gray-600">Unsynced Data</p>
                  <p className="text-3xl font-bold">{status.unsyncedRecords}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-6">Storage</h2>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Storage Used: {status.storageUsed}</p>
                <div className="w-full bg-gray-300 rounded-full h-3">
                  <div className="h-3 bg-blue-600 rounded-full" style={{ width: '20%' }} />
                </div>
              </div>
              <p className="text-sm text-gray-600">Available: {status.storageAvailable}</p>
            </div>

            <button
              onClick={handleSync}
              disabled={loading || status.unsyncedRecords === 0}
              className="w-full bg-indigo-600 text-white py-3 rounded font-bold hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {loading ? 'Syncing...' : `Sync ${status.unsyncedRecords} Records`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfflinePage;
