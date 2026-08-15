import React from 'react';
import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi';

export default function SHAPCard({ feature, shapValue, importance, effect, impact }) {
  const isPositive = (shapValue || 0) > 0 || effect?.toLowerCase().includes('increase');

  const formattedShap = shapValue !== undefined && !isNaN(Number(shapValue)) 
    ? Number(shapValue).toFixed(4) 
    : 'N/A';

  const formattedImportance = importance !== undefined && !isNaN(Number(importance))
    ? `${(Number(importance) * 100).toFixed(1)}%`
    : shapValue !== undefined && !isNaN(Number(shapValue))
    ? `${Math.min(Math.abs(Number(shapValue)) * 15, 98).toFixed(1)}%`
    : 'High';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Clinical Feature
          </span>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white capitalize">
            {feature ? feature.replace(/_/g, ' ') : 'Feature'}
          </h4>
        </div>
        
        <div className={`p-2 rounded-xl text-xs font-extrabold flex items-center space-x-1 border ${
          isPositive 
            ? 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900' 
            : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900'
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

      <div className="grid grid-cols-2 gap-2 text-xs py-1 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/80">
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-semibold block">SHAP Value</span>
          <span className="text-slate-900 dark:text-white font-black text-sm font-mono">
            {formattedShap}
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 font-semibold block">Relative Impact</span>
          <span className="text-slate-900 dark:text-white font-black text-sm font-mono">
            {formattedImportance}
          </span>
        </div>
      </div>

      {impact && (
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
          "{impact}"
        </p>
      )}
    </div>
  );
}
