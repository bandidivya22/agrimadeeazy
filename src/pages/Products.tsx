import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Grid, List } from 'lucide-react';
import { products } from '../data/products';
import { categories } from '../data/categories';
import ProductCard from '../components/ProductCard';
import { SkeletonGrid } from '../components/Skeleton';
import Rating from '../components/Rating';
import { formatPrice } from '../utils/helpers';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');

  const selectedCategory = searchParams.get('category') || '';
  const query = searchParams.get('q') || '';
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3500000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);

  const brands = useMemo(() => [...new Set(products.map((p) => p.brand))].sort(), []);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [selectedCategory, query, sortBy]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategory) result = result.filter((p) => p.categorySlug === selectedCategory);
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (selectedBrands.length > 0) result = result.filter((p) => selectedBrands.includes(p.brand));
    if (minRating > 0) result = result.filter((p) => p.rating >= minRating);

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'newest': result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      default: result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
    return result;
  }, [selectedCategory, query, priceRange, selectedBrands, minRating, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]));
  };

  const setCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug) params.set('category', slug);
    else params.delete('category');
    setSearchParams(params);
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-sm mb-3 text-gray-800 dark:text-gray-100">Categories</h3>
        <div className="space-y-2">
          <button onClick={() => setCategory('')} className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${!selectedCategory ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.slug)}
              className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedCategory === cat.slug ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-3 text-gray-800 dark:text-gray-100">Price Range</h3>
        <div className="space-y-2">
          <input type="range" min="0" max="3500000" step="50000" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], +e.target.value])} className="w-full" />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-3 text-gray-800 dark:text-gray-100">Brands</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="rounded accent-primary-600"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-3 text-gray-800 dark:text-gray-100">Minimum Rating</h3>
        <div className="space-y-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors w-full ${minRating === r ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              {r === 0 ? 'All Ratings' : <><Rating rating={r} size="sm" /> & up</>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          {selectedCategory ? categories.find((c) => c.slug === selectedCategory)?.name || 'Products' : query ? `Search: "${query}"` : 'All Products'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{filtered.length} products found</p>
      </div>

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="card p-5 sticky top-32">
            <FilterPanel />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 gap-4">
            <button onClick={() => setShowFilters(true)} className="md:hidden flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => setView('grid')} className={`p-2 rounded-lg ${view === 'grid' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                <Grid className="w-4 h-4" />
              </button>
              <button onClick={() => setView('list')} className={`p-2 rounded-lg ${view === 'list' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field py-2 text-sm w-auto"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {loading ? (
            <SkeletonGrid count={8} />
          ) : filtered.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">No products found matching your filters.</p>
              <button
                onClick={() => { setPriceRange([0, 3500000]); setSelectedBrands([]); setMinRating(0); setCategory(''); }}
                className="btn-outline mt-4"
              >
                Clear Filters
              </button>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((p) => (
                <div key={p.id} className="card p-4 flex gap-4">
                  <img src={p.image} alt={p.name} className="w-28 h-28 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase">{p.brand}</p>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">{p.name}</h3>
                    <Rating rating={p.rating} size="sm" showNumber />
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{p.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold text-primary-700 dark:text-primary-400">{formatPrice(p.price)}</span>
                      <a href={`/product/${p.slug}`} className="btn-primary py-1.5 px-4 text-sm">View</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 overflow-y-auto p-5 animate-slide-down">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Filters</h2>
              <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
            </div>
            <FilterPanel />
            <button onClick={() => setShowFilters(false)} className="btn-primary w-full mt-6">Apply Filters</button>
          </div>
        </div>
      )}
    </div>
  );
}
