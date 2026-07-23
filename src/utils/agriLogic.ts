import { products, Product } from '../data/products';

export type FarmSize = 'less-2' | '2-5' | '5-10' | 'above-10';
export type CropType = 'Rice' | 'Wheat' | 'Cotton' | 'Maize' | 'Sugarcane' | 'Vegetables' | 'Fruits' | 'Groundnut' | 'Other';
export type BudgetRange = 'under-10k' | '10k-50k' | '50k-2l' | 'above-2l';
export type FarmActivity = 'Land Preparation' | 'Sowing' | 'Irrigation' | 'Spraying' | 'Harvesting' | 'Garden Maintenance' | 'Weed Control';
export type PowerSource = 'Manual' | 'Battery' | 'Electric' | 'Petrol' | 'Diesel';
export type Season = 'Kharif' | 'Rabi' | 'Zaid';

export interface WizardAnswers {
  farmSize: FarmSize | null;
  cropType: CropType | null;
  budget: BudgetRange | null;
  activity: FarmActivity | null;
  powerSource: PowerSource | null;
}

export interface RecommendedProduct {
  product: Product;
  reason: string;
  matchScore: number;
}

const BUDGET_RANGES: Record<BudgetRange, { min: number; max: number; label: string }> = {
  'under-10k': { min: 0, max: 10000, label: 'Under \u20B910,000' },
  '10k-50k': { min: 10000, max: 50000, label: '\u20B910,000\u2013\u20B950,000' },
  '50k-2l': { min: 50000, max: 200000, label: '\u20B950,000\u2013\u20B92,00,000' },
  'above-2l': { min: 200000, max: Infinity, label: 'Above \u20B92,00,000' },
};

const FARM_SIZE_LABELS: Record<FarmSize, string> = {
  'less-2': 'Less than 2 Acres',
  '2-5': '2\u20135 Acres',
  '5-10': '5\u201310 Acres',
  'above-10': 'Above 10 Acres',
};

const ACTIVITY_TAGS: Record<FarmActivity, string[]> = {
  'Land Preparation': ['tractor', 'tiller', 'rotavator', 'soil-prep', 'harrow', 'cultivator'],
  'Sowing': ['seed-drill', 'planting', 'auger'],
  'Irrigation': ['water-pump', 'diesel'],
  'Spraying': ['power-sprayer', 'battery', 'knapsack', 'manual', 'pest-control', 'automatic'],
  'Harvesting': ['rice-mill', 'maize-sheller', 'processing', 'chaff-cutter', 'fodder'],
  'Garden Maintenance': ['brush-cutter', 'hedge-trimmer', 'lawn-mower', 'chainsaw', 'electric', 'pruning'],
  'Weed Control': ['weeder', 'cultivator', 'weeding', 'brush-cutter'],
};

const POWER_TAGS: Record<PowerSource, string[]> = {
  Manual: ['manual', 'knapsack'],
  Battery: ['battery', 'automatic'],
  Electric: ['electric'],
  Petrol: ['4-stroke', 'power-sprayer', 'auger'],
  Diesel: ['diesel', 'tiller'],
};

const CROP_ACTIVITY_BONUS: Partial<Record<CropType, FarmActivity[]>> = {
  Rice: ['Land Preparation', 'Harvesting', 'Irrigation'],
  Wheat: ['Land Preparation', 'Sowing', 'Harvesting'],
  Cotton: ['Spraying', 'Weed Control', 'Land Preparation'],
  Maize: ['Sowing', 'Harvesting', 'Land Preparation'],
  Sugarcane: ['Land Preparation', 'Irrigation', 'Harvesting'],
  Vegetables: ['Spraying', 'Garden Maintenance', 'Irrigation'],
  Fruits: ['Spraying', 'Garden Maintenance', 'Pruning'],
  Groundnut: ['Land Preparation', 'Harvesting', 'Weed Control'],
};

export const FARM_SIZE_OPTIONS: { value: FarmSize; label: string }[] = [
  { value: 'less-2', label: 'Less than 2 Acres' },
  { value: '2-5', label: '2\u20135 Acres' },
  { value: '5-10', label: '5\u201310 Acres' },
  { value: 'above-10', label: 'Above 10 Acres' },
];

