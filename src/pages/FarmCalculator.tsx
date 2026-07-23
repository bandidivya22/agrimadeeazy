import { useState, useMemo } from 'react';
import {
  Calculator, TrendingDown, TrendingUp, Clock, DollarSign, Download,
  Save, RotateCcw, Trash2, Wheat,
} from 'lucide-react';
import { products } from '../data/products';
import { formatPrice } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { saveCalcHistory, getCalcHistory, CalcHistoryEntry } from '../utils/agriLogic';

interface CalcForm {
  farmSize: string;
  workers: string;
  labourCost: string;
  workingDays: string;
  toolId: string;
}

const EMPTY_FORM: CalcForm = { farmSize: '', workers: '', labourCost: '', workingDays: '', toolId: '' };

interface CalcResult {
  manualCost: number;
  toolCost: number;
  moneySaved: number;
  timeSavedPct: number;
  roi: number;
  breakEvenMonths: number;
}

export default function FarmCalculator() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState<CalcForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof CalcForm, string>>>({});
  const [result, setResult] = useState<CalcResult | null>(null);
  const [history, setHistory] = useState<CalcHistoryEntry[]>(() => getCalcHistory());

  const selectedTool = products.find((p) => p.id === form.toolId);

  const validate = (): boolean => {
    const e: Partial<Record<keyof CalcForm, string>> = {};
    if (!form.farmSize || parseFloat(form.farmSize) <= 0) e.farmSize = 'Enter a valid farm size';
    if (!form.workers || parseInt(form.workers) <= 0) e.workers = 'Enter number of workers';
    if (!form.labourCost || parseFloat(form.labourCost) < 0) e.labourCost = 'Enter daily labour cost';
    if (!form.workingDays || parseInt(form.workingDays) <= 0) e.workingDays = 'Enter working days';
    if (!form.toolId) e.toolId = 'Select a tool';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const calculate = useMemo(() => {
    return (): CalcResult | null => {
      const farmSize = parseFloat(form.farmSize);
      const workers = parseInt(form.workers);
      const labourCost = parseFloat(form.labourCost);
      const workingDays = parseInt(form.workingDays);
      const tool = products.find((p) => p.id === form.toolId);
      if (!tool || !farmSize || !workers || !labourCost || !workingDays) return null;

      const manualCost = workers * labourCost * workingDays;
      const toolCostPerDay = tool.price / 365;
      const toolOperatingCost = toolCostPerDay * workingDays;
      const toolLabourCost = Math.max(1, Math.ceil(workers / 4)) * labourCost * workingDays;
      const totalToolCost = toolOperatingCost + toolLabourCost;
      const moneySaved = Math.max(0, manualCost - totalToolCost);
      const timeSavedPct = Math.min(80, Math.round(60 + (farmSize / 10) * 5));
      const annualSavings = moneySaved * 2;
      const roi = tool.price > 0 ? Math.round((annualSavings / tool.price) * 100) : 0;
      const breakEvenMonths = annualSavings > 0 ? Math.ceil(tool.price / (annualSavings / 12)) : 0;

      return { manualCost, toolCost: totalToolCost, moneySaved, timeSavedPct, roi, breakEvenMonths };
    };
  }, [form]);

  const handleCalculate = () => {
    if (!validate()) { showToast('Please fix the errors before calculating', 'error'); return; }
    const res = calculate();
    if (res) {
      setResult(res);
      showToast('Calculation complete!', 'success');
    }
  };

  const handleSave = () => {
    if (!user) { showToast('Login to save calculation history', 'info'); return; }
    if (!result || !selectedTool) return;
    const entry: CalcHistoryEntry = {
      id: `calc-${Date.now()}`,
      date: new Date().toISOString(),
      farmSize: parseFloat(form.farmSize),
      workers: parseInt(form.workers),
      labourCost: parseFloat(form.labourCost),
      workingDays: parseInt(form.workingDays),
      toolName: selectedTool.name,
      toolPrice: selectedTool.price,
      manualCost: result.manualCost,
      toolCost: result.toolCost,
      moneySaved: result.moneySaved,
      timeSaved: result.timeSavedPct,
      roi: result.roi,
      breakEvenMonths: result.breakEvenMonths,
    };
    saveCalcHistory(entry);
    setHistory(getCalcHistory());
    showToast('Calculation saved!', 'success');
  };

  const handleDownloadPDF = () => {
    if (!result || !selectedTool) return;
    const win = window.open('', '_blank');
    if (!win) { showToast('Please allow popups to download the report', 'error'); return; }
    win.document.write(`
      <html><head><title>Farm Cost & Savings Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #1a1a1a; }
        h1 { color: #15803d; } h2 { color: #166534; border-bottom: 2px solid #22c55e; padding-bottom: 6px; }
        .stat { display: inline-block; margin: 10px 20px 10px 0; }
        .stat-label { font-size: 12px; color: #666; } .stat-value { font-size: 22px; font-weight: bold; color: #15803d; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        td, th { padding: 10px; border: 1px solid #ddd; text-align: left; }
        th { background: #f0fdf4; } .header { text-align: center; }
      </style></head><body>
      <div class="header"><h1>AgriMadeEazy - Farm Cost & Savings Report</h1>
      <p>Generated on ${new Date().toLocaleString('en-IN')}</p></div>
      <h2>Input Details</h2>
      <table><tr><th>Farm Size</th><td>${form.farmSize} acres</td></tr>
      <tr><th>Workers</th><td>${form.workers}</td></tr>
      <tr><th>Daily Labour Cost</th><td>${formatPrice(parseFloat(form.labourCost))}</td></tr>
      <tr><th>Working Days</th><td>${form.workingDays}</td></tr>
      <tr><th>Selected Tool</th><td>${selectedTool.name} (${formatPrice(selectedTool.price)})</td></tr></table>
      <h2>Results</h2>
      <div class="stat"><div class="stat-label">Manual Labour Cost</div><div class="stat-value">${formatPrice(result.manualCost)}</div></div>
      <div class="stat"><div class="stat-label">Cost Using Tool</div><div class="stat-value">${formatPrice(result.toolCost)}</div></div>
      <div class="stat"><div class="stat-label">Money Saved</div><div class="stat-value">${formatPrice(result.moneySaved)}</div></div>
      <div class="stat"><div class="stat-label">Time Saved</div><div class="stat-value">${result.timeSavedPct}%</div></div>
      <div class="stat"><div class="stat-label">ROI</div><div class="stat-value">${result.roi}%</div></div>
      <div class="stat"><div class="stat-label">Break-even</div><div class="stat-value">${result.breakEvenMonths} months</div></div>
      </body></html>
    `);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setResult(null);
    setErrors({});
  };

  const clearHistory = () => {
    localStorage.removeItem('agrimadeeazy-calc-history');
    setHistory([]);
    showToast('History cleared', 'info');
  };

  const fieldClass = (name: keyof CalcForm) =>
    `input-field ${errors[name] ? 'border-red-500 ring-1 ring-red-500' : ''}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <span className="badge bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 px-4 py-1.5">
          <Calculator className="w-3.5 h-3.5 mr-1" /> Calculator
        </span>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mt-3">Farm Cost & Savings Calculator</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl mx-auto">
          Compare manual labour costs against using a tool. See your savings, ROI, and break-even estimate.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input form */}
        <div className="card p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-gray-800 dark:text-white">Enter Your Details</h2>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Farm Size (acres) *</label>
            <input type="number" min="0" step="0.1" className={fieldClass('farmSize')} value={form.farmSize}
              onChange={(e) => setForm({ ...form, farmSize: e.target.value })} placeholder="e.g. 5" />
            {errors.farmSize && <p className="text-xs text-red-500 mt-1">{errors.farmSize}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Number of Workers *</label>
              <input type="number" min="0" className={fieldClass('workers')} value={form.workers}
                onChange={(e) => setForm({ ...form, workers: e.target.value })} placeholder="e.g. 4" />
              {errors.workers && <p className="text-xs text-red-500 mt-1">{errors.workers}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Daily Labour Cost (₹) *</label>
              <input type="number" min="0" className={fieldClass('labourCost')} value={form.labourCost}
                onChange={(e) => setForm({ ...form, labourCost: e.target.value })} placeholder="e.g. 400" />
              {errors.labourCost && <p className="text-xs text-red-500 mt-1">{errors.labourCost}</p>}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Working Days *</label>
            <input type="number" min="0" className={fieldClass('workingDays')} value={form.workingDays}
              onChange={(e) => setForm({ ...form, workingDays: e.target.value })} placeholder="e.g. 30" />
            {errors.workingDays && <p className="text-xs text-red-500 mt-1">{errors.workingDays}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Select Agricultural Tool *</label>
            <select className={fieldClass('toolId')} value={form.toolId}
              onChange={(e) => setForm({ ...form, toolId: e.target.value })}>
              <option value="">Choose a tool...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — {formatPrice(p.price)}</option>
              ))}
            </select>
            {errors.toolId && <p className="text-xs text-red-500 mt-1">{errors.toolId}</p>}
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleCalculate} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Calculator className="w-4 h-4" /> Calculate
            </button>
            <button onClick={handleReset} className="btn-outline flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {result ? (
            <>
              <div className="card p-6">
                <h2 className="font-display text-lg font-bold text-gray-800 dark:text-white mb-4">Results</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 text-gray-400" /><span className="text-xs text-gray-500 dark:text-gray-400">Manual Labour Cost</span></div>
                    <p className="text-xl font-bold text-gray-800 dark:text-white">{formatPrice(result.manualCost)}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1"><Wheat className="w-4 h-4 text-primary-500" /><span className="text-xs text-gray-500 dark:text-gray-400">Cost Using Tool</span></div>
                    <p className="text-xl font-bold text-gray-800 dark:text-white">{formatPrice(result.toolCost)}</p>
                  </div>
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1"><TrendingDown className="w-4 h-4 text-primary-600" /><span className="text-xs text-primary-700 dark:text-primary-400">Money Saved</span></div>
                    <p className="text-xl font-bold text-primary-700 dark:text-primary-400">{formatPrice(result.moneySaved)}</p>
                  </div>
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1"><Clock className="w-4 h-4 text-primary-600" /><span className="text-xs text-primary-700 dark:text-primary-400">Time Saved</span></div>
                    <p className="text-xl font-bold text-primary-700 dark:text-primary-400">{result.timeSavedPct}%</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-green-600" /><span className="text-xs text-green-700 dark:text-green-400">ROI</span></div>
                    <p className="text-xl font-bold text-green-700 dark:text-green-400">{result.roi}%</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1"><Clock className="w-4 h-4 text-green-600" /><span className="text-xs text-green-700 dark:text-green-400">Break-even</span></div>
                    <p className="text-xl font-bold text-green-700 dark:text-green-400">{result.breakEvenMonths} months</p>
                  </div>
                </div>
                {/* Savings bar chart */}
                <div className="mt-5">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Cost Comparison</p>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1"><span className="text-gray-600 dark:text-gray-300">Manual</span><span className="font-semibold">{formatPrice(result.manualCost)}</span></div>
                      <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"><div className="h-full bg-gray-400 rounded-full" style={{ width: '100%' }} /></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1"><span className="text-primary-600 dark:text-primary-400">With Tool</span><span className="font-semibold">{formatPrice(result.toolCost)}</span></div>
                      <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div className="h-full bg-gradient-primary rounded-full" style={{ width: `${Math.min(100, (result.toolCost / result.manualCost) * 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={handleDownloadPDF} className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm">
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                  <button onClick={handleSave} className="btn-outline flex items-center gap-2 text-sm">
                    <Save className="w-4 h-4" /> Save
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">No calculation yet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Fill in the form and click Calculate to see your savings.</p>
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100">Calculation History</h3>
                <button onClick={clearHistory} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {history.slice(0, 5).map((h) => (
                  <div key={h.id} className="flex items-center justify-between text-xs py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-100">{h.toolName}</p>
                      <p className="text-gray-400">{new Date(h.date).toLocaleDateString('en-IN')} • {h.farmSize} acres</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary-600 dark:text-primary-400">Saved {formatPrice(h.moneySaved)}</p>
                      <p className="text-gray-400">ROI {h.roi}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
