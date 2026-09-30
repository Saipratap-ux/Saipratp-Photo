import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Sliders,
  Columns,
  Maximize2,
  Download,
  Bookmark,
  BookmarkCheck,
  Share2,
  Sparkles,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Shirt,
  User,
  Check,
} from 'lucide-react';
import { downloadImage } from '../lib/imageUtils';
import { TryOnResult } from '../types';

interface InteractiveComparisonSliderProps {
  personImage: string;
  outfitImage: string;
  resultImage: string;
  outfitTitle: string;
  isSavedToLookbook: boolean;
  onToggleSaveLookbook: () => void;
  onOpenCollageModal: () => void;
  onRegenerate: () => void;
}

type ViewMode = 'slider' | 'side-by-side' | 'single';

export const InteractiveComparisonSlider: React.FC<InteractiveComparisonSliderProps> = ({
  personImage,
  outfitImage,
  resultImage,
  outfitTitle,
  isSavedToLookbook,
  onToggleSaveLookbook,
  onOpenCollageModal,
  onRegenerate,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('slider');
  const [sliderComparisonMode, setSliderComparisonMode] = useState<'person' | 'outfit'>('person');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [justSaved, setJustSaved] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleSliderMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const width = rect.width;
      let pos = (x / width) * 100;
      pos = Math.max(5, Math.min(95, pos));
      setSliderPosition(pos);
    },
    []
  );

  const handleMouseDown = () => setIsDragging(true);
  const handleTouchStart = () => setIsDragging(true);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleSliderMove(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) handleSliderMove(e.touches[0].clientX);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleSliderMove]);

  const handleSaveClick = () => {
    onToggleSaveLookbook();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const beforeImage = sliderComparisonMode === 'person' ? personImage : outfitImage;
  const beforeLabel = sliderComparisonMode === 'person' ? 'Original Photo' : 'Outfit Garment';

  return (
    <div
      id="try-on-results-studio"
      className="rounded-2xl border border-stone-800 bg-stone-900/90 p-5 shadow-2xl backdrop-blur-sm"
    >
      {/* Studio Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-lg font-bold text-stone-100 font-serif">
              Virtual Try-On Result
            </h2>
            <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
              AI Tailored
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">{outfitTitle}</p>
        </div>

        {/* View Mode Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-xl border border-stone-800 bg-stone-950/80 p-1">
            <button
              id="viewmode-slider-btn"
              onClick={() => setViewMode('slider')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                viewMode === 'slider'
                  ? 'bg-amber-500 text-stone-950 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Split Slider</span>
            </button>

            <button
              id="viewmode-side-by-side-btn"
              onClick={() => setViewMode('side-by-side')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                viewMode === 'side-by-side'
                  ? 'bg-amber-500 text-stone-950 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Columns className="h-3.5 w-3.5" />
              <span>Side-by-Side</span>
            </button>

            <button
              id="viewmode-single-btn"
              onClick={() => setViewMode('single')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                viewMode === 'single'
                  ? 'bg-amber-500 text-stone-950 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Full View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Visualizer Area */}
      <div className="mt-4">
        {viewMode === 'slider' && (
          <div className="flex flex-col items-center">
            {/* Slider Comparison Toggle */}
            <div className="mb-3 flex items-center gap-2">
              <span className="text-[11px] font-medium text-stone-400">Compare With:</span>
              <button
                onClick={() => setSliderComparisonMode('person')}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  sliderComparisonMode === 'person'
                    ? 'border border-amber-500/50 bg-amber-500/20 text-amber-300'
                    : 'border border-stone-800 bg-stone-950/60 text-stone-400 hover:text-stone-200'
                }`}
              >
                <User className="h-3 w-3" />
                <span>Original Person</span>
              </button>
              <button
                onClick={() => setSliderComparisonMode('outfit')}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  sliderComparisonMode === 'outfit'
                    ? 'border border-amber-500/50 bg-amber-500/20 text-amber-300'
                    : 'border border-stone-800 bg-stone-950/60 text-stone-400 hover:text-stone-200'
                }`}
              >
                <Shirt className="h-3 w-3" />
                <span>Garment</span>
              </button>
            </div>

            {/* Interactive Slider Viewport */}
            <div
              ref={containerRef}
              id="interactive-slider-canvas"
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              className="relative aspect-[3/4] w-full max-w-lg cursor-ew-resize select-none overflow-hidden rounded-2xl border-2 border-stone-800 bg-stone-950 shadow-2xl"
            >
              {/* After Image (Try-On Result - Right side / Full background) */}
              <div className="absolute inset-0 h-full w-full">
                <img
                  src={resultImage}
                  alt="Virtual try-on result"
                  className="h-full w-full object-contain"
                  style={{ transform: `scale(${zoomLevel})` }}
                />
                <div className="absolute top-4 right-4 rounded-md bg-amber-500/90 px-2.5 py-1 text-[11px] font-bold text-stone-950 shadow backdrop-blur-md">
                  Virtual Try-On
                </div>
              </div>

              {/* Before Image (Original / Left side overlay with clip-path) */}
              <div
                className="absolute inset-0 h-full w-full overflow-hidden"
                style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
              >
                <img
                  src={beforeImage}
                  alt={beforeLabel}
                  className="h-full w-full object-contain"
                  style={{ transform: `scale(${zoomLevel})` }}
                />
                <div className="absolute top-4 left-4 rounded-md bg-stone-950/80 px-2.5 py-1 text-[11px] font-bold text-stone-200 shadow border border-stone-800 backdrop-blur-md">
                  {beforeLabel}
                </div>
              </div>

              {/* Draggable Divider Line & Knob */}
              <div
                className="absolute top-0 bottom-0 z-20 w-0.5 bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-amber-300 bg-stone-950 text-amber-400 shadow-xl transition-transform active:scale-110">
                  <div className="flex items-center gap-0.5">
                    <span className="block h-3 w-0.5 rounded bg-amber-400" />
                    <span className="block h-3 w-0.5 rounded bg-amber-400" />
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-2 text-[11px] text-stone-400">
              Drag slider left or right to inspect seamless garment draping & body alignment
            </p>
          </div>
        )}

        {viewMode === 'side-by-side' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Person */}
            <div className="overflow-hidden rounded-xl border border-stone-800 bg-stone-950">
              <div className="border-b border-stone-800 bg-stone-900/60 px-3 py-2 text-xs font-semibold text-stone-300">
                1. Your Photo
              </div>
              <div className="aspect-[3/4] w-full p-2">
                <img
                  src={personImage}
                  alt="Original person"
                  className="h-full w-full object-contain rounded-lg"
                />
              </div>
            </div>

            {/* Garment */}
            <div className="overflow-hidden rounded-xl border border-stone-800 bg-stone-950">
              <div className="border-b border-stone-800 bg-stone-900/60 px-3 py-2 text-xs font-semibold text-stone-300">
                2. Outfit Garment
              </div>
              <div className="aspect-[3/4] w-full p-2">
                <img
                  src={outfitImage}
                  alt="Outfit garment"
                  className="h-full w-full object-contain rounded-lg"
                />
              </div>
            </div>

            {/* Try-On Result */}
            <div className="overflow-hidden rounded-xl border-2 border-amber-500/60 bg-stone-950 shadow-lg shadow-amber-500/10">
              <div className="flex items-center justify-between border-b border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300">
                <span>3. MURALI Virtual Try-On</span>
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div className="aspect-[3/4] w-full p-2">
                <img
                  src={resultImage}
                  alt="Virtual try-on result"
                  className="h-full w-full object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {viewMode === 'single' && (
          <div className="flex flex-col items-center">
            <div className="relative aspect-[3/4] w-full max-w-lg overflow-hidden rounded-2xl border-2 border-stone-800 bg-stone-950 shadow-2xl">
              <img
                src={resultImage}
                alt="Virtual try-on result high resolution"
                className="h-full w-full object-contain"
                style={{ transform: `scale(${zoomLevel})` }}
              />

              {/* Zoom controls */}
              <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-xl border border-stone-800 bg-stone-950/80 p-1 backdrop-blur-md">
                <button
                  onClick={() => setZoomLevel((prev) => Math.max(1, prev - 0.25))}
                  className="rounded-lg p-1 text-stone-400 hover:bg-stone-800 hover:text-stone-100"
                  title="Zoom out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="px-1 text-[11px] font-semibold text-stone-300">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel((prev) => Math.min(2.5, prev + 0.25))}
                  className="rounded-lg p-1 text-stone-400 hover:bg-stone-800 hover:text-stone-100"
                  title="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-stone-800 pt-4">
        <button
          id="regenerate-from-viewer-btn"
          onClick={onRegenerate}
          className="flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-800 px-4 py-2 text-xs font-semibold text-stone-200 hover:bg-stone-700 hover:text-white"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Another Variation</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Save to Lookbook */}
          <button
            id="save-to-lookbook-btn"
            onClick={handleSaveClick}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              isSavedToLookbook
                ? 'border border-amber-500 bg-amber-500/20 text-amber-300'
                : 'border border-stone-700 bg-stone-800 text-stone-200 hover:bg-stone-700'
            }`}
          >
            {isSavedToLookbook ? (
              <>
                <BookmarkCheck className="h-4 w-4 text-amber-400" />
                <span>Saved to Lookbook</span>
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4" />
                <span>Save to Lookbook</span>
              </>
            )}
          </button>

          {/* Create Shareable Moodboard / Collage */}
          <button
            id="share-card-btn"
            onClick={onOpenCollageModal}
            className="flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-800 px-4 py-2 text-xs font-semibold text-stone-200 hover:bg-stone-700"
          >
            <Share2 className="h-4 w-4" />
            <span>Lookbook Card</span>
          </button>

          {/* Download Try-On Image */}
          <button
            id="download-result-btn"
            onClick={() => downloadImage(resultImage, `murali-${outfitTitle.toLowerCase().replace(/\s+/g, '-')}.png`)}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-stone-950 shadow-md shadow-amber-500/20 hover:bg-amber-400"
          >
            <Download className="h-4 w-4" />
            <span>Download High-Res</span>
          </button>
        </div>
      </div>
    </div>
  );
};
