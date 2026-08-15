import React from 'react';
import { HiTrendingUp, HiTrendingDown, HiSparkles } from 'react-icons/hi';

export default function SHAPCard({ feature, shapValue, importance, effect, impact }) {
  const isPositive = (shapValue || 0) > 0 || effect?.toLowerCase().includes('increase');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Clinical Feature
          </span>
          <h4 className="text-lg font-bold text-slate-900 capitalize">
            {feature ? feature.replace(/_/g, ' ') : 'Feature'}
          </h4>
        </div>
        
        <div className={`p-2 rounded-xl text-sm font-bold flex items-center space-x-1 ${
          isPositive 
            ? 'bg-red-50 text-red-600 border border-red-200' 
            : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
        }`}>
          {isPositive ? (
            <>
              <HiTrendingUp className="w-4 h-4 mr-1" />
              <span>+Risk</span>
            </>
          ) : (
            <>
              <HiTrendingDown className="w-4 h-4 mr-1" />
              <span>-Risk</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs py-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
        <div>
          <span className="text-slate-400 font-semibold block">SHAP Value</span>
          <span className="text-slate-800 font-bold text-sm">
            {shapValue !== undefined ? Number(shapValue).toFixed(4) : 'N/A'}
          </span>
        </div>
        <div>
          <span className="text-slate-400 font-semibold block">Relative Importance</span>
          <span className="text-slate-800 font-bold text-sm">
            {importance !== undefined ? `${(Number(importance) * 100).toFixed(1)}%` : 'High'}
          </span>
        </div>
      </div>

      {impact && (
        <p className="text-xs text-slate-600 leading-relaxed italic">
          "{impact}"
        </p>
      )}
    </div>
  );
}
