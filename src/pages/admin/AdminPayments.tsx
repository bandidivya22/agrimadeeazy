import { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, DollarSign, Smartphone, Truck, RefreshCw } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';

interface Order {
  id: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  utrNumber: string | null;
  status: string;
  date: string;
  address: { name: string; phone: string };
}

export default function AdminPayments() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    try {
      const data = JSON.parse(localStorage.getItem('agrimadeeazy-orders') || '[]');
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updatePaymentStatus = (id: string, status: 'Verified' | 'Rejected') => {
    setActionLoading(id + status);
    try {
      const all = JSON.parse(localStorage.getItem('agrimadeeazy-orders') || '[]');
      const updated = all.map((o: Order) => (o.id === id ? { ...o, paymentStatus: status } : o));
      localStorage.setItem('agrimadeeazy-orders', JSON.stringify(updated));
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, paymentStatus: status } : o)));
    } catch (err) {
      console.error('Error updating payment:', err);
    }
    setActionLoading(null);
  };

  const totalRevenue = orders.filter((o) => o.paymentStatus === 'Verified' || (o.paymentMethod === 'COD' && o.status === 'Delivered')).reduce((sum, o) => sum + o.total, 0);
  const pending = orders.filter((o) => o.paymentStatus === 'Pending').length;
  const verified = orders.filter((o) => o.paymentStatus === 'Verified').length;
  const rejected = orders.filter((o) => o.paymentStatus === 'Rejected').length;

  const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; bg: string; label: string }> = {
    Verified: { icon: CheckCircle, color: 'text-primary-600', bg: 'bg-primary-100 dark:bg-primary-900/30', label: 'Verified' },
    Pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30', label: 'Pending' },
    Rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', label: 'Rejected' },
    Failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', label: 'Failed' },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800 dark:text-white">Payment Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Verify and manage UPI & COD payments</p>
        </div>
        <button onClick={fetchOrders} className="btn-outline flex items-center gap-2 text-sm" disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: DollarSign, color: 'primary' },
          { label: 'Verified', value: verified.toString(), icon: CheckCircle, color: 'primary' },
          { label: 'Pending', value: pending.toString(), icon: Clock, color: 'amber' },
          { label: 'Rejected', value: rejected.toString(), icon: XCircle, color: 'red' },
        ].map((s, i) => (
          <div key={i} className="card p-5">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${
              s.color === 'primary' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' :
              s.color === 'amber' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
              'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            }`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="card p-12 text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400 mt-3">Loading payments...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">No orders yet. Payments will appear here once orders are placed.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Order ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase hidden sm:table-cell">Method</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase hidden md:table-cell">UTR</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {orders.map((o) => {
                  const cfg = statusConfig[o.paymentStatus] || statusConfig.Pending;
                  return (
                    <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-100">#{o.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">{o.address?.name || '-'}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-primary-700 dark:text-primary-400">{formatPrice(o.total)}</td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                          {o.paymentMethod === 'UPI' ? <Smartphone className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />} {o.paymentMethod}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell font-mono">
                        {o.utrNumber || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge text-xs ${cfg.bg} ${cfg.color} flex items-center gap-1 w-fit`}>
                          <cfg.icon className="w-3 h-3" /> {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {o.paymentStatus === 'Pending' && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => updatePaymentStatus(o.id, 'Verified')}
                              disabled={actionLoading === o.id + 'Verified'}
                              className="px-2 py-1 text-xs font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
                            >
                              {actionLoading === o.id + 'Verified' ? '...' : 'Verify'}
                            </button>
                            <button
                              onClick={() => updatePaymentStatus(o.id, 'Rejected')}
                              disabled={actionLoading === o.id + 'Rejected'}
                              className="px-2 py-1 text-xs font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 disabled:opacity-50"
                            >
                              {actionLoading === o.id + 'Rejected' ? '...' : 'Reject'}
                            </button>
                          </div>
                        )}
                        {o.paymentStatus !== 'Pending' && (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
