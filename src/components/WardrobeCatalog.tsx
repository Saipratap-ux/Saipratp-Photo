import React, { useState } from 'react';
import {
  Shirt,
  Sparkles,
  Search,
  Plus,
  Tag,
  Check,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { SAMPLE_OUTFITS } from '../data/samples';
import { SampleOutfit } from '../types';

interface WardrobeCatalogProps {
  onSelectOutfitToTry: (outfit: SampleOutfit) => void;
  onUploadCustomOutfit: () => void;
}

export const WardrobeCatalog: React.FC<WardrobeCatalogProps> = ({
  onSelectOutfitToTry,
  onUploadCustomOutfit,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Suits & Formal',
    'Dresses',
    'Streetwear',
    'Outerwear',
    'Ethnic & Festive',
    'Casual',
  ];

  const filteredOutfits = SAMPLE_OUTFITS.filter((outfit) => {
    const matchesCategory =
      selectedCategory === 'All' || outfit.category === selectedCategory;
    const matchesSearch =
      outfit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outfit.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outfit.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="wardrobe-catalog-section" className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-100 font-serif sm:text-2xl">
            MURALI Curated Wardrobe & Fashion Vault
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Explore ready-to-wear designer pieces or import your own clothes to test with AI
          </p>
        </div>

        <button
          id="upload-custom-outfit-btn"
          onClick={onUploadCustomOutfit}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-stone-950 shadow-md shadow-amber-500/20 hover:bg-amber-400"
        >
          <Plus className="h-4 w-4" />
          <span>Upload Custom Outfit</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'bg-stone-900 border border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search velvet tux, silk dress, jacket..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-stone-800 bg-stone-900 py-1.5 pl-9 pr-4 text-xs text-stone-200 placeholder:text-stone-500 focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Outfit Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {filteredOutfits.map((outfit) => (
          <div
            key={outfit.id}
            id={`wardrobe-card-${outfit.id}`}
            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/90 shadow-xl transition-all hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10"
          >
            <div>
              {/* Image */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-950">
                <img
                  src={outfit.imageUrl}
                  alt={outfit.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 rounded-md bg-stone-950/80 px-2 py-0.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider backdrop-blur-md border border-stone-800">
                  {outfit.brand || outfit.category}
                </div>
                {outfit.price && (
                  <div className="absolute top-3 right-3 rounded-md bg-stone-950/80 px-2 py-0.5 text-xs font-bold text-stone-100 backdrop-blur-md border border-stone-800">
                    {outfit.price}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-sm font-bold text-stone-100 group-hover:text-amber-300">
                  {outfit.title}
                </h3>
                <p className="mt-1 text-xs text-stone-400 line-clamp-2">
                  {outfit.description}
                </p>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {outfit.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-stone-800/80 px-1.5 py-0.5 text-[10px] text-stone-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Try On Button */}
            <div className="p-4 pt-0">
              <button
                id={`try-now-${outfit.id}-btn`}
                onClick={() => onSelectOutfitToTry(outfit)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-800 py-2.5 text-xs font-bold text-stone-200 transition-all hover:bg-amber-500 hover:text-stone-950 group-hover:bg-amber-500 group-hover:text-stone-950"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Try On This Outfit</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
