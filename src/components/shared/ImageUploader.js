'use client';

import { useRef, useState } from 'react';
import { uploadToImgBB } from '@/lib/imgbb';

/**
 * Reusable image uploader backed by imgBB or direct URL inputs.
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
  const [mode, setMode] = useState(value && !value.includes('ibb.co') ? 'url' : 'upload');
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

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPEG, PNG, GIF, WebP, etc.)');
      return;
    }

    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadError(`File is too large. Maximum size is ${maxSizeMB} MB.`);
      return;
    }

    setUploadError('');
    setIsUploading(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress((p) => Math.min(p + 12, 85));
    }, 200);

    try {
      const url = await uploadToImgBB(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      onChange(url);
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
    <div className="w-full space-y-2">
      {label && (
        <p className="text-sm font-bold text-cf-dark">{label}</p>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            mode === 'upload'
              ? 'bg-cf-dark text-cf-cream border-cf-dark shadow-sm'
              : 'bg-white text-cf-brown border-cf-tan hover:bg-cf-cream/30'
          }`}
        >
          📤 Upload Image
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            mode === 'url'
              ? 'bg-cf-dark text-cf-cream border-cf-dark shadow-sm'
              : 'bg-white text-cf-brown border-cf-tan hover:bg-cf-cream/30'
          }`}
        >
          🔗 Image URL
        </button>
      </div>

      {mode === 'upload' ? (
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
              ? 'border-cf-dark bg-cf-cream/40 scale-[1.01]'
              : 'border-cf-tan bg-white hover:border-cf-brown hover:bg-cf-cream/10'
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

          {value ? (
            <div className="flex flex-col items-center gap-3">
              <div
                className={`relative overflow-hidden border-2 border-white shadow-md ${isRound ? 'rounded-full' : 'rounded-xl'}`}
                style={{ width: previewDimensions.width, height: previewDimensions.height }}
              >
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
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
                  ✓ Uploaded successfully
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">Click to replace file</p>
              </div>
            </div>
          ) : isUploading ? (
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="w-8 h-8 rounded-full border-4 border-cf-tan border-t-cf-dark animate-spin" />
              <p className="text-xs font-semibold text-cf-dark">Uploading…</p>
              {uploadProgress > 0 && (
                <div className="w-32 h-1 bg-cf-tan rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cf-dark rounded-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-2">
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${isDragging ? 'bg-cf-cream' : 'bg-cf-cream/50'} transition-colors`}>
                <svg className="w-5 h-5 text-cf-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-cf-brown">
                  {isDragging ? 'Drop to upload' : 'Click or drag & drop'}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  PNG, JPG, WebP · Max {maxSizeMB} MB
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Paste direct image link (e.g. https://domain.com/pic.png)"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-cf-tan rounded-xl text-sm focus:border-cf-dark focus:outline-none placeholder-cf-brown/40 shadow-sm transition-all"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>
          {value && (
            <div className="flex items-center gap-3 bg-cf-cream/10 p-3 border border-cf-tan rounded-2xl">
              <div
                className={`relative overflow-hidden border border-cf-tan shadow-sm bg-white shrink-0 ${isRound ? 'rounded-full' : 'rounded-xl'}`}
                style={{ width: previewDimensions.width, height: previewDimensions.height }}
              >
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextSibling.style.display = 'flex';
                  }}
                />
                <div style={{ display: 'none' }} className="w-full h-full bg-red-50 text-red-500 text-[10px] font-bold text-center items-center justify-center p-1">
                  ⚠️ Invalid URL
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-cf-dark">Image Link Preview</p>
                <p className="text-[10px] text-cf-brown/60 truncate max-w-xs">{value}</p>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="text-xs font-bold text-red-500 hover:underline mt-1 block"
                >
                  Clear Link
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {hint && !displayError && (
        <p className="text-[10px] text-cf-brown/60 px-1">{hint}</p>
      )}

      {displayError && (
        <p className="text-xs text-red-500 px-1 flex items-center gap-1">
          ⚠️ {displayError}
        </p>
      )}
    </div>
  );
}
