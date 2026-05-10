import React from 'react';
import Link from 'next/link';
import { FaHeartbeat, FaXRayIcon, FaClock, FaFileAlt, FaBrain } from 'react-icons/fa';

const Home: React.FC = () => {
  const features = [
    {
      icon: <FaClock className="w-8 h-8 text-red-500" />,
      title: 'Emergency Triage Engine',
      description: 'AI-powered patient urgency scoring - Red/Yellow/Green priority system',
      link: '/triage',
    },
    {
      icon: <FaXRayIcon className="w-8 h-8 text-blue-500" />,
      title: 'Chest X-Ray AI',
      description: 'Pneumonia & TB detection with AI analysis and severity scoring',
      link: '/xray',
    },
    {
      icon: <FaHeartbeat className="w-8 h-8 text-green-500" />,
      title: 'Offline Healthcare',
      description: 'Edge AI inference without internet - Portable clinic mode',
      link: '/offline',
    },
    {
      icon: <FaFileAlt className="w-8 h-8 text-purple-500" />,
      title: 'Medical Reports',
      description: 'Automated radiology reports with multilingual support',
      link: '/reports',
    },
    {
      icon: <FaBrain className="w-8 h-8 text-orange-500" />,
      title: 'AI Patient Brain',
      description: 'Multimodal analysis - Image + Symptoms + Vitals intelligence',
      link: '/ai-analysis',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-600">🏥 Giliza X</h1>
          <div className="space-x-4">
            <Link href="/auth/login" className="px-4 py-2 text-indigo-600 hover:text-indigo-800">
              Login
            </Link>
            <Link href="/auth/register" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Register
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-4">
          AI Healthcare Intelligence Platform
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Real-time emergency triage, AI-powered diagnostics, and offline healthcare for global access
        </p>
        <div className="space-x-4">
          <Link href="/dashboard" className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-block">
            Access Dashboard
          </Link>
          <Link href="#features" className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 inline-block">
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">🔥 Top 5 Core Features</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <Link key={idx} href={feature.link}>
              <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer h-full">
                <div className="mb-4">{feature.icon}</div>
                <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-indigo-600 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold">1000+</div>
            <div>Hospitals</div>
          </div>
          <div>
            <div className="text-4xl font-bold">50K+</div>
            <div>Patients Triaged</div>
          </div>
          <div>
            <div className="text-4xl font-bold">98%</div>
            <div>Accuracy</div>
          </div>
          <div>
            <div className="text-4xl font-bold">24/7</div>
            <div>Available</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
