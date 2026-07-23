import { Link } from 'react-router-dom';
import {
  Package, Users, ShoppingBag, TrendingUp, DollarSign, ArrowRight,
  AlertCircle, CheckCircle, Clock, Sparkles, Wrench, Calculator, Sprout, Maximize,
} from 'lucide-react';
import { products } from '../../data/products';
import { categories } from '../../data/categories';
import { formatPrice } from '../../utils/helpers';
import { getAgriAnalytics } from '../../utils/agriLogic';

export default function AdminDashboard() {
  const orders = JSON.parse(localStorage.getItem('agrimadeeazy-orders') || '[]');
  const totalRevenue = orders.reduce((sum: number, o: any) => sum + o.total, 0);
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalUsers = 20;

  const agriAnalytics = getAgriAnalytics();

  const stats = [
    { label: 'Total Revenue', value: formatPrice(totalRevenue || 12500000), icon: DollarSign, color: 'primary', change: '+12%' },
    { label: 'Total Orders', value: (orders.length || 156).toString(), icon: ShoppingBag, color: 'blue', change: '+8%' },
    { label: 'Products', value: totalProducts.toString(), icon: Package, color: 'amber', change: '+5%' },
    { label: 'Users', value: totalUsers.toString(), icon: Users, color: 'primary', change: '+15%' },
  ];

  const recentOrders = orders.slice(-5).reverse();
  const lowStock = products.filter((p) => p.stock < 10).slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, here's what's happening</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                stat.color === 'primary' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' :
                stat.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
              }`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-primary-700 dark:text-primary-400 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {(recentOrders.length > 0 ? recentOrders : [
              { id: 'AGR123456', total: 595000, status: 'Placed', date: new Date().toISOString() },
              { id: 'AGR123455', total: 18500, status: 'Shipped', date: new Date().toISOString() },
              { id: 'AGR123454', total: 650, status: 'Delivered', date: new Date().toISOString() },
            ]).map((order: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div>
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">#{order.id}</p>
                  <p className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm text-primary-700 dark:text-primary-400">{formatPrice(order.total)}</p>
                  <span className={`badge text-xs ${
                    order.status === 'Delivered' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">Low Stock Alert</h2>
            <Link to="/admin/products" className="text-sm text-primary-700 dark:text-primary-400 font-medium flex items-center gap-1">
              Manage <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {lowStock.map((p) => (
              <div key={p.id} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800 dark:text-gray-100 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.category}</p>
                </div>
                <span className={`badge text-xs ${p.stock < 5 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                  {p.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agri Feature Analytics */}
      <div className="mt-6">
        <h2 className="font-display text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary-600" /> Agri Feature Analytics
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Top Recommended Products */}
          <div className="card p-5">
            <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-600" /> Most Recommended Products
            </h3>
            {agriAnalytics.topRecommendedProducts.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No recommendations yet</p>
            ) : (
              <div className="space-y-2">
                {agriAnalytics.topRecommendedProducts.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-300 truncate flex-1 mr-2">{item.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-20 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${Math.min(100, item.count * 20)}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 w-6 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Crops */}
          <div className="card p-5">
            <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-primary-600" /> Most Selected Crops
            </h3>
            {agriAnalytics.topCrops.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No data yet</p>
            ) : (
              <div className="space-y-2">
                {agriAnalytics.topCrops.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-300">{item.crop}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(100, item.count * 25)}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400 w-6 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Farm Size Distribution */}
          <div className="card p-5">
            <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Maximize className="w-4 h-4 text-primary-600" /> Farm Size Distribution
            </h3>
            {agriAnalytics.farmSizeDist.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No data yet</p>
            ) : (
              <div className="space-y-2">
                {agriAnalytics.farmSizeDist.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-300 truncate flex-1 mr-2">{item.size}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-20 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, item.count * 25)}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 w-6 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Most Used Calculator */}
          <div className="card p-5">
            <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-primary-600" /> Most Used Calculator Tools
            </h3>
            {agriAnalytics.calcUsage.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No calculations yet</p>
            ) : (
              <div className="space-y-2">
                {agriAnalytics.calcUsage.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-300 truncate flex-1 mr-2">{item.label}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-20 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, item.count * 25)}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 w-6 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Seasonal Popularity */}
          <div className="card p-5">
            <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary-600" /> Seasonal Popularity
            </h3>
            <div className="space-y-2">
              {agriAnalytics.seasonalPopularity.map((item, i) => {
                const maxCount = Math.max(...agriAnalytics.seasonalPopularity.map((s) => s.count), 1);
                return (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-300">{item.season}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(item.count / maxCount) * 100}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 w-6 text-right">{item.count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Maintenance Records */}
          <div className="card p-5">
            <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-primary-600" /> Maintenance Records
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-700 dark:text-primary-400">{agriAnalytics.maintenanceCount}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Registered Tools</p>
                <p className="text-xs text-gray-400">Tracked by users</p>
                <Link to="/admin/analytics" className="text-xs text-primary-600 dark:text-primary-400 hover:underline mt-1 inline-block">
                  View details →
                </Link>
      </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Add Product', link: '/admin/products', icon: Package },
          { label: 'View Orders', link: '/admin/orders', icon: ShoppingBag },
          { label: 'Analytics', link: '/admin/analytics', icon: TrendingUp },
        ].map((a, i) => (
          <Link key={i} to={a.link} className="card p-5 flex items-center gap-3 hover:border-primary-200 dark:hover:border-primary-700 group">
            <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <a.icon className="w-5 h-5 text-primary-700 dark:text-primary-400" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{a.label}</p>
              <p className="text-xs text-gray-400">Quick access</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
