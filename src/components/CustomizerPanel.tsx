import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Sparkles,
  MapPin,
  Tag,
  Scissors,
  Check,
  ChevronDown,
  Loader2,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { FitStyle, SceneType } from '../types';

interface CustomizerPanelProps {
  fitStyle: FitStyle;
  setFitStyle: (fit: FitStyle) => void;
  scene: SceneType;
  setScene: (scene: SceneType) => void;
  promptNote: string;
  setPromptNote: (note: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  canGenerate: boolean;
  hasResult: boolean;
}

const FIT_OPTIONS: { label: FitStyle; desc: string }[] = [
  { label: 'Regular Fit', desc: 'Standard true-to-size draping' },
  { label: 'Slim / Tailored Fit', desc: 'Contoured waist & sleeves' },
  { label: 'Relaxed / Oversized', desc: 'Loose drape with dropped shoulders' },
  { label: 'Tucked In', desc: 'Clean tucked waistband styling' },
  { label: 'Untucked / Flowing', desc: 'Casual free-flowing hem' },
];

const SCENE_OPTIONS: { label: SceneType; iconDesc: string }[] = [
  { label: 'Studio Clean', iconDesc: 'Neutral high-key fashion backdrop' },
  { label: 'Luxury Fashion Runway', iconDesc: 'Dramatic spotlights & catwalk' },
  { label: 'Urban Street Style', iconDesc: 'Modern city architectural vibe' },
  { label: 'Modern Minimalist Loft', iconDesc: 'Warm ambient indoor aesthetic' },
  { label: 'Golden Hour Outdoor', iconDesc: 'Warm natural sunset lighting' },
  { label: 'Cozy Boutique Cafe', iconDesc: 'Relaxed lifestyle environment' },
  { label: 'Original', iconDesc: 'Preserve person background' },
];

const QUICK_TAGS = [
  'Roll up sleeves',
  'Add matching sunglasses',
  'Pair with white sneakers',
  'Pair with dress leather shoes',
  'Minimalist watch & jewelry',
  'Unbutton top collar',
];

export const CustomizerPanel: React.FC<CustomizerPanelProps> = ({
  fitStyle,
  setFitStyle,
  scene,
  setScene,
  promptNote,
  setPromptNote,
  onGenerate,
  isGenerating,
  canGenerate,
  hasResult,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleTagClick = (tag: string) => {
    if (promptNote.includes(tag)) {
      setPromptNote(promptNote.replace(tag, '').replace(/,\s*,/g, ',').trim());
    } else {
      setPromptNote(promptNote ? `${promptNote}, ${tag}` : tag);
    }
  };

  return (
    <div
      id="customizer-panel"
      className="rounded-2xl border border-stone-800 bg-stone-900/90 p-5 shadow-xl backdrop-blur-sm"
    >
      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-stone-100">Try-On Customization</h3>
        </div>
        <span className="text-[11px] text-stone-400">Tailor fit & atmosphere</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {/* Fit Style Selection */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-stone-300">
            <Scissors className="h-3.5 w-3.5 text-amber-400" />
            Fit & Silhouette
          </label>
          <div className="relative">
            <select
              id="fit-style-select"
              value={fitStyle}
              onChange={(e) => setFitStyle(e.target.value as FitStyle)}
              className="w-full appearance-none rounded-xl border border-stone-700/80 bg-stone-950 px-3.5 py-2.5 text-xs font-medium text-stone-200 focus:border-amber-500 focus:outline-none"
            >
              {FIT_OPTIONS.map((opt) => (
                <option key={opt.label} value={opt.label}>
                  {opt.label} — {opt.desc}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-stone-400" />
          </div>
        </div>

        {/* Scene / Environment Selection */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-stone-300">
            <MapPin className="h-3.5 w-3.5 text-amber-400" />
            Lighting & Scene Environment
          </label>
          <div className="relative">
            <select
              id="scene-type-select"
              value={scene}
              onChange={(e) => setScene(e.target.value as SceneType)}
              className="w-full appearance-none rounded-xl border border-stone-700/80 bg-stone-950 px-3.5 py-2.5 text-xs font-medium text-stone-200 focus:border-amber-500 focus:outline-none"
            >
              {SCENE_OPTIONS.map((sc) => (
                <option key={sc.label} value={sc.label}>
                  {sc.label} ({sc.iconDesc})
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-stone-400" />
          </div>
        </div>
      </div>

      {/* Quick Styling Tags */}
      <div className="mt-4">
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-stone-300">
          <Tag className="h-3.5 w-3.5 text-amber-400" />
          Styling Accents & Additions
        </label>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_TAGS.map((tag) => {
            const isSelected = promptNote.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                  isSelected
                    ? 'border border-amber-500 bg-amber-500/20 text-amber-300'
                    : 'border border-stone-800 bg-stone-950/70 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                }`}
              >
                {isSelected && <Check className="h-3 w-3" />}
                <span>{tag}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Note input */}
      <div className="mt-3">
        <input
          id="custom-styling-input"
          type="text"
          placeholder="Custom instructions (e.g. 'high fashion portrait, drape loosely over shoulders')"
          value={promptNote}
          onChange={(e) => setPromptNote(e.target.value)}
          className="w-full rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-xs text-stone-200 placeholder:text-stone-500 focus:border-amber-500 focus:outline-none"
        />
      </div>

      {/* Main Try-On Trigger Button */}
      <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
        <button
          id="generate-try-on-btn"
          onClick={onGenerate}
          disabled={!canGenerate || isGenerating}
          className={`relative flex w-full flex-1 items-center justify-center gap-2.5 overflow-hidden rounded-xl px-6 py-3.5 text-sm font-bold tracking-wide transition-all shadow-lg ${
            canGenerate && !isGenerating
              ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 hover:brightness-110 shadow-amber-500/25 active:scale-[0.99] cursor-pointer'
              : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700/50'
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-stone-950" />
              <span>Fitting Outfit with MURALI AI...</span>
            </>
          ) : hasResult ? (
            <>
              <RefreshCw className="h-5 w-5 fill-stone-950" />
              <span>Re-Generate Try-On with New Settings</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 fill-stone-950" />
              <span>Generate Virtual Try-On</span>
            </>
          )}
        </button>

        {!canGenerate && (
          <p className="text-center text-xs text-stone-400 sm:text-left">
            * Please select both a photo of yourself and an outfit to try on.
          </p>
        )}
      </div>
    </div>
  );
};
