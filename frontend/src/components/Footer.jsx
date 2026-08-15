import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HiShieldCheck, 
  HiExternalLink, 
  HiCode, 
  HiDocumentText, 
  HiInformationCircle, 
  HiChip, 
  HiBeaker, 
  HiSparkles 
} from 'react-icons/hi';

export default function Footer() {
  const API_URL = import.meta.env.VITE_API_URL || 'https://pharma-guard-ow5u.onrender.com';

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Main Footer Links & Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <HiShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Pharma<span className="text-blue-500">Guard</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Advanced AI-powered pharmacogenomics risk prediction platform. Delivering clinical decision support through XGBoost predictive models, SHAP explainability, and real-time patient risk stratification.
            </p>
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                Version 1.0.0
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 font-medium">
                API Active
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home Landing</Link>
              </li>
              <li>
                <Link to="/predict" className="hover:text-white transition-colors">Risk Prediction</Link>
              </li>
              <li>
                <Link to="/explain" className="hover:text-white transition-colors">SHAP Explainability</Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-white transition-colors">Analytics Dashboard</Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-white transition-colors">Prediction History</Link>
              </li>
            </ul>
          </div>

          {/* System & Documentation Links */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Documentation & API
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a 
                  href={`${API_URL}/apidocs`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-white transition-colors group"
                >
                  <HiDocumentText className="w-4 h-4 mr-1.5 text-blue-400 group-hover:text-blue-300" />
                  Swagger Documentation
                  <HiExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-white transition-colors group"
                >
                  <HiCode className="w-4 h-4 mr-1.5 text-slate-400 group-hover:text-white" />
                  GitHub Repository
                  <HiExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
                </a>
              </li>
              <li>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-white transition-colors"
                >
                  LinkedIn Profile
                  <HiExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
                </a>
              </li>
              <li>
                <Link to="/status" className="hover:text-white transition-colors">API Health Check</Link>
              </li>
              <li>
                <Link to="/about-model" className="hover:text-white transition-colors">Model Specifications</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Dedicated "About the Project" Section */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-700/60 pb-4">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-400/20">
              <HiInformationCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                About The PharmaGuard Project
              </h3>
              <p className="text-xs text-slate-400">
                Precision Medicine & Pharmacogenomic Risk AI Platform Overview
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed text-slate-300">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm">
                <HiBeaker className="w-4 h-4" />
                <h4>Clinical Mission</h4>
              </div>
              <p className="text-slate-400">
                PharmaGuard bridges the gap between genomic research and clinical prescribing. By processing patient demographics, lifestyle factors, chronic disease profiles, and target gene variant annotations, the system identifies potential adverse drug reaction (ADR) risks before medication delivery.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                <HiChip className="w-4 h-4" />
                <h4>XGBoost & SHAP Intelligence</h4>
              </div>
              <p className="text-slate-400">
                The machine learning engine utilizes an Extreme Gradient Boosting (XGBoost) classifier trained on clinical pharmacogenomics datasets. Interpretability is enforced via SHAP (SHapley Additive exPlanations) to decompose every risk output into explicit feature contribution scores.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                <HiSparkles className="w-4 h-4" />
                <h4>CPIC & PharmGKB Standard</h4>
              </div>
              <p className="text-slate-400">
                Genetic variant annotations follow standardized Clinical Pharmacogenetics Implementation Consortium (CPIC) and PharmGKB evidence levels (1A, 1B, 2A). Evaluated gene loci include CYP2C19, CYP2D6, CYP2C9, VKORC1, TPMT, DPYD, and SLCO1B1.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & tech credits */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PharmaGuard AI. Healthcare Decision Support Tool.</p>
          <p className="mt-2 sm:mt-0">Built with React 18, Vite, Tailwind CSS, Recharts & Flask backend.</p>
        </div>

      </div>
    </footer>
  );
}