export const CROP_TYPE_OPTIONS: { value: CropType; label: string }[] = [
  { value: 'Rice', label: 'Rice' },
  { value: 'Wheat', label: 'Wheat' },
  { value: 'Cotton', label: 'Cotton' },
  { value: 'Maize', label: 'Maize' },
  { value: 'Sugarcane', label: 'Sugarcane' },
  { value: 'Vegetables', label: 'Vegetables' },
  { value: 'Fruits', label: 'Fruits' },
  { value: 'Groundnut', label: 'Groundnut' },
  { value: 'Other', label: 'Other' },
];

export const BUDGET_OPTIONS: { value: BudgetRange; label: string }[] = [
  { value: 'under-10k', label: 'Under \u20B910,000' },
  { value: '10k-50k', label: '\u20B910,000\u2013\u20B950,000' },
  { value: '50k-2l', label: '\u20B950,000\u2013\u20B92,00,000' },
  { value: 'above-2l', label: 'Above \u20B92,00,000' },
];

export const ACTIVITY_OPTIONS: { value: FarmActivity; label: string }[] = [
  { value: 'Land Preparation', label: 'Land Preparation' },
  { value: 'Sowing', label: 'Sowing' },
  { value: 'Irrigation', label: 'Irrigation' },
  { value: 'Spraying', label: 'Spraying' },
  { value: 'Harvesting', label: 'Harvesting' },
  { value: 'Garden Maintenance', label: 'Garden Maintenance' },
  { value: 'Weed Control', label: 'Weed Control' },
];

export const POWER_SOURCE_OPTIONS: { value: PowerSource; label: string }[] = [
  { value: 'Manual', label: 'Manual' },
  { value: 'Battery', label: 'Battery' },
  { value: 'Electric', label: 'Electric' },
  { value: 'Petrol', label: 'Petrol' },
  { value: 'Diesel', label: 'Diesel' },
];

export function recommendProducts(answers: WizardAnswers): RecommendedProduct[] {
  const scored = products.map((product) => {
    let score = 0;
    const reasons: string[] = [];

    // Activity match (highest weight)
    if (answers.activity) {
      const activityTags = ACTIVITY_TAGS[answers.activity] || [];
      const matched = product.tags.filter((t) => activityTags.includes(t));
      if (matched.length > 0) {
        score += 40 + matched.length * 10;
        reasons.push(`Ideal for ${answers.activity.toLowerCase()}`);
      }
    }

    // Power source match
    if (answers.powerSource) {
      const powerTags = POWER_TAGS[answers.powerSource] || [];
      const matched = product.tags.filter((t) => powerTags.includes(t));
      if (matched.length > 0) {
        score += 25;
        reasons.push(`${answers.powerSource}-powered as requested`);
      }
    }

    // Budget match
    if (answers.budget) {
      const range = BUDGET_RANGES[answers.budget];
      if (product.price >= range.min && product.price <= range.max) {
        score += 30;
        reasons.push(`Fits your ${range.label} budget`);
      } else if (product.price < range.min) {
        score += 10;
        reasons.push('Under your budget \u2014 great value');
      }
    }

    // Crop-activity bonus
    if (answers.cropType && answers.activity) {
      const bonusActivities = CROP_ACTIVITY_BONUS[answers.cropType];
      if (bonusActivities?.includes(answers.activity)) {
        score += 15;
        reasons.push(`Well-suited for ${answers.cropType} farming`);
      }
    }

    // Farm size fit
    if (answers.farmSize) {
      const isLargeFarm = answers.farmSize === '5-10' || answers.farmSize === 'above-10';
      const isSmallFarm = answers.farmSize === 'less-2';
      if (isLargeFarm && (product.categorySlug === 'farm-machinery' || product.tags.includes('heavy-duty'))) {
        score += 15;
        reasons.push('Handles large farm areas efficiently');
      }
      if (isSmallFarm && (product.categorySlug === 'hand-tools' || product.price < 10000)) {
        score += 15;
        reasons.push('Compact size perfect for small farms');
      }
    }

    // Rating bonus
    if (product.rating >= 4.5) {
      score += 10;
      reasons.push('Highly rated by farmers');
    }
    if (product.isBestSeller) {
      score += 5;
    }

    return { product, reason: reasons.join(' \u2022 '), matchScore: score };
  });

  return scored
    .filter((r) => r.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 6);
}

