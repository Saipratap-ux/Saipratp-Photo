import React from 'react';
import {
  Sparkles,
  Award,
  CheckCircle2,
  Palette,
  Compass,
  Footprints,
  Watch,
  Layers,
  Scissors,
  Check,
  TrendingUp,
} from 'lucide-react';
import { FashionAnalysis } from '../types';

interface StylistAnalysisCardProps {
  analysis: FashionAnalysis | null;
  isLoading: boolean;
}

export const StylistAnalysisCard: React.FC<StylistAnalysisCardProps> = ({
  analysis,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div
        id="stylist-analysis-loading"
        className="rounded-2xl border border-stone-800 bg-stone-900/70 p-6 backdrop-blur-sm animate-pulse"
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-stone-800" />
          <div className="space-y-2">
            <div className="h-4 w-44 rounded bg-stone-800" />
            <div className="h-3 w-64 rounded bg-stone-800/60" />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-stone-800/40" />
          ))}
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'Instant Buy':
        return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300';
      case 'Great Match':
        return 'border-amber-500/40 bg-amber-500/10 text-amber-300';
      case 'Worth Considering':
        return 'border-blue-500/40 bg-blue-500/10 text-blue-300';
      default:
        return 'border-stone-700 bg-stone-800 text-stone-300';
    }
  };

  return (
    <div
      id="stylist-analysis-card"
      className="rounded-2xl border border-stone-800 bg-stone-900/90 p-6 shadow-xl backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-stone-100 font-serif">
                MURALI AI Stylist Verdict
              </h3>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${getVerdictColor(
                  analysis.overallVerdict
                )}`}
              >
                {analysis.overallVerdict}
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Personalized color harmony, silhouette, and occasion suitability analysis
            </p>
          </div>
        </div>

        {/* Big Overall Match Score */}
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-2">
          <Award className="h-5 w-5 text-amber-400" />
          <div>
            <div className="text-lg font-extrabold text-amber-400 font-serif">
              {analysis.matchScore}%
            </div>
            <div className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
              Fit & Style Match
            </div>
          </div>
        </div>
      </div>

      {/* 4 Score Metrics Bento */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-stone-800 bg-stone-950/60 p-3">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Color Harmony</span>
            <Palette className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="mt-1 text-lg font-bold text-stone-100">
            {analysis.colorHarmonyScore}%
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-800">
            <div
              className="h-full bg-amber-400 rounded-full"
              style={{ width: `${analysis.colorHarmonyScore}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-stone-800 bg-stone-950/60 p-3">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Silhouette Fit</span>
            <Scissors className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="mt-1 text-lg font-bold text-stone-100">
            {analysis.silhouetteScore}%
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-800">
            <div
              className="h-full bg-emerald-400 rounded-full"
              style={{ width: `${analysis.silhouetteScore}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-stone-800 bg-stone-950/60 p-3">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Versatility</span>
            <Compass className="h-3.5 w-3.5 text-sky-400" />
          </div>
          <div className="mt-1 text-lg font-bold text-stone-100">
            {analysis.versatilityScore}%
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-800">
            <div
              className="h-full bg-sky-400 rounded-full"
              style={{ width: `${analysis.versatilityScore}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-stone-800 bg-stone-950/60 p-3">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Palette Synergy</span>
            <TrendingUp className="h-3.5 w-3.5 text-purple-400" />
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            {analysis.colorPalette?.map((hex, i) => (
              <div
                key={i}
                className="h-5 w-5 rounded-full border border-stone-700 shadow-xs"
                style={{ backgroundColor: hex }}
                title={hex}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Summary Narrative */}
      <div className="mt-4 rounded-xl border border-stone-800/80 bg-stone-950/40 p-4">
        <p className="text-xs leading-relaxed text-stone-300">
          <strong className="text-amber-300 font-semibold">Stylist Note: </strong>
          {analysis.summary}
        </p>
      </div>

      {/* Key Strengths & Occasions */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Key Strengths */}
        <div>
          <h4 className="mb-2 text-xs font-bold text-stone-300 uppercase tracking-wider">
            Why This Works For You
          </h4>
          <ul className="space-y-1.5">
            {analysis.keyStrengths?.map((strength, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-stone-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suitable Occasions */}
        <div>
          <h4 className="mb-2 text-xs font-bold text-stone-300 uppercase tracking-wider">
            Ideal Occasions
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {analysis.suitableOccasions?.map((occ, idx) => (
              <span
                key={idx}
                className="rounded-lg border border-stone-700/80 bg-stone-950/80 px-2.5 py-1 text-xs font-medium text-amber-200/90"
              >
                {occ}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Complete Styling Advice (Shoes, Jewelry, Layering) */}
      <div className="mt-5 border-t border-stone-800/80 pt-4">
        <h4 className="mb-3 text-xs font-bold text-stone-300 uppercase tracking-wider">
          Complete The Look (Stylist Recommendations)
        </h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-stone-800 bg-stone-950/50 p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
              <Footprints className="h-3.5 w-3.5" />
              <span>Footwear Pairing</span>
            </div>
            <p className="mt-1 text-xs text-stone-300">
              {analysis.stylingRecommendations?.footwear}
            </p>
          </div>

          <div className="rounded-xl border border-stone-800 bg-stone-950/50 p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
              <Watch className="h-3.5 w-3.5" />
              <span>Accessories & Accents</span>
            </div>
            <p className="mt-1 text-xs text-stone-300">
              {analysis.stylingRecommendations?.accessories}
            </p>
          </div>

          <div className="rounded-xl border border-stone-800 bg-stone-950/50 p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
              <Layers className="h-3.5 w-3.5" />
              <span>Layering / Grooming</span>
            </div>
            <p className="mt-1 text-xs text-stone-300">
              {analysis.stylingRecommendations?.layering || analysis.stylingRecommendations?.groomingTips}
            </p>
          </div>
        </div>
      </div>

      {/* Tailoring & Fit Note */}
      {analysis.tailoringAdvice && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-500/5 p-2.5 border border-amber-500/20 text-[11px] text-stone-300">
          <Scissors className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-amber-300">Tailoring Tip: </strong>
            {analysis.tailoringAdvice}
          </span>
        </div>
      )}
    </div>
  );
};
