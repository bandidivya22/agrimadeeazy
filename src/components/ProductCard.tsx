import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../data/products';
import { formatPrice } from '../utils/helpers';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import Rating from './Rating';

export default function ProductCard({ product }: { product: Product }) {
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

  return (
    <Link to={`/product/${product.slug}`} className="product-card group block animate-fade-in">
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.discount > 0 && <span className="badge bg-red-500 text-white">-{product.discount}%</span>}
          {product.isNew && <span className="badge bg-primary-600 text-white">New</span>}
          {product.isBestSeller && <span className="badge bg-amber-500 text-white">Best Seller</span>}
        </div>
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
            wished ? 'bg-red-500 text-white' : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-white'
          } backdrop-blur-sm`}
        >
          <Heart className={`w-4 h-4 ${wished ? 'fill-white' : ''}`} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            className="w-full btn-primary py-2 text-sm flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" /> Add to Cart
          </button>
        </div>
      </div>
      <div className="p-4 space-y-2">
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
      </div>
    </Link>
  );
}
