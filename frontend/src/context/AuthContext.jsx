import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEFAULT_PREFERENCES = {
  preferredGene: 'CYP2C19',
  defaultEvidence: '1A',
  enableAlertToasts: true,
  autoFillDemoData: true,
  themeMode: 'light', // 'light' | 'dark'
};

const DEMO_USERS = {
  doctor: {
    name: 'Dr. Sarah Jenkins, MD',
    email: 'dr.jenkins@pharmaguard.ai',
    role: 'doctor',
    title: 'Senior Pharmacogenomics Specialist',
    avatar: '👨‍⚕️',
  },
  admin: {
    name: 'Prathap (Admin)',
    email: 'admin@pharmaguard.ai',
    role: 'admin',
    title: 'System & Model Administrator',
    avatar: '🛡️',
  },
  patient: {
    name: 'Chandan N (Patient)',
    email: 'john.doe@patient.org',
    role: 'patient',
    title: 'Patient Profile',
    avatar: '👤',
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('pharmaguard_user');
    return saved ? JSON.parse(saved) : DEMO_USERS.doctor;
  });

  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('pharmaguard_prefs');
    return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
  });

  // Sync dark theme class on <html> and <body> elements
  useEffect(() => {
    const isDark = preferences.themeMode === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('pharmaguard_prefs', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('pharmaguard_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pharmaguard_user');
    }
  }, [user]);

  const toggleTheme = () => {
    setPreferences((prev) => ({
      ...prev,
      themeMode: prev.themeMode === 'dark' ? 'light' : 'dark',
    }));
  };

  const loginAsRole = (role) => {
    const selectedUser = DEMO_USERS[role] || DEMO_USERS.doctor;
    setUser(selectedUser);
  };

  const loginCustom = (customUser) => {
    setUser(customUser);
  };

  const createAccount = (accountData) => {
    const newUser = {
      name: accountData.fullName || 'Registered User',
      email: accountData.email,
      role: accountData.role || 'doctor',
      title: accountData.role === 'admin' ? 'System Administrator' : accountData.role === 'doctor' ? 'Clinical Doctor' : 'Registered Patient',
      avatar: accountData.role === 'admin' ? '🛡️' : accountData.role === 'doctor' ? '👨‍⚕️' : '👤',
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  const updatePreferences = (newPrefs) => {
    setPreferences((prev) => ({ ...prev, ...newPrefs }));
  };

  const currentRole = user ? user.role : 'guest';

  return (
    <AuthContext.Provider
      value={{
        user,
        role: currentRole,
        preferences,
        toggleTheme,
        loginAsRole,
        loginCustom,
        createAccount,
        logout,
        updatePreferences,
        DEMO_USERS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
