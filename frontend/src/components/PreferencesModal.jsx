import React from 'react';
import { useAuth } from '../context/AuthContext';
import { HiX, HiCog, HiCheck, HiSparkles, HiBeaker, HiUser, HiKey } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

export default function PreferencesModal({ isOpen, onClose }) {
  const { user, role, preferences, updatePreferences, loginAsRole, logout, DEMO_USERS } = useAuth();

  if (!isOpen) return null;

  const handleGeneChange = (gene) => {
    updatePreferences({ preferredGene: gene });
    toast.info(`Preferred gene focus set to ${gene}`);
  };

  const handleEvidenceChange = (evidence) => {
    updatePreferences({ defaultEvidence: evidence });
    toast.info(`Default evidence threshold set to Level ${evidence}`);
  };

  const handleToggleToast = () => {
    updatePreferences({ enableAlertToasts: !preferences.enableAlertToasts });
  };

  const handleToggleAutoFill = () => {
    updatePreferences({ autoFillDemoData: !preferences.autoFillDemoData });
  };

  const handleSwitchRole = (newRole) => {
    loginAsRole(newRole);
    toast.success(`Role switched to ${newRole.toUpperCase()} (${DEMO_USERS[newRole].name})`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-md">
                <HiCog className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">User Preferences & Role</h3>
                <p className="text-xs text-slate-500">Configure role, gene focus, thresholds & settings</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            
            {/* Quick Role Switcher */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <label className="block text-xs font-bold text-slate-900 uppercase flex items-center justify-between">
                <span className="flex items-center">
                  <HiUser className="w-4 h-4 mr-1 text-blue-600" />
                  Active Account & Role
                </span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] rounded-md font-extrabold uppercase">
                  {role}
                </span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'doctor', label: 'Doctor', icon: '👨‍⚕️' },
                  { id: 'admin', label: 'Admin', icon: '🛡️' },
                  { id: 'patient', label: 'Patient', icon: '👤' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleSwitchRole(r.id)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center space-x-1 ${
                      role === r.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{r.icon}</span>
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Gene Focus */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase flex items-center">
                <HiBeaker className="w-4 h-4 mr-1 text-purple-600" />
                Primary Gene Locus Focus
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['CYP2C19', 'CYP2D6', 'CYP2C9', 'VKORC1', 'SLCO1B1', 'TPMT', 'DPYD', 'UGT1A1'].map((gene) => (
                  <button
                    key={gene}
                    type="button"
                    onClick={() => handleGeneChange(gene)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                      preferences.preferredGene === gene
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {gene}
                  </button>
                ))}
              </div>
            </div>

            {/* Default Evidence Level Threshold */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Default Evidence Level Threshold (CPIC)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['1A', '1B', '2A', '2B'].map((ev) => (
                  <button
                    key={ev}
                    type="button"
                    onClick={() => handleEvidenceChange(ev)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      preferences.defaultEvidence === ev
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Level {ev}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Toast Notifications</span>
                  <span className="text-[11px] text-slate-500">Show alert popups upon prediction generation</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.enableAlertToasts}
                  onChange={handleToggleToast}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Auto-Fill Clinical Demo Data</span>
                  <span className="text-[11px] text-slate-500">Prepopulate patient form with sample metrics</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.autoFillDemoData}
                  onChange={handleToggleAutoFill}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-all"
            >
              Done & Save Settings
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
