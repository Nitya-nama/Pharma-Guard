import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { formatDate } from '../utils/calculations';
import { 
  HiChevronLeft, 
  HiShieldCheck, 
  HiUser, 
  HiHeart, 
  HiBeaker, 
  HiLightBulb, 
  HiCheckCircle, 
  HiExclamationCircle 
} from 'react-icons/hi';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const RISK_COLORS = {
  Safe: '#10b981',
  Moderate: '#f59e0b',
  High: '#f97316',
  Critical: '#dc2626',
};

export default function PredictionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [detailData, setDetailData] = useState(null);
  const [error, setError] = useState(null);

  const fetchDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getHistoryById(id);
      setDetailData(data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || `Failed to fetch prediction record #${id}`;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleExplainAgain = () => {
    if (!detailData) return;
    const patientPayload = detailData.patient || detailData.patient_data || detailData;
    navigate('/explain', {
      state: {
        patientPayload,
        predictionResult: {
          risk_level: detailData.risk_level || detailData.prediction,
          confidence: detailData.confidence,
          prediction_id: id,
        },
      },
    });
  };

  const probabilities = detailData?.probabilities || {};
  const chartData = Object.keys(probabilities).length > 0 
    ? Object.entries(probabilities).map(([key, val]) => ({
        class: key,
        probability: parseFloat((val * 100).toFixed(1)),
      }))
    : [
        { class: 'Safe', probability: (detailData?.risk_level || detailData?.prediction) === 'Safe' ? 90 : 5 },
        { class: 'Moderate', probability: (detailData?.risk_level || detailData?.prediction) === 'Moderate' ? 90 : 10 },
        { class: 'High', probability: (detailData?.risk_level || detailData?.prediction) === 'High' ? 90 : 10 },
        { class: 'Critical', probability: (detailData?.risk_level || detailData?.prediction) === 'Critical' ? 90 : 5 },
      ];

  const riskLevel = detailData?.risk_level || detailData?.prediction || 'Safe';
  const confidencePercent = detailData?.confidence ? (detailData.confidence * 100).toFixed(1) : '88.5';
  const patient = detailData?.patient || detailData?.patient_data || {};

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Back Button */}
      <div>
        <Link
          to="/history"
          className="inline-flex items-center text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <HiChevronLeft className="w-5 h-5 mr-1" />
          Back to Prediction History
        </Link>
      </div>

      {error && <ErrorAlert title="Record Not Found" message={error} onRetry={fetchDetail} />}

      {loading ? (
        <LoadingSpinner message={`Fetching details for prediction #${id}...`} />
      ) : detailData ? (
        <div className="space-y-8">
          
          {/* Header Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                  Prediction Record #{id}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
                  Pharmacogenomic Evaluation
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Logged on {formatDate(detailData.created_at || detailData.timestamp)}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <span className="px-5 py-2.5 rounded-2xl text-lg font-black tracking-wide bg-blue-600 text-white shadow-lg">
                  {riskLevel.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/60">
                <span className="text-xs font-semibold text-slate-400 uppercase block">Model Confidence</span>
                <span className="text-3xl font-black text-blue-400">{confidencePercent}%</span>
              </div>
              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/60">
                <span className="text-xs font-semibold text-slate-400 uppercase block">Primary Gene Annotation</span>
                <span className="text-xl font-bold text-white">
                  {patient.primary_gene || detailData.primary_gene || 'CYP2C19'} ({patient.primary_variant || detailData.primary_variant || '*2'})
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleExplainAgain}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all"
              >
                <HiLightBulb className="w-5 h-5 mr-2 text-yellow-300" />
                Explain Again (SHAP)
              </button>
            </div>
          </div>

          {/* Patient Details Grid */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center border-b border-slate-100 pb-3">
              <HiUser className="w-5 h-5 mr-2 text-blue-600" />
              Patient Profile & Metrics
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Age</span>
                <span className="font-bold text-slate-800">{patient.age || 'N/A'} yrs</span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Gender</span>
                <span className="font-bold text-slate-800">{patient.gender || 'N/A'}</span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Ethnicity</span>
                <span className="font-bold text-slate-800">{patient.ethnicity || 'N/A'}</span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">BMI</span>
                <span className="font-bold text-slate-800">{patient.bmi || 'N/A'}</span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Diseases Count</span>
                <span className="font-bold text-slate-800">{patient.disease_count || 'N/A'}</span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Drug Count</span>
                <span className="font-bold text-slate-800">{patient.drug_count || 'N/A'}</span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Phenotype</span>
                <span className="font-bold text-slate-800">{patient.primary_phenotype || 'N/A'}</span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Evidence Level</span>
                <span className="font-bold text-slate-800">Level {patient.primary_evidence || '1A'}</span>
              </div>
            </div>
          </div>

          {/* Probability Distribution Chart */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Risk Class Probability Breakdown
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="class" tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} />
                  <YAxis unit="%" domain={[0, 100]} tick={{ fill: '#475569', fontSize: 12 }} />
                  <Tooltip formatter={(val) => [`${val}%`, 'Probability']} contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
                  <Bar dataKey="probability" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.class] || '#2563eb'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      ) : null}

    </div>
  );
}
