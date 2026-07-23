import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart, ShoppingCart, Truck, ShieldCheck, RefreshCw, Minus, Plus,
  ChevronRight, Star, CheckCircle,
} from 'lucide-react';
import { getProductBySlug, products } from '../data/products';
import { reviews } from '../data/reviews';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/helpers';
import Rating from '../components/Rating';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { slug } = useParams();
  const product = getProductBySlug(slug || '');
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 dark:text-gray-400">Product not found.</p>
        <Link to="/products" className="btn-primary mt-4 inline-block">Back to Products</Link>
      </div>
    );
  }

  const productReviews = reviews.filter((r) => r.productId === product.id);
  const related = products.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4);
  const wished = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast(`${product.name} added to cart`, 'success');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    window.location.href = '/cart';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link to="/" className="hover:text-primary-700">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/products" className="hover:text-primary-700">Products</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`/products?category=${product.categorySlug}`} className="hover:text-primary-700">{product.category}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-800 dark:text-gray-100 truncate">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="card overflow-hidden aspect-square">
            <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-primary-600' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide">{product.brand}</p>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mt-1">{product.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <Rating rating={product.rating} showNumber reviewCount={product.reviewCount} />
              {product.isBestSeller && <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Best Seller</span>}
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary-700 dark:text-primary-400">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                <span className="badge bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">{product.discount}% OFF</span>
              </>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-300">{product.description}</p>

          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className={`w-4 h-4 ${product.stock > 0 ? 'text-primary-600' : 'text-red-500'}`} />
            <span className={product.stock > 0 ? 'text-primary-700 dark:text-primary-400 font-medium' : 'text-red-500 font-medium'}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-700 dark:text-gray-200">Quantity:</span>
            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 font-semibold w-12 text-center">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button onClick={handleBuyNow} disabled={product.stock === 0} className="btn-secondary flex items-center gap-2 disabled:opacity-50">
              Buy Now
            </button>
            <button
              onClick={() => { toggleWishlist(product); showToast(wished ? 'Removed from wishlist' : 'Added to wishlist', wished ? 'info' : 'success'); }}
              className={`p-3 rounded-xl border-2 transition-all ${wished ? 'border-red-500 text-red-500' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-red-300'}`}
            >
              <Heart className={`w-5 h-5 ${wished ? 'fill-red-500' : ''}`} />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            {[
              { icon: Truck, title: 'Free Delivery', desc: 'On orders > ₹50,000' },
              { icon: ShieldCheck, title: 'Warranty', desc: 'Manufacturer warranty' },
              { icon: RefreshCw, title: '7-Day Returns', desc: 'Easy return policy' },
              { icon: CheckCircle, title: 'Verified', desc: 'Quality assured' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <f.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <div>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">{f.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto scrollbar-hide">
          {(['description', 'specifications', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium text-sm capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab ? 'border-primary-600 text-primary-700 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab === 'reviews' ? `Reviews (${productReviews.length})` : tab}
            </button>
          ))}
        </div>

        <div className="card p-6">
          {activeTab === 'description' && (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-primary-600 mt-0.5 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {product.specifications.map((spec, i) => (
                    <tr key={i} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <td className="py-3 pr-4 font-medium text-gray-700 dark:text-gray-200 w-1/3">{spec.label}</td>
                      <td className="py-3 text-gray-600 dark:text-gray-300">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {productReviews.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No reviews yet. Be the first to review!</p>
              ) : (
                <>
                  <div className="flex items-center gap-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-primary-700 dark:text-primary-400">{product.rating}</p>
                      <Rating rating={product.rating} />
                      <p className="text-xs text-gray-500 mt-1">{product.reviewCount} reviews</p>
                    </div>
                  </div>
                  {productReviews.map((rev) => (
                    <div key={rev.id} className="space-y-2 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={rev.userAvatar} alt={rev.userName} className="w-10 h-10 rounded-full" />
                          <div>
                            <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{rev.userName}</p>
                            {rev.verified && <p className="text-xs text-primary-600 dark:text-primary-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verified Purchase</p>}
                          </div>
                        </div>
                        <Rating rating={rev.rating} size="sm" />
                      </div>
                      <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{rev.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{rev.comment}</p>
                      <p className="text-xs text-gray-400">{rev.date}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="section-title mb-6">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
