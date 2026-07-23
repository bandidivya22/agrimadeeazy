import { useState, useEffect } from 'react';
import {
  Wrench, Plus, Edit2, Trash2, CheckCircle, Calendar, Shield,
  Clock, AlertCircle, X, History,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import {
  MaintenanceRecord,
  getMaintenanceRecords, addMaintenanceRecord, updateMaintenanceRecord, deleteMaintenanceRecord,
} from '../utils/agriLogic';
import { formatDate } from '../utils/helpers';

const EMPTY_FORM = {
  toolName: '', purchaseDate: '', lastServiceDate: '', nextServiceDate: '', warrantyExpiry: '', notes: '',
};

function daysUntil(dateStr: string): number {
  if (!dateStr) return Infinity;
  const diff = new Date(dateStr).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function MaintenanceTracker() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setRecords(getMaintenanceRecords());
  }, []);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.toolName.trim()) e.toolName = 'Tool name is required';
    if (!form.purchaseDate) e.purchaseDate = 'Purchase date is required';
    if (!form.nextServiceDate) e.nextServiceDate = 'Next service date is required';
    if (form.purchaseDate && form.nextServiceDate && new Date(form.nextServiceDate) < new Date(form.purchaseDate)) {
      e.nextServiceDate = 'Next service must be after purchase date';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) { showToast('Please fix the errors', 'error'); return; }
    if (editingId) {
      updateMaintenanceRecord(editingId, { ...form });
      showToast('Tool updated successfully', 'success');
    } else {
      addMaintenanceRecord({
        id: `maint-${Date.now()}`,
        ...form,
        history: form.lastServiceDate ? [{ date: form.lastServiceDate, action: 'Initial service recorded' }] : [],
      });
      showToast('Tool added successfully', 'success');
    }
    setRecords(getMaintenanceRecords());
    resetForm();
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (rec: MaintenanceRecord) => {
    setEditingId(rec.id);
    setForm({
      toolName: rec.toolName, purchaseDate: rec.purchaseDate, lastServiceDate: rec.lastServiceDate,
      nextServiceDate: rec.nextServiceDate, warrantyExpiry: rec.warrantyExpiry, notes: rec.notes,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteMaintenanceRecord(id);
    setRecords(getMaintenanceRecords());
    showToast('Tool deleted', 'info');
  };

  const handleMarkServiced = (rec: MaintenanceRecord) => {
    const today = new Date().toISOString().split('T')[0];
    const next = new Date();
    next.setMonth(next.getMonth() + 6);
    updateMaintenanceRecord(rec.id, {
      lastServiceDate: today,
      nextServiceDate: next.toISOString().split('T')[0],
      history: [...(rec.history || []), { date: today, action: 'Marked as serviced' }],
    });
    setRecords(getMaintenanceRecords());
    showToast(`${rec.toolName} marked as serviced`, 'success');
  };

  // Dashboard stats
  const totalTools = records.length;
  const upcoming = records.filter((r) => { const d = daysUntil(r.nextServiceDate); return d >= 0 && d <= 30; });
  const overdue = records.filter((r) => daysUntil(r.nextServiceDate) < 0);
  const warrantyExpiring = records.filter((r) => { const d = daysUntil(r.warrantyExpiry); return d >= 0 && d <= 60; });

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="card p-12">
          <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="font-display text-xl font-bold text-gray-800 dark:text-white mb-2">Tool Maintenance Tracker</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Login to track your tool maintenance, service schedules, and warranty status.</p>
          <Link to="/login" className="btn-primary inline-block">Login to Continue</Link>
        </div>
      </div>
    );
  }

  const fieldClass = (name: string) => `input-field ${errors[name] ? 'border-red-500 ring-1 ring-red-500' : ''}`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <span className="badge bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 px-4 py-1.5">
            <Wrench className="w-3.5 h-3.5 mr-1" /> Maintenance
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mt-3">Tool Maintenance Tracker</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track service schedules, warranty status, and maintenance history.</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Tool
        </button>
      </div>

      {/* Dashboard cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Tools', value: totalTools, icon: Wrench, color: 'primary' },
          { label: 'Upcoming Services', value: upcoming.length, icon: Clock, color: 'amber' },
          { label: 'Overdue Services', value: overdue.length, icon: AlertCircle, color: 'red' },
          { label: 'Warranty Expiring', value: warrantyExpiring.length, icon: Shield, color: 'blue' },
        ].map((s, i) => (
          <div key={i} className="card p-5">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${
              s.color === 'primary' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' :
              s.color === 'amber' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
              s.color === 'red' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
              'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
            }`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in" onClick={resetForm}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card-hover max-w-lg w-full max-h-[85vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-display text-lg font-bold text-gray-800 dark:text-white">{editingId ? 'Edit Tool' : 'Add Tool'}</h2>
              <button onClick={resetForm} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Tool Name *</label>
                <input className={fieldClass('toolName')} value={form.toolName} onChange={(e) => setForm({ ...form, toolName: e.target.value })} placeholder="e.g. Power Tiller 7HP" />
                {errors.toolName && <p className="text-xs text-red-500 mt-1">{errors.toolName}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Purchase Date *</label>
                  <input type="date" className={fieldClass('purchaseDate')} value={form.purchaseDate} onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })} />
                  {errors.purchaseDate && <p className="text-xs text-red-500 mt-1">{errors.purchaseDate}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Last Service Date</label>
                  <input type="date" className={fieldClass('lastServiceDate')} value={form.lastServiceDate} onChange={(e) => setForm({ ...form, lastServiceDate: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Next Service Date *</label>
                  <input type="date" className={fieldClass('nextServiceDate')} value={form.nextServiceDate} onChange={(e) => setForm({ ...form, nextServiceDate: e.target.value })} />
                  {errors.nextServiceDate && <p className="text-xs text-red-500 mt-1">{errors.nextServiceDate}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Warranty Expiry</label>
                  <input type="date" className={fieldClass('warrantyExpiry')} value={form.warrantyExpiry} onChange={(e) => setForm({ ...form, warrantyExpiry: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Notes</label>
                <textarea className={fieldClass('notes')} rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any additional notes..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSubmit} className="btn-primary flex-1">{editingId ? 'Update' : 'Add Tool'}</button>
                <button onClick={resetForm} className="btn-outline">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Records */}
      {records.length === 0 ? (
        <div className="card p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">No tools tracked yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Add your first tool to start tracking maintenance schedules and warranty.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Your First Tool
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Upcoming & overdue section */}
          {(upcoming.length > 0 || overdue.length > 0) && (
            <div className="card p-5">
              <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" /> Needs Attention
              </h2>
              <div className="space-y-3">
                {[...overdue, ...upcoming].map((rec) => {
                  const d = daysUntil(rec.nextServiceDate);
                  const isOverdue = d < 0;
                  return (
                    <div key={rec.id} className={`flex items-center justify-between p-3 rounded-xl ${isOverdue ? 'bg-red-50 dark:bg-red-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isOverdue ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400'}`}>
                          <AlertCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-800 dark:text-gray-100">{rec.toolName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {isOverdue ? `${Math.abs(d)} days overdue` : `Service due in ${d} days`}
                          </p>
                        </div>
                      </div>
                      <button onClick={() => handleMarkServiced(rec)} className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Mark Serviced
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* All records */}
          <div className="card p-5">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">All Tools</h2>
            <div className="space-y-3">
              {records.map((rec) => {
                const serviceDays = daysUntil(rec.nextServiceDate);
                const warrantyDays = daysUntil(rec.warrantyExpiry);
                return (
                  <div key={rec.id} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:shadow-card transition-all">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{rec.toolName}</h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3 text-xs">
                          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                            <Calendar className="w-3.5 h-3.5" /> Purchased: {formatDate(rec.purchaseDate)}
                          </div>
                          <div className={`flex items-center gap-1.5 ${serviceDays < 0 ? 'text-red-500' : serviceDays <= 30 ? 'text-amber-500' : 'text-gray-500 dark:text-gray-400'}`}>
                            <Wrench className="w-3.5 h-3.5" /> Next service: {rec.nextServiceDate ? formatDate(rec.nextServiceDate) : '-'}
                          </div>
                          <div className={`flex items-center gap-1.5 ${warrantyDays < 0 ? 'text-red-500' : warrantyDays <= 60 ? 'text-amber-500' : 'text-gray-500 dark:text-gray-400'}`}>
                            <Shield className="w-3.5 h-3.5" /> Warranty: {rec.warrantyExpiry ? formatDate(rec.warrantyExpiry) : '-'}
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                            <History className="w-3.5 h-3.5" /> Last service: {rec.lastServiceDate ? formatDate(rec.lastServiceDate) : '-'}
                          </div>
                        </div>
                        {rec.notes && <p className="text-xs text-gray-400 mt-2">{rec.notes}</p>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => handleMarkServiced(rec)} className="p-2 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors" title="Mark as serviced">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleEdit(rec)} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(rec.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
