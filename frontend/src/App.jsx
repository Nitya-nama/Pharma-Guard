import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import PreferencesModal from './components/PreferencesModal';

// Pages
import Home from './pages/Home';
import Predict from './pages/Predict';
import Explain from './pages/Explain';
import Analytics from './pages/Analytics';
import History from './pages/History';
import PredictionDetail from './pages/PredictionDetail';
import Status from './pages/Status';
import AboutModel from './pages/AboutModel';

// React Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MainApp() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState('login');
  const [preferencesModalOpen, setPreferencesModalOpen] = useState(false);

  const handleOpenLogin = (mode = 'login') => {
    setLoginModalMode(mode);
    setLoginModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-blue-500 selection:text-white transition-colors duration-300 w-full overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar
        onOpenLogin={handleOpenLogin}
        onOpenPreferences={() => setPreferencesModalOpen(true)}
      />

      {/* Main Page Body */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 pt-8 pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/explain" element={<Explain />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/history" element={<History />} />
          <Route path="/history/:id" element={<PredictionDetail />} />
          <Route path="/status" element={<Status />} />
          <Route path="/about-model" element={<AboutModel />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <LoginModal
        isOpen={loginModalOpen}
        initialMode={loginModalMode}
        onClose={() => setLoginModalOpen(false)}
      />

      <PreferencesModal
        isOpen={preferencesModalOpen}
        onClose={() => setPreferencesModalOpen(false)}
      />

      {/* Global Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <MainApp />
      </Router>
    </AuthProvider>
  );
}
