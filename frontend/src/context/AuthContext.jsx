import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEFAULT_PREFERENCES = {
  preferredGene: 'CYP2C19',
  defaultEvidence: '1A',
  enableAlertToasts: true,
  autoFillDemoData: true,
  themeAccent: 'blue',
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
    name: 'Alex Rivera (Admin)',
    email: 'admin@pharmaguard.ai',
    role: 'admin',
    title: 'System & Model Administrator',
    avatar: '🛡️',
  },
  patient: {
    name: 'John Doe (Patient)',
    email: 'john.doe@patient.org',
    role: 'patient',
    title: 'Patient Profile',
    avatar: '👤',
  },
};

export function AuthProvider({ children }) {
  // Load saved user or default to doctor login for quick initial evaluation
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('pharmaguard_user');
    return saved ? JSON.parse(saved) : DEMO_USERS.doctor;
  });

  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('pharmaguard_prefs');
    return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('pharmaguard_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pharmaguard_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('pharmaguard_prefs', JSON.stringify(preferences));
  }, [preferences]);

  const loginAsRole = (role) => {
    const selectedUser = DEMO_USERS[role] || DEMO_USERS.doctor;
    setUser(selectedUser);
  };

  const loginCustom = (customUser) => {
    setUser(customUser);
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
        loginAsRole,
        loginCustom,
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
