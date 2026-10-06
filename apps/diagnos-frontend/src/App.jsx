import React from 'react';
import Navigation from './components/Navigation';
import FileUploader from './components/FileUploader';
import ClinicalCanvas from './components/ClinicalCanvas';
import TelemetryDashboard from './components/TelemetryDashboard';
import { useDiagnostics } from './context/DiagnosticContext';

export default function App() {
  const { previewUrl } = useDiagnostics();

  return (
    <div className="min-h-screen flex flex-col text-slate-100 relative">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
      <div className="relative z-10">
        <Navigation />

        <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-[1600px] w-full mx-auto">
          <div className="lg:col-span-3 flex flex-col h-full">
            {previewUrl ? (
              <ClinicalCanvas />
            ) : (
              <FileUploader />
            )}
          </div>

          <div className="lg:col-span-1 h-full">
            <TelemetryDashboard />
          </div>
        </main>
      </div>
    </div>
  );
}