// ── Seasonal data ────────────────────────────────────────────────────
export interface SeasonalInfo {
  crops: string[];
  activities: FarmActivity[];
  bestTime: string;
  explanation: string;
  recommendedTagKeywords: string[];
}

export const SEASONAL_DATA: Record<Season, SeasonalInfo> = {
  Kharif: {
    crops: ['Rice', 'Cotton', 'Maize', 'Sugarcane', 'Groundnut'],
    activities: ['Land Preparation', 'Sowing', 'Irrigation', 'Spraying'],
    bestTime: 'June \u2013 October (Monsoon season)',
    explanation: 'Kharif crops rely on monsoon rains. Focus on land preparation before rains, timely sowing, and pest control during humid conditions.',
    recommendedTagKeywords: ['tractor', 'tiller', 'rotavator', 'seed-drill', 'power-sprayer', 'battery', 'water-pump'],
  },
  Rabi: {
    crops: ['Wheat', 'Maize', 'Groundnut', 'Vegetables'],
    activities: ['Land Preparation', 'Sowing', 'Irrigation', 'Harvesting'],
    bestTime: 'November \u2013 March (Winter season)',
    explanation: 'Rabi crops need irrigation support as they grow in dry winter. Land preparation and sowing happen post-monsoon, harvesting before summer.',
    recommendedTagKeywords: ['seed-drill', 'rotavator', 'cultivator', 'water-pump', 'rice-mill', 'maize-sheller'],
  },
  Zaid: {
    crops: ['Vegetables', 'Fruits', 'Groundnut'],
    activities: ['Irrigation', 'Spraying', 'Garden Maintenance'],
    bestTime: 'April \u2013 June (Summer season)',
    explanation: 'Zaid is the short summer cropping season. Focus on irrigation, garden maintenance, and pest control for vegetables and fruits.',
    recommendedTagKeywords: ['water-pump', 'power-sprayer', 'battery', 'brush-cutter', 'hedge-trimmer', 'lawn-mower', 'drip'],
  },
};

export function getSeasonalProducts(season: Season): Product[] {
  const info = SEASONAL_DATA[season];
  return products.filter((p) => p.tags.some((t) => info.recommendedTagKeywords.includes(t)));
}

// ── Storage helpers (localStorage-based, matching project pattern) ──
const RECO_HISTORY_KEY = 'agrimadeeazy-reco-history';
const CALC_HISTORY_KEY = 'agrimadeeazy-calc-history';
const MAINTENANCE_KEY = 'agrimadeeazy-maintenance';

export interface RecoHistoryEntry {
  id: string;
  date: string;
  answers: WizardAnswers;
  recommendations: { productId: string; productName: string; matchScore: number }[];
}

export function saveRecoHistory(entry: RecoHistoryEntry) {
  const all = JSON.parse(localStorage.getItem(RECO_HISTORY_KEY) || '[]');
  all.unshift(entry);
  localStorage.setItem(RECO_HISTORY_KEY, JSON.stringify(all.slice(0, 50)));
}

export function getRecoHistory(): RecoHistoryEntry[] {
  return JSON.parse(localStorage.getItem(RECO_HISTORY_KEY) || '[]');
}

export interface CalcHistoryEntry {
  id: string;
  date: string;
  farmSize: number;
  workers: number;
  labourCost: number;
  workingDays: number;
  toolName: string;
  toolPrice: number;
  manualCost: number;
  toolCost: number;
  moneySaved: number;
  timeSaved: number;
  roi: number;
  breakEvenMonths: number;
}

export function saveCalcHistory(entry: CalcHistoryEntry) {
  const all = JSON.parse(localStorage.getItem(CALC_HISTORY_KEY) || '[]');
  all.unshift(entry);
  localStorage.setItem(CALC_HISTORY_KEY, JSON.stringify(all.slice(0, 50)));
}

