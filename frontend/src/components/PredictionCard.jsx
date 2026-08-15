import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';
import { 
  HiExclamationCircle, 
  HiCheckCircle, 
  HiShieldCheck, 
  HiLightBulb, 
  HiClipboardList 
} from 'react-icons/hi';
import { motion } from 'framer-motion';

const RISK_COLORS = {
  Safe: '#10b981',
  Moderate: '#f59e0b',
  High: '#f97316',
  Critical: '#dc2626',
};

export default function PredictionCard({ predictionResult, patientData }) {
  const navigate = useNavigate();

  if (!predictionResult) return null;

  const {
    risk_level = 'Moderate',
    confidence = 0.85,
    prediction_id = 'N/A',
    probabilities = {},
  } = predictionResult;

  const formattedConfidence = (confidence * 100).toFixed(1);

  const chartData = Object.keys(probabilities).length > 0 
    ? Object.entries(probabilities).map(([key, val]) => ({
        class: key,
        probability: parseFloat((val * 100).toFixed(1)),
      }))
    : [
        { class: 'Safe', probability: risk_level === 'Safe' ? 85 : 5 },
        { class: 'Moderate', probability: risk_level === 'Moderate' ? 85 : 10 },
        { class: 'High', probability: risk_level === 'High' ? 85 : 10 },
        { class: 'Critical', probability: risk_level === 'Critical' ? 85 : 5 },
      ];

  const getRiskBadge = (level) => {
    switch (level?.toLowerCase()) {
      case 'critical':
        return 'bg-red-500 text-white shadow-red-500/30';
      case 'high':
        return 'bg-amber-500 text-white shadow-amber-500/30';
      case 'moderate':
        return 'bg-yellow-500 text-white shadow-yellow-500/30';
      case 'safe':
      default:
        return 'bg-emerald-500 text-white shadow-emerald-500/30';
    }
  };

  const handleExplainClick = () => {
    navigate('/explain', {
      state: {
        patientPayload: patientData,
        predictionResult: predictionResult,
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden"
    >
      {/* Header Banner */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            <HiShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Prediction Generated</span>
            <span>•</span>
            <span className="text-slate-300">ID #{prediction_id}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Pharmacogenomic Risk Assessment
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <div className={`px-5 py-2.5 rounded-2xl text-lg font-black tracking-wide shadow-lg ${getRiskBadge(risk_level)}`}>
            {risk_level?.toUpperCase()} RISK
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 sm:p-8 space-y-8">
        
        {/* KPI Metrics row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <div className="p-5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl space-y-1">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Predicted Class</p>
            <div className="flex items-center space-x-2">
              {risk_level === 'Safe' ? (
                <HiCheckCircle className="w-6 h-6 text-emerald-500" />
              ) : (
                <HiExclamationCircle className="w-6 h-6 text-red-500" />
              )}
              <span className="text-2xl font-black text-slate-900 dark:text-white">{risk_level}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Based on XGBoost model evaluation</p>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl space-y-1">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Model Confidence</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-blue-600 dark:text-blue-400">{formattedConfidence}%</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Probability Score</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-2">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${formattedConfidence}%` }}
              ></div>
            </div>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl space-y-1 sm:col-span-2 lg:col-span-1">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Patient Profile</p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {patientData?.patient_name || 'Patient'}, {patientData?.gender}, {patientData?.age} yrs
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gene: <span className="font-semibold text-slate-700 dark:text-slate-300">{patientData?.primary_gene || 'CYP2C19'}</span> ({patientData?.primary_variant})
            </p>
          </div>

        </div>

        {/* Probability Chart Section */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
            <span>Risk Class Probability Distribution</span>
          </h3>

          <div className="h-64 w-full bg-slate-50/50 dark:bg-slate-800/50 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="class" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                <YAxis unit="%" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Probability']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#fff' }}
                />
                <Bar dataKey="probability" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={RISK_COLORS[entry.class] || '#2563eb'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleExplainClick}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-slate-800 dark:hover:bg-blue-700 transition-all"
          >
            <HiLightBulb className="w-5 h-5 mr-2 text-yellow-400" />
            Explain Prediction (SHAP)
          </button>

          <button
            onClick={() => navigate('/history')}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold transition-all border border-slate-200 dark:border-slate-700"
          >
            <HiClipboardList className="w-5 h-5 mr-2 text-slate-500 dark:text-slate-400" />
            View Prediction History
          </button>
        </div>

      </div>
    </motion.div>
  );
}
