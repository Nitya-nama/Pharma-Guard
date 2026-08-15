import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiX, HiLockClosed, HiCheckCircle, HiShieldCheck, HiUserGroup, HiKey } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

export default function LoginModal({ isOpen, onClose }) {
  const { loginAsRole, loginCustom, DEMO_USERS } = useAuth();
  const [activeTab, setActiveTab] = useState('doctor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleQuickLogin = (role) => {
    loginAsRole(role);
    toast.success(`Logged in as ${DEMO_USERS[role].name} (${role.toUpperCase()})`);
    onClose();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const customUser = {
      name: email.split('@')[0] || 'Authenticated User',
      email: email || 'user@pharmaguard.ai',
      role: activeTab,
      title: activeTab === 'doctor' ? 'Clinical Doctor' : activeTab === 'admin' ? 'System Administrator' : 'Patient',
      avatar: activeTab === 'doctor' ? '👨‍⚕️' : activeTab === 'admin' ? '🛡️' : '👤',
    };
    loginCustom(customUser);
    toast.success(`Welcome back, ${customUser.name}!`);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <HiLockClosed className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">PharmaGuard Login</h3>
                <p className="text-xs text-slate-500">Select role & sign in to unlock access</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          {/* Role Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl">
            {[
              { id: 'doctor', label: 'Doctor', icon: '👨‍⚕️' },
              { id: 'admin', label: 'Admin', icon: '🛡️' },
              { id: 'patient', label: 'Patient', icon: '👤' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Quick 1-Click Demo Login Box */}
          <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 flex items-center">
                <HiCheckCircle className="w-4 h-4 mr-1 text-blue-600" />
                Quick 1-Click Demo Login ({activeTab.toUpperCase()})
              </span>
            </div>
            <p className="text-xs text-blue-700">
              Instantly test the platform with preset demo credentials for this role.
            </p>
            <button
              type="button"
              onClick={() => handleQuickLogin(activeTab)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center"
            >
              <HiKey className="w-4 h-4 mr-1.5 text-yellow-300" />
              Login as {DEMO_USERS[activeTab].name}
            </button>
          </div>

          {/* Standard Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={DEMO_USERS[activeTab].email}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all"
            >
              Sign In to Account
            </button>
          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
