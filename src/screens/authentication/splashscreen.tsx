import { getDropdownDataWithCache } from '@/Services/CacheService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { ActivityIndicator, Image, View } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('accessToken');
 
      if (token) {
 
        const role = await AsyncStorage.getItem('role');

        // ✅ تحميل بيانات dropdown سواء المستخدم Admin أو Clerk إلخ
        try {
          console.log('📦 تحميل بيانات dropdown...');
          const dropdownData = await getDropdownDataWithCache();
          console.log('✅ القوائم تم تحميلها:', Object.keys(dropdownData || {}).length);
        } catch (cacheError) {
          console.error('⚠️ فشل تحميل بيانات dropdown:', cacheError);
        }

        if (role === 'Admin') { navigation.replace('adminview'); }

        if (role === 'Clerk') { navigation.replace('clerkview'); }

        if (role === 'Invoice') { navigation.replace('financeview'); }

        if (role === 'PrintOfficer') { navigation.replace('officerview'); }

      } else {
        navigation.replace('userlogin');
      }
    };
    checkAuth();

  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Image
        source={require('@/assets/images/logo.png')} // تأكد من المسار الصحيح
        style={{ width: 150, height: 150, marginBottom: 30 }}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#007BFF" />
    </View>
  );
}
