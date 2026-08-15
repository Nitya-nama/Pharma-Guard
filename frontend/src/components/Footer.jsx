import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HiShieldCheck, 
  HiInformationCircle, 
  HiChip, 
  HiBeaker, 
  HiSparkles,
  HiCheckCircle,
  HiLightningBolt
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const GENE_QUICK_LOOKUP = {
  CYP2C19: {
    drug: 'Clopidogrel (Plavix) & PPIs',
    evidence: 'Level 1A (CPIC Approved)',
    phenotype: 'Poor Metabolizer (*2/*3)',
    impact: 'Reduced antiplatelet activation; high risk of ischemic events or stent thrombosis.',
  },
  CYP2D6: {
    drug: 'Codeine, Tamoxifen & SSRIs',
    evidence: 'Level 1A (CPIC Approved)',
    phenotype: 'Ultrarapid Metabolizer (*1xN)',
    impact: 'Rapid conversion to morphine leading to severe life-threatening opioid toxicity.',
  },
  VKORC1: {
    drug: 'Warfarin (Coumadin)',
    evidence: 'Level 1A (CPIC Approved)',
    phenotype: 'Haplotype A (-1639G>A)',
    impact: 'Increased sensitivity to Warfarin; requires lower initial dose to prevent bleeding.',
  },
  TPMT: {
    drug: 'Azathioprine & Mercaptopurine',
    evidence: 'Level 1A (CPIC Approved)',
    phenotype: 'Homozygous Deficient (*3A)',
    impact: 'Severe, fatal bone marrow suppression without dose reduction.',
  },
};

export default function Footer() {
  const [selectedGene, setSelectedGene] = useState('CYP2C19');
  const activeGeneInfo = GENE_QUICK_LOOKUP[selectedGene];

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="w-full px-4 sm:px-8 lg:px-12 py-12 space-y-12">
        
        {/* Main Footer Links & Unique Interactive Widget Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <HiShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Pharma<span className="text-blue-500">Guard</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Advanced AI-powered pharmacogenomics risk prediction platform delivering clinical decision support through XGBoost models, SHAP explainability, and real-time patient risk stratification.
            </p>
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                Version 2.5.0
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 font-medium flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
                API Active
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors">Home Landing</Link>
              </li>
              <li>
                <Link to="/predict" className="hover:text-blue-400 transition-colors">Risk Prediction Engine</Link>
              </li>
              <li>
                <Link to="/explain" className="hover:text-blue-400 transition-colors">SHAP Explainability</Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-blue-400 transition-colors">Analytics Dashboard</Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-blue-400 transition-colors">Prediction Audit History</Link>
              </li>
            </ul>
          </div>

          {/* UNIQUE INTERACTIVE PGX BIOMARKER LOOKUP WIDGET */}
          <div className="md:col-span-2 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
              <div className="flex items-center space-x-2">
                <HiBeaker className="w-5 h-5 text-blue-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Interactive PGx Biomarker Inspector
                </h3>
              </div>
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-bold rounded-md border border-blue-400/30">
                Live Guideline Reference
              </span>
            </div>

            {/* Gene Locus Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {Object.keys(GENE_QUICK_LOOKUP).map((gene) => (
                <button
                  key={gene}
                  onClick={() => setSelectedGene(gene)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedGene === gene
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {gene}
                </button>
              ))}
            </div>

            {/* Live Inspection Result Box */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedGene}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-700/60 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-blue-400">{selectedGene} Locus</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    {activeGeneInfo.evidence}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block font-semibold">Associated Medication</span>
                    <span className="text-slate-200 font-bold">{activeGeneInfo.drug}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-semibold">High-Risk Phenotype</span>
                    <span className="text-amber-400 font-bold">{activeGeneInfo.phenotype}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed italic border-t border-slate-800 pt-2 mt-1">
                  "{activeGeneInfo.impact}"
                </p>
              </motion.div>
            </AnimatePresence>
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

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PharmaGuard AI. Healthcare Decision Support Tool.</p>
        </div>

      </div>
    </footer>
  );
}
