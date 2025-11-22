// components/CustomDrawerContent.js
import RTLText from '@/components/RTLText';
import i18n, { setLanguage } from '@/Services/i18n';
import { logoutUser } from '@/src/screens/authentication/logout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { useEffect, useState } from 'react';
import { I18nManager, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const isRTL = I18nManager.isRTL;

export default function CustomDrawerContent(props) {
  const [isArabic, setIsArabic] = useState(false);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const switchLanguage = currentLanguage === "en" ? "ar" : "en";
  const defaultAvatar = require('@/assets/images/user-placeholder.png');

  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('appLanguage');
        const lang = storedLanguage || 'en';
        setCurrentLanguage(lang);
        setIsArabic(lang === 'ar');
      } catch (error) {
        console.log('Error fetching language:', error);
      }
    };

    fetchLanguage();
  }, []);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const fn = await AsyncStorage.getItem('FirstName');
        const ln = await AsyncStorage.getItem('LastName');
        const av = await AsyncStorage.getItem('AvatarUrl');

        setFirstName(fn);
        setLastName(ln);
        setAvatarUrl(av);
      } catch (error) {
        console.error('Error loading user info:', error);
      }
    };

    loadUserInfo();
  }, []);

  const displayName = `${firstName ?? ''} ${lastName ?? ''}`.trim() || '';

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* ====== الهيدر ====== */}
      <View style={styles.header}>
        {/* زر الإعدادات */}
        <TouchableOpacity
          style={[
            styles.gearButton,

            isArabic ? { left: 15 } : { right: 15 },
          ]}
          onPress={() => props.navigation.navigate('EditProfileScreen')}
        >
          <Ionicons name="settings-outline" size={22} color="#fff" />
        </TouchableOpacity>
        <Image
          source={avatarUrl ? { uri: avatarUrl } : defaultAvatar}
          style={styles.avatar}
        />
        <Text style={styles.username}>{displayName}</Text>
      </View>

      {/* ====== عناصر الـ Drawer ====== */}
      <View style={{ flex: 1, direction: isRTL ? "rtl" : "ltr" }}>
        <DrawerItemList {...props} />
      </View>

      {/* ====== زر تسجيل الخروج ====== */}
      <View style={styles.footer}>
        <DrawerItem
          label={() => (
            <RTLText style={{ fontSize: 18 }}>
              {isArabic ? 'English' : 'العربية'}
            </RTLText>
          )}
          icon={({ color, size }) => (
            <Ionicons name="language" color={color} size={size} />
          )}
          onPress={() => setLanguage(switchLanguage)}
        />
        <DrawerItem
          label={() => (
            <RTLText style={{ fontSize: 18 }}>
              {i18n.t('logout')}
            </RTLText>
          )}
          icon={({ color, size }) => (
            <Ionicons name="log-out-outline" color={color} size={size} />
          )}
          onPress={() => logoutUser(props.navigation)}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    backgroundColor: '#81bdff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  gearButton: {
    position: 'absolute',
    top: 10,
    backgroundColor: 'rgba(255,255,255,0.25)',
    padding: 8,
    borderRadius: 20,
  },
  avatar: { width: 70, height: 70, borderRadius: 35, marginBottom: 10 },
  username: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
  footer: {
    direction: isRTL ? "rtl" : "ltr",
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
  },
});
