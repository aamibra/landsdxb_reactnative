import { logout_api } from '@/constant/DXBConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';



export const logoutUser = async (navigation) => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const userId = await AsyncStorage.getItem('userId');

    if (!userId || !refreshToken) {
      console.warn('No user info found.');
      return;
    }

    // 📨 إرسال طلب تسجيل الخروج
    await axios.post(
      logout_api,
      { userId, refreshToken },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // 🧹 حذف كل البيانات من AsyncStorage
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userId', 'role', 'expiresAt']);

    // 🔁 توجيه المستخدم لشاشة تسجيل الدخول
    navigation.reset({
      index: 0,
      routes: [{ name: 'userlogin' }],
    });

  } catch (error : any) {
    console.error('Logout error:', error.response?.data || error.message);
  }
};
