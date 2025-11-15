// src/api/axios.js
import { refreshtoken_api, rooturl } from '@/constant/DXBConstant';
import { replace } from '@/Services/navigationRef';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const api = axios.create({
  baseURL: rooturl, // ✅ عدل الـ API حسب مشروعك
});

// 📌 Interceptor لإضافة access token تلقائيًا
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 📌 Interceptor لتجديد التوكن إذا انتهت صلاحيته
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // لو انتهى accessToken وكان هذا أول فشل
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = await AsyncStorage.getItem('refreshToken');
      const userId       = await AsyncStorage.getItem('userId');
      const language = await AsyncStorage.getItem('appLanguage') || 'en';

      if (!refreshToken || !userId) {
        await AsyncStorage.clear();
        replace('userlogin');  // 👈 يرجع المستخدم لتسجيل الدخول
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(refreshtoken_api, {
          userId,
          refreshToken,
        },
          {
            headers: {
              'Accept-Language': language, // تحديد اللغة
            }
          }
        );

        const { accessToken, refreshToken: newRefreshToken, expireAt } = res.data;

        // خزن التوكن الجديد
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', newRefreshToken);
        await AsyncStorage.setItem('expiresAt', expireAt);

        // أعد المحاولة مع التوكن الجديد
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers['Accept-Language'] = language;

        return api(originalRequest);
      } catch (err) {
        await AsyncStorage.clear();
        replace('userlogin');  // 👈 إعادة التوجيه للـ login

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
