import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const USERS = {
  admin: { name: 'Priya Sharma', role: 'admin', avatar: 'PS', email: 'priya@vaxsafe.io' },
  dispatcher: { name: 'James Mutua', role: 'dispatcher', avatar: 'JM', email: 'james@vaxsafe.io' },
  driver: { name: 'Daniel Ochieng', role: 'driver', avatar: 'DO', email: 'daniel@vaxsafe.io' },
};

const ROLE_ACCESS = {
  admin: ['/', '/digital-twin', '/routes', '/fleet', '/anomalies', '/audit', '/driver', '/roadmap'],
  dispatcher: ['/', '/routes', '/fleet', '/anomalies', '/audit'],
  driver: ['/', '/driver', '/fleet'],
};

const ROLE_LABELS = {
  admin: 'Administrator',
  dispatcher: 'Dispatcher',
  driver: 'Driver',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (role) => {
    setUser(USERS[role] || USERS.admin);
  };

  const logout = () => setUser(null);

  const canAccess = (path) => {
    if (!user) return false;
    return ROLE_ACCESS[user.role]?.includes(path) ?? false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, canAccess, ROLE_LABELS }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
