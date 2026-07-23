import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, ArrowRight, ArrowLeft, RotateCcw, GitCompare, X,
  Maximize, Sprout, Wallet, Wrench, Zap, CheckCircle, Clock,
} from 'lucide-react';
import {
  recommendProducts, saveRecoHistory,
  FARM_SIZE_OPTIONS, CROP_TYPE_OPTIONS, BUDGET_OPTIONS, ACTIVITY_OPTIONS, POWER_SOURCE_OPTIONS,
  FarmSize, CropType, BudgetRange, FarmActivity, PowerSource,
  WizardAnswers, RecommendedProduct,
} from '../utils/agriLogic';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/helpers';
import RecommendationCard from '../components/RecommendationCard';

const STEPS = [
  { id: 'farmSize', title: 'Farm Size', icon: Maximize, options: FARM_SIZE_OPTIONS },
  { id: 'cropType', title: 'Crop Type', icon: Sprout, options: CROP_TYPE_OPTIONS },
  { id: 'budget', title: 'Budget', icon: Wallet, options: BUDGET_OPTIONS },
  { id: 'activity', title: 'Farming Activity', icon: Wrench, options: ACTIVITY_OPTIONS },
  { id: 'powerSource', title: 'Power Source', icon: Zap, options: POWER_SOURCE_OPTIONS },
] as const;

