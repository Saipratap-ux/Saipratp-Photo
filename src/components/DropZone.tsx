import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  Camera,
  Sparkles,
  X,
  Link,
  Image as ImageIcon,
  User,
  Shirt,
  CheckCircle2,
} from 'lucide-react';
import { fileToBase64, optimizeImageDataUri, urlToDataUri } from '../lib/imageUtils';

interface DropZoneProps {
  id: string;
  type: 'person' | 'outfit';
  title: string;
  subtitle: string;
  image: string | null;
  imageLabel?: string;
  onImageSelected: (imageDataUri: string, label?: string) => void;
  onClearImage: () => void;
  onOpenSampleModal: () => void;
  onOpenCameraModal?: () => void;
}

export const DropZone: React.FC<DropZoneProps> = ({
  id,
  type,
  title,
  subtitle,
  image,
  imageLabel,
  onImageSelected,
  onClearImage,
  onOpenSampleModal,
  onOpenCameraModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const rawBase64 = await fileToBase64(file);
        const optimized = await optimizeImageDataUri(rawBase64);
        onImageSelected(optimized, file.name);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const rawBase64 = await fileToBase64(file);
      const optimized = await optimizeImageDataUri(rawBase64);
      onImageSelected(optimized, file.name);
    }
  };

  const handleLoadUrl = async () => {
    if (!urlInputValue.trim()) return;
    try {
      setUrlLoading(true);
      setUrlError(null);
      const dataUri = await urlToDataUri(urlInputValue.trim());
      const optimized = await optimizeImageDataUri(dataUri);
      onImageSelected(optimized, 'Web image');
      setShowUrlInput(false);
      setUrlInputValue('');
    } catch (err: any) {
      setUrlError('Failed to load image from this URL. Please check the link or upload a file.');
    } finally {
      setUrlLoading(false);
    }
  };

  return (
    <div id={`${id}-card`} className="flex flex-col h-full">
      {/* Zone Header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-semibold ${
              type === 'person'
                ? 'bg-amber-500/20 text-amber-300'
                : 'bg-emerald-500/20 text-emerald-300'
            }`}
          >
            {type === 'person' ? <User className="h-3.5 w-3.5" /> : <Shirt className="h-3.5 w-3.5" />}
          </div>
          <span className="text-sm font-semibold text-stone-200">{title}</span>
        </div>

        {image && (
          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Ready
          </span>
        )}
      </div>

      {/* Main Container */}
      <div
        id={id}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-2xl border-2 transition-all min-h-[340px] sm:min-h-[380px] ${
          isDragging
            ? 'border-amber-400 bg-amber-950/20 shadow-lg shadow-amber-500/20'
            : image
            ? 'border-stone-700/80 bg-stone-950'
            : 'border-dashed border-stone-800 bg-stone-900/50 hover:border-stone-700 hover:bg-stone-900/80'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {image ? (
          /* Preview state */
          <div className="relative h-full w-full group flex items-center justify-center bg-stone-950">
            <img
              src={image}
              alt={title}
              referrerPolicy="no-referrer"
              className="h-full w-full object-contain max-h-[380px]"
            />

            {/* Label overlay badge */}
            {imageLabel && (
              <div className="absolute top-3 left-3 z-10 max-w-[80%] truncate rounded-md bg-stone-950/80 px-2.5 py-1 text-xs font-medium text-stone-200 backdrop-blur-md border border-stone-800">
                {imageLabel}
              </div>
            )}

            {/* Hover Actions */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-stone-950/60 opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl border border-stone-700 bg-stone-900/90 px-3 py-1.5 text-xs font-semibold text-stone-200 shadow-md hover:bg-stone-800 hover:text-white"
              >
                Change Image
              </button>
              <button
                onClick={onClearImage}
                className="rounded-xl border border-rose-500/30 bg-rose-950/70 p-2 text-xs font-semibold text-rose-300 shadow-md hover:bg-rose-900"
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Empty / Upload State */
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-stone-800 bg-stone-850/80 text-amber-400 shadow-inner">
              <UploadCloud className="h-7 w-7" />
            </div>

            <p className="text-sm font-medium text-stone-200">
              Drag & Drop your image here
            </p>
            <p className="mt-1 text-xs text-stone-400 max-w-[220px]">
              {subtitle}
            </p>

            {/* Primary Browse Button */}
            <button
              id={`${id}-browse-btn`}
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 rounded-xl bg-stone-800 px-4 py-2 text-xs font-semibold text-stone-100 hover:bg-stone-700 hover:text-amber-300 border border-stone-700 transition-all"
            >
              Browse Files
            </button>

            {/* Action Bar (Camera, Presets, URL) */}
            <div className="mt-5 flex items-center gap-2">
              {type === 'person' && onOpenCameraModal && (
                <button
                  id={`${id}-webcam-btn`}
                  onClick={onOpenCameraModal}
                  className="flex items-center gap-1.5 rounded-lg border border-stone-800 bg-stone-950/60 px-2.5 py-1.5 text-[11px] font-medium text-stone-300 hover:border-stone-700 hover:bg-stone-800 hover:text-amber-300"
                >
                  <Camera className="h-3.5 w-3.5 text-amber-400" />
                  <span>Take Selfie</span>
                </button>
              )}

              <button
                id={`${id}-sample-preset-btn`}
                onClick={onOpenSampleModal}
                className="flex items-center gap-1.5 rounded-lg border border-stone-800 bg-stone-950/60 px-2.5 py-1.5 text-[11px] font-medium text-stone-300 hover:border-stone-700 hover:bg-stone-800 hover:text-amber-300"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Sample {type === 'person' ? 'Models' : 'Outfits'}</span>
              </button>

              <button
                id={`${id}-url-toggle-btn`}
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="flex items-center gap-1.5 rounded-lg border border-stone-800 bg-stone-950/60 px-2.5 py-1.5 text-[11px] font-medium text-stone-300 hover:border-stone-700 hover:bg-stone-800 hover:text-amber-300"
                title="Paste image URL"
              >
                <Link className="h-3.5 w-3.5" />
                <span>Paste Link</span>
              </button>
            </div>

            {/* URL Input dropdown */}
            {showUrlInput && (
              <div className="mt-3 w-full max-w-[280px] rounded-xl border border-stone-800 bg-stone-950 p-2.5">
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={urlInputValue}
                  onChange={(e) => setUrlInputValue(e.target.value)}
                  className="w-full rounded-lg border border-stone-800 bg-stone-900 px-2.5 py-1.5 text-xs text-stone-200 placeholder:text-stone-500 focus:border-amber-500 focus:outline-none"
                />
                {urlError && <p className="mt-1 text-[10px] text-rose-400">{urlError}</p>}
                <div className="mt-2 flex justify-end gap-1.5">
                  <button
                    onClick={() => setShowUrlInput(false)}
                    className="rounded px-2 py-1 text-[10px] text-stone-400 hover:text-stone-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLoadUrl}
                    disabled={urlLoading || !urlInputValue}
                    className="rounded bg-amber-500 px-2.5 py-1 text-[10px] font-semibold text-stone-950 hover:bg-amber-400 disabled:opacity-50"
                  >
                    {urlLoading ? 'Loading...' : 'Load'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
