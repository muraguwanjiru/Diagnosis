import React from 'react';
import { BarChart3, Binary, ShieldCheck, Clock, ServerCrash } from 'lucide-react';
import { useDiagnostics } from '../context/DiagnosticContext';

export default function TelemetryDashboard() {
  const { analysisResult, isAnalyzing } = useDiagnostics();

  return (
    <div className="bg-[#f6f2ee] border border-[#d8cab8] rounded-xl p-5 flex flex-col h-full shadow-[0_18px_40px_rgba(33,41,46,0.08)] space-y-5">
      <div className="flex items-center space-x-2 pb-3 border-b border-[#d8cab8]">
        <BarChart3 className="w-4 h-4 text-[#ff7a3d]" />
        <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-[#39515c]">
          AI Telemetry Processing Core
        </h2>
      </div>

      {analysisResult ? (
        <div className="flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-[10px] text-[#5d737d] uppercase tracking-widest block font-semibold">
              DenseNet Probability Metrics
            </span>
            <div className="space-y-3">
              {analysisResult.densenetVector.map((vector) => {
                const isSelected = analysisResult.primaryDiagnosis === vector.state;
                return (
                  <div key={vector.state} className={`p-2.5 rounded-lg border transition-all ${
                    isSelected ? 'bg-[#fff2eb] border-[rgba(255,122,61,0.25)]' : 'bg-[#fffaf7] border-[#f0d9cc]'
                  }`}>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className={`font-sans font-medium ${isSelected ? 'text-[#24353d]' : 'text-[#5e6f79]'}`}>
                        {vector.state}
                      </span>
                      <span className="font-mono font-bold text-[#1db4b8]">
                        {(vector.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-[#e8dfd4] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${vector.confidence * 100}%`,
                          backgroundColor: vector.color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#f2eee8] p-4 rounded-lg border border-[#d8cab8] font-mono text-[11px] space-y-2.5 text-[#536873]">
            <div className="flex justify-between items-center border-b border-[#d8cab8] pb-1.5">
              <span className="flex items-center text-[#5d727d]"><Binary className="w-3.5 h-3.5 mr-1" /> Client Registry Hash</span>
              <span className="text-[#24353d] text-[10px] bg-[#f7f4f1] px-2 py-0.5 rounded border border-[#d8cab8]">{analysisResult.patientAnonymizationHash}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#d8cab8] pb-1.5">
              <span className="flex items-center text-[#5d727d]"><Clock className="w-3.5 h-3.5 mr-1" /> Latency Footprint</span>
              <span className="text-[#1db4b8] font-bold">{analysisResult.processingTimeMs} ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center text-[#5d727d]"><ShieldCheck className="w-3.5 h-3.5 mr-1" /> Validation Layer</span>
              <span className="text-[#ff7a3d]">Secondary Overlay Mode</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-[#61737b] font-mono text-xs">
          <ServerCrash className="w-7 h-7 mb-2 text-[#1db4b8]" strokeWidth={1.5} />
          <span>Awaiting Engine Inferences</span>
          <span className="text-[9px] text-[#708089] max-w-[180px] mt-1">Staged image tensors populate this vector context</span>
        </div>
      )}

      <div className="text-[9px] leading-relaxed text-[#607078] pt-3 border-t border-[#d8cab8] font-sans">
        <span className="font-bold text-[#ff7a3d] uppercase block mb-0.5">Regulatory Operations Clause:</span>
        Diagnos functions explicitly as a Class II secondary decision-support instrument. The diagnostic system cannot replace structural radiology evaluations verified by accredited medical practitioners.
      </div>
    </div>
  );
}
