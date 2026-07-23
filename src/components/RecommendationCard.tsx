import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, CheckCircle, Sparkles } from 'lucide-react';
import { Product } from '../data/products';
import { formatPrice } from '../utils/helpers';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import Rating from './Rating';

interface Props {
  product: Product;
  reason: string;
  matchScore: number;
}

export default function RecommendationCard({ product, reason, matchScore }: Props) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const wished = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    showToast(`${product.name} added to cart`, 'success');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    showToast(wished ? 'Removed from wishlist' : 'Added to wishlist', wished ? 'info' : 'success');
  };

  const maxScore = 100;
  const matchPct = Math.min(100, Math.round((matchScore / maxScore) * 100));

  return (
    <div className="card overflow-hidden group animate-fade-in flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.discount > 0 && <span className="badge bg-red-500 text-white">-{product.discount}%</span>}
          {product.isBestSeller && <span className="badge bg-amber-500 text-white">Best Seller</span>}
        </div>
        <div className="absolute top-3 right-3 badge bg-primary-600 text-white gap-1">
          <Sparkles className="w-3 h-3" /> {matchPct}% match
        </div>
      </div>
      <div className="p-4 space-y-2 flex-1 flex flex-col">
        <p className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide">{product.brand}</p>
        <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100 line-clamp-2 leading-snug min-h-[2.5rem]">
          {product.name}
        </h3>
        <Rating rating={product.rating} size="sm" showNumber reviewCount={product.reviewCount} />
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary-700 dark:text-primary-400">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-2.5 mt-1">
          <p className="text-xs text-primary-800 dark:text-primary-300 flex items-start gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>{reason}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 mt-auto pt-2">
          <button onClick={handleAddToCart} className="flex-1 btn-primary py-2 text-sm flex items-center justify-center gap-1.5">
            <ShoppingCart className="w-4 h-4" /> Cart
          </button>
          <button onClick={handleWishlist} className={`p-2 rounded-lg border transition-all ${wished ? 'bg-red-50 border-red-300 text-red-500' : 'border-gray-200 dark:border-gray-600 text-gray-500 hover:border-primary-300'}`}>
            <Heart className={`w-4 h-4 ${wished ? 'fill-red-500' : ''}`} />
          </button>
          <Link to={`/product/${product.slug}`} className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 hover:border-primary-300 hover:text-primary-600 transition-all">
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
