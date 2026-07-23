import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Package, CheckCircle, Truck, Home as HomeIcon, X, AlertTriangle } from 'lucide-react';
import { formatPrice, formatDate } from '../utils/helpers';
import { useToast } from '../context/ToastContext';

const CANCELLABLE_STATUSES = ['Placed', 'Confirmed', 'Packed'];
const CANCEL_REASONS = [
  'Ordered by mistake',
  'Found a better price',
  'Delivery is taking too long',
  'Changed my mind',
  'Incorrect product selected',
  'Other',
];

export default function Orders() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('agrimadeeazy-orders') || '[]'));
  const [cancelTarget, setCancelTarget] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState(CANCEL_REASONS[0]);
  const [otherReason, setOtherReason] = useState('');

  const handleCancel = () => {
    const reason = cancelReason === 'Other' ? otherReason : cancelReason;
    const cancelDate = new Date().toISOString();
    const updated = orders.map((o: any) =>
      o.id === cancelTarget.id
        ? { ...o, status: 'Cancelled', cancelReason: reason, cancelDate }
        : o
    );
    setOrders(updated);
    localStorage.setItem('agrimadeeazy-orders', JSON.stringify(updated));

    showToast('Your order has been cancelled successfully.', 'success')
    setCancelTarget(null);
    setCancelReason(CANCEL_REASONS[0]);
    setOtherReason('');
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-24 h-24 mx-auto rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-6">
          <Package className="w-12 h-12 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 className="font-display text-2xl font-bold text-gray-800 dark:text-white mb-2">No Orders Yet</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't placed any orders.</p>
        <Link to="/products" className="btn-primary inline-block">Start Shopping</Link>
      </div>
    );
  }

  const statusSteps = [
    { icon: CheckCircle, label: 'Placed' },
    { icon: Package, label: 'Packed' },
    { icon: Truck, label: 'Shipped' },
    { icon: HomeIcon, label: 'Delivered' },
  ];

  const getStatusColor = (status: string) => {
    if (status === 'Cancelled') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    if (status === 'Delivered') return 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400';
    if (status === 'Shipped') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
  };

  const getActiveStepIndex = (status: string) => {
    if (status === 'Cancelled') return -1;
    const map: Record<string, number> = { Placed: 0, Confirmed: 0, Packed: 1, Shipped: 2, Delivered: 3 };
    return map[status] ?? 0;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">My Orders</h1>
      <div className="space-y-4">
        {[...orders].reverse().map((order: any) => {
          const activeStep = getActiveStepIndex(order.status);
          const canCancel = CANCELLABLE_STATUSES.includes(order.status);
          return (
            <div key={order.id} className={`card p-5 space-y-4 ${order.status === 'Cancelled' ? 'opacity-75' : ''}`}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-100">Order #{order.id}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(order.date)}</p>
                </div>
                <span className={`badge ${getStatusColor(order.status)}`}>{order.status}</span>
              </div>

              {order.status === 'Cancelled' ? (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 space-y-1">
                  <p className="text-sm text-red-700 dark:text-red-400 font-medium flex items-center gap-1.5">
                    <X className="w-4 h-4" /> Order Cancelled
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400">
                    Reason: {order.cancelReason || 'Not specified'}
                  </p>
                  {order.cancelDate && (
                    <p className="text-xs text-red-600 dark:text-red-400">
                      Cancelled on: {formatDate(order.cancelDate)}
                    </p>
                  )}
                  {order.paymentMethod === 'UPI' && (
                    <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                      UPI Refund will be processed
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700" />
                  <div className="absolute top-5 left-0 h-0.5 bg-primary-600 transition-all duration-500" style={{ width: `${(activeStep / 3) * 100}%` }} />
                  {statusSteps.map((s, i) => (
                    <div key={i} className="relative z-10 text-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto ${i <= activeStep ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                        <s.icon className="w-5 h-5" />
                      </div>
                      <p className="text-xs mt-1 font-medium text-gray-600 dark:text-gray-300">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-800 dark:text-gray-100 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div className="space-y-1">
                  <div>
                    <span className="font-bold text-gray-800 dark:text-white">Total</span>
                    <span className="text-lg font-bold text-primary-700 dark:text-primary-400 ml-2">{formatPrice(order.total)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Payment:</span>
                    <span className="font-medium text-gray-700 dark:text-gray-200">{order.paymentMethod || 'COD'}</span>
                    {order.paymentStatus && (
                      <span className={`badge text-xs ${
                        order.paymentStatus === 'Verified' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' :
                        order.paymentStatus === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        order.paymentStatus === 'Failed' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>{order.paymentStatus}</span>
                    )}
                  </div>
                </div>
                {canCancel && (
                  <button
                    onClick={() => setCancelTarget(order)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-red-500 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <X className="w-4 h-4" /> Cancel Order
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cancel confirmation modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setCancelTarget(null)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-card-hover max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="font-display text-lg font-bold text-gray-800 dark:text-white">Cancel Order?</h2>
              </div>
              <button onClick={() => setCancelTarget(null)}><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to cancel order <span className="font-semibold">#{cancelTarget.id}</span>? This action cannot be undone.
            </p>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 block">Reason for Cancellation</label>
              <select
                className="input-field"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              >
                {CANCEL_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              {cancelReason === 'Other' && (
                <input
                  className="input-field mt-2"
                  placeholder="Please specify your reason"
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                />
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelTarget(null)}
                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                No, Keep Order
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <X className="w-4 h-4" /> Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
