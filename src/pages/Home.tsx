import { Link } from 'react-router-dom';
import {
  ArrowRight, Truck, ShieldCheck, Headphones, CreditCard, Sprout, Star,
  TrendingUp, Users, Award, Leaf, Play,
} from 'lucide-react';
import { categories } from '../data/categories';
import { getFeaturedProducts, getBestSellers, getNewArrivals } from '../data/products';
import { testimonials } from '../data/reviews';
import ProductCard from '../components/ProductCard';
import Rating from '../components/Rating';

export default function Home() {
  const featured = getFeaturedProducts().slice(0, 8);
  const bestSellers = getBestSellers().slice(0, 4);
  const newArrivals = getNewArrivals().slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-earth-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-earth-400 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 animate-slide-up">
              <span className="badge bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300 px-4 py-1.5">
                <Sprout className="w-3.5 h-3.5 mr-1" /> India's #1 Agricultural Marketplace
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-agri-dark dark:text-white">
                Modern Tools for <span className="text-gradient">Modern Farmers</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md">
                From tractors to seeds, irrigation to harvesters — everything your farm needs, delivered to your doorstep.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/products" className="btn-primary flex items-center gap-2">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/learn" className="btn-secondary flex items-center gap-2">
                  <Play className="w-4 h-4" /> Learn AgriMadeEazy
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div>
                  <p className="text-2xl font-bold text-primary-700 dark:text-primary-400">20+</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Products</p>
                </div>
                <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />
                <div>
                  <p className="text-2xl font-bold text-primary-700 dark:text-primary-400">10+</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Categories</p>
                </div>
                <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />
                <div>
                  <p className="text-2xl font-bold text-primary-700 dark:text-primary-400">5K+</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Happy Farmers</p>
                </div>
              </div>
            </div>
            <div className="relative animate-scale-in">
              <div className="relative rounded-3xl overflow-hidden shadow-card-hover">
                <img
                  src="https://images.pexels.com/photos/1112080/pexels-photo-1112080.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Modern tractor working in a lush green field"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -left-4 glass rounded-2xl p-4 shadow-card-hover animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary-700 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100">30% More Yield</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">With our tools</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 glass rounded-2xl p-4 shadow-card-hover animate-float" style={{ animationDelay: '1.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                    <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100">Quality Assured</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Certified products</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section className="border-y border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹50,000' },
              { icon: ShieldCheck, title: 'Quality Assured', desc: 'Certified products only' },
              { icon: CreditCard, title: 'Secure Payments', desc: 'UPI & COD available' },
              { icon: Headphones, title: '24/7 Support', desc: 'Expert assistance' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                  <f.icon className="w-6 h-6 text-primary-700 dark:text-primary-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{f.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="section-title">Shop by Category</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Find exactly what your farm needs</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="card p-5 text-center group hover:-translate-y-1"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden bg-primary-50 dark:bg-primary-900/30 mb-3 flex items-center justify-center">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100">{cat.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{cat.productCount} products</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Handpicked for you</p>
          </div>
          <Link to="/products" className="text-primary-700 dark:text-primary-400 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="rounded-3xl bg-gradient-earth overflow-hidden relative">
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-8 md:p-12 space-y-4 text-white">
              <span className="badge bg-white/20 text-white px-4 py-1.5">Limited Time Offer</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Up to 30% OFF on Tractors</h2>
              <p className="text-white/80">Upgrade your farm with the latest agricultural tools and machinery.</p>
              <Link to="/products?category=farm-machinery" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="h-64 md:h-80">
              <img src="https://images.pexels.com/photos/5358849/pexels-photo-5358849.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Green tractor plowing a field" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">Best Sellers</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Most loved by farmers</p>
          </div>
          <Link to="/products" className="text-primary-700 dark:text-primary-400 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">New Arrivals</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Latest additions to our catalog</p>
          </div>
          <Link to="/products" className="text-primary-700 dark:text-primary-400 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Learn AgriMadeEazy CTA */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="card p-8 md:p-12 bg-gradient-to-r from-primary-50 to-earth-50 dark:from-gray-800 dark:to-gray-800 border border-primary-100 dark:border-gray-700">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="badge bg-primary-600 text-white px-4 py-1.5">
                <Play className="w-3.5 h-3.5 mr-1" /> Video Tutorials
              </span>
              <h2 className="font-display text-3xl font-bold text-gray-800 dark:text-white">Learn How to Use AgriMadeEazy</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Watch our step-by-step video guide to learn how to browse, order, and get the most out of AgriMadeEazy.
              </p>
              <Link to="/learn" className="btn-primary inline-flex items-center gap-2">
                <Play className="w-4 h-4" /> Start Learning
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-card-hover relative">
                <img src="https://images.pexels.com/photos/16678079/pexels-photo-16678079.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Farmer using smartphone in field" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center animate-bounce-gentle">
                    <Play className="w-10 h-10 text-white" fill="white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-primary-50/50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="section-title">Farmer Testimonials</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">What our farmers say about AgriMadeEazy</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.slice(0, 6).map((t) => (
              <div key={t.id} className="card p-6 space-y-4">
                <Rating rating={t.rating} />
                <p className="text-gray-600 dark:text-gray-300 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{t.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.role} • {t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Users, value: '5,000+', label: 'Happy Farmers' },
            { icon: Leaf, value: '20+', label: 'Products' },
            { icon: Truck, value: '500+', label: 'Daily Deliveries' },
            { icon: Star, value: '4.7/5', label: 'Customer Rating' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                <s.icon className="w-7 h-7 text-primary-700 dark:text-primary-400" />
              </div>
              <p className="text-2xl font-bold text-primary-700 dark:text-primary-400">{s.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
