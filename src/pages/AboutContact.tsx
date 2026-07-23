import { Tractor, Target, Users, Award, Leaf, TrendingUp, Mail, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../context/ToastContext';

export function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-10">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center shadow-green mb-4">
          <Tractor className="w-9 h-9 text-white" />
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">About AgriMadeEazy</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
          Empowering Indian farmers with quality agricultural tools and equipment at affordable prices.
        </p>
      </div>

      <div className="card p-8 mb-6 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="font-display text-xl font-bold text-gray-800 dark:text-white mb-4">Our Story</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Founded in 2024, AgriMadeEazy started with a simple mission: to make quality agricultural tools accessible to every farmer in India. We saw that farmers in rural areas struggled to find reliable equipment at fair prices. Today, AgriMadeEazy serves over 5,000 farmers across the country, offering 20+ agricultural tools across 5 categories — from tractors and sprayers to garden and hand tools.
            </p>
          </div>
          <div className="aspect-video rounded-2xl overflow-hidden">
            <img src="https://images.pexels.com/photos/11858253/pexels-photo-11858253.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Farmers working together in a green field" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[
          { icon: Target, title: 'Our Mission', desc: 'To democratize access to modern agricultural tools for every Indian farmer.' },
          { icon: Leaf, title: 'Our Vision', desc: 'A future where technology empowers sustainable and profitable farming.' },
          { icon: Users, title: 'Our Values', desc: 'Quality, affordability, transparency, and farmer-first approach.' },
        ].map((item, i) => (
          <div key={i} className="card p-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-3">
              <item.icon className="w-7 h-7 text-primary-700 dark:text-primary-400" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">{item.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="card p-8">
        <h2 className="font-display text-xl font-bold text-gray-800 dark:text-white mb-4">Why Choose AgriMadeEazy?</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: Award, title: 'Quality Assured', desc: 'Only certified, genuine products from trusted brands' },
            { icon: TrendingUp, title: 'Best Prices', desc: 'Competitive pricing with regular discounts' },
            { icon: Users, title: 'Expert Support', desc: '24/7 customer service in multiple languages' },
            { icon: Leaf, title: 'Eco-Friendly', desc: 'Promoting sustainable and organic farming practices' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-primary-700 dark:text-primary-400" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{item.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Contact() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Message sent! We\'ll get back to you soon.', 'success');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-800 dark:text-white">Get in Touch</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">We'd love to hear from you. Reach out anytime.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {[
          { icon: Mail, title: 'Email Us', value: 'bandihemamahalakshmisridivya@gmail.com', sub: '24/7 response' },
          { icon: MapPin, title: 'Visit Us', value: 'Tech Park, Hyderabad', sub: 'Telangana 500001' },
        ].map((item, i) => (
          <div key={i} className="card p-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-3">
              <item.icon className="w-7 h-7 text-primary-700 dark:text-primary-400" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">{item.title}</h3>
            <p className="text-sm text-primary-700 dark:text-primary-400 font-medium mt-1">{item.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{item.sub}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Your Name</label>
            <input required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Farmer" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Email</label>
            <input type="email" required className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Subject</label>
          <input required className="input-field" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="How can we help?" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Message</label>
          <textarea required rows={5} className="input-field" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Your message..." />
        </div>
        <button type="submit" className="btn-primary flex items-center gap-2">
          <Send className="w-4 h-4" /> Send Message
        </button>
      </form>
    </div>
  );
}
