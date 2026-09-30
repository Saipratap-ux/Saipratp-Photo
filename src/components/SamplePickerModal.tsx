import React, { useState } from 'react';
import { X, Sparkles, User, Shirt, Tag, Check } from 'lucide-react';
import { SAMPLE_PEOPLE, SAMPLE_OUTFITS } from '../data/samples';
import { SampleOutfit, SamplePerson } from '../types';

interface SamplePickerModalProps {
  isOpen: boolean;
  type: 'person' | 'outfit';
  onClose: () => void;
  onSelectPerson: (person: SamplePerson) => void;
  onSelectOutfit: (outfit: SampleOutfit) => void;
}

export const SamplePickerModal: React.FC<SamplePickerModalProps> = ({
  isOpen,
  type,
  onClose,
  onSelectPerson,
  onSelectOutfit,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Suits & Formal', 'Dresses', 'Streetwear', 'Outerwear', 'Ethnic & Festive', 'Casual'];

  const filteredOutfits =
    activeCategory === 'All'
      ? SAMPLE_OUTFITS
      : SAMPLE_OUTFITS.filter((o) => o.category === activeCategory);

  return (
    <div
      id="sample-picker-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm"
    >
      <div
        id="sample-picker-container"
        className="relative max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-stone-800 bg-stone-900 shadow-2xl flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              {type === 'person' ? <User className="h-4 w-4" /> : <Shirt className="h-4 w-4" />}
            </div>
            <div>
              <h3 className="text-base font-semibold text-stone-100">
                {type === 'person' ? 'Select a Model Preset' : 'Select a Curated Outfit'}
              </h3>
              <p className="text-xs text-stone-400">
                {type === 'person'
                  ? 'Choose a high-resolution portrait with clear pose & lighting'
                  : 'Select a designer garment to preview on your portrait'}
              </p>
            </div>
          </div>

          <button
            id="sample-picker-close-btn"
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-800 hover:text-stone-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Outfit category pills if picking outfit */}
        {type === 'outfit' && (
          <div className="flex items-center gap-1.5 overflow-x-auto border-b border-stone-800/80 bg-stone-950/40 px-6 py-2.5 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-stone-950 font-semibold'
                    : 'bg-stone-800/70 text-stone-300 hover:bg-stone-700 hover:text-stone-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Grid List */}
        <div className="flex-1 overflow-y-auto p-6">
          {type === 'person' ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {SAMPLE_PEOPLE.map((person) => (
                <div
                  key={person.id}
                  id={`sample-person-${person.id}`}
                  onClick={() => {
                    onSelectPerson(person);
                    onClose();
                  }}
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-stone-800 bg-stone-950/70 transition-all hover:border-amber-500/60 hover:shadow-lg hover:shadow-amber-500/10"
                >
                  <div className="aspect-[3/4] w-full overflow-hidden bg-stone-800">
                    <img
                      src={person.imageUrl}
                      alt={person.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-stone-100 group-hover:text-amber-300">
                        {person.name}
                      </h4>
                      <span className="rounded bg-stone-800 px-1.5 py-0.5 text-[10px] text-stone-400 capitalize">
                        {person.gender}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-stone-400 line-clamp-1">
                      {person.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {filteredOutfits.map((outfit) => (
                <div
                  key={outfit.id}
                  id={`sample-outfit-${outfit.id}`}
                  onClick={() => {
                    onSelectOutfit(outfit);
                    onClose();
                  }}
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-stone-800 bg-stone-950/70 transition-all hover:border-amber-500/60 hover:shadow-lg hover:shadow-amber-500/10"
                >
                  <div className="aspect-[3/4] w-full overflow-hidden bg-stone-800">
                    <img
                      src={outfit.imageUrl}
                      alt={outfit.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-medium text-amber-400 uppercase tracking-wide">
                        {outfit.brand || outfit.category}
                      </span>
                      {outfit.price && (
                        <span className="text-xs font-bold text-stone-200">
                          {outfit.price}
                        </span>
                      )}
                    </div>
                    <h4 className="mt-1 text-xs font-semibold text-stone-100 group-hover:text-amber-300 line-clamp-1">
                      {outfit.title}
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {outfit.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-stone-800/90 px-1.5 py-0.5 text-[9px] text-stone-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
