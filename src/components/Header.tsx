import React from 'react';
import { Sparkles, Shirt, BookmarkCheck, Camera, Layers, Wand2 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'studio' | 'wardrobe' | 'lookbook';
  setActiveTab: (tab: 'studio' | 'wardrobe' | 'lookbook') => void;
  lookbookCount: number;
  onOpenQuickCamera?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lookbookCount,
  onOpenQuickCamera,
}) => {
  return (
    <header
      id="murali-header"
      className="sticky top-0 z-40 w-full border-b border-stone-800/80 bg-stone-950/85 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div
            id="brand-logo-badge"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 text-stone-950 shadow-lg shadow-amber-500/20"
          >
            <Sparkles className="h-5 w-5 fill-stone-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-wider text-stone-100 sm:text-2xl font-serif">
                MURALI
              </span>
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-amber-300 uppercase">
                AI Virtual Try-On
              </span>
            </div>
            <p className="hidden text-xs text-stone-400 sm:block">
              Photorealistic Dressing Room & AI Wardrobe Stylist
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav id="header-nav-tabs" className="flex items-center gap-1.5 rounded-xl border border-stone-800 bg-stone-900/90 p-1">
          <button
            id="nav-tab-studio"
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all sm:text-sm ${
              activeTab === 'studio'
                ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                : 'text-stone-300 hover:bg-stone-800/60 hover:text-stone-100'
            }`}
          >
            <Wand2 className="h-4 w-4" />
            <span>Try-On Studio</span>
          </button>

          <button
            id="nav-tab-wardrobe"
            onClick={() => setActiveTab('wardrobe')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all sm:text-sm ${
              activeTab === 'wardrobe'
                ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                : 'text-stone-300 hover:bg-stone-800/60 hover:text-stone-100'
            }`}
          >
            <Shirt className="h-4 w-4" />
            <span>Wardrobe Closet</span>
          </button>

          <button
            id="nav-tab-lookbook"
            onClick={() => setActiveTab('lookbook')}
            className={`relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all sm:text-sm ${
              activeTab === 'lookbook'
                ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                : 'text-stone-300 hover:bg-stone-800/60 hover:text-stone-100'
            }`}
          >
            <BookmarkCheck className="h-4 w-4" />
            <span>Lookbook</span>
            {lookbookCount > 0 && (
              <span
                id="lookbook-count-badge"
                className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                  activeTab === 'lookbook'
                    ? 'bg-stone-950 text-amber-400'
                    : 'bg-amber-500 text-stone-950'
                }`}
              >
                {lookbookCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
