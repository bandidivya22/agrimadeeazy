import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  { q: 'How do I place an order on AgriMadeEazy?', a: 'Browse products, add items to your cart, and proceed to checkout. Fill in your shipping address, choose a payment method (UPI or COD), and confirm your order.' },
  { q: 'What payment methods are available?', a: 'We support UPI payments (Google Pay, PhonePe, Paytm, BHIM, Amazon Pay and all UPI apps) and Cash on Delivery (COD) for select locations.' },
  { q: 'Do you offer free shipping?', a: 'Yes! Orders above ₹50,000 qualify for free shipping across India. For orders below that, a flat shipping fee of ₹250 applies.' },
  { q: 'How long does delivery take?', a: 'Typically 3-7 business days depending on your location. Remote areas may take up to 10 days. You\'ll receive tracking updates via SMS and email.' },
  { q: 'What is your return policy?', a: 'We offer 7-day returns for most products. Items must be unused and in original packaging. Refunds are processed within 5-7 business days.' },
  { q: 'Are the products genuine and warranted?', a: 'Yes, all products are 100% genuine and sourced directly from manufacturers. Warranty periods vary by product and are mentioned on each product page.' },
  { q: 'Can I cancel my order?', a: 'Orders can be cancelled before they are shipped. Go to My Orders, select the order, and click Cancel. Refund will be processed if payment was made online.' },
  { q: 'Do you offer EMI options?', a: 'EMI options may be available on select products. Please contact our support team for more information about EMI eligibility.' },
  { q: 'How do I track my order?', a: 'Go to My Orders in your account. Each order shows its current status: Placed, Packed, Shipped, or Delivered.' },
  { q: 'Is there a tutorial video available?', a: 'Yes! We have a comprehensive video tutorial on our Learn page that walks you through browsing, ordering, and using all features of the platform.' },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-4">
          <HelpCircle className="w-8 h-8 text-primary-700 dark:text-primary-400" />
        </div>
        <h1 className="font-display text-3xl font-bold text-gray-800 dark:text-white">Frequently Asked Questions</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Find answers to common questions</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="card overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">{faq.q}</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && (
              <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-300 animate-slide-down">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const blogPosts = [
  { id: 1, title: '10 Essential Tools Every Farmer Should Have', excerpt: 'From hand tools to power equipment, here are the must-have tools for a productive farm.', date: '2024-09-15', author: 'Rajesh Kumar', image: 'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'Tools' },
  { id: 2, title: 'How to Choose the Right Tractor for Your Farm', excerpt: 'A comprehensive guide to selecting the perfect tractor based on your farm size and needs.', date: '2024-09-10', author: 'Suresh Patel', image: 'https://images.pexels.com/photos/1112080/pexels-photo-1112080.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'Tractors' },
  { id: 3, title: 'Organic Farming: A Beginner\'s Guide', excerpt: 'Learn the basics of organic farming and how to transition from chemical to natural methods.', date: '2024-09-05', author: 'Anita Sharma', image: 'https://images.pexels.com/photos/5425769/pexels-photo-5425769.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'Organic' },
  { id: 4, title: 'Water-Saving Irrigation Techniques', excerpt: 'Discover modern irrigation methods that save water while increasing crop yield.', date: '2024-08-28', author: 'Arjun Mehta', image: 'https://images.pexels.com/photos/2632650/pexels-photo-2632650.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'Irrigation' },
  { id: 5, title: 'Best Practices for Seed Selection', excerpt: 'How to choose the right seeds for your climate, soil, and crop rotation plan.', date: '2024-08-20', author: 'Priya Singh', image: 'https://images.pexels.com/photos/5425770/pexels-photo-5425770.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'Seeds' },
  { id: 6, title: 'Understanding Fertilizer NPK Ratios', excerpt: 'What do those numbers on fertilizer bags mean? A simple explanation for farmers.', date: '2024-08-15', author: 'Gurpreet Singh', image: 'https://images.pexels.com/photos/4751990/pexels-photo-4751990.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'Fertilizers' },
];

export function Blog() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-800 dark:text-white">AgriMadeEazy Blog</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Tips, guides, and insights for modern farmers</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <article key={post.id} className="card overflow-hidden group cursor-pointer">
            <div className="aspect-video overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-5 space-y-2">
              <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">{post.category}</span>
              <h2 className="font-display font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400">
                <span>{post.author}</span>
                <span>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
