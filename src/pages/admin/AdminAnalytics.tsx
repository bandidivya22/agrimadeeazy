import { TrendingUp, Package, Users, ShoppingBag, DollarSign, BarChart3, XCircle } from 'lucide-react';
import { products } from '../../data/products';
import { categories } from '../../data/categories';
import { formatPrice } from '../../utils/helpers';

export default function AdminAnalytics() {
  const totalRevenue = 12500000;
  const totalOrders = 156;
  const totalUsers = 20;
  const cancelledOrders = 14;
  const cancelledRevenue = 185000;
  const avgOrderValue = totalRevenue / totalOrders;

  const categoryRevenue = categories.map((cat) => {
    const catProducts = products.filter((p) => p.categorySlug === cat.slug);
    const revenue = catProducts.reduce((sum, p) => sum + p.price * p.sold, 0);
    return { name: cat.name, revenue, count: catProducts.length };
  }).sort((a, b) => b.revenue - a.revenue);

  const maxRevenue = Math.max(...categoryRevenue.map((c) => c.revenue));
  const topProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);

  const monthlyData = [
    { month: 'Jan', revenue: 850000, orders: 12 },
    { month: 'Feb', revenue: 920000, orders: 15 },
    { month: 'Mar', revenue: 1100000, orders: 18 },
    { month: 'Apr', revenue: 1350000, orders: 22 },
    { month: 'May', revenue: 1580000, orders: 25 },
    { month: 'Jun', revenue: 1820000, orders: 28 },
    { month: 'Jul', revenue: 1650000, orders: 24 },
    { month: 'Aug', revenue: 1950000, orders: 31 },
    { month: 'Sep', revenue: 2280000, orders: 35 },
  ];

  const maxMonthly = Math.max(...monthlyData.map((m) => m.revenue));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-800 dark:text-white">Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Business insights and performance</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: DollarSign, change: '+12%' },
          { label: 'Total Orders', value: totalOrders.toString(), icon: ShoppingBag, change: '+8%' },
          { label: 'Avg Order Value', value: formatPrice(Math.round(avgOrderValue)), icon: TrendingUp, change: '+4%' },
          { label: 'Total Users', value: totalUsers.toString(), icon: Users, change: '+15%' },
        ].map((s, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                <s.icon className="w-5 h-5 text-primary-700 dark:text-primary-400" />
              </div>
              <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">{s.change}</span>
            </div>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Monthly revenue chart */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Monthly Revenue</h2>
        <div className="flex items-end gap-2 h-48">
          {monthlyData.map((m, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-primary-100 dark:bg-primary-900/30 rounded-t-lg relative group hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors" style={{ height: `${(m.revenue / maxMonthly) * 100}%` }}>
                <div className="w-full bg-gradient-to-t from-primary-700 to-primary-500 rounded-t-lg h-full group-hover:opacity-80 transition-opacity" />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                  {formatPrice(m.revenue)}
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5 border-l-4 border-red-500">
        <div className="flex items-center justify-between mb-3">
          <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <span className="text-xs font-semibold text-red-600 dark:text-red-400">{((cancelledOrders / totalOrders) * 100).toFixed(1)}%</span>
        </div>
        <p className="text-xl font-bold text-gray-800 dark:text-white">{cancelledOrders}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Cancelled Orders · {formatPrice(cancelledRevenue)} refunded</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Category revenue */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Revenue by Category</h2>
          <div className="space-y-3">
            {categoryRevenue.map((c, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700 dark:text-gray-200">{c.name}</span>
                  <span className="text-gray-500 dark:text-gray-400">{formatPrice(c.revenue)}</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-primary rounded-full transition-all duration-500" style={{ width: `${(c.revenue / maxRevenue) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Top Selling Products</h2>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-400 w-6">#{i + 1}</span>
                <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.sold} sold</p>
                </div>
                <span className="text-sm font-semibold text-primary-700 dark:text-primary-400">{formatPrice(p.price * p.sold)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
