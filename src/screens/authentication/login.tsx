import { login_api, rooturl } from '@/constant/DXBConstant';
import api from '@/Services/axiosInstance';
import { getDropdownDataWithCache } from '@/Services/CacheService';
import i18n, { setLanguage } from '@/Services/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function LoginScreen({ navigation }: any) { 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); 
  const [isArabic, setIsArabic] = useState(false);
  const [language, setLang] = useState('ar'); 

  const [lastPress, setLastPress] = useState(0);

  const switchLanguage = language === "en" ? "ar" : "en";

  
  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('appLanguage');
        const lang = storedLanguage || 'en'; 

        setLang(lang); 
        setIsArabic(lang === 'ar');
      } catch (error) {
        console.log('Error fetching language:', error);
      }
    };

    fetchLanguage();
  }, []);


  const handleLogin = async () => {
    setErrorMessage(''); // إعادة تعيين الرسالة في كل محاولة

    // ✅ التحقق من أن الحقول غير فارغة
    if (!username.trim() || !password.trim()) {
      setErrorMessage(i18n.t('invalidusernameorpassword'));
      return;
    }

    setLoading(true); // ✅ ابدأ التحميل


    try {
      const response = await api.post(login_api, { username, password }, {
        headers: {
          'Accept-Language': language, // 👈 إرسال اللغة المطلوبة
        },
      });
      const { success, message, data } = response.data;

      if (!success) {
        setErrorMessage(message || i18n.t('loginfailed'));
        setLoading(false);
        return;
      }

      const { accessToken, refreshToken, userId, role, expiresAt, firstName, lastName, avatarUrl } = data;

      const avatarUrlToSet = avatarUrl ? rooturl + avatarUrl : '';

      await AsyncStorage.multiSet([
        ['accessToken', accessToken],
        ['refreshToken', refreshToken],
        ['userId', userId],
        ['role', role],
        ['expiresAt', expiresAt],
        ['FirstName', firstName],
        ['LastName', lastName],
        ['AvatarUrl', avatarUrlToSet],
      ]);

      // 🔹 هنا نحمّل بيانات الـ Dropdown بعد تسجيل الدخول مباشرة
      try {
        console.log('📥 تحميل بيانات dropdown بعد تسجيل الدخول...');
        const dropdownData = await getDropdownDataWithCache();
        console.log('✅ تم تحميل dropdown:', Object.keys(dropdownData || {}).length);
      } catch (err) {
        console.error('⚠️ فشل تحميل بيانات dropdown:', err);
      }

      switch (role) {
        case 'Admin':
          navigation.replace('adminview');
          break;
        case 'Clerk':
          navigation.replace('clerkview');
          break;
        case 'Invoice':
          navigation.replace('financeview');
          break;
        case 'PrintOfficer':
          navigation.replace('officerview');
          break;
        default:
          setErrorMessage(i18n.t('undefineduserrole'));
          break;
      }
    } catch (error: any) {
      if (error.request) {
        setErrorMessage(i18n.t('verifyconnecttonetwork'));
      } else {
        setErrorMessage(i18n.t('unexpectederrortryagain'));
      }
    } finally {
      setLoading(false); // ✅ أوقف التحميل دائمًا
    }
  };


  // ✅ منع الضغط المتكرر على الزر خلال ثانيتين
  const handleLoginPress = () => {
    const now = Date.now();
    if (now - lastPress < 2000) return; // يمنع النقر السريع
    setLastPress(now);
    if (!loading) handleLogin();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollView}
            keyboardShouldPersistTaps="handled"
          >
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
            />
            <Text style={styles.title}>{i18n.t('welcomeonlandsdxb')}</Text>

            <TextInput
              style={styles.input}
              placeholder={i18n.t('username')}
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />

            <TextInput
              style={styles.input}
              placeholder={i18n.t('password')}
              secureTextEntry
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />

            {/* ✅ عرض رسالة الخطأ بشكل جميل */}
            {errorMessage ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.loginButton}
              onPress={!loading ? handleLoginPress : undefined}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>{i18n.t('login')}</Text>
              )}
            </TouchableOpacity>

            <View style={styles.languageContainer}>
              <TouchableOpacity onPress={ () => setLanguage(switchLanguage)} style={styles.langButton}>
                <Text style={styles.langText}>
                  {i18n.t('selectedlang')}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60, // رفع الشعار شوي
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#999',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  loginButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, // لأندرويد
  },

  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  languageContainer: {
    marginTop: 20,
    width: '100%',
  },
  errorBox: {
    backgroundColor: '#ffe6e6',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ff4d4d',
  },
  errorText: {
    color: '#cc0000',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  langButton: {
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007BFF', // لون أزرق خفيف
    borderRadius: 8,
    alignSelf: 'center',
  },

  langText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

