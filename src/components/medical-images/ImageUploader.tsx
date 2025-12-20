import React, { useState, useRef } from 'react';
import '../../styles/components/ImageUploader.css';

interface ImageFile {
  id: string;
  file: File;
  name: string;
  size: string;
  type: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
}

interface ImageUploaderProps {
  onUploadComplete?: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onUploadComplete, 
  maxFiles = 5, 
  maxSize = 10 
}) => {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return { 
        isValid: false, 
        error: `File size exceeds ${maxSize}MB limit` 
      };
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/dicom'];
    if (!allowedTypes.includes(file.type)) {
      return { 
        isValid: false, 
        error: 'File type not supported. Supported: JPG, PNG, PDF, DICOM' 
      };
    }

    return { isValid: true };
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles: ImageFile[] = [];
    let validFileCount = 0;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      // Check if we've reached the max file limit
      if (files.length + validFileCount >= maxFiles) {
        break;
      }

      const validation = validateFile(file);
      
      if (validation.isValid) {
        newFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          name: file.name,
          size: formatFileSize(file.size),
          type: file.type.split('/')[1].toUpperCase(),
          progress: 0,
          status: 'pending'
        });
        validFileCount++;
      } else {
        // Show error for invalid file
        alert(`${file.name}: ${validation.error}`);
      }
    }

    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const uploadFiles = async () => {
    // In a real app, this would upload files to the server
    // For now, we'll simulate the upload process
    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== 'pending') continue;
      
      // Update status to uploading
      setFiles(prev => prev.map(file => 
        file.id === files[i].id 
          ? { ...file, status: 'uploading' } 
          : file
      ));
      
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setFiles(prev => prev.map(file => 
          file.id === files[i].id 
            ? { ...file, progress } 
            : file
        ));
      }
      
      // Update status to success
      setFiles(prev => prev.map(file => 
        file.id === files[i].id 
          ? { ...file, status: 'success', progress: 100 } 
          : file
      ));
    }
    
    // Call callback with uploaded files
    if (onUploadComplete) {
      onUploadComplete(files.map(f => f.file));
    }
  };

  return (
    <div className="image-uploader">
      <div 
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="upload-content">
          <div className="upload-icon">📁</div>
          <p>Drag and drop files here or click to browse</p>
          <p className="upload-hint">
            Supported formats: JPG, PNG, PDF, DICOM (Max {maxSize}MB per file)
          </p>
          <button type="button" className="btn btn-outline">
            Select Files
          </button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          multiple
          accept=".jpg,.jpeg,.png,.pdf,.dcm"
          className="file-input"
        />
      </div>
      
      {files.length > 0 && (
        <div className="file-list">
          <div className="file-list-header">
            <h3>Selected Files ({files.length}/{maxFiles})</h3>
            <button 
              className="btn btn-primary"
              onClick={uploadFiles}
              disabled={files.some(f => f.status === 'uploading')}
            >
              Upload All
            </button>
          </div>
          
          <div className="file-items">
            {files.map(file => (
              <div key={file.id} className="file-item">
                <div className="file-info">
                  <div className="file-icon">
                    {file.type === 'PDF' ? '📄' : '🖼️'}
                  </div>
                  <div className="file-details">
                    <h4>{file.name}</h4>
                    <p className="file-meta">{file.size} • {file.type}</p>
                  </div>
                </div>
                
                <div className="file-actions">
                  {file.status === 'pending' && (
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => removeFile(file.id)}
                    >
                      Remove
                    </button>
                  )}
                  
                  {file.status === 'uploading' && (
                    <div className="upload-progress">
                      <div 
                        className="progress-bar"
                        style={{ width: `${file.progress}%` }}
                      ></div>
                      <span className="progress-text">{file.progress}%</span>
                    </div>
                  )}
                  
                  {file.status === 'success' && (
                    <span className="status-success">✓ Uploaded</span>
                  )}
                  
                  {file.status === 'error' && (
                    <span className="status-error">✗ Error</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;