import React from 'react';

export const TriageLevel = ({ level }) => {
  const colors = {
    RED: 'bg-red-500 text-white',
    YELLOW: 'bg-yellow-400 text-black',
    GREEN: 'bg-green-500 text-white',
  };

  return (
    <span className={`px-3 py-1 rounded-full font-bold text-sm ${colors[level] || colors.GREEN}`}>
      {level}
    </span>
  );
};

export const SeverityBadge = ({ severity }) => {
  const colors = {
    high: 'bg-red-100 text-red-800',
    moderate: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full font-semibold text-xs ${colors[severity] || colors.low}`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const colors = {
    pending: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full font-semibold text-xs ${colors[status] || colors.pending}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
