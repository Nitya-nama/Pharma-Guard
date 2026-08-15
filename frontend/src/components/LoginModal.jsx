import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  HiX, 
  HiLockClosed, 
  HiCheckCircle, 
  HiKey,
  HiUserAdd,
  HiUser,
  HiMail
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

export default function LoginModal({ isOpen, onClose, initialMode = 'login' }) {
  const { loginAsRole, loginCustom, createAccount, DEMO_USERS } = useAuth();
  
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [activeRole, setActiveRole] = useState('doctor');
  
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('doctor');
  const [specialty, setSpecialty] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleQuickLogin = (role) => {
    loginAsRole(role);
    toast.success(`Logged in as ${DEMO_USERS[role].name} (${role.toUpperCase()})`);
    onClose();
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const customUser = {
      name: email.split('@')[0] || 'Authenticated User',
      email: email || 'user@pharmaguard.ai',
      role: activeRole,
      title: activeRole === 'doctor' ? 'Clinical Doctor' : activeRole === 'admin' ? 'System Administrator' : 'Patient Profile',
      avatar: activeRole === 'doctor' ? '👨‍⚕️' : activeRole === 'admin' ? '🛡️' : '👤',
    };
    loginCustom(customUser);
    toast.success(`Welcome back, ${customUser.name}!`);
    onClose();
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !regEmail) {
      toast.error('Please fill in all required fields.');
      return;
    }
    const newUser = createAccount({
      fullName,
      email: regEmail,
      role: regRole,
    });
    toast.success(`Account created! Welcome to PharmaGuard, ${newUser.name}.`);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                {mode === 'login' ? <HiLockClosed className="w-5 h-5" /> : <HiUserAdd className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-xl font-extrabold">
                  {mode === 'login' ? 'PharmaGuard Access' : 'Create New Account'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {mode === 'login' ? 'Select role & sign in to your dashboard' : 'Register a new Doctor, Admin, or Patient account'}
                </p>
              </div>
            </div>

            <button
              id="login-modal-close-btn"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher: Sign In vs Create Account */}
          <div className="flex rounded-2xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
                mode === 'register'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {mode === 'login' ? (
            <div className="space-y-6">
              {/* Role Selection */}
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                {[
                  { id: 'doctor', label: 'Doctor', icon: '👨‍⚕️' },
                  { id: 'admin', label: 'Admin', icon: '🛡️' },
                  { id: 'patient', label: 'Patient', icon: '👤' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveRole(tab.id)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                      activeRole === tab.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Quick 1-Click Demo Login Box */}
              <div className="bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center">
                    <HiCheckCircle className="w-4 h-4 mr-1 text-blue-600 dark:text-blue-400" />
                    Quick 1-Click Demo Login ({activeRole.toUpperCase()})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickLogin(activeRole)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center"
                >
                  <HiKey className="w-4 h-4 mr-1.5 text-yellow-300" />
                  Sign In as {DEMO_USERS[activeRole].name}
                </button>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={DEMO_USERS[activeRole].email}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl text-sm transition-all shadow-md"
                >
                  Sign In to Account
                </button>
              </form>
            </div>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1 flex items-center">
                  <HiUser className="w-4 h-4 mr-1 text-blue-600" />
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Emily Watson"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1 flex items-center">
                  <HiMail className="w-4 h-4 mr-1 text-blue-600" />
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="emily.watson@hospital.org"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Account Role *</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="doctor">Doctor 👨‍⚕️</option>
                    <option value="admin">Admin 🛡️</option>
                    <option value="patient">Patient 👤</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Specialty / Dept</label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="Pharmacology"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Set Password *</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2"
              >
                <HiUserAdd className="w-5 h-5" />
                <span>Create PharmaGuard Account</span>
              </button>
            </form>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
