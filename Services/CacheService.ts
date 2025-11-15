import AsyncStorage from '@react-native-async-storage/async-storage';
import { get_LastDrpDownModified_api, get_options_api } from '../constant/DXBConstant';

import {
  CACHE_KEY_DropDownMenu, DROPDOWN_CACHE_KEY,
  DROPDOWN_DATE_KEY
} from '@/constant/DXBConstant';
  
import axios from 'axios';
import api from './axiosInstance';
 

export const getCachedDropdownMenu = async (): Promise<Record<string, any[]> | null> => {
  const cached =  await AsyncStorage.getItem(CACHE_KEY_DropDownMenu);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.warn('Failed to parse cached JSON', e);
    }
  }
  return null;
};

export const saveDropdownToCacheMenu = async (data: Record<string, any[]>) => { 
  await AsyncStorage.setItem(CACHE_KEY_DropDownMenu, JSON.stringify(data));
};


export async function getDropdownDataWithCache() {
  try {
    const result = await AsyncStorage.multiGet([
      DROPDOWN_CACHE_KEY,
      DROPDOWN_DATE_KEY,
    ]);

    const cachedData = result[0][1]; // القيمة المخزنة كـ string
    const cachedDate = result[1][1]; // التاريخ المخزن

    const localData = cachedData ? JSON.parse(cachedData) : null;
    const localDate = cachedDate ? cachedDate : null;

    // 🔹 نحصل على تاريخ آخر تحديث من السيرفر
    const serverDate = await fetchDropdownLastModified();

    // 🔹 إذا ما في بيانات محلية، أو البيانات قديمة → نحدّثها
    if (!localData || !localDate || new Date(serverDate) > new Date(localDate)) {
      console.log('📦 تحديث البيانات من السيرفر...');
      const newData = await fetchDropdownData();

      await AsyncStorage.multiSet([
        [DROPDOWN_CACHE_KEY, JSON.stringify(newData)],
        [DROPDOWN_DATE_KEY, serverDate],
      ]);

      return newData;
    }
  
    // 🔹 البيانات المحلية صالحة
    console.log('✅ استخدام البيانات من الكاش');
    return localData;
  } catch (error) {
    console.error('❌ خطأ في تحميل القوائم:', error);

    // fallback: حاول تحميل مباشرة من السيرفر
    const newData = await fetchDropdownData();
    await AsyncStorage.multiSet([
      [DROPDOWN_CACHE_KEY, JSON.stringify(newData)],
      [DROPDOWN_DATE_KEY, new Date().toISOString()],
    ]);

    return newData;
  }
}


// 🔹 تجيب تاريخ آخر تعديل من السيرفر فقط
  async function fetchDropdownLastModified(): Promise<string> {
  const res = await axios.get(get_LastDrpDownModified_api);


  return res.data.lastModified; // مثال: "2025-10-25T10:00:00Z"
}

// 🔹 تجيب كل القوائم من السيرفر
  async function fetchDropdownData(): Promise<Record<string, any[]> | null> {
  try {
    const res = await api.get(get_options_api);

    if (res.status === 200 && res.data.succeeded) {
      const result = res.data.result;
      const newMenus: Record<string, any[]> = {};

      Object.entries(result).forEach(([key, array]) => {
        if (Array.isArray(array)) {
          newMenus[key] = array;
        } else {
          console.warn(`⚠️ Value for key '${key}' is not an array.`);
        }
      });

      console.log('✅ Dropdown data fetched and processed successfully.');
      return newMenus;
    } else {
      console.warn(`⚠️ API returned error ${res.status}`, res.data.errors);
      return null;
    }
  } catch (error) {
    console.error('❌ Error fetching dropdown data:', error);
    return null;
  }
}




