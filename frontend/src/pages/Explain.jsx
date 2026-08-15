import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../api/api';
import SHAPCard from '../components/SHAPCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { HiLightBulb, HiSparkles, HiInformationCircle } from 'react-icons/hi';
import { toast } from 'react-toastify';

const DEFAULT_PATIENT = {
  age: 67,
  gender: 'Male',
  ethnicity: 'Asian',
  height_cm: 171,
  weight_kg: 81,
  bmi: 27.7,
  smoking_status: 'Former',
  alcohol_consumption: 'Occasional',
  physical_activity: 'Low',
  diabetes: true,
  hypertension: true,
  kidney_disease: true,
  liver_disease: false,
  heart_disease: true,
  disease_count: 4,
  drug_count: 5,
  gene_count: 5,
  variant_count: 5,
  primary_gene: 'CYP2C19',
  primary_variant: 'CYP2C19*2',
  primary_phenotype: 'Poor Metabolizer',
  primary_evidence: '1A',
  multimorbidity: 1,
  high_risk_disease: 2,
  strong_pgx: 1,
};

const PIE_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function Explain() {
  const location = useLocation();
  const passedPayload = location.state?.patientPayload || DEFAULT_PATIENT;

  const [loading, setLoading] = useState(false);
  const [explainData, setExplainData] = useState(null);
  const [error, setError] = useState(null);

  const fetchExplanation = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.explain(payload);
      setExplainData(data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch SHAP explanation.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExplanation(passedPayload);
  }, []);

  // Format data for Horizontal Bar Chart (SHAP values)
  const barChartData = explainData?.top_features ? explainData.top_features.map((f) => ({
    feature: f.feature ? f.feature.replace(/_/g, ' ') : 'Feature',
    shap: parseFloat(Number(f.shap_value || f.shap || 0).toFixed(4)),
  })) : [];

  // Format data for Pie Chart (Importance distribution)
  const pieChartData = explainData?.top_features ? explainData.top_features.map((f) => ({
    name: f.feature ? f.feature.replace(/_/g, ' ') : 'Feature',
    value: parseFloat(Number((f.importance || Math.abs(f.shap_value || 0.1)) * 100).toFixed(1)),
  })) : [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      
      {/* Title */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold border border-amber-200">
          <HiLightBulb className="w-4 h-4 text-amber-600" />
          <span>SHAP (SHapley Additive exPlanations)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Prediction Explainability
        </h1>
        <p className="text-sm text-slate-600">
          Deconstruct model output features to understand individual clinical and genomic risk drivers.
        </p>
      </div>

      {error && (
        <ErrorAlert
          title="Explainability Error"
          message={error}
          onRetry={() => fetchExplanation(passedPayload)}
        />
      )}

      {loading ? (
        <LoadingSpinner message="Calculating SHAP feature impact values..." />
      ) : explainData ? (
        <div className="space-y-8">
          
          {/* Summary Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-blue-600 rounded-xl">
                  <HiSparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Model Decision Summary</h3>
                  <p className="text-xs text-slate-400">Natural Language SHAP Synthesis</p>
                </div>
              </div>
              <span className="px-4 py-1.5 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-full text-xs font-bold">
                {explainData.prediction?.toUpperCase()} ({((explainData.confidence || 0.8) * 100).toFixed(1)}% Confidence)
              </span>
            </div>

            <p className="text-base text-slate-200 leading-relaxed font-medium">
              "{explainData.summary || 'Summary unavailable.'}"
            </p>
          </div>

          {/* Top Features Cards Grid */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 flex items-center">
              <span>Top Clinical & Genetic Risk Factors</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {explainData.top_features?.map((f, idx) => (
                <SHAPCard
                  key={idx}
                  feature={f.feature}
                  shapValue={f.shap_value}
                  importance={f.importance}
                  effect={f.effect}
                  impact={f.impact}
                />
              ))}
            </div>
          </div>

          {/* Visual Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
            
            {/* SHAP Horizontal Bar Chart */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-base font-bold text-slate-900">
                SHAP Impact Values (Feature Magnitude)
              </h4>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    layout="vertical" 
                    data={barChartData} 
                    margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
                  >
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="feature" type="category" tick={{ fontSize: 11, fontWeight: 600 }} width={110} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
                    <Bar dataKey="shap" radius={[0, 8, 8, 0]}>
                      {barChartData.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.shap > 0 ? '#ef4444' : '#10b981'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Importance Pie Chart */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-base font-bold text-slate-900">
                Feature Importance Relative Share (%)
              </h4>
              <div className="h-72 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={95}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`pie-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      ) : null}

    </div>
  );
}
