'use client';

import React from 'react';
import { Activity, AlertCircle, Brain, BarChart3, Zap } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: AlertCircle,
      title: 'Emergency Triage',
      description: 'Real-time patient urgency scoring and queue management',
      color: 'text-red-600',
    },
    {
      icon: BarChart3,
      title: 'Chest X-Ray AI',
      description: 'AI-assisted chest scan analysis and pneumonia detection',
      color: 'text-blue-600',
    },
    {
      icon: Brain,
      title: 'Multimodal AI Brain',
      description: 'Unified patient data analysis and risk prediction',
      color: 'text-purple-600',
    },
    {
      icon: Activity,
      title: 'Medical Reports',
      description: 'Automated report generation with doctor customization',
      color: 'text-green-600',
    },
  ];

  return (
    <div className="space-y-12 py-12">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">🏥 Giliza X</h1>
          <p className="text-xl mb-2">AI-Powered Healthcare Intelligence Platform</p>
          <p className="text-gray-300 mb-8">Revolutionary AI technology for emergency triage, medical imaging analysis, and intelligent diagnostics</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold text-lg">
            Get Started
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Top 5 Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                  <Icon className={`w-12 h-12 ${feature.color} mb-4`} />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">10,000+</div>
              <p className="text-gray-600 mt-2">Patients Assessed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">99.2%</div>
              <p className="text-gray-600 mt-2">Accuracy Rate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600">50+</div>
              <p className="text-gray-600 mt-2">Hospital Partners</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
