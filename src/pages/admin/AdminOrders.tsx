import { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle, Clock, Truck, Home as HomeIcon, X, AlertTriangle } from 'lucide-react';
import { formatPrice, formatDate } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

interface Order {
  id: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  status: 'Placed' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  payment: string;
  cancelReason?: string;
  cancelDate?: string;
}

const sampleOrders: Order[] = Array.from({ length: 15 }, (_, i) => ({
  id: `AGR${String(123456 - i).padStart(6, '0')}`,
  customer: ['Rajesh Kumar', 'Suresh Patel', 'Lakshmi Devi', 'Mohammed Iqbal', 'Anita Sharma', 'Venkat Rao', 'Priya Singh', 'Gurpreet Singh', 'Arjun Mehta', 'Sunita Bai', 'Karthik Naidu', 'Fatima Begum', 'Ramesh Chandra', 'Deepak Yadav', 'Meena Iyer'][i],
  email: `user${i + 1}@agrimadeeazy.com`,
  items: Math.floor(Math.random() * 5) + 1,
  total: [595000, 18500, 650, 28500, 85000, 450, 1200, 12500, 38500, 750, 320, 4200, 1850, 6800, 550][i],
  status: (['Delivered', 'Shipped', 'Packed', 'Placed', 'Cancelled'] as const)[i % 5],
  date: new Date(2024, 8, 20 - i).toISOString(),
  payment: i % 3 === 0 ? 'COD' : 'UPI',
  cancelReason: i % 5 === 4 ? 'Found a better price' : undefined,
  cancelDate: i % 5 === 4 ? new Date(2024, 8, 18 - i).toISOString() : undefined,
}));

const statusColors: Record<string, string> = {
  Placed: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Confirmed: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Packed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Delivered: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
  Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function AdminOrders() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  // Merge in user-placed orders from localStorage
  useEffect(() => {
    const userOrders = JSON.parse(localStorage.getItem('agrimadeeazy-orders') || '[]');
    if (userOrders.length > 0) {
      const mapped = userOrders.map((o: any) => ({
        id: o.id,
        customer: o.address?.name || 'Customer',
        email: 'customer@agrimadeeazy.com',
        items: o.items?.length || 1,
        total: o.total,
        status: o.status,
        date: o.date,
        payment: o.paymentMethod,
        cancelReason: o.cancelReason,
        cancelDate: o.cancelDate,
      }));
      setOrders([...mapped, ...sampleOrders]);
    }
  }, []);

  const filtered = orders.filter(
    (o) => (o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase())) && (!filterStatus || o.status === filterStatus)
  );

  const updateStatus = (id: string, status: Order['status']) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
    if (viewOrder?.id === id) setViewOrder({ ...viewOrder, status });
    showToast(`Order status updated to ${status}`, 'success');
  };

  const statusFlow: Order['status'][] = ['Placed', 'Packed', 'Shipped', 'Delivered'];

  const cancelledCount = orders.filter((o) => o.status === 'Cancelled').length;
  const cancelledRevenue = orders.filter((o) => o.status === 'Cancelled').reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800 dark:text-white">Order Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{orders.length} orders · {cancelledCount} cancelled</p>
        </div>
        {cancelledCount > 0 && (
          <div className="card px-4 py-2.5 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Cancelled: <span className="font-bold text-red-600">{formatPrice(cancelledRevenue)}</span></span>
          </div>
        )}
      </div>

      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input className="input-field pl-10" placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input-field sm:w-40" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="Cancelled">Cancelled</option>
          {statusFlow.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Order ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase hidden md:table-cell">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase hidden sm:table-cell">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Total</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map((o) => (
                <tr key={o.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 ${o.status === 'Cancelled' ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3 font-medium text-sm text-gray-800 dark:text-gray-100">#{o.id}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-sm text-gray-800 dark:text-gray-100">{o.customer}</p>
                    <p className="text-xs text-gray-400">{o.items} items</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hidden sm:table-cell">{formatDate(o.date)}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-primary-700 dark:text-primary-400">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge text-xs ${statusColors[o.status]}`}>{o.status}</span>
                    {o.status === 'Cancelled' && o.cancelReason && (
                      <p className="text-xs text-red-500 mt-1 hidden lg:block">{o.cancelReason}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setViewOrder(o)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewOrder(null)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-card-hover max-w-lg w-full p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-gray-800 dark:text-white">Order #{viewOrder.id}</h2>
              <button onClick={() => setViewOrder(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Customer</span><span className="font-medium">{viewOrder.customer}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium">{viewOrder.email}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium">{formatDate(viewOrder.date)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Items</span><span className="font-medium">{viewOrder.items}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Payment</span><span className="font-medium">{viewOrder.payment}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="font-bold text-primary-700 dark:text-primary-400">{formatPrice(viewOrder.total)}</span></div>
            </div>

            {viewOrder.status === 'Cancelled' && (
              <div className="mt-4 bg-red-50 dark:bg-red-900/20 rounded-xl p-4 space-y-1.5">
                <p className="text-sm font-semibold text-red-700 dark:text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Cancellation Details
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">Reason: {viewOrder.cancelReason || 'Not specified'}</p>
                {viewOrder.cancelDate && <p className="text-xs text-red-600 dark:text-red-400">Cancelled on: {formatDate(viewOrder.cancelDate)}</p>}
                {viewOrder.payment === 'UPI' && (
                  <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">UPI Refund will be processed</p>
                )}
              </div>
            )}

            {viewOrder.status !== 'Cancelled' && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Update Status:</p>
                <div className="grid grid-cols-2 gap-2">
                  {statusFlow.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(viewOrder.id, s)}
                      className={`py-2 rounded-lg text-sm font-medium transition-all ${viewOrder.status === s ? 'bg-primary-700 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
