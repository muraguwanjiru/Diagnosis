import React from 'react';
import { Maximize2, RotateCcw, Eye, Sliders, LayoutGrid, AlertTriangle } from 'lucide-react';
import { useDiagnostics } from '../context/DiagnosticContext';

export default function ClinicalCanvas() {
  const { 
    previewUrl, isAnalyzing, analysisResult, activeLayer, setActiveLayer,
    brightness, setBrightness, contrast, setContrast, zoom, setZoom, invert, setInvert,
    resetCanvasModifiers, clearSession
  } = useDiagnostics();

  const layers = ['axial', 'sagittal', 'coronal'];

  const computedImageStyle = {
    filter: `brightness(${brightness}%) contrast(${contrast}%) ${invert ? 'invert(1)' : 'invert(0)'}`,
    transform: `scale(${zoom / 100})`,
    transition: 'transform 0.1s ease-out, filter 0.05s ease-out',
  };

  return (
    <div className="bg-[#f5f1ec] border border-[#d8cab8] rounded-xl overflow-hidden flex flex-col h-full shadow-[0_18px_40px_rgba(33,41,46,0.08)]">
      <div className="bg-[#efe8e1]/90 px-4 py-3 border-b border-[#d8cab8] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <LayoutGrid className="w-4 h-4 text-[#ff7a3d]" />
          <span className="text-xs uppercase tracking-wider font-mono font-bold text-[#36515d]">PACS Interactive Viewport</span>
        </div>

        {previewUrl && (
          <div className="flex items-center space-x-2 bg-[#fff9f5] p-0.5 rounded-md border border-[#f0d9cc]">
            {layers.map((layer) => (
              <button
                key={layer}
                onClick={() => setActiveLayer(layer)}
                className={`px-3 py-1 text-[10px] font-mono rounded capitalize transition-all ${
                  activeLayer === layer
                    ? 'bg-[rgba(255,122,61,0.12)] text-[#ff7a3d] border border-[rgba(255,122,61,0.25)]'
                    : 'text-[#5d6d74] hover:text-[#24353d]'
                }`}
              >
                {layer}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 bg-[#f0ebe5] relative overflow-hidden flex items-center justify-center p-4 group select-none min-h-[360px]">
        {isAnalyzing && (
          <div className="absolute inset-0 bg-[#f3eee8]/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <div className="relative w-20 h-20 mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-[#d8cab8]" />
              <div className="absolute inset-0 rounded-full border-2 border-t-[#ff7a3d] border-r-[#1db4b8] animate-spin" />
            </div>
            <p className="text-xs font-mono tracking-widest text-[#1db4b8] animate-pulse">EVALUATING DENSENET-121 WEIGHT MATRICES...</p>
          </div>
        )}

        {previewUrl ? (
          <div className="relative overflow-hidden w-full h-full flex items-center justify-center">
            <img
              src={previewUrl}
              alt="Brain MRI Workspace Context"
              style={computedImageStyle}
              className="max-h-full max-w-full object-contain pointer-events-none rounded"
            />

            <div className="absolute top-4 left-4 font-mono text-[10px] text-[#48606b] bg-[#f5f1ed]/80 p-2 rounded border border-[#d8cab8] pointer-events-none space-y-0.5">
              <p>W: {contrast * 2}</p>
              <p>L: {brightness * 2}</p>
              <p>ZOOM: {zoom}%</p>
              <p className="text-[#1db4b8] uppercase">MODE: {activeLayer}</p>
            </div>

            {analysisResult && (
              <div className="absolute top-4 right-4 font-mono text-[10px] text-[#5a6d75] bg-[#fefaf7]/80 p-2 rounded border border-[#f0d9cc] pointer-events-none">
                <div className="flex items-center space-x-1.5 text-[#ff7a3d] font-bold mb-1">
                  <AlertTriangle className="w-3 h-3 text-[#ff7a3d]" />
                  <span>AI OVERLAY ACTIVE</span>
                </div>
                <p>TARGET: <span className="text-[#24353d] font-sans font-bold">{analysisResult.primaryDiagnosis}</span></p>
                <p>CONFIDENCE: <span className="text-[#24353d] font-bold">{analysisResult.confidenceScore}%</span></p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-[#61737b] font-mono text-xs flex flex-col items-center">
            <Eye className="w-8 h-8 mb-2 text-[#1db4b8]" />
            <span>PACS Monitor Offline</span>
            <span className="text-[10px] text-[#708089] mt-1">Stage structural data matrices to initialize</span>
          </div>
        )}
      </div>

      <div className="bg-[#f2eee8]/90 p-4 border-t border-[#d8cab8] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-[#61737b]">
              <span>Luminance / Brightness</span>
              <span className="text-[#1db4b8]">{brightness}%</span>
            </div>
            <input
              type="range" min="50" max="150" value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              disabled={!previewUrl}
              className="w-full accent-[#1db4b8] bg-[#f5e5dd] h-1 rounded-lg appearance-none cursor-pointer disabled:opacity-30"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-[#61737b]">
              <span>Dynamic Intensity Contrast</span>
              <span className="text-[#1db4b8]">{contrast}%</span>
            </div>
            <input
              type="range" min="50" max="150" value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              disabled={!previewUrl}
              className="w-full accent-[#1db4b8] bg-[#f5e5dd] h-1 rounded-lg appearance-none cursor-pointer disabled:opacity-30"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-[#61737b]">
              <span>Geometric Magnification</span>
              <span className="text-[#1db4b8]">{zoom}%</span>
            </div>
            <input
              type="range" min="100" max="200" value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              disabled={!previewUrl}
              className="w-full accent-[#1db4b8] bg-[#f5e5dd] h-1 rounded-lg appearance-none cursor-pointer disabled:opacity-30"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#d8cab8]">
          <div className="flex space-x-2">
            <button
              onClick={() => setInvert(!invert)}
              disabled={!previewUrl}
              className="px-3 py-1.5 rounded bg-[#f7f4f1] border border-[#d8cab8] text-xs font-mono text-[#425a65] hover:text-[#24353d] hover:bg-[#f0eae3] transition disabled:opacity-30 flex items-center space-x-1"
            >
              <Sliders className="w-3.5 h-3.5 text-[#1db4b8]" />
              <span>Invert Gray Values</span>
            </button>

            <button
              onClick={resetCanvasModifiers}
              disabled={!previewUrl}
              className="p-1.5 rounded bg-[#f7f4f1] border border-[#d8cab8] text-[#425a65] hover:text-[#24353d] hover:bg-[#f0eae3] transition disabled:opacity-30"
              title="Reset Parameters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {previewUrl && (
            <button
              onClick={clearSession}
              className="px-3 py-1.5 text-xs font-mono text-[#ff7a3d] hover:text-[#e66227] bg-[rgba(255,122,61,0.08)] hover:bg-[rgba(255,122,61,0.14)] rounded border border-[rgba(255,122,61,0.25)] transition"
            >
              Flush Workspace Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
