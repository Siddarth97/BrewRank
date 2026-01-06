
export interface CoffeeShop {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  tasteScore: number;
  varietyScore: number;
  ambienceScore: number;
  summary: string;
  mapsUrl: string;
  imageUrl?: string;
}

export interface AnalysisResult {
  shops: CoffeeShop[];
  groundingUrls: Array<{ uri: string; title: string }>;
}

export interface ComparisonData {
  category: string;
  [key: string]: string | number;
}
