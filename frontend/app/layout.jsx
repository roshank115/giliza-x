import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Giliza X - AI Healthcare Intelligence',
  description: 'Revolutionary AI-powered healthcare platform for emergency triage, medical imaging, and intelligent diagnostics',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <nav className="bg-primary text-white p-4 shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">🏥 Giliza X</h1>
            <div className="flex gap-4">
              <a href="/" className="hover:text-gray-300">Dashboard</a>
              <a href="/triage" className="hover:text-gray-300">Triage</a>
              <a href="/xray" className="hover:text-gray-300">X-Ray AI</a>
              <a href="/ai" className="hover:text-gray-300">AI Brain</a>
              <a href="/reports" className="hover:text-gray-300">Reports</a>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
