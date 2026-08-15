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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-20 pb-16"
    >
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div variants={itemVariants} className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold shadow-xs">
                <HiSparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Next-Gen Pharmacogenomics AI Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Precision Medicine & <br className="hidden sm:block" />
                <span className="gradient-text">Pharmacogenomic Risk</span> AI
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                PharmaGuard leverages machine learning algorithms and SHAP explainability to evaluate adverse drug reaction risks, patient genotype profiles, and multi-morbidity interactions in real time.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                  <Link
                    to="/predict"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-xl shadow-blue-500/25 transition-all"
                  >
                    <HiShieldCheck className="w-5 h-5 mr-2" />
                    Predict Risk Now
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                  <Link
                    to="/analytics"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    <HiChartBar className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Analytics Dashboard
                  </Link>
                </motion.div>

                <a
                  href={`${API_URL}/apidocs`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 text-base font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {/* <HiDocumentText className="w-5 h-5 mr-1.5 text-slate-400" />
                  API Docs
                  <HiExternalLink className="w-4 h-4 ml-1 opacity-70" /> */}
                </a>
              </div>

              {/* Metrics Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 dark:border-slate-800">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">94.8%</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Model Accuracy</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">&lt; 150ms</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Inference Latency</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">SHAP</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Explainable AI</p>
                </div>
              </div>

            </motion.div>

            {/* Right Card Mockup */}
            <motion.div variants={itemVariants} className="lg:col-span-5">
              <motion.div 
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="relative mx-auto max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                      PG
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Live Risk Stratification</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Patient CYP2C19 Annotation</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold rounded-full border border-emerald-200 dark:border-emerald-800">
                    SAFE
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <span>Target Phenotype</span>
                    <span className="text-slate-900 dark:text-white font-bold">Poor Metabolizer</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <span>Evidence Rating</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">Level 1A (CPIC)</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <span>Model Confidence</span>
                      <span className="text-slate-900 dark:text-white font-bold">96.4%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 dark:bg-blue-500 h-full w-[96%] rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/80 space-y-2">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Top Contributor (SHAP)</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Primary Gene Variant</span>
                    <span className="font-mono text-red-600 dark:text-red-400 font-bold">+0.421 (High Risk)</span>
                  </div>
                </div>

                <Link
                  to="/predict"
                  className="w-full flex items-center justify-center py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors shadow-md"
                >
                  Run Patient Assessment
                </Link>

              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* About Section */}
      <motion.section variants={itemVariants} className="w-full px-4 sm:px-8 lg:px-12">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">About PharmaGuard</span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Transforming Genetic Insights into Clinical Action
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
              Pharmacogenomics (PGx) studies how genes affect a person's response to medications. PharmaGuard combines patient demographics, lifestyle factors, pre-existing conditions, and genomic variant profiles to predict drug efficacy and potential toxicity before treatment begins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <motion.div whileHover={{ scale: 1.02 }} className="p-6 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/80 space-y-2">
              <HiBeaker className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Genomic Precision</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Evaluates primary gene variants (CYP2C19, CYP2D6, TPMT, DPYD) paired with metabolizer phenotype evidence ratings.
              </p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="p-6 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/80 space-y-2">
              <HiHeart className="w-8 h-8 text-red-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Comorbidity Aware</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Incorporates multi-morbidity metrics (Diabetes, Hypertension, Liver/Kidney disease) to adjust risk scores.
              </p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="p-6 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/80 space-y-2">
              <HiLightningBolt className="w-8 h-8 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">SHAP Transparency</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Eliminates black-box ML predictions by providing granular feature impact scores for every prediction.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section variants={itemVariants} className="w-full px-4 sm:px-8 lg:px-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Core Features</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Designed specifically for healthcare practitioners and researchers</p>
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
              <motion.div 
                key={i} 
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-blue-400 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section variants={itemVariants} className="w-full px-4 sm:px-8 lg:px-12">
        <div className="bg-slate-900 dark:bg-slate-900/90 text-white rounded-3xl p-8 sm:p-12 space-y-8 border border-slate-800">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Workflow</span>
            <h2 className="text-3xl font-extrabold text-white">How PharmaGuard Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Input Patient Clinical Data', desc: 'Enter demographics, lifestyle, comorbidities, and genetic variant details.' },
              { step: '02', title: 'XGBoost ML Inference', desc: 'Engine calculates risk class probabilities and confidence scores.' },
              { step: '03', title: 'SHAP Feature Breakdown', desc: 'Review feature impact visualization to guide clinical treatment decisions.' },
            ].map((s, i) => (
              <motion.div key={i} whileHover={{ scale: 1.02 }} className="space-y-3 border-t border-slate-800 pt-6">
                <span className="text-3xl font-black text-blue-500 font-mono">{s.step}</span>
                <h3 className="text-lg font-bold text-white">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Technologies Used */}
      <motion.section variants={itemVariants} className="w-full px-4 sm:px-8 lg:px-12 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Technologies Used</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Built on modern open-source web and machine learning stacks</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {['React 18', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Axios', 'Recharts', 'XGBoost', 'SHAP', 'Flask', 'Marshmallow', 'Flasgger'].map((tech) => (
            <motion.span 
              key={tech} 
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 shadow-2xs"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </motion.section>

    </motion.div>
  );
}
