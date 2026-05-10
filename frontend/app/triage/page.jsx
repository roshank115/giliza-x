'use client';

import React, { useEffect, useState } from 'react';
import { triageAPI } from '@/lib/api';
import { TriageLevel } from '@/components/Badges';
import { AlertCircle, Activity, Users } from 'lucide-react';

export default function TriageDashboard() {
  const [queue, setQueue] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [queueRes, alertsRes] = await Promise.all([
        triageAPI.getQueue(),
        triageAPI.getAlerts(),
      ]);
      setQueue(queueRes.data.queue || []);
      setAlerts(alertsRes.data.alerts || []);
    } catch (error) {
      console.error('Failed to fetch triage data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading triage queue...</div>;
  }

  const stats = {
    red: queue.filter(p => p.urgencyLevel === 'RED').length,
    yellow: queue.filter(p => p.urgencyLevel === 'YELLOW').length,
    green: queue.filter(p => p.urgencyLevel === 'GREEN').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
          <div className="text-3xl font-bold text-red-600">{stats.red}</div>
          <p className="text-sm text-red-800">Critical Cases</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
          <div className="text-3xl font-bold text-yellow-600">{stats.yellow}</div>
          <p className="text-sm text-yellow-800">Urgent Cases</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
          <div className="text-3xl font-bold text-green-600">{stats.green}</div>
          <p className="text-sm text-green-800">Routine Cases</p>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-red-900">High Risk Alerts</h3>
          </div>
          <div className="space-y-2">
            {alerts.slice(0, 5).map(alert => (
              <div key={alert.id} className="text-sm text-red-800">
                <strong>{alert.patientData.patientName}</strong> - {alert.riskFactors.slice(0, 2).join(', ')}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Triage Queue */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">Position</th>
              <th className="px-4 py-2 text-left">Patient Name</th>
              <th className="px-4 py-2 text-left">Urgency</th>
              <th className="px-4 py-2 text-left">Score</th>
              <th className="px-4 py-2 text-left">Est. Wait Time</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((patient, idx) => (
              <tr key={patient.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-bold text-gray-700">#{idx + 1}</td>
                <td className="px-4 py-3">{patient.patientName}</td>
                <td className="px-4 py-3">
                  <TriageLevel level={patient.urgencyLevel} />
                </td>
                <td className="px-4 py-3 font-bold">{patient.urgencyScore}</td>
                <td className="px-4 py-3 text-gray-600">{patient.estimatedWaitTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
