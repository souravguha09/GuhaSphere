import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('guhasphere-token');
    if (!token) { setLoading(false); return; }
    api.get('/auth/me').then(({ data }) => setUser(data.user)).catch(() => localStorage.removeItem('guhasphere-token')).finally(() => setLoading(false));
  }, []);
  const authenticate = async (endpoint, payload) => {
    const { data } = await api.post(`/auth/${endpoint}`, payload);
    localStorage.setItem('guhasphere-token', data.token);
    setUser(data.user);
    return data.user;
  };
  const login = (payload) => authenticate('login', payload);
  const register = (payload) => authenticate('register', payload);
  const logout = () => { localStorage.removeItem('guhasphere-token'); setUser(null); };
  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