export function getCalcHistory(): CalcHistoryEntry[] {
  return JSON.parse(localStorage.getItem(CALC_HISTORY_KEY) || '[]');
}

export interface MaintenanceRecord {
  id: string;
  toolName: string;
  purchaseDate: string;
  lastServiceDate: string;
  nextServiceDate: string;
  warrantyExpiry: string;
  notes: string;
  history: { date: string; action: string }[];
}

export function getMaintenanceRecords(): MaintenanceRecord[] {
  return JSON.parse(localStorage.getItem(MAINTENANCE_KEY) || '[]');
}

export function saveMaintenanceRecords(records: MaintenanceRecord[]) {
  localStorage.setItem(MAINTENANCE_KEY, JSON.stringify(records));
}

export function addMaintenanceRecord(record: MaintenanceRecord) {
  const all = getMaintenanceRecords();
  all.unshift(record);
  saveMaintenanceRecords(all);
}

export function updateMaintenanceRecord(id: string, updates: Partial<MaintenanceRecord>) {
  const all = getMaintenanceRecords();
  const idx = all.findIndex((r) => r.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...updates };
    saveMaintenanceRecords(all);
  }
}

export function deleteMaintenanceRecord(id: string) {
  const all = getMaintenanceRecords().filter((r) => r.id !== id);
  saveMaintenanceRecords(all);
}

// ── Analytics aggregation ────────────────────────────────────────────
export interface AgriAnalytics {
  topRecommendedProducts: { name: string; count: number }[];
  topCrops: { crop: string; count: number }[];
  farmSizeDist: { size: string; count: number }[];
  calcUsage: { label: string; count: number }[];
  seasonalPopularity: { season: string; count: number }[];
  maintenanceCount: number;
}

export function getAgriAnalytics(): AgriAnalytics {
  const recoHistory = getRecoHistory();
  const calcHistory = getCalcHistory();
  const maintenance = getMaintenanceRecords();

  // Top recommended products
  const productCounts: Record<string, number> = {};
  recoHistory.forEach((entry) => {
    entry.recommendations.forEach((r) => {
      productCounts[r.productName] = (productCounts[r.productName] || 0) + 1;
    });
  });
  const topRecommendedProducts = Object.entries(productCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Top crops
  const cropCounts: Record<string, number> = {};
  recoHistory.forEach((entry) => {
    if (entry.answers.cropType) {
      cropCounts[entry.answers.cropType] = (cropCounts[entry.answers.cropType] || 0) + 1;
    }
  });
  const topCrops = Object.entries(cropCounts)
    .map(([crop, count]) => ({ crop, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Farm size distribution
  const sizeCounts: Record<string, number> = {};
  recoHistory.forEach((entry) => {
    if (entry.answers.farmSize) {
      const label = FARM_SIZE_LABELS[entry.answers.farmSize];
      sizeCounts[label] = (sizeCounts[label] || 0) + 1;
    }
  });
  const farmSizeDist = Object.entries(sizeCounts).map(([size, count]) => ({ size, count }));

  // Calculator usage
  const calcCounts: Record<string, number> = {};
  calcHistory.forEach((entry) => {
    calcCounts[entry.toolName] = (calcCounts[entry.toolName] || 0) + 1;
  });
  const calcUsage = Object.entries(calcCounts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Seasonal popularity (from reco history answers if season recorded, else from seasonal page visits in localStorage)
  const seasonalCounts: Record<string, number> = { Kharif: 0, Rabi: 0, Zaid: 0 };
  const seasonalVisits = JSON.parse(localStorage.getItem('agrimadeeazy-seasonal-visits') || '{}');
  Object.keys(seasonalCounts).forEach((s) => {
    seasonalCounts[s] = seasonalVisits[s] || 0;
  });
  const seasonalPopularity = Object.entries(seasonalCounts).map(([season, count]) => ({ season, count }));

  return {
    topRecommendedProducts,
    topCrops,
    farmSizeDist,
    calcUsage,
    seasonalPopularity,
    maintenanceCount: maintenance.length,
  };
}

export { FARM_SIZE_LABELS, BUDGET_RANGES };
