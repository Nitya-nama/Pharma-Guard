import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HiShieldCheck, 
  HiChartBar, 
  HiDocumentText, 
  HiSparkles, 
  HiHeart, 
  HiBeaker, 
  HiLightningBolt, 
  HiExternalLink,
  HiCheckCircle,
  HiChip,
  HiUserGroup
} from 'react-icons/hi';
import { motion } from 'framer-motion';

export default function Home() {
  const API_URL = import.meta.env.VITE_API_URL || 'https://pharma-guard-ow5u.onrender.com';

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold"
              >
                <HiSparkles className="w-4 h-4 text-blue-600" />
                <span>Next-Gen Pharmacogenomics AI Platform</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight"
              >
                Precision Medicine & <br className="hidden sm:block" />
                <span className="gradient-text">Pharmacogenomic Risk</span> AI
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                PharmaGuard leverages machine learning algorithms and SHAP explainability to evaluate adverse drug reaction risks, patient genotype profiles, and multi-morbidity interactions in real time.
              </motion.p>

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
              >
                <Link
                  to="/predict"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/25 hover:bg-blue-700 active:scale-95 transition-all"
                >
                  <HiShieldCheck className="w-5 h-5 mr-2" />
                  Predict Risk Now
                </Link>

                <Link
                  to="/analytics"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-800 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 transition-all"
                >
                  <HiChartBar className="w-5 h-5 mr-2 text-blue-600" />
                  Analytics Dashboard
                </Link>

                <a
                  href={`${API_URL}/apidocs`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 text-base font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <HiDocumentText className="w-5 h-5 mr-1.5 text-slate-400" />
                  API Docs
                  <HiExternalLink className="w-4 h-4 ml-1 opacity-70" />
                </a>
              </motion.div>

              {/* Metrics Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">94.8%</p>
                  <p className="text-xs text-slate-500 font-medium">Model Accuracy</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">&lt; 150ms</p>
                  <p className="text-xs text-slate-500 font-medium">Inference Latency</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">SHAP</p>
                  <p className="text-xs text-slate-500 font-medium">Explainable AI</p>
                </div>
              </div>

            </div>

            {/* Right Card Mockup / Graphic */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-6">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                      PG
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Live Risk Stratification</h3>
                      <p className="text-xs text-slate-500">Patient CYP2C19 Annotation</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-extrabold rounded-full">
                    SAFE
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Target Phenotype</span>
                    <span className="text-slate-900 font-bold">Poor Metabolizer</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Evidence Rating</span>
                    <span className="text-blue-600 font-bold">Level 1A (CPIC)</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                      <span>Model Confidence</span>
                      <span className="text-slate-900 font-bold">96.4%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full w-[96%] rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <p className="text-xs font-bold text-slate-700 uppercase">Top Contributor (SHAP)</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">Primary Gene Variant</span>
                    <span className="font-mono text-red-600 font-bold">+0.421 (High Risk)</span>
                  </div>
                </div>

                <Link
                  to="/predict"
                  className="w-full flex items-center justify-center py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
                >
                  Run Patient Assessment
                </Link>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">About PharmaGuard</span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Transforming Genetic Insights into Clinical Action
            </h2>
            <p className="text-slate-600 leading-relaxed text-base">
              Pharmacogenomics (PGx) studies how genes affect a person's response to medications. PharmaGuard combines patient demographics, lifestyle factors, pre-existing conditions, and genomic variant profiles to predict drug efficacy and potential toxicity before treatment begins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <HiBeaker className="w-8 h-8 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">Genomic Precision</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Evaluates primary gene variants (CYP2C19, CYP2D6, TPMT, DPYD) paired with metabolizer phenotype evidence ratings.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <HiHeart className="w-8 h-8 text-red-500" />
              <h3 className="text-base font-bold text-slate-900">Comorbidity Aware</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Incorporates multi-morbidity metrics (Diabetes, Hypertension, Liver/Kidney disease) to adjust risk scores.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <HiLightningBolt className="w-8 h-8 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900">SHAP Transparency</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Eliminates black-box ML predictions by providing granular feature impact scores for every prediction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">Core Features</h2>
          <p className="text-slate-600 text-sm">Designed specifically for healthcare practitioners and researchers</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Single & Batch Prediction', desc: 'Predict risk for individual patient profiles or process batch JSON records.', icon: HiShieldCheck },
            { title: 'SHAP Explainability', desc: 'Detailed feature contribution analysis showing why a prediction was made.', icon: HiSparkles },
            { title: 'Power BI Analytics', desc: 'Real-time dashboard summarizing risk distributions, daily trends, and top genes.', icon: HiChartBar },
            { title: 'Audit Trail & History', desc: 'Comprehensive log of all prior predictions with search, filter, and export capabilities.', icon: HiDocumentText },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-blue-300 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Workflow</span>
            <h2 className="text-3xl font-extrabold">How PharmaGuard Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Input Patient Clinical Data', desc: 'Enter demographics, lifestyle, comorbidities, and genetic variant details.' },
              { step: '02', title: 'XGBoost ML Inference', desc: 'Engine calculates risk class probabilities and confidence scores.' },
              { step: '03', title: 'SHAP Feature Breakdown', desc: 'Review feature impact visualization to guide clinical treatment decisions.' },
            ].map((s, i) => (
              <div key={i} className="space-y-3 border-t border-slate-800 pt-6">
                <span className="text-3xl font-black text-blue-500 font-mono">{s.step}</span>
                <h3 className="text-lg font-bold text-white">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Used */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">Technologies Used</h2>
          <p className="text-xs text-slate-500">Built on modern open-source web and machine learning stacks</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {['React 18', 'Vite', 'Tailwind CSS', 'Axios', 'Recharts', 'XGBoost', 'SHAP', 'Flask', 'Marshmallow', 'Flasgger'].map((tech) => (
            <span key={tech} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs">
              {tech}
            </span>
          ))}
        </div>
      </section>

    </div>
  );
}
