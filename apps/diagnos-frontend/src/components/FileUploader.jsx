import React, { useCallback, useState } from 'react';
import { UploadCloud, FileSymlink, AlertCircle } from 'lucide-react';
import { useDiagnostics } from '../context/DiagnosticContext';

export default function FileUploader() {
  const { uploadAndAnalyzeFile, isAnalyzing } = useDiagnostics();
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/') || file.name.endsWith('.dcm')) {
        uploadAndAnalyzeFile(file);
      }
    }
  }, [uploadAndAnalyzeFile]);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      uploadAndAnalyzeFile(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`h-full flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-all duration-300 bg-[#f6f3ee]/80 backdrop-blur-sm ${
        isDragActive ? 'border-[#ff7a3d] bg-[rgba(255,122,61,0.08)] shadow-[0_0_20px_rgba(255,122,61,0.18)]' : 'border-[#f0d9cc] hover:border-[#ffb88d]'
      }`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <div className="bg-[#fff6f1] p-4 rounded-full border border-[#f0d9cc] mb-4 shadow-inner">
        {isDragActive ? (
          <FileSymlink className="w-10 h-10 text-[#ff7a3d] animate-bounce" />
        ) : (
          <UploadCloud className="w-10 h-10 text-[#1db4b8]" />
        )}
      </div>

      <h3 className="text-md font-semibold text-[#24353d] tracking-wide">Stage DICOM / Structural Brain MRI</h3>
      <p className="text-xs text-[#5e6d74] mt-1 mb-6 text-center max-w-xs">
        Drag and drop primary imagery matrices here or manually browse file directory resources.
      </p>

      <label className="relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-xs font-mono font-medium text-white rounded-lg group bg-gradient-to-br from-[#ff7a3d] via-[#ff9c5d] to-[#1db4b8] hover:text-white focus:ring-2 focus:outline-none focus:ring-[#1db4b8] cursor-pointer transition-all">
        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-[#26373d] rounded-md group-hover:bg-opacity-0">
          {isAnalyzing ? 'Running Neural Pipelines...' : 'Select Target Matrix'}
        </span>
        <input 
          type="file" 
          className="hidden" 
          accept="image/*,.dcm" 
          onChange={handleFileInput} 
          disabled={isAnalyzing}
        />
      </label>

      <div className="mt-8 flex items-start space-x-2 text-[10px] text-[#6e7a80] max-w-xs border-t border-[#f0d9cc] pt-4">
        <AlertCircle className="w-3.5 h-3.5 text-[#1db4b8] shrink-0 mt-0.5" />
        <span>Data structures undergo automated client-side sanitization prior to matrix evaluations to conform to security regulations.</span>
      </div>
    </div>
  );
}
