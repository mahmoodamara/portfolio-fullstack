// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true); // جديد

  // حفظ الجلسة
  const login = (data) => {
    localStorage.setItem('token', data.token);
    setAdmin(data.admin);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAdmin(null);
  };

  // عند تحميل التطبيق - تحقق من صحة التوكن
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await API.get('/auth/me');
        setAdmin(res.data);
      } catch (err) {
        console.warn('Invalid token or session expired');
        logout(); // امسح التوكن
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
