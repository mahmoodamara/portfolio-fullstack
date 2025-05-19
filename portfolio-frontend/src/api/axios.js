// src/api/axios.js
import axios from 'axios';

// يمكنك ضبط عنوان السيرفر عبر متغير البيئة أو استخدام المحلي
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// ✅ إرفاق التوكن تلقائيًا لكل طلب
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ❌ تسجيل الأخطاء وتنسيقها
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.message || 'Server error';
    console.error(`❌ API Error: ${msg}`);
    return Promise.reject(error);
  }
);

export default API;
