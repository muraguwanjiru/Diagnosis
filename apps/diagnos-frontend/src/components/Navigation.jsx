import React from 'react';
import { Activity, ShieldAlert, Cpu, Layers } from 'lucide-react';

export default function Navigation() {
  return (
    <nav className="border-b border-[#d9cab8] bg-[#f5f1eb]/90 px-6 py-4 flex items-center justify-between backdrop-blur-sm shadow-[0_10px_20px_rgba(44,54,58,0.04)]">
      <div className="flex items-center space-x-3">
        <div className="bg-[rgba(255,122,61,0.15)] p-2 rounded-lg border border-[rgba(255,122,61,0.45)]">
          <Activity className="h-6 w-6 text-[#ff7a3d]" />
        </div>
        <div>
          <span className="text-xl font-bold tracking-wider text-[#24353d] font-sans">
            DIAGNOS <span className="text-xs bg-[rgba(29,180,184,0.14)] text-[#1db4b8] px-2 py-0.5 rounded font-mono border border-[rgba(29,180,184,0.3)] ml-2">V2.4</span>
          </span>
          <p className="text-[10px] text-[#5d6d74] uppercase tracking-widest font-medium">Neuroradiology Decision Support System</p>
        </div>
      </div>

      <div className="flex items-center space-x-6 text-sm text-[#3a4d57] font-medium">
        <div className="flex items-center space-x-1 text-[#4c5c65]">
          <Cpu className="w-4 h-4 text-[#1db4b8]" />
          <span className="font-mono text-xs">DenseNet-121 Architecture</span>
        </div>
        <div className="flex items-center space-x-1 text-[#1db4b8] bg-[rgba(29,180,184,0.08)] px-2.5 py-1 rounded-full border border-[rgba(29,180,184,0.2)] text-xs">
          <div className="w-1.5 h-1.5 bg-[#1db4b8] rounded-full animate-pulse" />
          <span>HIPAA Secure Node</span>
        </div>
      </div>
    </nav>
  );
}
