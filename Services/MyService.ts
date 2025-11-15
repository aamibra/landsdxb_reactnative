import axios from 'axios';
import { Constant, get_LastDrpDownModified_api, get_options_api } from '../constant/DXBConstant';
import { ResultObjectModel } from '../Models/PolicyLandModel';
import { saveDropdownToCacheMenu } from '../Services/CacheService';
import api from './axiosInstance';


export const fetchAndCacheDropdown = async (): Promise<void> => {
  try {
    const response = await axios.get<ResultObjectModel<any>>(
      Constant.policyservice + 'opt',
      { validateStatus: () => true }
    );

    if (response.status === 200 && response.data.succeeded) {
      const result = response.data.result;
      const newMenus: Record<string, any[]> = {};

      Object.entries(result).forEach(([key, array]) => {
        if (Array.isArray(array)) {
          newMenus[key] = array;
        } else {
          console.warn(`Value for key '${key}' is not an array.`);
        }
      });

      saveDropdownToCacheMenu(newMenus);

      console.log('Dropdown data cached successfully.');
    } else {
      console.warn(`API returned error ${response.status}`, response.data.errors);
    }
  } catch (error: any) {
    console.error('Error fetching dropdown data:', error.message);
  }
};


// 🔹 تجيب تاريخ آخر تعديل من السيرفر فقط
export async function fetchDropdownLastModified(): Promise<string> {
  const res = await axios.get(get_LastDrpDownModified_api);


  return res.data.lastModified; // مثال: "2025-10-25T10:00:00Z"
}

// 🔹 تجيب كل القوائم من السيرفر
export async function fetchDropdownData(): Promise<Record<string, any[]> | null> {
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
