import React, { createContext, useContext, useState } from 'react';

const DiagnosticContext = createContext();

export const useDiagnostics = () => {
  const context = useContext(DiagnosticContext);
  if (!context) throw new Error('useDiagnostics must be used within a DiagnosticProvider');
  return context;
};

export const DiagnosticProvider = ({ children }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeLayer, setActiveLayer] = useState('axial');
  
  // Clinical Canvas Image Modifiers
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [zoom, setZoom] = useState(100);
  const [invert, setInvert] = useState(false);

  const resetCanvasModifiers = () => {
    setBrightness(100);
    setContrast(100);
    setZoom(100);
    setInvert(false);
  };

  const uploadAndAnalyzeFile = async (file) => {
    setSelectedFile(file);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    resetCanvasModifiers();

    // Create secure window blob URL for localized HIPAA-compliant client preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Mocking high-fidelity DenseNet-121 inference processing pipelines
    setTimeout(() => {
      const mockVectorOutputs = [
        { state: 'Gliomas', confidence: 0.942, severity: 'High Alert', color: '#ef4444' },
        { state: 'Meningiomas', confidence: 0.038, severity: 'Low Risk', color: '#f59e0b' },
        { state: 'Pituitary Tumors', confidence: 0.011, severity: 'Low Risk', color: '#3b82f6' },
        { state: 'Normal Anatomy', confidence: 0.009, severity: 'Negative', color: '#10b981' }
      ];
      
      setAnalysisResult({
        primaryDiagnosis: 'Gliomas',
        confidenceScore: 94.2,
        processingTimeMs: 142,
        densenetVector: mockVectorOutputs,
        patientAnonymizationHash: `MR-ANON-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        timestamp: new Date().toISOString()
      });
      setIsAnalyzing(false);
    }, 2500);
  };

  const clearSession = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    resetCanvasModifiers();
  };

  return (
    <DiagnosticContext.Provider value={{
      selectedFile, previewUrl, isAnalyzing, analysisResult, activeLayer,
      brightness, contrast, zoom, invert,
      setActiveLayer, setBrightness, setContrast, setZoom, setInvert,
      uploadAndAnalyzeFile, clearSession, resetCanvasModifiers
    }}>
      {children}
    </DiagnosticContext.Provider>
  );
};
