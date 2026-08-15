import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { calculateBMI, derivePatientMetrics } from '../utils/calculations';
import { 
  HiUser, 
  HiHeart, 
  HiBeaker, 
  HiSparkles, 
  HiShieldCheck, 
  HiSearch, 
  HiChevronRight, 
  HiChevronLeft,
  HiPhone,
  HiIdentification
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const GENE_OPTIONS = ['CYP2C19', 'CYP2D6', 'CYP2C9', 'VKORC1', 'SLCO1B1', 'TPMT', 'DPYD', 'UGT1A1'];
const PHENOTYPE_OPTIONS = ['Poor Metabolizer', 'Intermediate Metabolizer', 'Normal Metabolizer', 'Rapid Metabolizer', 'Ultrarapid Metabolizer'];
const EVIDENCE_OPTIONS = ['1A', '1B', '2A', '2B', '3', '4'];
const ETHNICITY_OPTIONS = ['Asian', 'Caucasian', 'African American', 'Hispanic', 'Other'];

export default function PredictionForm({ onSubmit, isLoading }) {
  const [activeStep, setActiveStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      patient_name: 'Robert Chen',
      patient_phone: '+1 (555) 234-5678',
      age: 65,
      gender: 'Male',
      ethnicity: 'Asian',
      height_cm: 170,
      weight_kg: 75,
      bmi: 26.0,
      smoking_status: 'Former',
      alcohol_consumption: 'Occasional',
      physical_activity: 'Low',
      diabetes: true,
      hypertension: true,
      kidney_disease: false,
      liver_disease: false,
      heart_disease: true,
      disease_count: 3,
      drug_count: 4,
      gene_count: 3,
      variant_count: 4,
      primary_gene: 'CYP2C19',
      primary_variant: 'CYP2C19*2',
      primary_phenotype: 'Poor Metabolizer',
      primary_evidence: '1A',
    },
  });

  const weight = watch('weight_kg');
  const height = watch('height_cm');
  const diabetes = watch('diabetes');
  const hypertension = watch('hypertension');
  const kidney_disease = watch('kidney_disease');
  const liver_disease = watch('liver_disease');
  const heart_disease = watch('heart_disease');
  const primary_evidence = watch('primary_evidence');

  // Auto-calculate BMI
  useEffect(() => {
    const bmi = calculateBMI(weight, height);
    if (bmi > 0) {
      setValue('bmi', bmi);
    }
  }, [weight, height, setValue]);

  // Auto-update disease_count
  useEffect(() => {
    const count = [diabetes, hypertension, kidney_disease, liver_disease, heart_disease].filter(Boolean).length;
    setValue('disease_count', count);
  }, [diabetes, hypertension, kidney_disease, liver_disease, heart_disease, setValue]);

  const handleFormSubmit = (data) => {
    const numericData = {
      ...data,
      age: parseInt(data.age, 10),
      height_cm: parseFloat(data.height_cm),
      weight_kg: parseFloat(data.weight_kg),
      bmi: parseFloat(data.bmi),
      disease_count: parseInt(data.disease_count, 10),
      drug_count: parseInt(data.drug_count, 10),
      gene_count: parseInt(data.gene_count, 10),
      variant_count: parseInt(data.variant_count, 10),
      diabetes: Boolean(data.diabetes),
      hypertension: Boolean(data.hypertension),
      kidney_disease: Boolean(data.kidney_disease),
      liver_disease: Boolean(data.liver_disease),
      heart_disease: Boolean(data.heart_disease),
    };

    const derived = derivePatientMetrics(numericData);
    const finalPayload = {
      ...numericData,
      ...derived,
    };

    onSubmit(finalPayload);
  };

  const steps = [
    { id: 1, title: 'Identity & Baseline', icon: HiUser, desc: 'Name, Phone & Physical Metrics' },
    { id: 2, title: 'Lifestyle & Clinical', icon: HiHeart, desc: 'Comorbidities & Regimen' },
    { id: 3, title: 'Pharmacogenomics', icon: HiBeaker, desc: 'Loci, Variants & Phenotype' },
  ];

  const matchesSearch = (text) => {
    if (!searchQuery) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      
      {/* Search Data Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <HiSearch className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient variables (e.g. name, gene, smoking)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Step {activeStep} of 3</span>
          {searchQuery && (
            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold">
              Filtering enabled
            </span>
          )}
        </div>
      </div>

      {/* Wizard Step Progress Tracker */}
      <div className="grid grid-cols-3 gap-3">
        {steps.map((s) => {
          const Icon = s.icon;
          const isActive = activeStep === s.id;
          const isDone = activeStep > s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveStep(s.id)}
              className={`p-3 sm:p-4 rounded-2xl border text-left transition-all flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : isDone
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${
                isActive ? 'bg-blue-500 text-white' : isDone ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-slate-600'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-bold block truncate">{s.title}</span>
                <span className={`text-[10px] hidden sm:block truncate ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                  {s.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Step Content Panels */}
      <AnimatePresence mode="wait">
        
        {/* Step 1: Patient Identity & Demographics */}
        {activeStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"
          >
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <HiIdentification className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">1. Patient Identity & Demographics</h3>
                <p className="text-xs text-slate-500">Contact information & physical baseline metrics</p>
              </div>
            </div>

            {/* Patient Name & Phone Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
              {matchesSearch('patient name') && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center">
                    <HiUser className="w-4 h-4 mr-1 text-blue-600" />
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    {...register('patient_name', { required: 'Patient Name is required' })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
                    placeholder="e.g. Robert Chen"
                  />
                  {errors.patient_name && <p className="text-xs text-red-500 mt-1">{errors.patient_name.message}</p>}
                </div>
              )}

              {matchesSearch('phone number') && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center">
                    <HiPhone className="w-4 h-4 mr-1 text-emerald-600" />
                    Patient Phone Number *
                  </label>
                  <input
                    type="text"
                    {...register('patient_phone', { required: 'Phone Number is required' })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
                    placeholder="e.g. +1 (555) 234-5678"
                  />
                  {errors.patient_phone && <p className="text-xs text-red-500 mt-1">{errors.patient_phone.message}</p>}
                </div>
              )}
            </div>

            {/* Demographic Physical Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {matchesSearch('age') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Age (Years) *</label>
                  <input
                    type="number"
                    {...register('age', { required: 'Age is required', min: 1, max: 120 })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              )}

              {matchesSearch('gender') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Gender *</label>
                  <select
                    {...register('gender')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              )}

              {matchesSearch('ethnicity') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Ethnicity *</label>
                  <select
                    {...register('ethnicity')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    {ETHNICITY_OPTIONS.map((eth) => (
                      <option key={eth} value={eth}>{eth}</option>
                    ))}
                  </select>
                </div>
              )}

              {matchesSearch('height') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Height (cm) *</label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('height_cm', { required: 'Height is required' })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              )}

              {matchesSearch('weight') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Weight (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('weight_kg', { required: 'Weight is required' })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              )}

              {matchesSearch('bmi') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">BMI (Auto-Calculated)</label>
                  <input
                    type="number"
                    step="0.1"
                    readOnly
                    {...register('bmi')}
                    className="w-full px-3.5 py-2.5 bg-blue-50/60 border border-blue-200 rounded-xl text-sm font-bold text-blue-700 cursor-not-allowed"
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 2: Lifestyle & Clinical Comorbidities */}
        {activeStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"
          >
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                <HiHeart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">2. Lifestyle & Comorbidity Profile</h3>
                <p className="text-xs text-slate-500">Environmental factors & active chronic diseases</p>
              </div>
            </div>

            {/* Lifestyle Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {matchesSearch('smoking') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Smoking Status</label>
                  <select {...register('smoking_status')} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                    <option value="Never">Never</option>
                    <option value="Former">Former</option>
                    <option value="Current">Current</option>
                  </select>
                </div>
              )}

              {matchesSearch('alcohol') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Alcohol Consumption</label>
                  <select {...register('alcohol_consumption')} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                    <option value="None">None</option>
                    <option value="Occasional">Occasional</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Heavy">Heavy</option>
                  </select>
                </div>
              )}

              {matchesSearch('activity') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Physical Activity</label>
                  <select {...register('physical_activity')} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                  </select>
                </div>
              )}
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">Diagnosed Chronic Diseases</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[
                  { id: 'diabetes', label: 'Diabetes' },
                  { id: 'hypertension', label: 'Hypertension' },
                  { id: 'kidney_disease', label: 'Kidney Disease' },
                  { id: 'liver_disease', label: 'Liver Disease' },
                  { id: 'heart_disease', label: 'Heart Disease' },
                ].map((d) => (
                  <label key={d.id} className="flex items-center p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
                    <input type="checkbox" {...register(d.id)} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                    <span className="ml-2.5 text-xs font-medium text-slate-800">{d.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Disease Count (Auto)</label>
                <input type="number" readOnly {...register('disease_count')} className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 cursor-not-allowed" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Drug Count (Concomitant Medications) *</label>
                <input type="number" {...register('drug_count', { required: 'Drug count required', min: 0, max: 30 })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Pharmacogenomic Profile */}
        {activeStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"
          >
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                <HiBeaker className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">3. Pharmacogenomic Profile</h3>
                <p className="text-xs text-slate-500">Gene variant annotations & metabolizer phenotype</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {matchesSearch('gene') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Primary Gene *</label>
                  <select {...register('primary_gene')} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                    {GENE_OPTIONS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              )}

              {matchesSearch('variant') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Primary Variant *</label>
                  <input type="text" {...register('primary_variant', { required: 'Variant required' })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" placeholder="e.g. CYP2C19*2" />
                </div>
              )}

              {matchesSearch('phenotype') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Predicted Phenotype *</label>
                  <select {...register('primary_phenotype')} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                    {PHENOTYPE_OPTIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              )}

              {matchesSearch('evidence') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Evidence Level (CPIC) *</label>
                  <select {...register('primary_evidence')} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                    {EVIDENCE_OPTIONS.map((e) => (
                      <option key={e} value={e}>Level {e}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Gene Count *</label>
                <input type="number" {...register('gene_count')} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Variant Count *</label>
                <input type="number" {...register('variant_count')} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Step Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => setActiveStep((s) => Math.max(s - 1, 1))}
          disabled={activeStep === 1}
          className="px-5 py-3 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-2xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center"
        >
          <HiChevronLeft className="w-4 h-4 mr-1" />
          Previous Step
        </button>

        {activeStep < 3 ? (
          <button
            type="button"
            onClick={() => setActiveStep((s) => Math.min(s + 1, 3))}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center"
          >
            Next Step
            <HiChevronRight className="w-4 h-4 ml-1" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 disabled:opacity-50 transition-all flex items-center"
          >
            {isLoading ? (
              'Processing Prediction...'
            ) : (
              <>
                <HiShieldCheck className="w-5 h-5 mr-2 text-yellow-300" />
                Predict Patient Risk
              </>
            )}
          </button>
        )}
      </div>

    </form>
  );
}
