import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home as HomeIcon } from 'lucide-react';
import { formatPrice } from '../utils/helpers';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const orders = JSON.parse(localStorage.getItem('agrimadeeazy-orders') || '[]');
  const order = orders.find((o: any) => o.id === orderId);

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 dark:text-gray-400">Order not found.</p>
        <Link to="/" className="btn-primary mt-4 inline-block">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4 animate-scale-in">
          <CheckCircle className="w-12 h-12 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Order Placed Successfully!</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Your order ID is <span className="font-bold text-primary-700 dark:text-primary-400">{order.id}</span></p>
      </div>

      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Order Date</p>
            <p className="font-semibold text-gray-800 dark:text-gray-100">{new Date(order.date).toLocaleDateString('en-IN')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">{order.status}</span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-200 mb-3">Items</h3>
          <div className="space-y-3">
            {order.items.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <img src={item.image} alt="" className="w-14 h-14 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-800 dark:text-gray-100">{item.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                </div>
                <span className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-baseline">
          <span className="font-bold text-gray-800 dark:text-white">Total Paid</span>
          <span className="text-xl font-bold text-primary-700 dark:text-primary-400">{formatPrice(order.total)}</span>
        </div>
      </div>

      {/* Tracking */}
      <div className="card p-6 mt-4">
        <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-200 mb-4">Order Tracking</h3>
        <div className="flex items-center justify-between relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700" />
          <div className="absolute top-5 left-0 w-1/3 h-0.5 bg-primary-600" />
          {[
            { icon: CheckCircle, label: 'Placed', active: true },
            { icon: Package, label: 'Packed', active: false },
            { icon: Truck, label: 'Shipped', active: false },
            { icon: HomeIcon, label: 'Delivered', active: false },
          ].map((s, i) => (
            <div key={i} className="relative z-10 text-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto ${s.active ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <p className="text-xs mt-2 font-medium text-gray-600 dark:text-gray-300">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Link to="/orders" className="btn-primary flex-1 text-center">View All Orders</Link>
        <Link to="/products" className="btn-outline flex-1 text-center">Continue Shopping</Link>
      </div>
    </div>
  );
}
