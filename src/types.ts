export type FitStyle = 'Regular Fit' | 'Slim / Tailored Fit' | 'Relaxed / Oversized' | 'Tucked In' | 'Untucked / Flowing';

export type SceneType =
  | 'Studio Clean'
  | 'Luxury Fashion Runway'
  | 'Urban Street Style'
  | 'Modern Minimalist Loft'
  | 'Golden Hour Outdoor'
  | 'Cozy Boutique Cafe'
  | 'Original';

export interface SamplePerson {
  id: string;
  name: string;
  gender: 'female' | 'male' | 'unisex';
  bodyType: string;
  imageUrl: string;
  description: string;
}

export interface SampleOutfit {
  id: string;
  title: string;
  category: 'Dresses' | 'Suits & Formal' | 'Streetwear' | 'Ethnic & Festive' | 'Outerwear' | 'Casual';
  brand?: string;
  price?: string;
  color: string;
  imageUrl: string;
  description: string;
  tags: string[];
}

export interface StylingRecommendations {
  footwear: string;
  accessories: string;
  layering: string;
  groomingTips: string;
}

export interface FashionAnalysis {
  overallVerdict: 'Instant Buy' | 'Great Match' | 'Worth Considering' | 'Styling Required' | 'Alternative Recommended';
  matchScore: number;
  colorHarmonyScore: number;
  silhouetteScore: number;
  versatilityScore: number;
  summary: string;
  suitableOccasions: string[];
  keyStrengths: string[];
  stylingRecommendations: StylingRecommendations;
  tailoringAdvice: string;
  colorPalette: string[];
}

export interface TryOnResult {
  id: string;
  timestamp: number;
  personImage: string;
  outfitImage: string;
  resultImage: string;
  outfitTitle: string;
  outfitPrice?: string;
  fitStyle: FitStyle;
  scene: SceneType;
  promptNote?: string;
  analysis?: FashionAnalysis;
  userRating?: number; // 1-5 stars
  favorite?: boolean;
}
