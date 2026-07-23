import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, subtotal, shipping, tax, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-24 h-24 mx-auto rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 className="font-display text-2xl font-bold text-gray-800 dark:text-white mb-2">Your Cart is Empty</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn-primary inline-flex items-center gap-2">
          Start Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="card p-4 flex gap-4">
              <Link to={`/product/${item.product.slug}`}>
                <img src={item.product.image} alt={item.product.name} className="w-24 h-24 rounded-xl object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-primary-600 dark:text-primary-400 uppercase">{item.product.brand}</p>
                <Link to={`/product/${item.product.slug}`}>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 hover:text-primary-700 line-clamp-2">{item.product.name}</h3>
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatPrice(item.product.price)}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1.5 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1.5 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-primary-700 dark:text-primary-400">{formatPrice(item.product.price * item.quantity)}</span>
                    <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 hover:text-red-600 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-between">
            <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 font-medium">Clear Cart</button>
            <Link to="/products" className="text-sm text-primary-700 dark:text-primary-400 font-medium hover:underline">Continue Shopping</Link>
          </div>
        </div>

        {/* Summary */}
        <div className="card p-6 h-fit sticky top-32 space-y-4">
          <h2 className="font-display text-lg font-bold text-gray-800 dark:text-white">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Subtotal ({items.length} items)</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Shipping</span>
              <span className="font-semibold">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Tax (5% GST)</span>
              <span className="font-semibold">{formatPrice(tax)}</span>
            </div>
            {shipping === 0 && subtotal > 0 && (
              <p className="text-xs text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 p-2 rounded-lg">
                You got free shipping!
              </p>
            )}
          </div>
          <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-gray-800 dark:text-white">Total</span>
              <span className="text-2xl font-bold text-primary-700 dark:text-primary-400">{formatPrice(total)}</span>
            </div>
          </div>
          <Link to="/checkout" className="btn-primary w-full flex items-center justify-center gap-2">
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
