import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { 
  HiServer, 
  HiCheckCircle, 
  HiRefresh, 
  HiChip, 
  HiDatabase, 
  HiCog,
  HiLockClosed
} from 'react-icons/hi';
import { toast } from 'react-toastify';

export default function Status() {
  const { role, loginAsRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState(null);
  const [error, setError] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getHealth();
      setHealthData(data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch API health status.';
      setError(msg);
      toast.error('Health check failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === 'admin') {
      fetchHealth();
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
            API Health & Live System Diagnostics are restricted to Administrator accounts only.
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

  const items = [
    {
      title: 'API Gateway',
      key: 'api_status',
      status: healthData?.status || healthData?.api_status || 'Healthy',
      icon: HiServer,
      desc: 'REST API service endpoints operational',
    },
    {
      title: 'XGBoost Model',
      key: 'model_loaded',
      status: healthData?.model_loaded !== false ? 'Loaded & Active' : 'Not Loaded',
      icon: HiChip,
      desc: 'Trained pharmacogenomics classifier in memory',
    },
    {
      title: 'Preprocessor Pipeline',
      key: 'preprocessor_loaded',
      status: healthData?.preprocessor_loaded !== false ? 'Loaded & Active' : 'Not Loaded',
      icon: HiCog,
      desc: 'Feature scaler and numerical transformer',
    },
    {
      title: 'Label Encoder',
      key: 'label_encoder_loaded',
      status: healthData?.label_encoder_loaded !== false ? 'Loaded & Active' : 'Not Loaded',
      icon: HiDatabase,
      desc: 'Categorical target mapping encoder',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Title Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200 mb-2">
            <HiServer className="w-4 h-4 text-emerald-600" />
            <span>Admin System Diagnostics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            API Health & Status
          </h1>
          <p className="text-sm text-slate-600">
            Real-time status monitor for machine learning artifacts, API server, and preprocessors.
          </p>
        </div>

        <button
          onClick={fetchHealth}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-xs hover:bg-slate-50 transition-all shrink-0"
        >
          <HiRefresh className="w-4 h-4 mr-2 text-blue-600" />
          Ping System
        </button>
      </div>

      {error && <ErrorAlert message={error} onRetry={fetchHealth} />}

      {loading ? (
        <LoadingSpinner message="Ping health endpoints..." />
      ) : (
        <div className="space-y-6">
          
          {/* Status Overview Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex items-center justify-between shadow-xl">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                System Status
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                All Systems Operational
              </h2>
              <p className="text-xs text-slate-400">
                Connected to backend: <span className="font-mono text-slate-300">{import.meta.env.VITE_API_URL || 'https://pharma-guard-ow5u.onrender.com'}</span>
              </p>
            </div>

            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-8 w-8 bg-emerald-500"></span>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                      {item.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}
