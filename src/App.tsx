/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  AlertCircle,
  Wand2,
  Layers,
  Camera,
  Shirt,
  Info,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { Header } from './components/Header';
import { DropZone } from './components/DropZone';
import { CustomizerPanel } from './components/CustomizerPanel';
import { InteractiveComparisonSlider } from './components/InteractiveComparisonSlider';
import { StylistAnalysisCard } from './components/StylistAnalysisCard';
import { WardrobeCatalog } from './components/WardrobeCatalog';
import { LookbookDrawer } from './components/LookbookDrawer';
import { CameraCaptureModal } from './components/CameraCaptureModal';
import { SamplePickerModal } from './components/SamplePickerModal';
import { OutfitCollageModal } from './components/OutfitCollageModal';
import { SAMPLE_PEOPLE, SAMPLE_OUTFITS } from './data/samples';
import {
  FitStyle,
  SceneType,
  TryOnResult,
  SamplePerson,
  SampleOutfit,
  FashionAnalysis,
} from './types';
import { urlToDataUri, optimizeImageDataUri } from './lib/imageUtils';

export default function App() {
  // Main Navigation state
  const [activeTab, setActiveTab] = useState<'studio' | 'wardrobe' | 'lookbook'>('studio');

  // Input states
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [personLabel, setPersonLabel] = useState<string>('Aria (Studio Portrait)');
  const [outfitImage, setOutfitImage] = useState<string | null>(null);
  const [outfitTitle, setOutfitTitle] = useState<string>('Emerald Velvet Tuxedo Suit');
  const [outfitPrice, setOutfitPrice] = useState<string>('$480');

  // Customizer states
  const [fitStyle, setFitStyle] = useState<FitStyle>('Regular Fit');
  const [scene, setScene] = useState<SceneType>('Studio Clean');
  const [promptNote, setPromptNote] = useState<string>('');

  // Execution states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<TryOnResult | null>(null);

  // Lookbook Persistence
  const [lookbook, setLookbook] = useState<TryOnResult[]>(() => {
    try {
      const saved = localStorage.getItem('murali_lookbook');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal states
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [sampleModalType, setSampleModalType] = useState<'person' | 'outfit' | null>(null);
  const [isCollageOpen, setIsCollageOpen] = useState(false);

  // Initialize with curated defaults so the user has immediate visual richness
  useEffect(() => {
    async function loadDefaults() {
      try {
        if (!personImage && SAMPLE_PEOPLE[0]) {
          const personUri = await urlToDataUri(SAMPLE_PEOPLE[0].imageUrl);
          setPersonImage(personUri);
          setPersonLabel(SAMPLE_PEOPLE[0].name);
        }
        if (!outfitImage && SAMPLE_OUTFITS[0]) {
          const outfitUri = await urlToDataUri(SAMPLE_OUTFITS[0].imageUrl);
          setOutfitImage(outfitUri);
          setOutfitTitle(SAMPLE_OUTFITS[0].title);
          setOutfitPrice(SAMPLE_OUTFITS[0].price || '$480');
        }
      } catch (err) {
        console.warn('Initial default sample image conversion failed, falling back to direct URL', err);
        if (!personImage) setPersonImage(SAMPLE_PEOPLE[0].imageUrl);
        if (!outfitImage) setOutfitImage(SAMPLE_OUTFITS[0].imageUrl);
      }
    }
    loadDefaults();
  }, []);

  // Save lookbook to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('murali_lookbook', JSON.stringify(lookbook));
    } catch (e) {
      console.error('Failed to persist lookbook', e);
    }
  }, [lookbook]);

  // Handler for Virtual Try-On generation
  const handleGenerateTryOn = async () => {
    if (!personImage || !outfitImage) {
      setErrorMessage('Please upload or select both your photo and an outfit.');
      return;
    }

    try {
      setIsGenerating(true);
      setIsAnalyzing(true);
      setErrorMessage(null);

      // Trigger Try-On Image Generation
      const tryOnRes = await fetch('/api/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personImage,
          outfitImage,
          fitStyle,
          scene,
          promptNote,
          category: outfitTitle,
        }),
      });

      const tryOnData = await tryOnRes.json();

      if (!tryOnRes.ok || !tryOnData.success) {
        throw new Error(
          tryOnData.error || 'Failed to generate try-on result. Please check input images.'
        );
      }

      // Trigger Stylist Analysis in parallel or sequential
      let analysisData: FashionAnalysis | undefined = undefined;
      try {
        const analysisRes = await fetch('/api/analyze-outfit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            personImage,
            outfitImage,
            fitStyle,
            outfitTitle,
          }),
        });
        const parsedAnalysis = await analysisRes.json();
        if (parsedAnalysis.success) {
          analysisData = parsedAnalysis.analysis;
        }
      } catch (analErr) {
        console.warn('Stylist analysis non-blocking error:', analErr);
      }

      const newResult: TryOnResult = {
        id: `tryon-${Date.now()}`,
        timestamp: Date.now(),
        personImage,
        outfitImage,
        resultImage: tryOnData.imageUrl,
        outfitTitle,
        outfitPrice,
        fitStyle,
        scene,
        promptNote,
        analysis: analysisData,
        userRating: 5,
      };

      setCurrentResult(newResult);

      // Trigger celebratory confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#ffffff', '#10b981'],
      });
    } catch (err: any) {
      console.error('Virtual try on generation failure:', err);
      setErrorMessage(
        err.message || 'An error occurred while generating your virtual try-on. Please try again.'
      );
    } finally {
      setIsGenerating(false);
      setIsAnalyzing(false);
    }
  };

  // Toggle Save / Unsave from lookbook
  const handleToggleSaveLookbook = () => {
    if (!currentResult) return;
    const exists = lookbook.some((item) => item.id === currentResult.id);
    if (exists) {
      setLookbook(lookbook.filter((item) => item.id !== currentResult.id));
    } else {
      setLookbook([currentResult, ...lookbook]);
    }
  };

  const isSavedToLookbook = Boolean(
    currentResult && lookbook.some((item) => item.id === currentResult.id)
  );

  // Select Sample Person
  const handleSelectSamplePerson = async (person: SamplePerson) => {
    setPersonLabel(person.name);
    try {
      const dataUri = await urlToDataUri(person.imageUrl);
      setPersonImage(dataUri);
    } catch {
      setPersonImage(person.imageUrl);
    }
  };

  // Select Sample Outfit
  const handleSelectSampleOutfit = async (outfit: SampleOutfit) => {
    setOutfitTitle(outfit.title);
    setOutfitPrice(outfit.price || '');
    try {
      const dataUri = await urlToDataUri(outfit.imageUrl);
      setOutfitImage(dataUri);
    } catch {
      setOutfitImage(outfit.imageUrl);
    }
  };

  // Quick try from Wardrobe Catalog
  const handleWardrobeTryOutfit = async (outfit: SampleOutfit) => {
    await handleSelectSampleOutfit(outfit);
    setActiveTab('studio');
  };

  // View specific lookbook item in Studio
  const handleViewLookbookItem = (item: TryOnResult) => {
    setPersonImage(item.personImage);
    setOutfitImage(item.outfitImage);
    setOutfitTitle(item.outfitTitle);
    setOutfitPrice(item.outfitPrice || '');
    setFitStyle(item.fitStyle);
    setScene(item.scene);
    setCurrentResult(item);
    setActiveTab('studio');
  };

  return (
    <div id="murali-app" className="min-h-screen bg-stone-950 text-stone-100 selection:bg-amber-500 selection:text-stone-950 font-sans">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lookbookCount={lookbook.length}
        onOpenQuickCamera={() => setIsCameraOpen(true)}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Error Alert if any */}
        {errorMessage && (
          <div
            id="error-alert-banner"
            className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 text-rose-200 backdrop-blur-sm"
          >
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <strong className="font-semibold">Try-On Notice: </strong>
              {errorMessage}
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-semibold text-rose-400 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* TAB 1: VIRTUAL TRY-ON STUDIO */}
        {activeTab === 'studio' && (
          <div className="space-y-8">
            {/* Top Workspace Grid: Upload Zones (Person & Garment) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* DropZone 1: User's Photo / Portrait */}
              <DropZone
                id="person-dropzone"
                type="person"
                title="1. Your Photo (Person)"
                subtitle="Upload a clear front-facing portrait or full-body photo"
                image={personImage}
                imageLabel={personLabel}
                onImageSelected={(img, label) => {
                  setPersonImage(img);
                  if (label) setPersonLabel(label);
                }}
                onClearImage={() => {
                  setPersonImage(null);
                  setPersonLabel('');
                }}
                onOpenSampleModal={() => setSampleModalType('person')}
                onOpenCameraModal={() => setIsCameraOpen(true)}
              />

              {/* DropZone 2: Outfit Garment */}
              <DropZone
                id="outfit-dropzone"
                type="outfit"
                title="2. Outfit Garment"
                subtitle="Drop any garment image, dress, jacket, suit, or top"
                image={outfitImage}
                imageLabel={outfitTitle}
                onImageSelected={(img, label) => {
                  setOutfitImage(img);
                  if (label) setOutfitTitle(label);
                }}
                onClearImage={() => {
                  setOutfitImage(null);
                  setOutfitTitle('');
                }}
                onOpenSampleModal={() => setSampleModalType('outfit')}
              />
            </div>

            {/* Customizer Panel & Trigger */}
            <CustomizerPanel
              fitStyle={fitStyle}
              setFitStyle={setFitStyle}
              scene={scene}
              setScene={setScene}
              promptNote={promptNote}
              setPromptNote={setPromptNote}
              onGenerate={handleGenerateTryOn}
              isGenerating={isGenerating}
              canGenerate={Boolean(personImage && outfitImage)}
              hasResult={Boolean(currentResult)}
            />

            {/* Virtual Try-On Result Section */}
            {currentResult && (
              <div className="space-y-6 pt-4">
                {/* Interactive Split Comparison Slider / 3-Card Grid */}
                <InteractiveComparisonSlider
                  personImage={currentResult.personImage}
                  outfitImage={currentResult.outfitImage}
                  resultImage={currentResult.resultImage}
                  outfitTitle={currentResult.outfitTitle}
                  isSavedToLookbook={isSavedToLookbook}
                  onToggleSaveLookbook={handleToggleSaveLookbook}
                  onOpenCollageModal={() => setIsCollageOpen(true)}
                  onRegenerate={handleGenerateTryOn}
                />

                {/* AI Stylist Analysis Card */}
                <StylistAnalysisCard
                  analysis={currentResult.analysis || null}
                  isLoading={isAnalyzing}
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WARDROBE CATALOG & CLOSET */}
        {activeTab === 'wardrobe' && (
          <WardrobeCatalog
            onSelectOutfitToTry={handleWardrobeTryOutfit}
            onUploadCustomOutfit={() => {
              setActiveTab('studio');
              setOutfitImage(null);
              setOutfitTitle('');
            }}
          />
        )}

        {/* TAB 3: MY VIRTUAL LOOKBOOK */}
        {activeTab === 'lookbook' && (
          <LookbookDrawer
            lookbook={lookbook}
            onRemoveFromLookbook={(id) =>
              setLookbook(lookbook.filter((item) => item.id !== id))
            }
            onSelectToView={handleViewLookbookItem}
            onRateItem={(id, rating) => {
              setLookbook(
                lookbook.map((item) =>
                  item.id === id ? { ...item, userRating: rating } : item
                )
              );
            }}
            onGoToStudio={() => setActiveTab('studio')}
          />
        )}
      </main>

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(dataUri) => {
          setPersonImage(dataUri);
          setPersonLabel('Live Camera Selfie');
        }}
      />

      {/* Sample Picker Modal */}
      <SamplePickerModal
        isOpen={sampleModalType !== null}
        type={sampleModalType || 'person'}
        onClose={() => setSampleModalType(null)}
        onSelectPerson={handleSelectSamplePerson}
        onSelectOutfit={handleSelectSampleOutfit}
      />

      {/* Moodboard / Collage Modal */}
      <OutfitCollageModal
        isOpen={isCollageOpen}
        onClose={() => setIsCollageOpen(false)}
        result={currentResult}
      />
    </div>
  );
}
