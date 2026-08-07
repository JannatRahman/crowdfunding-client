'use client';

import { useRef, useState } from 'react';
import { uploadToImgBB } from '@/lib/imgbb';

/**
 * Reusable image uploader backed by imgBB.
 *
 * Props:
 *  - value        {string}            current image URL (controlled)
 *  - onChange     {(url: string) => void}  called with the hosted URL after upload
 *  - label        {string}            field label
 *  - hint         {string}            optional helper text under the dropzone
 *  - accept       {string}            MIME types (default: "image/*")
 *  - maxSizeMB    {number}            max file size in MB (default: 5)
 *  - previewSize  {"sm"|"md"|"lg"}    avatar size variant (default: "md")
 *  - isRound      {boolean}           circular preview (for avatars)
 *  - error        {string}            external validation error message
 */
export default function ImageUploader({
  value,
  onChange,
  label = 'Image',
  hint,
  accept = 'image/*',
  maxSizeMB = 5,
  previewSize = 'md',
  isRound = false,
  error,
}) {
  const inputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // simulated

  const previewDimensions = {
    sm: { width: 64, height: 64 },
    md: { width: 96, height: 96 },
    lg: { width: 140, height: 140 },
  }[previewSize] || { width: 96, height: 96 };

  const handleFile = async (file) => {
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPEG, PNG, GIF, WebP, etc.)');
      return;
    }

    // Validate size
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadError(`File is too large. Maximum size is ${maxSizeMB} MB.`);
      return;
    }

    setUploadError('');
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate visual progress while uploading
    const progressInterval = setInterval(() => {
      setUploadProgress((p) => Math.min(p + 12, 85));
    }, 200);

    try {
      const url = await uploadToImgBB(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      onChange(url);
      // Brief flash of 100% before hiding
      setTimeout(() => setUploadProgress(0), 600);
    } catch (err) {
      clearInterval(progressInterval);
      setUploadError(err.message || 'Upload failed. Please try again.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e) => {
    handleFile(e.target.files?.[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange('');
    setUploadError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const displayError = error || uploadError;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <p className="text-sm font-medium text-gray-700">{label}</p>
      )}

      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative flex flex-col items-center justify-center gap-3 p-5
          border-2 border-dashed rounded-2xl cursor-pointer
          transition-all duration-200 select-none
          ${isDragging
            ? 'border-blue-500 bg-blue-50 scale-[1.01]'
            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50'
          }
          ${isUploading ? 'pointer-events-none opacity-70' : ''}
          ${displayError ? 'border-red-400 bg-red-50/50' : ''}
        `}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        aria-label={`Upload ${label}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleInputChange}
        />

        {/* Preview + controls */}
        {value ? (
          <div className="flex flex-col items-center gap-3">
            <div
              className={`relative overflow-hidden border-2 border-white shadow-md ${isRound ? 'rounded-full' : 'rounded-xl'}`}
              style={{ width: previewDimensions.width, height: previewDimensions.height }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
              />

              {/* Remove button overlay */}
              <button
                type="button"
                onClick={handleRemove}
                className={`absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-150 ${isRound ? 'rounded-full' : 'rounded-xl'}`}
                aria-label="Remove image"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs font-semibold text-green-600 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Uploaded successfully
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Click to replace</p>
            </div>
          </div>
        ) : isUploading ? (
          <div className="flex flex-col items-center gap-3 py-2">
            {/* Spinner */}
            <div className="w-10 h-10 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin" />
            <p className="text-sm font-medium text-blue-600">Uploading…</p>

            {/* Progress bar */}
            {uploadProgress > 0 && (
              <div className="w-36 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            {/* Upload icon */}
            <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${isDragging ? 'bg-blue-100' : 'bg-gray-100'} transition-colors`}>
              <svg className={`w-6 h-6 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700">
                {isDragging ? 'Drop to upload' : 'Click or drag & drop'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                PNG, JPG, GIF, WebP · Max {maxSizeMB} MB
              </p>
            </div>
          </div>
        )}
      </div>

      {hint && !displayError && (
        <p className="text-xs text-gray-400 px-1">{hint}</p>
      )}

      {displayError && (
        <p className="text-xs text-red-500 px-1 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {displayError}
        </p>
      )}
    </div>
  );
}
