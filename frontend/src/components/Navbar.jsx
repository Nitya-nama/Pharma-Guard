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
  HiCog,
  HiLogout,
  HiLockClosed,
  HiSun,
  HiMoon,
  HiUserAdd,
  HiUser
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ onOpenLogin, onOpenPreferences }) {
  const { user, role, logout, preferences, toggleTheme } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDark = preferences.themeMode === 'dark';

  // Role-based navigation item rules:
  // Admin: Full access (All 7 links including API Status & About Model)
  // Doctor: Clinical tools (Home, Predict, Explainability, Analytics, History)
  // Patient: Patient tools (Home, Predict Risk, My History)
  // Guest: Public preview (Home, Predict Risk) + Sign In CTA
  const allNavItems = [
    { id: 'nav-item-home', name: 'Home', path: '/', icon: HiHeart, roles: ['guest', 'doctor', 'admin', 'patient'] },
    { id: 'nav-item-predict', name: 'Predict Risk', path: '/predict', icon: HiShieldCheck, roles: ['guest', 'doctor', 'admin', 'patient'] },
    { id: 'nav-item-explain', name: 'Explainability', path: '/explain', icon: HiLightBulb, roles: ['doctor', 'admin'] },
    { id: 'nav-item-analytics', name: 'Analytics', path: '/analytics', icon: HiChartBar, roles: ['doctor', 'admin'] },
    { id: 'nav-item-history', name: 'History', path: '/history', icon: HiClipboardList, roles: ['doctor', 'admin', 'patient'] },
    { id: 'nav-item-status', name: 'API Status', path: '/status', icon: HiServer, roles: ['admin'] },
    { id: 'nav-item-about-model', name: 'About Model', path: '/about-model', icon: HiChip, roles: ['admin'] },
  ];

  const visibleNavItems = allNavItems.filter((item) => item.roles.includes(role));

  const getRoleBadgeStyle = (userRole) => {
    switch (userRole) {
      case 'admin':
        return 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'doctor':
        return 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'patient':
        return 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors w-full">
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-3">
          
          {/* Logo & Brand */}
          <Link id="nav-brand-logo" to="/" className="flex items-center space-x-2 sm:space-x-2.5 shrink-0 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all duration-200 shrink-0">
              <HiShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  Pharma<span className="text-blue-600 dark:text-blue-500">Guard</span>
                </span>
                {user ? (
                  <span id="nav-user-role-badge" className={`hidden xl:inline-flex items-center px-2 py-0.5 text-[9px] font-extrabold rounded-full border uppercase tracking-wider ${getRoleBadgeStyle(role)}`}>
                    {user.avatar} {role}
                  </span>
                ) : (
                  <span id="nav-guest-badge" className="hidden xl:inline-flex items-center px-2 py-0.5 text-[9px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full border border-slate-200 dark:border-slate-700">
                    Guest Mode
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 hidden 2xl:block leading-tight">
                Pharmacogenomics Risk Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav id="nav-desktop-menu" className="hidden lg:flex items-center space-x-1 bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shrink">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  id={item.id}
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-2.5 py-1.5 rounded-xl text-[11px] xl:text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200/80 dark:border-slate-700'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-900/60'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5 mr-1 opacity-80 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* User Auth, Theme Toggle & Actions */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            
            {/* Light / Dark Mode Toggle Button */}
            <button
              id="nav-theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 transition-colors shrink-0"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <HiSun className="w-4 h-4 text-amber-400" /> : <HiMoon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Preferences Button */}
            <button
              id="nav-preferences-btn"
              onClick={onOpenPreferences}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 transition-colors shrink-0"
              title="User Preferences & Settings"
            >
              <HiCog className="w-4 h-4" />
            </button>

            {user ? (
              <div className="flex items-center space-x-2 shrink-0">
                
                {/* LOGGED IN USER PROFILE (Shifted to the LEFT of Sign Out Button) */}
                <div id="nav-user-profile-left" className="flex items-center space-x-2 px-2.5 py-1.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-xl">
                  <span className="text-sm">{user.avatar}</span>
                  <div className="flex flex-col text-left max-w-[110px] sm:max-w-[130px]">
                    <span className="text-[11px] sm:text-xs font-extrabold text-slate-900 dark:text-slate-100 truncate leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[9px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider truncate leading-tight">
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* SIGN OUT BUTTON (Positioned to the RIGHT of User Profile) */}
                <button
                  id="nav-logout-btn"
                  onClick={logout}
                  className="inline-flex items-center justify-center px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-extrabold text-white bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 rounded-xl transition-all shadow-sm shadow-red-500/20 whitespace-nowrap shrink-0"
                  title="Sign Out of Account"
                >
                  <HiLogout className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 shrink-0" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              /* GUEST MODE: Sign In & Create Account Buttons */
              <div className="flex items-center space-x-1.5 shrink-0">
                <button
                  id="nav-login-btn"
                  onClick={() => onOpenLogin('login')}
                  className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-all whitespace-nowrap shrink-0"
                >
                  <HiLockClosed className="w-3.5 h-3.5 mr-1 text-yellow-500" />
                  <span>Sign In</span>
                </button>

                <button
                  id="nav-register-btn"
                  onClick={() => onOpenLogin('register')}
                  className="inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 active:scale-95 transition-all whitespace-nowrap shrink-0"
                >
                  <HiUserAdd className="w-3.5 h-3.5 mr-1 text-blue-200" />
                  <span>Create Account</span>
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              id="nav-mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0"
            >
              {mobileMenuOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
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
            className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-1 sm:px-6">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    id={`mobile-${item.id}`}
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" />
                    {item.name}
                  </NavLink>
                );
              })}

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <button
                  onClick={() => {
                    toggleTheme();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl"
                >
                  <span className="flex items-center">
                    {isDark ? <HiSun className="w-5 h-5 mr-2 text-amber-400" /> : <HiMoon className="w-5 h-5 mr-2 text-slate-600" />}
                    Theme Mode
                  </span>
                  <span className="text-xs uppercase bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    {isDark ? 'Dark' : 'Light'}
                  </span>
                </button>

                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center px-4 py-3 text-sm font-extrabold text-white bg-red-600 rounded-xl"
                  >
                    <HiLogout className="w-5 h-5 mr-2 text-white" />
                    Sign Out ({user.name})
                  </button>
                ) : (
                  <div className="space-y-2 pt-1">
                    <button
                      onClick={() => {
                        onOpenLogin('login');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl"
                    >
                      <HiLockClosed className="w-5 h-5 mr-2 text-yellow-500" />
                      Sign In
                    </button>

                    <button
                      onClick={() => {
                        onOpenLogin('register');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl"
                    >
                      <HiUserAdd className="w-5 h-5 mr-2" />
                      Create Account
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
