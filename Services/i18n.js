import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
// Import your translation files
import ar from '@/assets/locales/ar.json';
import en from '@/assets/locales/en.json';
 

const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
};
 
// Determine the device's locale and use 'en' as a fallback
const deviceLanguage =  'ar';
const fallbackLanguage = 'en';
const initialLanguage = resources[deviceLanguage] ? deviceLanguage : fallbackLanguage;

i18n
  .use(initReactI18next) // passes i18n to react-i18next
  .init({
    resources,
    lng: initialLanguage, // Set the initial language here
    fallbackLng: fallbackLanguage,
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    // Optional: Add debug mode if you need it
    // debug: true, 
  });


  
export const setLanguage = async (lang) => {
  const isRTL = lang === "ar";
  console.log('appLanguage' + lang)
  // حفظ اللغة
  await AsyncStorage.setItem("appLanguage", lang);

  // تغيير لغة i18next فوراً
  await i18n.changeLanguage(lang);
   console.log("i18n.dir" + i18n.dir);
    console.log("lang" + lang);
  // إذا كان الـ RTL يحتاج تغيير
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);

    // Restart (يعمل فقط داخل EAS Build)
    await Updates.reloadAsync();
  }
};

export const loadLanguage = async () => {
  const savedLang = await AsyncStorage.getItem("appLanguage") || "en";
  const isRTL = savedLang === "ar";

  await AsyncStorage.setItem("appLanguage", savedLang);

  // علامة لمنع الـ Loop
  const justReloaded = await AsyncStorage.getItem("justReloaded");
    
  // ↪ إذا التطبيق قام بإعادة التشغيل للتو
  if (justReloaded === "true") {
    await AsyncStorage.removeItem("justReloaded"); // نظّف العلامة
    await i18n.changeLanguage(savedLang);
    return;
  }

  // ↪ إذا الاتجاه غير مطابق → نحتاج Reload مرة واحدة
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);

    // ضع علامة أننا سنقوم بـ reload
    await AsyncStorage.setItem("justReloaded", "true");

    await Updates.reloadAsync();
    return;
  }

  // لا يوجد أي تغيير → فقط غيّر اللغة
  await i18n.changeLanguage(savedLang);
};

  

export default i18n;
