import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  ShoppingCart, Heart, Search, Menu, X, Sun, Moon, User, LogOut, Package,
  LayoutDashboard, Tractor, Mail, ChevronDown, Sparkles, Calculator, Calendar, Wrench,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { searchProducts } from '../data/products';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof searchProducts>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchResults(searchProducts(searchQuery).slice(0, 5));
      setShowSearch(true);
    } else {
      setShowSearch(false);
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-primary-800 text-white text-xs hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> bandihemamahalakshmisridivya@gmail.com</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-primary-200 transition-colors">About</Link>
            <Link to="/contact" className="hover:text-primary-200 transition-colors">Contact</Link>
            <Link to="/faq" className="hover:text-primary-200 transition-colors">FAQ</Link>
            <Link to="/blog" className="hover:text-primary-200 transition-colors">Blog</Link>
          </div>
        </div>
      </div>

      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'glass shadow-card' : 'bg-white dark:bg-gray-900'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-green">
                <Tractor className="w-6 h-6 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-gradient hidden sm:block">AgriMadeEazy</span>
            </Link>

            {/* Search - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-xl mx-6 relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for tractors, seeds, tools..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              {showSearch && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-card-hover border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-slide-down">
                  {searchResults.map((p) => (
                    <Link
                      key={p.id}
                      to={`/product/${p.slug}`}
                      onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{p.name}</p>
                        <p className="text-xs text-primary-600 dark:text-primary-400">₹{p.price.toLocaleString('en-IN')}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </form>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Toggle theme">
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              <Link to="/wishlist" className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full object-cover" />
                    <ChevronDown className="w-4 h-4 hidden md:block" />
                  </button>
                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-card-hover border border-gray-100 dark:border-gray-700 py-2 z-50 animate-slide-down">
                        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                          <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{user?.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                        </div>
                        <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <User className="w-4 h-4" /> Profile
                        </Link>
                        <Link to="/orders" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <Package className="w-4 h-4" /> My Orders
                        </Link>
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                          </Link>
                        )}
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link to="/login" className="hidden md:flex btn-primary py-2 px-4 text-sm">Login</Link>
              )}

              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Category nav - Desktop */}
          <div className="hidden md:flex items-center gap-6 h-11 border-t border-gray-100 dark:border-gray-800">
            <Link to="/" className={`nav-link text-sm ${location.pathname === '/' ? 'text-primary-700 dark:text-primary-400 font-semibold' : ''}`}>Home</Link>
            <Link to="/products" className="nav-link text-sm">All Products</Link>
            <Link to="/learn" className="nav-link text-sm text-primary-700 dark:text-primary-400 font-semibold">Learn AgriMadeEazy</Link>
            <Link to="/recommend-tools" className="nav-link text-sm flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Recommend Tools</Link>
            <Link to="/farm-calculator" className="nav-link text-sm flex items-center gap-1"><Calculator className="w-3.5 h-3.5" /> Calculator</Link>
            <Link to="/seasonal-tools" className="nav-link text-sm flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Seasonal Tools</Link>
            <Link to="/maintenance" className="nav-link text-sm flex items-center gap-1"><Wrench className="w-3.5 h-3.5" /> Maintenance</Link>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden glass border-t border-gray-100 dark:border-gray-800 animate-slide-down">
            <div className="px-4 py-4 space-y-3">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </form>
              <Link to="/" onClick={() => setMobileOpen(false)} className="block py-2 nav-link">Home</Link>
              <Link to="/products" onClick={() => setMobileOpen(false)} className="block py-2 nav-link">All Products</Link>
              <Link to="/learn" onClick={() => setMobileOpen(false)} className="block py-2 nav-link text-primary-700 dark:text-primary-400 font-semibold">Learn AgriMadeEazy</Link>
              <Link to="/recommend-tools" onClick={() => setMobileOpen(false)} className="block py-2 nav-link flex items-center gap-2"><Sparkles className="w-4 h-4" /> Recommend Tools</Link>
              <Link to="/farm-calculator" onClick={() => setMobileOpen(false)} className="block py-2 nav-link flex items-center gap-2"><Calculator className="w-4 h-4" /> Calculator</Link>
              <Link to="/seasonal-tools" onClick={() => setMobileOpen(false)} className="block py-2 nav-link flex items-center gap-2"><Calendar className="w-4 h-4" /> Seasonal Tools</Link>
              <Link to="/maintenance" onClick={() => setMobileOpen(false)} className="block py-2 nav-link flex items-center gap-2"><Wrench className="w-4 h-4" /> Maintenance</Link>
              <div className="pt-2 border-t border-gray-100 dark:border-gray-700 space-y-2">
                <Link to="/about" onClick={() => setMobileOpen(false)} className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">About</Link>
                <Link to="/contact" onClick={() => setMobileOpen(false)} className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">Contact</Link>
                <Link to="/faq" onClick={() => setMobileOpen(false)} className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">FAQ</Link>
                <Link to="/blog" onClick={() => setMobileOpen(false)} className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">Blog</Link>
                {!isAuthenticated && (
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block btn-primary text-center mt-2">Login</Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
