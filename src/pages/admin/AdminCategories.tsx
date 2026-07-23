import { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { categories as initialCats, Category } from '../../data/categories';
import { useToast } from '../../context/ToastContext';

export default function AdminCategories() {
  const { showToast } = useToast();
  const [cats, setCats] = useState<Category[]>(initialCats);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const handleDelete = (id: string) => {
    setCats(cats.filter((c) => c.id !== id));
    showToast('Category deleted', 'success');
  };

  const handleSave = (cat: Category) => {
    if (editing) {
      setCats(cats.map((c) => (c.id === cat.id ? cat : c)));
      showToast('Category updated', 'success');
    } else {
      setCats([...cats, { ...cat, id: `cat-${Date.now()}` }]);
      showToast('Category added', 'success');
    }
    setShowModal(false);
    setEditing(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800 dark:text-white">Category Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{cats.length} categories</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cats.map((cat) => (
          <div key={cat.id} className="card p-5">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">{cat.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{cat.description}</p>
                <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mt-1">{cat.productCount} products</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button onClick={() => { setEditing(cat); setShowModal(true); }} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200">
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={() => handleDelete(cat.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm bg-red-50 dark:bg-red-900/20 hover:bg-red-100 text-red-600">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && <CategoryModal category={editing} onSave={handleSave} onClose={() => { setShowModal(false); setEditing(null); }} />}
    </div>
  );
}

function CategoryModal({ category, onSave, onClose }: { category: Category | null; onSave: (c: Category) => void; onClose: () => void }) {
  const [form, setForm] = useState<Category>(category || {
    id: '', name: '', slug: '', icon: 'Package', image: '', description: '', productCount: 0,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-card-hover max-w-md w-full p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-gray-800 dark:text-white">{category ? 'Edit Category' : 'Add Category'}</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Name</label>
            <input className="input-field" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <input className="input-field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Image URL</label>
            <input className="input-field" required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary w-full">{category ? 'Update' : 'Add'} Category</button>
        </form>
      </div>
    </div>
  );
}
