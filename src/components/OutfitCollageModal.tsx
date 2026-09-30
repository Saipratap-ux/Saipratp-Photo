import React, { useRef, useEffect, useState } from 'react';
import { X, Download, Sparkles, Share2, Award, Check } from 'lucide-react';
import { TryOnResult } from '../types';

interface OutfitCollageModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: TryOnResult | null;
}

export const OutfitCollageModal: React.FC<OutfitCollageModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [collageDataUrl, setCollageDataUrl] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!isOpen || !result) return;

    const generateCollage = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Dark luxury background
      ctx.fillStyle = '#0c0a09';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gradient accent subtle glow
      const grad = ctx.createRadialGradient(600, 300, 50, 600, 300, 600);
      grad.addColorStop(0, 'rgba(245, 158, 11, 0.12)');
      grad.addColorStop(1, 'rgba(12, 10, 9, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gold top border line
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(0, 0, canvas.width, 6);

      // Header Brand
      ctx.font = 'bold 36px serif';
      ctx.fillStyle = '#fafaf9';
      ctx.fillText('MURALI', 60, 80);

      ctx.font = '600 16px sans-serif';
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('AI VIRTUAL TRY-ON STUDIO', 210, 78);

      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#a8a29e';
      ctx.fillText(new Date().toLocaleDateString('en-US', { dateStyle: 'medium' }), 1000, 78);

      // Helper function to load image
      const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = () => resolve(img);
          img.src = src;
        });
      };

      try {
        const [imgPerson, imgOutfit, imgResult] = await Promise.all([
          loadImage(result.personImage),
          loadImage(result.outfitImage),
          loadImage(result.resultImage),
        ]);

        // Draw Left column: 2 smaller cards (Person & Garment)
        // Draw Person Card
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(60, 130, 320, 420);
        ctx.drawImage(imgPerson, 60, 130, 320, 420);

        ctx.fillStyle = 'rgba(12, 10, 9, 0.8)';
        ctx.fillRect(60, 510, 320, 40);
        ctx.font = 'bold 14px sans-serif';
        ctx.fillStyle = '#e7e5e4';
        ctx.fillText('1. Original Portrait', 75, 535);

        // Draw Outfit Card
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(60, 580, 320, 420);
        ctx.drawImage(imgOutfit, 60, 580, 320, 420);

        ctx.fillStyle = 'rgba(12, 10, 9, 0.8)';
        ctx.fillRect(60, 960, 320, 40);
        ctx.font = 'bold 14px sans-serif';
        ctx.fillStyle = '#e7e5e4';
        ctx.fillText('2. Selected Garment', 75, 985);

        // Draw Main Result Card (Right side)
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(420, 130, 720, 870);
        ctx.drawImage(imgResult, 420, 130, 720, 870);

        // Frame border for Result
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.strokeRect(420, 130, 720, 870);

        // Result bottom banner
        ctx.fillStyle = 'rgba(12, 10, 9, 0.9)';
        ctx.fillRect(420, 870, 720, 130);

        ctx.font = 'bold 24px serif';
        ctx.fillStyle = '#fafaf9';
        ctx.fillText(result.outfitTitle, 450, 915);

        ctx.font = '15px sans-serif';
        ctx.fillStyle = '#a8a29e';
        const fitDesc = `Fit: ${result.fitStyle}  •  Environment: ${result.scene}`;
        ctx.fillText(fitDesc, 450, 945);

        if (result.analysis) {
          ctx.font = 'bold 18px sans-serif';
          ctx.fillStyle = '#f59e0b';
          ctx.fillText(`AI Score: ${result.analysis.matchScore}% Match (${result.analysis.overallVerdict})`, 450, 975);
        }

        // Footer Brand watermark
        ctx.font = '13px sans-serif';
        ctx.fillStyle = '#78716c';
        ctx.fillText('Generated with MURALI AI Virtual Try-On Engine', 450, 1140);

        const finalDataUrl = canvas.toDataURL('image/png', 0.95);
        setCollageDataUrl(finalDataUrl);
      } catch (err) {
        console.error('Collage generation error:', err);
      }
    };

    generateCollage();
  }, [isOpen, result]);

  if (!isOpen || !result) return null;

  const handleDownload = () => {
    if (!collageDataUrl) return;
    const link = document.createElement('a');
    link.href = collageDataUrl;
    link.download = `murali-lookbook-${result.outfitTitle.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.click();
  };

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      id="collage-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/85 p-4 backdrop-blur-sm"
    >
      <div
        id="collage-modal-container"
        className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-stone-800 bg-stone-900 shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <h3 className="text-base font-bold text-stone-100 font-serif">
              MURALI Lookbook Moodboard Card
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-800 hover:text-stone-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Card Viewport */}
        <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center bg-stone-950">
          {collageDataUrl ? (
            <img
              src={collageDataUrl}
              alt="Murali Fashion Collage"
              className="max-h-[500px] w-auto rounded-xl border border-stone-800 shadow-2xl"
            />
          ) : (
            <div className="py-20 text-center text-xs text-stone-400">
              Generating High Fashion Moodboard...
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-stone-800 bg-stone-900/90 px-6 py-4">
          <button
            onClick={handleCopyShare}
            className="flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-800 px-4 py-2 text-xs font-semibold text-stone-200 hover:bg-stone-700"
          >
            {copiedLink ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                <span>Share App Link</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            disabled={!collageDataUrl}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-stone-950 hover:bg-amber-400 shadow-md shadow-amber-500/20 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>Download Moodboard Card</span>
          </button>
        </div>
      </div>
    </div>
  );
};
