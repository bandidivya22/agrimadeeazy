import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/helpers';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { items, clearWishlist } = useWishlist();
  const { showToast } = useToast();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-24 h-24 mx-auto rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-6">
          <Heart className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="font-display text-2xl font-bold text-gray-800 dark:text-white mb-2">Your Wishlist is Empty</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Save items you love for later.</p>
        <Link to="/products" className="btn-primary inline-block">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">My Wishlist ({items.length})</h1>
        <button onClick={() => { clearWishlist(); showToast('Wishlist cleared', 'info'); }} className="text-sm text-red-500 hover:text-red-600 font-medium">Clear All</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
