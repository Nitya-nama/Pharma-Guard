import React, { useState } from 'react';
import PredictionForm from '../components/PredictionForm';
import PredictionCard from '../components/PredictionCard';
import ErrorAlert from '../components/ErrorAlert';
import { api } from '../api/api';
import { toast } from 'react-toastify';
import { HiShieldCheck, HiSparkles } from 'react-icons/hi';

export default function Predict() {
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState(null);

  const handlePredictSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setPatientData(formData);

    try {
      const data = await api.predict(formData);
      setPredictionResult(data);
      toast.success(`Prediction complete! Risk Level: ${data.risk_level}`, {
        position: 'top-right',
        autoClose: 4000,
      });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Prediction failed. Please try again.';
      setError(msg);
      toast.error(`Error: ${msg}`, { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Page Title */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-200">
          <HiSparkles className="w-4 h-4 text-blue-600" />
          <span>Patient Risk Inference Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Pharmacogenomic Risk Prediction
        </h1>
        <p className="text-sm text-slate-600">
          Enter clinical demographics, lifestyle, disease profile, and gene variant details to generate real-time risk scores.
        </p>
      </div>

      {error && (
        <ErrorAlert
          title="Prediction Error"
          message={typeof error === 'object' ? JSON.stringify(error) : error}
          onRetry={() => setError(null)}
        />
      )}

      {/* Form & Results Container */}
      <div className="space-y-8">
        <PredictionForm onSubmit={handlePredictSubmit} isLoading={loading} />

        {predictionResult && (
          <div className="pt-4">
            <PredictionCard
              predictionResult={predictionResult}
              patientData={patientData}
            />
          </div>
        )}
      </div>

    </div>
  );
}
