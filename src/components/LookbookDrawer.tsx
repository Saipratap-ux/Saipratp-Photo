import React, { useState } from 'react';
import {
  BookmarkCheck,
  Trash2,
  Download,
  Star,
  Sparkles,
  Sliders,
  Calendar,
  Layers,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { downloadImage } from '../lib/imageUtils';
import { TryOnResult } from '../types';

interface LookbookDrawerProps {
  lookbook: TryOnResult[];
  onRemoveFromLookbook: (id: string) => void;
  onSelectToView: (item: TryOnResult) => void;
  onRateItem: (id: string, rating: number) => void;
  onGoToStudio: () => void;
}

export const LookbookDrawer: React.FC<LookbookDrawerProps> = ({
  lookbook,
  onRemoveFromLookbook,
  onSelectToView,
  onRateItem,
  onGoToStudio,
}) => {
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);

  const toggleCompare = (id: string) => {
    if (selectedForComparison.includes(id)) {
      setSelectedForComparison(selectedForComparison.filter((i) => i !== id));
    } else {
      if (selectedForComparison.length >= 2) {
        setSelectedForComparison([selectedForComparison[1], id]);
      } else {
        setSelectedForComparison([...selectedForComparison, id]);
      }
    }
  };

  const compareItems = lookbook.filter((item) =>
    selectedForComparison.includes(item.id)
  );

  return (
    <div id="lookbook-view-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-100 font-serif sm:text-2xl">
            My Virtual Lookbook ({lookbook.length})
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Review your past AI try-on fits, compare multiple outfits side-by-side, and save for shopping decisions
          </p>
        </div>

        {lookbook.length > 1 && (
          <div className="text-xs text-stone-400">
            {selectedForComparison.length === 2 ? (
              <span className="font-semibold text-amber-400">
                Comparing 2 Selected Outfits Below
              </span>
            ) : (
              <span>Select any 2 items to compare them side-by-side</span>
            )}
          </div>
        )}
      </div>

      {/* Side-by-Side Comparison Box if 2 items selected */}
      {compareItems.length === 2 && (
        <div className="rounded-2xl border-2 border-amber-500/40 bg-stone-900/90 p-5 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-bold text-stone-100">
                Side-by-Side Outfit Comparison
              </h3>
            </div>
            <button
              onClick={() => setSelectedForComparison([])}
              className="text-xs text-stone-400 hover:text-stone-200"
            >
              Clear Comparison
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {compareItems.map((item, idx) => (
              <div key={item.id} className="flex flex-col gap-3 rounded-xl bg-stone-950 p-4 border border-stone-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">
                    Option {idx === 0 ? 'A' : 'B'}: {item.outfitTitle}
                  </span>
                  {item.analysis && (
                    <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-300">
                      Match: {item.analysis.matchScore}%
                    </span>
                  )}
                </div>

                <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-stone-900">
                  <img
                    src={item.resultImage}
                    alt={item.outfitTitle}
                    className="h-full w-full object-contain"
                  />
                </div>

                {item.analysis && (
                  <div className="space-y-2 text-xs text-stone-300">
                    <p className="line-clamp-2 italic text-stone-400">
                      "{item.analysis.summary}"
                    </p>
                    <div className="flex justify-between border-t border-stone-800 pt-2 text-[11px]">
                      <span>Verdict: <strong className="text-stone-100">{item.analysis.overallVerdict}</strong></span>
                      <span>Fit Style: <strong className="text-stone-100">{item.fitStyle}</strong></span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid of All Saved Looks */}
      {lookbook.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-800 bg-stone-900/40 p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-850 text-stone-500">
            <BookmarkCheck className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-stone-200">
            Your Lookbook is Empty
          </h3>
          <p className="mt-1 max-w-sm text-xs text-stone-400">
            Upload your photo and try on outfits in the Virtual Try-On Studio to save your looks here.
          </p>
          <button
            onClick={onGoToStudio}
            className="mt-5 flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-stone-950 hover:bg-amber-400 shadow-md shadow-amber-500/20"
          >
            <Sparkles className="h-4 w-4" />
            <span>Go to Try-On Studio</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {lookbook.map((item) => {
            const isComparing = selectedForComparison.includes(item.id);
            return (
              <div
                key={item.id}
                id={`lookbook-card-${item.id}`}
                className={`group flex flex-col justify-between overflow-hidden rounded-2xl border bg-stone-900/90 shadow-xl transition-all ${
                  isComparing
                    ? 'border-amber-400 ring-2 ring-amber-400/40'
                    : 'border-stone-800 hover:border-stone-700'
                }`}
              >
                <div>
                  {/* Result Image */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-950">
                    <img
                      src={item.resultImage}
                      alt={item.outfitTitle}
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-102"
                    />

                    {/* Overlay Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      <span className="rounded-md bg-stone-950/80 px-2 py-0.5 text-[10px] font-bold text-amber-400 backdrop-blur-md border border-stone-800">
                        {item.fitStyle}
                      </span>
                    </div>

                    {item.analysis && (
                      <div className="absolute top-3 right-3 rounded-md bg-emerald-500/90 px-2 py-0.5 text-xs font-bold text-stone-950 shadow">
                        {item.analysis.matchScore}% Match
                      </div>
                    )}
                  </div>

                  {/* Info & Rating */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-stone-100 line-clamp-1">
                        {item.outfitTitle}
                      </h3>
                      {item.outfitPrice && (
                        <span className="text-xs font-bold text-stone-300">
                          {item.outfitPrice}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs text-stone-400">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>

                      {/* Star rating */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => onRateItem(item.id, star)}
                            className="text-stone-600 hover:text-amber-400"
                          >
                            <Star
                              className={`h-3.5 w-3.5 ${
                                (item.userRating || 0) >= star
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-stone-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {item.analysis && (
                      <p className="mt-2.5 text-xs text-stone-300 line-clamp-2">
                        {item.analysis.summary}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between border-t border-stone-800/80 bg-stone-950/40 p-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleCompare(item.id)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                        isComparing
                          ? 'bg-amber-500 text-stone-950 font-bold'
                          : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                      }`}
                    >
                      {isComparing ? 'Comparing' : 'Compare'}
                    </button>

                    <button
                      onClick={() => onSelectToView(item)}
                      className="flex items-center gap-1 rounded-lg bg-stone-800 px-2.5 py-1 text-xs font-medium text-stone-300 hover:bg-stone-700 hover:text-white"
                      title="Inspect in Studio"
                    >
                      <Eye className="h-3 w-3" />
                      <span>View</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => downloadImage(item.resultImage, `murali-${item.outfitTitle}.png`)}
                      className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-800 hover:text-stone-100"
                      title="Download image"
                    >
                      <Download className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => onRemoveFromLookbook(item.id)}
                      className="rounded-lg p-1.5 text-rose-400 hover:bg-rose-950/50"
                      title="Remove from lookbook"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
