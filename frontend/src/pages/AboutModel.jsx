import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { 
  HiChip, 
  HiShieldCheck, 
  HiViewGrid, 
  HiLockClosed 
} from 'react-icons/hi';

export default function AboutModel() {
  const { role, loginAsRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [modelInfo, setModelInfo] = useState(null);
  const [error, setError] = useState(null);

  const fetchModelInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getModelInfo();
      setModelInfo(data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch model info.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === 'admin') {
      fetchModelInfo();
    }
  }, [role]);

  if (role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center mx-auto shadow-md">
          <HiLockClosed className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Admin Privileges Required</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Model Specifications & Architecture details are restricted to Administrator accounts only.
          </p>
        </div>
        <button
          onClick={() => loginAsRole('admin')}
          className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-500/25 transition-all"
        >
          Switch to Admin Role 🛡️
        </button>
      </div>
    );
  }

  const info = modelInfo || {
    model_name: 'PharmaGuard Risk Classifier',
    algorithm: 'XGBoost (Extreme Gradient Boosting)',
    version: '1.0.0',
    feature_count: 24,
    risk_classes: ['Safe', 'Moderate', 'High', 'Critical'],
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Title */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-200">
          <HiChip className="w-4 h-4 text-blue-600" />
          <span>Admin Machine Learning Specifications</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About Model Architecture
        </h1>
        <p className="text-sm text-slate-600">
          Technical specifications of the deployed XGBoost predictive model and feature engineering pipeline.
        </p>
      </div>

      {error && <ErrorAlert message={error} onRetry={fetchModelInfo} />}

      {loading ? (
        <LoadingSpinner message="Fetching model metadata from backend..." />
      ) : (
        <div className="space-y-8">
          
          {/* Header Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div className="flex items-center space-x-4">
                <div className="p-3.5 bg-blue-600 rounded-2xl shadow-lg">
                  <HiChip className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">
                    {info.model_name || info.name || 'PharmaGuard XGBoost Model'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Algorithm: <span className="text-blue-400 font-semibold">{info.algorithm || 'XGBoost'}</span>
                  </p>
                </div>
              </div>

              <span className="px-4 py-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 rounded-full text-xs font-bold shrink-0">
                v{info.version || '1.0.0'} Production
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/60">
                <span className="text-xs font-semibold text-slate-400 uppercase block">Total Features</span>
                <span className="text-3xl font-black text-blue-400">{info.feature_count || info.n_features || 24}</span>
              </div>

              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/60">
                <span className="text-xs font-semibold text-slate-400 uppercase block">Target Classes</span>
                <span className="text-3xl font-black text-emerald-400">{info.risk_classes?.length || 4}</span>
              </div>

              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/60 col-span-2 sm:col-span-1">
                <span className="text-xs font-semibold text-slate-400 uppercase block">Explainability</span>
                <span className="text-xl font-bold text-yellow-400">SHAP Tree Explainer</span>
              </div>
            </div>
          </div>

          {/* Risk Classes Grid */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center">
              <HiShieldCheck className="w-5 h-5 mr-2 text-blue-600" />
              Risk Stratification Classes
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Safe', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', desc: 'Standard metabolizer, minimal ADR risk.' },
                { name: 'Moderate', color: 'bg-yellow-50 text-yellow-800 border-yellow-200', desc: 'Slightly altered metabolism, standard dosing watch.' },
                { name: 'High', color: 'bg-amber-50 text-amber-700 border-amber-200', desc: 'Impaired metabolism, alternative drug consideration.' },
                { name: 'Critical', color: 'bg-red-50 text-red-700 border-red-200', desc: 'Severe adverse risk or toxicity, immediate clinical review.' },
              ].map((c) => (
                <div key={c.name} className={`p-4 rounded-xl border ${c.color} space-y-1`}>
                  <h4 className="text-base font-extrabold">{c.name}</h4>
                  <p className="text-xs opacity-90 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
