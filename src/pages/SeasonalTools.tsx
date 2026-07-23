import { useState, useEffect } from 'react';
import {
  Sun, CloudRain, Sprout, Calendar, Info, Leaf,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getSeasonalProducts, SEASONAL_DATA, Season } from '../utils/agriLogic';

const SEASONS: { value: Season; label: string; icon: typeof Sun; desc: string }[] = [
  { value: 'Kharif', label: 'Kharif', icon: CloudRain, desc: 'Monsoon crops' },
  { value: 'Rabi', label: 'Rabi', icon: Sun, desc: 'Winter crops' },
  { value: 'Zaid', label: 'Zaid', icon: Sprout, desc: 'Summer crops' },
];

export default function SeasonalTools() {
  const [season, setSeason] = useState<Season>('Kharif');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    // Track seasonal visit for analytics
    const visits = JSON.parse(localStorage.getItem('agrimadeeazy-seasonal-visits') || '{}');
    visits[season] = (visits[season] || 0) + 1;
    localStorage.setItem('agrimadeeazy-seasonal-visits', JSON.stringify(visits));
    return () => clearTimeout(timer);
  }, [season]);

  const info = SEASONAL_DATA[season];
  const seasonProducts = getSeasonalProducts(season);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <span className="badge bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 px-4 py-1.5">
          <Calendar className="w-3.5 h-3.5 mr-1" /> Seasonal Tools
        </span>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mt-3">Seasonal Tool Recommendation</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl mx-auto">
          Discover the right tools for each cropping season. Select a season to see recommended tools, crops, and activities.
        </p>
      </div>

      {/* Season selector */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto mb-8">
        {SEASONS.map((s) => {
          const active = season === s.value;
          return (
            <button
              key={s.value}
              onClick={() => setSeason(s.value)}
              className={`card p-4 sm:p-6 text-center transition-all ${active ? 'border-2 border-primary-600 bg-primary-50 dark:bg-primary-900/20 shadow-card-hover' : 'hover:border-primary-200 dark:hover:border-primary-700'}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 ${active ? 'bg-primary-600 text-white' : 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'}`}>
                <s.icon className="w-6 h-6" />
              </div>
              <p className={`font-bold text-sm ${active ? 'text-primary-700 dark:text-primary-300' : 'text-gray-800 dark:text-gray-100'}`}>{s.label}</p>
              <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">{s.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Season info */}
      <div className="card p-6 mb-8 max-w-4xl mx-auto bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/20 dark:to-gray-800">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Sprout className="w-4 h-4" /> Suitable Crops
            </h3>
            <div className="flex flex-wrap gap-2">
              {info.crops.map((c) => (
                <span key={c} className="badge bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1">{c}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Leaf className="w-4 h-4" /> Farming Activities
            </h3>
            <div className="flex flex-wrap gap-2">
              {info.activities.map((a) => (
                <span key={a} className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 px-3 py-1">{a}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Best Time to Use
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">{info.bestTime}</p>
          </div>
        </div>
        <div className="mt-5 pt-5 border-t border-primary-100 dark:border-primary-800/50">
          <p className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
            <Info className="w-4 h-4 text-primary-600 mt-0.5 shrink-0" />
            {info.explanation}
          </p>
        </div>
      </div>

      {/* Products */}
      <h2 className="font-display text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">
        Recommended Tools for {season} Season
      </h2>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="aspect-square shimmer-bg" />
              <div className="p-4 space-y-2">
                <div className="h-3 w-1/3 shimmer-bg rounded" />
                <div className="h-4 w-full shimmer-bg rounded" />
                <div className="h-5 w-1/2 shimmer-bg rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : seasonProducts.length === 0 ? (
        <div className="card p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
            <Sprout className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">No products found for this season. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {seasonProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