export default function RecommendTools() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<WizardAnswers>({
    farmSize: null, cropType: null, budget: null, activity: null, powerSource: null,
  });
  const [results, setResults] = useState<RecommendedProduct[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const currentStep = STEPS[stepIdx];
  const isLastStep = stepIdx === STEPS.length - 1;
  const progressPct = ((stepIdx + 1) / STEPS.length) * 100;

  const selectAnswer = (stepId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [stepId]: value }));
  };

  const handleNext = () => {
    const stepKey = currentStep.id as keyof WizardAnswers;
    if (!answers[stepKey]) {
      showToast('Please select an option to continue', 'error');
      return;
    }
    if (isLastStep) {
      setLoading(true);
      setTimeout(() => {
        const recs = recommendProducts(answers);
        setResults(recs);
        if (user && recs.length > 0) {
          saveRecoHistory({
            id: `reco-${Date.now()}`,
            date: new Date().toISOString(),
            answers,
            recommendations: recs.map((r) => ({
              productId: r.product.id, productName: r.product.name, matchScore: r.matchScore,
            })),
          });
        }
        setLoading(false);
        showToast(`${recs.length} tools recommended for you!`, 'success');
      }, 800);
    } else {
      setStepIdx((i) => i + 1);
    }
  };

  const handleBack = () => {
    if (stepIdx > 0) setStepIdx((i) => i - 1);
  };

  const handleRestart = () => {
    setStepIdx(0);
    setAnswers({ farmSize: null, cropType: null, budget: null, activity: null, powerSource: null });
    setResults(null);
    setCompareList([]);
    setShowCompare(false);
  };

  const toggleCompare = (productId: string) => {
    setCompareList((prev) => {
      if (prev.includes(productId)) return prev.filter((id) => id !== productId);
      if (prev.length >= 3) { showToast('You can compare up to 3 products', 'info'); return prev; }
      return [...prev, productId];
    });
  };

  const compareProducts = results?.filter((r) => compareList.includes(r.product.id)) ?? [];

  // ── Results view ─────────────────────────────────────────────────
  if (results) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
        <div className="text-center mb-8">
          <span className="badge bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 px-4 py-1.5">
            <Sparkles className="w-3.5 h-3.5 mr-1" /> Recommendations
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mt-3">Recommended Tools for Your Farm</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Based on your inputs, here are the best-matching products</p>
        </div>

        {/* Summary chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {Object.entries(answers).map(([key, val]) => {
            if (!val) return null;
            const option = STEPS.find((s) => s.id === key)?.options.find((o) => o.value === val);
            return (
              <span key={key} className="badge bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1">
                {option?.label}
              </span>
            );
          })}
        </div>

        {results.length === 0 ? (
          <div className="card p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
              <Sprout className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">No matching products found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Try adjusting your answers for better recommendations.</p>
            <button onClick={handleRestart} className="btn-primary inline-flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Start Over
            </button>
          </div>
        ) : (
          <>
            {/* Action bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">{results.length} products recommended</p>
              <div className="flex items-center gap-2">
                {compareList.length > 0 && (
                  <button onClick={() => setShowCompare(true)} className="btn-outline flex items-center gap-2 text-sm">
                    <GitCompare className="w-4 h-4" /> Compare ({compareList.length})
                  </button>
                )}
                <button onClick={handleRestart} className="btn-outline flex items-center gap-2 text-sm">
                  <RotateCcw className="w-4 h-4" /> Start Over
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {results.map((rec) => (
                <div key={rec.product.id} className="relative">
                  <RecommendationCard product={rec.product} reason={rec.reason} matchScore={rec.matchScore} />
                  <button
                    onClick={() => toggleCompare(rec.product.id)}
                    className={`absolute top-3 right-20 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      compareList.includes(rec.product.id)
                        ? 'bg-primary-600 text-white'
                        : 'bg-white/80 dark:bg-gray-800/80 text-gray-500 hover:bg-white'
                    }`}
                    title="Compare"
                  >
                    <GitCompare className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Compare modal */}
        {showCompare && compareProducts.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in" onClick={() => setShowCompare(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card-hover max-w-4xl w-full max-h-[85vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
                <h2 className="font-display text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <GitCompare className="w-5 h-5 text-primary-600" /> Compare Products
                </h2>
                <button onClick={() => setShowCompare(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 pr-4 font-semibold text-gray-600 dark:text-gray-300">Attribute</th>
                      {compareProducts.map((p) => (
                        <th key={p.product.id} className="text-left py-3 px-4 font-semibold text-gray-800 dark:text-gray-100 min-w-[160px]">
                          <img src={p.product.image} alt={p.product.name} className="w-16 h-16 rounded-lg object-cover mb-2" />
                          {p.product.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {[
                      { label: 'Price', get: (p: typeof compareProducts[0]) => formatPrice(p.product.price) },
                      { label: 'Rating', get: (p: typeof compareProducts[0]) => `${p.product.rating} (${p.product.reviewCount})` },
                      { label: 'Brand', get: (p: typeof compareProducts[0]) => p.product.brand },
                      { label: 'Category', get: (p: typeof compareProducts[0]) => p.product.category },
                      { label: 'Match Score', get: (p: typeof compareProducts[0]) => `${Math.min(100, Math.round((p.matchScore / 100) * 100))}%` },
                      { label: 'Reason', get: (p: typeof compareProducts[0]) => p.reason },
                      { label: 'Stock', get: (p: typeof compareProducts[0]) => `${p.product.stock} units` },
                    ].map((row) => (
                      <tr key={row.label}>
                        <td className="py-3 pr-4 font-medium text-gray-500 dark:text-gray-400">{row.label}</td>
                        {compareProducts.map((p) => (
                          <td key={p.product.id} className="py-3 px-4 text-gray-800 dark:text-gray-200">{row.get(p)}</td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <td className="py-3 pr-4 font-medium text-gray-500 dark:text-gray-400">Actions</td>
                      {compareProducts.map((p) => (
                        <td key={p.product.id} className="py-3 px-4">
                          <Link to={`/product/${p.product.slug}`} className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">View Product</Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Wizard view ──────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <span className="badge bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 px-4 py-1.5">
          <Sparkles className="w-3.5 h-3.5 mr-1" /> Smart Wizard
        </span>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mt-3">Tool Recommendation Wizard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl mx-auto">
          Answer a few questions about your farm and we'll recommend the best tools from our catalog.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Step {stepIdx + 1} of {STEPS.length}</span>
          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">{Math.round(progressPct)}%</span>
        </div>
        <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div className="h-full bg-gradient-primary rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* Step content */}
      <div className="card p-6 md:p-8 animate-fade-in" key={stepIdx}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
            <currentStep.icon className="w-6 h-6 text-primary-700 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-gray-800 dark:text-white">{currentStep.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Select your {currentStep.title.toLowerCase()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentStep.options.map((opt) => {
            const selected = answers[currentStep.id as keyof WizardAnswers] === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => selectAnswer(currentStep.id, opt.value)}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                  selected
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                }`}
              >
                <span className={`text-sm font-medium ${selected ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-200'}`}>
                  {opt.label}
                </span>
                {selected && <CheckCircle className="w-5 h-5 text-primary-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button onClick={handleBack} disabled={stepIdx === 0} className="btn-outline flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={handleNext} disabled={loading} className="btn-primary flex items-center gap-2">
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Finding tools...</>
          ) : isLastStep ? (
            <>Get Recommendations <Sparkles className="w-4 h-4" /></>
          ) : (
            <>Next <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </div>

      {!user && (
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4 flex items-center justify-center gap-1">
          <Clock className="w-3 h-3" /> <Link to="/login" className="text-primary-600 dark:text-primary-400 underline">Login</Link> to save your recommendation history
        </p>
      )}
    </div>
  );
}
