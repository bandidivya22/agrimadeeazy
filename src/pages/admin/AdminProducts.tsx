import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Package } from 'lucide-react';
import { products as allProducts, Product } from '../../data/products';
import { categories } from '../../data/categories';
import { formatPrice } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

export default function AdminProducts() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const filtered = products.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) && (!filterCat || p.categorySlug === filterCat)
  );

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    showToast('Product deleted', 'success');
  };

  const handleSave = (product: Product) => {
    if (editing) {
      setProducts(products.map((p) => (p.id === product.id ? product : p)));
      showToast('Product updated', 'success');
    } else {
      setProducts([...products, { ...product, id: `prod-${Date.now()}` }]);
      showToast('Product added', 'success');
    }
    setShowModal(false);
    setEditing(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800 dark:text-white">Product Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{products.length} products</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input className="input-field pl-10" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input-field sm:w-48" value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Price</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase hidden sm:table-cell">Stock</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-gray-800 dark:text-gray-100 truncate">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell">{p.category}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-primary-700 dark:text-primary-400">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`badge text-xs ${p.stock < 10 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setEditing(p); setShowModal(true); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && <ProductModal product={editing} onSave={handleSave} onClose={() => { setShowModal(false); setEditing(null); }} />}
    </div>
  );
}

function ProductModal({ product, onSave, onClose }: { product: Product | null; onSave: (p: Product) => void; onClose: () => void }) {
  const [form, setForm] = useState<Product>(product || {
    id: '', name: '', slug: '', category: '', categorySlug: '', brand: '', price: 0, originalPrice: 0, discount: 0,
    rating: 0, reviewCount: 0, stock: 0, sold: 0, image: '', images: [], description: '', features: [],
    specifications: [], isFeatured: false, isBestSeller: false, isNew: true, tags: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-card-hover max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-gray-800 dark:text-white">{product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Name</label>
            <input className="input-field" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Brand</label>
              <input className="input-field" required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <select className="input-field" value={form.categorySlug} onChange={(e) => {
                const cat = categories.find((c) => c.slug === e.target.value);
                setForm({ ...form, categorySlug: e.target.value, category: cat?.name || '' });
              }}>
                <option value="">Select</option>
                {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Price (₹)</label>
              <input type="number" className="input-field" required value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Original Price</label>
              <input type="number" className="input-field" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: +e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Stock</label>
              <input type="number" className="input-field" required value={form.stock} onChange={(e) => setForm({ ...form, stock: +e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Image URL</label>
            <input className="input-field" required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value, images: [e.target.value] })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <textarea className="input-field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isBestSeller} onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })} /> Best Seller</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} /> New</label>
          </div>
          <button type="submit" className="btn-primary w-full">{product ? 'Update' : 'Add'} Product</button>
        </form>
      </div>
    </div>
  );
}
