import React, { useState, useRef } from 'react';
import * as api from '../api/client';
import ErrorAlert from './ErrorAlert';

const ResumeUpload = ({ jobId, onUploadComplete }) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(Array.from(e.target.files));
    }
  };

  const validateAndAddFiles = (newFiles) => {
    setError('');
    setSuccess('');
    
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const validExtensions = ['.pdf', '.docx'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    const validFiles = [];
    let hasError = false;

    newFiles.forEach(file => {
      // Basic type/extension check
      const isTypeValid = validTypes.includes(file.type);
      const nameLower = file.name.toLowerCase();
      const isExtValid = validExtensions.some(ext => nameLower.endsWith(ext));
      
      if (!isTypeValid && !isExtValid) {
        setError('Only .pdf and .docx files are allowed');
        hasError = true;
        return;
      }
      
      if (file.size > maxSize) {
        setError(`File ${file.name} exceeds 10MB limit`);
        hasError = true;
        return;
      }
      
      // Prevent duplicates
      if (!files.some(f => f.name === file.name && f.size === file.size)) {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setProgress(0);
    setError('');
    setSuccess('');
    
    try {
      await api.uploadResumes(jobId, files, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(percentCompleted);
      });
      
      setSuccess(`Successfully uploaded ${files.length} resume(s)`);
      setFiles([]);
      if (onUploadComplete) onUploadComplete();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload resumes. They may have failed processing.');
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="resume-upload-container">
      <ErrorAlert message={error} onDismiss={() => setError('')} />
      {success && (
        <div className="alert alert-success">
          {success}
          <button className="close-btn" onClick={() => setSuccess('')}>&times;</button>
        </div>
      )}
      
      <div 
        className={`dropzone ${isDragging ? 'active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="dropzone-icon">📄</div>
        <h3>Drag & Drop Resumes Here</h3>
        <p className="text-muted mt-2">or click to browse files</p>
        <p className="text-sm text-muted mt-2">Supported formats: .pdf, .docx (Max 10MB per file)</p>
        <input 
          type="file" 
          multiple 
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          style={{ display: 'none' }} 
          ref={fileInputRef}
          onChange={handleFileSelect}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="mb-2">Selected Files ({files.length})</h4>
          <div className="file-list">
            {files.map((file, index) => (
              <div key={index} className="file-item">
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
                <button 
                  className="btn btn-secondary text-sm text-danger" 
                  onClick={() => removeFile(index)}
                  disabled={isUploading}
                  style={{ padding: '0.25rem 0.5rem', border: 'none' }}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          
          {isUploading && (
            <div className="progress-bar-container mt-4">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
          )}
          
          <div className="mt-4 flex justify-between items-center">
            <button 
              className="btn btn-secondary" 
              onClick={() => setFiles([])}
              disabled={isUploading}
            >
              Clear All
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? `Uploading... ${progress}%` : 'Upload & Analyze Resumes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
