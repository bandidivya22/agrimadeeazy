import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Learn from './pages/Learn';
import { About, Contact } from './pages/AboutContact';
import { FAQ, Blog } from './pages/FAQBlog';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPayments from './pages/admin/AdminPayments';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import { lazy, Suspense } from 'react';
import SkeletonCard from './components/Skeleton';

const LazyRecommendTools = lazy(() => import('./pages/RecommendTools'));
const LazyFarmCalculator = lazy(() => import('./pages/FarmCalculator'));
const LazySeasonalTools = lazy(() => import('./pages/SeasonalTools'));
const LazyMaintenanceTracker = lazy(() => import('./pages/MaintenanceTracker'));

const PageFallback = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <BrowserRouter>
                <Routes>
                  {/* Admin routes - no public navbar/footer */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminLayout><AdminDashboard /></AdminLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminLayout><AdminProducts /></AdminLayout></ProtectedRoute>} />
                  <Route path="/admin/categories" element={<ProtectedRoute adminOnly><AdminLayout><AdminCategories /></AdminLayout></ProtectedRoute>} />
                  <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminLayout><AdminUsers /></AdminLayout></ProtectedRoute>} />
                  <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminLayout><AdminOrders /></AdminLayout></ProtectedRoute>} />
                  <Route path="/admin/payments" element={<ProtectedRoute adminOnly><AdminLayout><AdminPayments /></AdminLayout></ProtectedRoute>} />
                  <Route path="/admin/analytics" element={<ProtectedRoute adminOnly><AdminLayout><AdminAnalytics /></AdminLayout></ProtectedRoute>} />

                  {/* Public routes */}
                  <Route
                    path="*"
                    element={
                      <div className="min-h-screen flex flex-col">
                        <Navbar />
                        <main className="flex-1">
                          <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/product/:slug" element={<ProductDetail />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                            <Route path="/order-success/:orderId" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                            <Route path="/wishlist" element={<Wishlist />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                            <Route path="/learn" element={<Learn />} />
                            <Route path="/recommend-tools" element={<Suspense fallback={<PageFallback />}><LazyRecommendTools /></Suspense>} />
                            <Route path="/farm-calculator" element={<Suspense fallback={<PageFallback />}><LazyFarmCalculator /></Suspense>} />
                            <Route path="/seasonal-tools" element={<Suspense fallback={<PageFallback />}><LazySeasonalTools /></Suspense>} />
                            <Route path="/maintenance" element={<Suspense fallback={<PageFallback />}><LazyMaintenanceTracker /></Suspense>} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/faq" element={<FAQ />} />
                            <Route path="/blog" element={<Blog />} />
                          </Routes>
                        </main>
                        <Footer />
                      </div>
                    }
                  />
                </Routes>
              </BrowserRouter>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
