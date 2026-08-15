import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HiShieldCheck, 
  HiChartBar, 
  HiClipboardList, 
  HiChip, 
  HiHeart, 
  HiMenu, 
  HiX, 
  HiLightBulb,
  HiServer,
  HiSparkles,
  HiCog,
  HiLogout,
  HiLockClosed
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ onOpenLogin, onOpenPreferences }) {
  const { user, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Define role-based navigation items
  // API Status and About Model are now strictly restricted to ADMIN role only
  const allNavItems = [
    { name: 'Home', path: '/', icon: HiHeart, roles: ['guest', 'doctor', 'admin', 'patient'] },
    { name: 'Predict Risk', path: '/predict', icon: HiShieldCheck, roles: ['guest', 'doctor', 'admin', 'patient'] },
    { name: 'Explainability', path: '/explain', icon: HiLightBulb, roles: ['doctor', 'admin'] },
    { name: 'Analytics', path: '/analytics', icon: HiChartBar, roles: ['doctor', 'admin'] },
    { name: 'History', path: '/history', icon: HiClipboardList, roles: ['doctor', 'admin', 'patient'] },
    { name: 'API Status', path: '/status', icon: HiServer, roles: ['admin'] },
    { name: 'About Model', path: '/about-model', icon: HiChip, roles: ['admin'] },
  ];

  const visibleNavItems = allNavItems.filter((item) => item.roles.includes(role));

  const getRoleBadgeStyle = (userRole) => {
    switch (userRole) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'doctor':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'patient':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-all duration-200">
              <HiShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  Pharma<span className="text-blue-600">Guard</span>
                </span>
                {user ? (
                  <span className={`hidden sm:inline-flex items-center px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border uppercase ${getRoleBadgeStyle(role)}`}>
                    {user.avatar} {role}
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-extrabold bg-slate-100 text-slate-600 rounded-full border border-slate-200">
                    Guest Mode
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium text-slate-600 hidden md:block">
                Pharmacogenomics Risk Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-50/80 p-1.5 rounded-2xl border border-slate-200/60">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
                      isActive
                        ? 'bg-white text-blue-600 shadow-xs border border-slate-200/80'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 mr-1.5 opacity-80" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* User Auth & Actions */}
          <div className="flex items-center space-x-3">
            
            {/* Preferences Button */}
            <button
              onClick={onOpenPreferences}
              className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 transition-colors"
              title="User Preferences & Settings"
            >
              <HiCog className="w-5 h-5" />
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-extrabold text-slate-900 leading-tight">{user.name}</span>
                  <span className="text-[10px] text-slate-600 font-medium">{user.title}</span>
                </div>

                <button
                  onClick={logout}
                  className="inline-flex items-center justify-center px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all border border-slate-200"
                  title="Sign Out"
                >
                  <HiLogout className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-extrabold text-white bg-blue-600 rounded-xl shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all"
              >
                <HiLockClosed className="w-4 h-4 mr-1.5 text-yellow-300" />
                Sign In / Login
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
            >
              {mobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-200 bg-white shadow-xl overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-1 sm:px-6">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 border border-blue-100'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 mr-3 text-blue-600" />
                    {item.name}
                  </NavLink>
                );
              })}

              <div className="pt-4 border-t border-slate-100 space-y-2">
                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold text-red-600 bg-red-50 rounded-xl"
                  >
                    <HiLogout className="w-5 h-5 mr-2" />
                    Sign Out ({user.name})
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onOpenLogin();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl"
                  >
                    <HiLockClosed className="w-5 h-5 mr-2" />
                    Login / Select Role
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
