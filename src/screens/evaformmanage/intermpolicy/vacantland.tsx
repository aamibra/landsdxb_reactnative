import { AccordionSection } from '@/components/AccordionSection';
import AreaNamePicker from '@/components/AreaNamePicker';
import { applyMask } from '@/constant/applyMask';
import { e, evaluatevlandform_api, getvlandform_api } from '@/constant/DXBConstant';
import { getDropdownDataWithCache } from '@/Services/CacheService';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import FilePreviewModal from '@/components/FilePreviewModal';
import RTLText from '@/components/RTLText';
import api from '@/Services/axiosInstance';
import i18n from '@/Services/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import PagerView from 'react-native-pager-view';



function numberWithCommas(x) {
  if (x == null) return '';
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

function removeCommas(str) {
  if (str == null) return '';
  return str.toString().trim().replace(/,/g, '');
}


const numberCommas = (x) => {
  if (!x) return '';

  const num = x.toString().replace(/,/g, '');

  // تحقق إذا الإدخال رقم عشري فقط
  if (!/^\d*\.?\d*$/.test(num)) return '';

  return parseFloat(num).toLocaleString('en-US');
};


const SectionLabel = ({ title }: any) => {
  return (
    <View style={styles.labelContainer}>
      <RTLText style={styles.labelText}>{title}</RTLText>
    </View>
  );
};


const VacantLand = ({ navigation, route }: any) => {
  const formid = route.params?.formid;

  const [language, setLanguage] = useState('en');
  const [isArabic, setIsArabic] = useState(false);
  const [switchLanguage, setSwitchLanguage] = useState('ar');
  const [loading, setLoading] = useState(false);
  const [dropdown, setDropdown] = useState<Record<string, { id: number; text: string, name_en: string, name_ar: string }[]>>({});
  const pagerRef = useRef(null);
  const [showBuildArea, setShowBuildArea] = useState(true);

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFiles, setPreviewFiles] = useState([]); // ⬅️ List of files
  const [showPreviewButton, setShowPreviewButton] = useState(false);


  const [showExtraFields, setShowExtraFields] = useState(false);
  const [formData, setFormData] = useState({
    formid: '',
    applicantname: '',
    applicantemail: '',
    applicantmobile: '',
    deliveryaddress: '',
    applicanttrn: '',
    typeofvaluation: '',
    purpose: '',
    // RealEstate Section
    areanameid: '',
    arealabel: '',
    landsectionid: '',
    landtypeno: '1',
    categoryownland: '',
    plotnumber: '',
    usage: '',
    municipaltynumber: '',
    areasize: '',
    landareasqm: '',
    areaallowed: '',
    arearatio: '',
    height: '',
    areaprice: '',
    efratio: '',
    grossvalue: '',
    areapricesqm: '',
    isshownote: 'false',
    note: '',
    certificatenote: '',
    titleDeed: null,
    siteMap: null,
    otherDoc: null,
    titledeedid: '',
    titledeedname: '',
    titledeedimg: '',
    sitemapid: '',
    sitemapname: '',
    sitemapimg: '',
    otherdocumentid: '',
    otherdocumentname: '',
    otherdocumentimg: '',
  });

  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('appLanguage');
        const lang = storedLanguage || 'en';
        setLanguage(lang);
        setSwitchLanguage(storedLanguage === 'en' ? 'ar' : 'en');
        setIsArabic(lang === 'ar');
      } catch (error) {
        console.log('Error fetching language:', error);
      }
    };

    fetchLanguage();
  }, []);
 
  const cleanNumber = (val) => {
    if (!val) return NaN;

    const cleaned = val.toString().replace(/,/g, '');

    return isNaN(cleaned) ? NaN : parseFloat(cleaned);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t('vacantpolicy'),
    });
  }, [navigation, i18n.language]);

  const [collapse, setCollapse] = useState({
    applicant: false,
    realEstate: false,
    documents: false,
    evaluation: false,
    certificate: false
  });

  useEffect(() => {
    const loadPolicy = async () => {
      if (!formid) return;

      try {
        const res = await api.get(getvlandform_api, {
          params: { formid: formid },
        });

        if (res.status === 200 && res.data) {
          const data = res.data;

          setFormData({
            formid: data.formid || '',
            applicantname: data.applicantname || '',
            applicantemail: data.applicantemail || '',
            applicantmobile: data.applicantmobile || '',
            deliveryaddress: data.deliveryaddress || '',
            applicanttrn: data.applicanttrn || '',
            purpose: data.purpose || '',
            typeofvaluation: data.typeofvaluation || '',
            landsectionid: data.landsectionid || '',
            landtypeno: data.landtypeno?.toString() || '',
            categoryownland: data.categoryownland?.toString() || '',
            areanameid: data.areanameid || '',
            arealabel: data.arealabel || '',
            usage: data.usage || '',
            plotnumber: data.plotnumber || '',
            municipaltynumber: data.municipaltynumber || '',
            areasize: data.areasize || '',
            landareasqm: data.landareasqm || '',
            areaallowed: data.areaallowed || '',
            arearatio: data.arearatio || '',
            height: data.height || '',
            areaprice: '',
            efratio: '',
            grossvalue: '',
            areapricesqm: '',
            isshownote: 'false',
            note: '',
            certificatenote: '',
            // Images (assuming you want to display uploaded file names)
            titleDeed: null,
            siteMap: null,
            otherDoc: null,
            // You can store the IDs and names if needed
            titledeedid: data.titledeedid || '',
            titledeedimg: data.titledeedimg || '',
            titledeedname: data.titledeedname || '',
            sitemapid: data.sitemapid || '',
            sitemapimg: data.sitemapimg || '',
            sitemapname: data.sitemapname || '',
            otherdocumentid: data.otherdocumentid || '',
            otherdocumentimg: data.otherdocumentimg || '',
            otherdocumentname: data.otherdocumentname || '',
          });

          setShowExtraFields(data.categoryownland?.toString() === '1');

          setFormData(prev => {

            const categoryownland = data.categoryownland || '';
            let areasize = data.areasize || '';
            let arearatio = data.arearatio || '';

            let areaname = data.areaname;

            if (areaname != null && areaname !== '') {
              prev.areanameid = areaname.areanameid;
              prev.arealabel = areaname.arealabel;

            } else {
              areaname = '';
            }

            /* if (categoryownland === '1') {
               // Arabian Gulf → أظهر الحقول
               setShowExtraFields(true);
             } else {
               // Citizen → أخفِ الحقول وامسح القيم
               setShowExtraFields(false);
             }*/

            let landareasqm = areasize ? (parseFloat(areasize) / e).toFixed(2) : '';

            let areaallowed = '';

            if (
              arearatio != null &&              // not null and not undefined
              areasize != null &&               // not null and not undefined
              !isNaN(parseFloat(arearatio)) &&  // arearatio can be parsed to number
              !isNaN(parseFloat(areasize))      // areasize can be parsed to number
            ) {
              // إذا كل شيء صحيح، نفّذ العملية
              areaallowed = (parseFloat(arearatio) * parseFloat(areasize)).toFixed(2);
              setShowBuildArea(false);
            } else {
              // خلاف ذلك، اتركه كـ '' أو قيمة افتراضية
              areaallowed = '';
              setShowBuildArea(true);
            }

            areasize = numberWithCommas(data.areasize) || '';
            arearatio = numberWithCommas(arearatio) || '';
            areaallowed = numberWithCommas(areaallowed) || '';
            landareasqm = numberWithCommas(landareasqm) || '';


            return {
              ...prev,
              areasize: areasize,
              arearatio: arearatio,
              areaallowed: areaallowed,
              landareasqm: landareasqm,
            };
          });


        } else {
          console.log('Policy not found');
        }
      } catch (error) {
        console.error('Error fetching policy data:', error);
      }
    };

    loadPolicy();
  }, []);


  useEffect(() => {
    const loadDropdowns = async () => {
      const dropdowns = await getDropdownDataWithCache();
      setDropdown(dropdowns);
    };

    loadDropdowns();
  }, []);

  useEffect(() => {
    const hasServerFiles =
      !!formData?.titledeedimg ||
      !!formData?.sitemapimg ||
      !!formData?.otherdocumentimg;

    const hasLocalFiles = previewFiles.length > 0;

    setShowPreviewButton(hasServerFiles || hasLocalFiles);
  }, [formData, previewFiles]);

  const toggleSection = (section) => {
    setCollapse((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (key, value) => {
    // setFormData((prev) => ({ ...prev, [key]: value }));
    setFormData(prev => {
      const updatedForm = { ...prev, [key]: value };

      // إذا غيّر المستخدم categoryLand
      if (key === 'categoryownland') {
        if (value === '1') {
          // Arabian Gulf → أظهر الحقول
          setShowExtraFields(true);
          updatedForm.grossvalue = '';
        } else {
          // Citizen → أخفِ الحقول وامسح القيم
          setShowExtraFields(false);
          updatedForm.arearatio = '';
          updatedForm.areaallowed = '';
          updatedForm.efratio = '';
          updatedForm.grossvalue = '';
        }
      }
      return updatedForm;
    });

  };



  const pickDocument = async (key) => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ الطريقة الجديدة
      allowsMultipleSelection: false,
    });


    if (!result.canceled && result.assets.length > 0) {
      const file = result.assets[0];

      const fileToUpload = {
        uri: file.uri,
        name: file.fileName || file.uri.split('/').pop(),
        type: file.mimeType || 'application/octet-stream', // تأكد من تحديد نوع الملف
      };

      handleChange(key, fileToUpload);

      // تحديث previewFiles بحيث يظهر زر المعاينة
      setPreviewFiles(prev => {
        // استبدل الملف لنفس النوع (key) أو أضفه جديد
        const filtered = prev.filter(f => f.key !== key);
        return [...filtered, fileToUpload];
      });

      // لو حاب تخزن اسم الملف لعرضه
      if (key === 'siteMap') {
        handleChange('sitemapname', fileToUpload.name);
      } else if (key === 'titleDeed') {
        handleChange('titledeedname', fileToUpload.name);
      } else if (key === 'otherDoc') {
        handleChange('otherdocumentname', fileToUpload.name);
      }
    }

  };



  const goToPage = (pageIndex) => {
    pagerRef.current?.setPage(pageIndex);
  };

  const handleSubmit = async () => {


    try {
      setLoading(true);


      let areasize = removeCommas(formData.areasize) || '';
      let arearatio = removeCommas(formData.arearatio) || '';
      let areaprice = removeCommas(formData.areaprice) || '';
      let efratio = removeCommas(formData.efratio) || '';
      let grossvalue = removeCommas(formData.grossvalue) || '';

      const ServerData = new FormData();

      ServerData.append("applicantname", formData.applicantname);
      ServerData.append("applicantemail", formData.applicantemail);
      ServerData.append("applicantmobile", formData.applicantmobile);
      ServerData.append("deliveryaddress", formData.deliveryaddress);
      ServerData.append("applicanttrn", formData.applicanttrn);
      ServerData.append("typeofvaluation", formData.typeofvaluation);
      ServerData.append("purpose", formData.purpose);
      ServerData.append("areanameid", formData.areanameid);
      ServerData.append("plotnumber", formData.plotnumber);
      ServerData.append("municipaltynumber", formData.municipaltynumber);
      ServerData.append("areasize", areasize);
      ServerData.append("arearatio", arearatio);
      ServerData.append("categoryownland", formData.categoryownland);
      ServerData.append("landtypeno", formData.landtypeno);
      ServerData.append("usage", formData.usage);
      ServerData.append("height", formData.height);
      ServerData.append("isshownote", formData.isshownote);
      ServerData.append("note", formData.note);
      ServerData.append("certificatenote", formData.certificatenote);
      ServerData.append("areaprice", areaprice);
      ServerData.append("grossvalue", grossvalue);
      //ServerData.append("efratio", formData.efratio);

      // أضف الملفات بشكل صحيح
      if (formData.siteMap && formData.siteMap.uri) {
        ServerData.append("sitemapfile", formData.siteMap);
      }

      if (formData.titleDeed && formData.titleDeed.uri) {
        ServerData.append("titledeedfile", formData.titleDeed);
      }

      if (formData.otherDoc && formData.otherDoc.uri) {
        ServerData.append("otherdocumentfile", formData.otherDoc);
      }

      if (formData.efratio) {
        ServerData.append("efratio", efratio);
      }
      if (formData.titledeedid) {
        ServerData.append("titledeedid", formData.titledeedid);
      }
      if (formData.sitemapid) {
        ServerData.append("sitemapid", formData.sitemapid);
      }
      if (formData.otherdocumentid) {
        ServerData.append("otherdocumentid", formData.otherdocumentid);
      }

      if (formid) {
        ServerData.append("formid", formid);
      }

      const response = await fetch(
        evaluatevlandform_api,
        {
          method: 'POST',
          body: ServerData,
          headers: {
            Accept: 'application/json',
            // لا تضف Content-Type عند استخدام FormData
          },
        }
      );

      const responseData = await response.json().catch(() => null);

      if (response.ok) {
        navigation.goBack();
      } else {
        console.log('Server response error:', responseData || response);

        let errorMessages = 'Unknown error occurred.';

        if (responseData) {
          if (responseData.Errors) {
            errorMessages = Object.values(responseData.Errors).flat().join('\n');
          } else if (responseData.Message) {
            errorMessages = responseData.Message;
          } else {
            errorMessages = JSON.stringify(responseData, null, 2);
          }
        }

        Alert.alert('Validation Errors', errorMessages);
      }
    } catch (error) {
      console.error('Error submitting user:', error);
      Alert.alert('Error', 'Something went wrong while submitting the user.');
    } finally {
      setLoading(false);
    }



    // console.log('Form Data:', formData);
    //  alert('Form submitted! Check console.');
  };


  // مثال عند فتح المعاينة (تعديل حسب بياناتك)
  const openPreview = () => {
    const files = [];

    // helper لتجهيز الملفات
    const prepareFile = (uri, type, name, label) => ({ uri, type, name, label });

    // titleDeed
    if (formData.titleDeed?.uri) {
      files.push(prepareFile(formData.titleDeed.uri, formData.titleDeed.type, formData.titleDeed.name, i18n.t('titledeed')));
    } else if (formData.titledeedimg) {
      const base64 = formData.titledeedimg;
      const isPdf = base64.startsWith('%PDF') || base64.includes('application/pdf');
      const type = isPdf ? 'application/pdf' : 'image/jpeg';
      //const uri = `data:${type};base64,${base64}`;
      const uri = `${base64}`;
      files.push(prepareFile(uri, type, formData.titledeedname || 'title_deed', i18n.t('titledeed')));
    }

    // siteMap
    if (formData.siteMap?.uri) {
      files.push(prepareFile(formData.siteMap.uri, formData.siteMap.type, formData.siteMap.name, i18n.t('sitemap')));
    } else if (formData.sitemapimg) {
      const base64 = formData.sitemapimg;
      const isPdf = base64.startsWith('%PDF') || base64.includes('application/pdf');
      const type = isPdf ? 'application/pdf' : 'image/jpeg';
      const uri = `${base64}`;
      files.push(prepareFile(uri, type, formData.sitemapname || 'site_map', i18n.t('sitemap')));
    }

    // otherDoc
    if (formData.otherDoc?.uri) {
      files.push(prepareFile(formData.otherDoc.uri, formData.otherDoc.type, formData.otherDoc.name, i18n.t('otherdocument')));
    } else if (formData.otherdocumentimg) {
      const base64 = formData.otherdocumentimg;
      const isPdf = base64.startsWith('%PDF') || base64.includes('application/pdf');
      const type = isPdf ? 'application/pdf' : 'image/jpeg';
      const uri = `${base64}`;
      files.push(prepareFile(uri, type, formData.otherdocumentname || 'other_doc', i18n.t('otherdocument')));
    }

    if (files.length > 0) {
      setPreviewFiles(files);
      setPreviewVisible(true);
    }
  };



  const handleAreaChange = (field, value) => {
    // اجعل القيمة رقمية فقط مع السماح بالفاصلة
    const numericValue = value.replace(/[^0-9.]/g, '');

    if (field === 'areasize') {
      // SQF → احسب SQM
      const sqm = numericValue ? (parseFloat(numericValue) / e).toFixed(2) : '';
      setFormData(prev => ({
        ...prev,
        areasize: numericValue,
        landareasqm: sqm,
      }));
    } else if (field === 'landareasqm') {
      // SQM → احسب SQF
      const sqf = numericValue ? (parseFloat(numericValue) * e).toFixed(2) : '';
      setFormData(prev => ({
        ...prev,
        landareasqm: numericValue,
        areasize: sqf,
      }));
    }
  };


  const handleSmartChange = (field, value) => {
    const numericValue = value.replace(/[^0-9.]/g, '');

    setFormData(prev => {
      const updated = { ...prev, [field]: numericValue };

      const landArea = cleanNumber(updated.areasize);
      const landAreaSQM = cleanNumber(updated.landareasqm);
      const far = cleanNumber(updated.arearatio);
      const ratioAllowed = cleanNumber(updated.areaallowed);
      const buildArea = cleanNumber(updated.efratio);
      const price = cleanNumber(updated.areaprice);
      const landType = updated.categoryownland;

      // --------------------------------------
      // 1. التحويل بين SQF <-> SQM

      if (field === 'landareasqm') {
        if (numericValue === '') {
          updated.areasize = '';
          updated.arearatio = '';
          updated.areaallowed = '';
          updated.grossvalue = '';
        } else {

          let landarea = (parseFloat(numericValue) * e).toFixed(2);
          landarea = numberCommas(landarea);
          updated.areasize = landarea;

          if (!isNaN(far) && far !== 0) {
            let allowed = (far * (parseFloat(numericValue) * e)).toFixed(2);
            allowed = numberCommas(allowed);
            updated.areaallowed = allowed;
          }

          if (!isNaN(ratioAllowed) && ratioAllowed !== 0) {
            let FARatio = (ratioAllowed / (parseFloat(numericValue) * e)).toFixed(2);
            FARatio = numberCommas(FARatio);
            updated.arearatio = FARatio;
          }

        }
      }

      if (field === 'areasize') {
        if (numericValue === '') {
          updated.landareasqm = '';
          updated.arearatio = '';
          updated.areaallowed = '';
          updated.grossvalue = '';
        } else {
          let landsqm = (parseFloat(numericValue) / e).toFixed(2);
          landsqm = numberCommas(landsqm);
          updated.landareasqm = landsqm;

          if (!isNaN(far) && far !== 0) {
            let allowed = (far * numericValue).toFixed(2);
            allowed = numberCommas(allowed);
            updated.areaallowed = allowed;
          }

          if (!isNaN(ratioAllowed) && ratioAllowed !== 0) {
            let FARatio = (ratioAllowed / landArea).toFixed(2);
            FARatio = numberCommas(FARatio);
            updated.arearatio = FARatio;
          }
        }
      }

      // --------------------------------------
      // 2. نسبة السماح <-> FAR


      if (field === 'arearatio') {
        if (numericValue === '') {
          setShowBuildArea(true);
          updated.areaallowed = '';
        } else {
          if (!isNaN(landArea) && landArea !== 0) {
            setShowBuildArea(false);
            let allowed = (parseFloat(numericValue) * landArea).toFixed(2);
            allowed = numberCommas(allowed);
            updated.areaallowed = allowed;
          } else {
            setShowBuildArea(true);
            updated.arearatio = '';
            updated.areaallowed = '';
            updated.grossvalue = '';
          }
        }
      }


      if (field === 'areaallowed') {
        if (numericValue === '') {
          setShowBuildArea(true);
          updated.arearatio = '';
        } else {
          if (!isNaN(landArea) && landArea !== 0) {
            setShowBuildArea(false);
            let FARatio = (ratioAllowed / landArea).toFixed(2);
            FARatio = numberCommas(FARatio);
            updated.arearatio = FARatio;
          } else {
            setShowBuildArea(true);
            updated.arearatio = '';
            updated.areaallowed = '';
            updated.grossvalue = '';
          }
        }
      }

      //   if ((field === 'landArea' || field === 'far') && !isNaN(landArea) && !isNaN(far)) {
      //    updated.areaallowed = (landArea * far).toFixed(2);
      //  }

      //  if (field === 'areaallowed' && !isNaN(ratioAllowed) && !isNaN(landArea) && landArea !== 0) {
      //    updated.far = (ratioAllowed / landArea).toFixed(2);
      //  }

      if (field === 'areaprice') {
        if (numericValue === '') {
          updated.areapricesqm = '';
          updated.grossvalue = '';
        } else {
          let sqm = (parseFloat(numericValue) * e).toFixed(2);
          sqm = numberCommas(sqm);
          updated.areapricesqm = sqm;
        }
      }

      if (field === 'areapricesqm') {
        if (numericValue === '') {
          updated.areaprice = '';
          updated.grossvalue = '';
        } else {
          let sqf = (parseFloat(numericValue) / e).toFixed(2);
          sqf = numberCommas(sqf);
          updated.areaprice = sqf;
        }
      }


      // --------------------------------------
      // 3. التحكم بعرض Build Area حسب FAR
      if (field === 'arearatio') {
        setShowBuildArea(numericValue === '');
        updated.grossvalue = '';
      }

      // --------------------------------------
      // 4. حساب Gross Value
      if (landType === '2' && !isNaN(price)) {
        if (!isNaN(far) && !isNaN(landArea)) {
          let grossvalue = (far * landArea * price).toFixed(2);
          grossvalue = numberCommas(grossvalue);
          updated.grossvalue = grossvalue;

        } else if (!isNaN(buildArea)) {
          let grossvalue = (buildArea * price).toFixed(2);
          grossvalue = numberCommas(grossvalue);
          updated.grossvalue = grossvalue;

        } else if (isNaN(far) && isNaN(buildArea) && !isNaN(price) && !isNaN(landArea)) {
          let grossvalue = (landArea * price).toFixed(2);
          grossvalue = numberCommas(grossvalue);
          updated.grossvalue = grossvalue;
        } else {
          updated.grossvalue = '';
        }
      }

      if ((landType === '1' || landType === '') && !isNaN(price)) {
        if (!isNaN(price) && !isNaN(landArea)) {
          let grossvalue = (landArea * price).toFixed(2);
          grossvalue = numberCommas(grossvalue);
          updated.grossvalue = grossvalue;
        } else {
          updated.grossvalue = '';
        }
      }


      return updated;
    });
  };

  // --- for email ----
  // Allow only valid email characters as user types
  const handleEmailChange = (key, value) => {
    const filtered = value.replace(/[^a-zA-Z0-9@._+-]/g, '');
    setFormData((prev) => ({ ...prev, [key]: filtered }));
  };

  // Simple email validation regex
  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // On blur or submit: clear if invalid
  const handleBlur = (key: any) => {
    if (formData.applicantemail !== '' && !isValidEmail(formData.applicantemail)) {
      setFormData((prev) => ({ ...prev, [key]: '' })); // Clear incomplete/invalid input like clearIncomplete:true
    }
  };

  const handleCommaBlur = (key, value) => {
    setFormData(prev => {
      let commavalue = numberCommas(value);
      return { ...prev, [key]: commavalue };
    });
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }


  return (
    <View style={{ flex: 1 }}>
      <PagerView style={styles.pagerView} initialPage={0} ref={pagerRef}>
        {/* الصفحة الأولى */}
        <ScrollView contentContainerStyle={styles.page} key="1">
          <RTLText style={styles.header}> {i18n.t('vacantlandform')}</RTLText>

          {/* قسم المعلومات الشخصية */}
          <AccordionSection
            title={i18n.t('applicantinfo')}
            isCollapsed={collapse.applicant}
            toggle={() => toggleSection('applicant')}
          >
            <RTLText style={styles.label}>{i18n.t('applicanttrn')}</RTLText>
            <TextInput style={styles.input} placeholder={i18n.t('applicanttrn')} value={formData.applicanttrn} onChangeText={(text) => handleChange('applicanttrn', text)} />
            <RTLText style={styles.label}>{i18n.t('applicantname')}</RTLText>
            <TextInput style={styles.input} placeholder={i18n.t('applicantname')} value={formData.applicantname} onChangeText={(text) => handleChange('applicantname', text)} />
            <RTLText style={styles.label}>{i18n.t('mobile')} </RTLText>
            <TextInput style={styles.input} placeholder={i18n.t('mobile')} value={formData.applicantmobile} onChangeText={(text) => handleChange('applicantmobile', applyMask(text, '(999) 999-9999'))} keyboardType="numeric" />
            <RTLText style={styles.label}>{i18n.t('email')}</RTLText>
            <TextInput style={styles.input} placeholder={i18n.t('email')} value={formData.applicantemail} onChangeText={(text) => handleEmailChange('applicantemail', text)} onBlur={(text) => handleBlur('applicantemail')} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
            <RTLText style={styles.label}>{i18n.t('deliveryaddress')}</RTLText>
            <TextInput style={styles.inputarea} placeholder={i18n.t('deliveryaddress')} value={formData.deliveryaddress} onChangeText={(text) => handleChange('deliveryaddress', text)} />
            <RTLText style={styles.label}>{i18n.t('selectpurpose')}</RTLText>
            <View style={styles.pickerWrapper}>
              <Picker
                style={{ height: 70 }}
                selectedValue={formData.purpose}
                onValueChange={(itemValue: string) => handleChange('purpose', itemValue)}
              >
                <Picker.Item label={i18n.t('selectpurpose')} value={null} />
                {Object.entries(dropdown)
                  .filter(([key]) => key === 'purpose')
                  .map(([menuKey, options]) => (
                    options.map((item) => (
                      <Picker.Item key={item.id} label={isArabic ? item.name_ar : item.name_en} value={item.id} />
                    ))
                  ))}
              </Picker>
            </View>
            <RTLText style={styles.label}>{i18n.t('selecttypeofvaluation')}</RTLText>
            <View style={styles.pickerWrapper} >
              <Picker
                style={{ height: 70 }}
                selectedValue={formData.typeofvaluation}
                onValueChange={(itemValue: string) => handleChange('typeofvaluation', itemValue)}
              >
                <Picker.Item label={i18n.t('selecttypeofvaluation')} value={null} />
                {Object.entries(dropdown)
                  .filter(([key]) => key === 'vlandevatype')
                  .map(([menuKey, options]) => (
                    options.map((item) => (
                      <Picker.Item key={item.id} label={isArabic ? item.name_ar : item.name_en} value={item.id} />
                    ))
                  ))}
              </Picker>
            </View>
          </AccordionSection>

          {/* معلومات العقار */}
          <AccordionSection
            title={i18n.t('realestateinformation')}
            isCollapsed={collapse.realEstate}
            toggle={() => toggleSection('realEstate')}
          >
            {/* Category Land */}
            <RTLText style={styles.label}>{i18n.t('categoryland')}</RTLText>
            <View style={styles.pickerWrapper}>
              <Picker
                style={{ height: 70 }}
                selectedValue={formData.categoryownland}
                onValueChange={(itemValue) => handleChange('categoryownland', itemValue)}
              >
                <Picker.Item label={i18n.t('selectcategoryland')} value="" />
                <Picker.Item label={i18n.t('freeholdland')} value="1" />
                <Picker.Item label={i18n.t('citizenarabiangulf')} value="2" />
              </Picker>
            </View>

            {/* Land Type Number */}
            <RTLText style={styles.label}>{i18n.t('landtypenumber')} </RTLText>
            <View style={styles.pickerWrapper}>
              <Picker
                style={{ height: 70 }}
                selectedValue={formData.landtypeno}
                onValueChange={(itemValue) => handleChange('landtypeno', itemValue)}
              >
                <Picker.Item label={i18n.t('selectlandtypenumber')} value="" />
                <Picker.Item label={i18n.t('plotnumber')} value="1" />
                <Picker.Item label={i18n.t('municipalitynumber')} value="2" />
              </Picker>
            </View>

            {/* باقي الحقول */}
            {/* Show Plot No if landTypeNumber == "1" */}
            {formData.landtypeno === "1" && (
              <View>
                <RTLText style={styles.label}>{i18n.t('plotnumber')}</RTLText>
                <TextInput
                  style={styles.input}
                  placeholder={i18n.t('plotnumber')}
                  value={formData.plotnumber}
                  onChangeText={(text) => handleChange('plotnumber', text)}
                />
              </View>
            )}

            {/* Show Municipality No if landTypeNumber == "2" */}
            {formData.landtypeno === "2" && (
              <View>
                <RTLText style={styles.label}>{i18n.t('municipalitynumber')}</RTLText>
                <TextInput
                  style={styles.input}
                  placeholder={i18n.t('municipalitynumber')}
                  value={formData.municipaltynumber}
                  onChangeText={(text) =>
                    handleChange('municipaltynumber', applyMask(text, '999-99999'))
                  }
                  keyboardType="numeric"
                />
              </View>
            )}

            <RTLText style={styles.label}>{i18n.t('selectareaname')}</RTLText>
            <AreaNamePicker
              value={formData.areanameid}
              selectedLabel={formData.arealabel}
              onChange={(id, label) => {
                setFormData({ ...formData, areanameid: id, arealabel: label });
              }}
            />

            <RTLText style={styles.label}>{i18n.t('landareasqf')}</RTLText>
            <TextInput style={styles.input} placeholder={i18n.t('landareasqf')} value={formData.areasize} onBlur={(text) => handleCommaBlur('areasize', formData.areasize)} onChangeText={(text) => handleSmartChange('areasize', text)} keyboardType="numeric" />
            <RTLText style={styles.label}>{i18n.t('landareasqm')}</RTLText>
            <TextInput style={styles.input} placeholder={i18n.t('landareasqm')} value={formData.landareasqm} onBlur={(text) => handleCommaBlur('landareasqm', formData.landareasqm)} onChangeText={(text) => handleSmartChange('landareasqm', text)} keyboardType="numeric" />

            {showExtraFields && (
              <View >
                <RTLText style={styles.label}>{i18n.t('arearatio')}</RTLText>
                <TextInput style={styles.input} placeholder={i18n.t('arearatio')} value={formData.arearatio} onBlur={(text) => handleCommaBlur('arearatio', formData.arearatio)} onChangeText={(text) => handleSmartChange('arearatio', text)} keyboardType="numeric" />
                <RTLText style={styles.label}>{i18n.t('ratioallowd')}</RTLText>
                <TextInput style={styles.input} placeholder={i18n.t('ratioallowd')} value={formData.areaallowed} onBlur={(text) => handleCommaBlur('areaallowed', formData.areaallowed)} onChangeText={(text) => handleSmartChange('areaallowed', text)} keyboardType="numeric" />
              </View>
            )}

            <RTLText style={styles.label}>{i18n.t('selectusage')}</RTLText>
            <View style={styles.pickerWrapper}>
              <Picker
                style={{ height: 50 }}
                selectedValue={formData.usage}
                onValueChange={(itemValue: string) => handleChange("usage", itemValue)}
              >
                <Picker.Item label={i18n.t('selectusage')} value={null} />
                {Object.entries(dropdown)
                  .filter(([key]) => key === 'usage')
                  .map(([menuKey, options]) => (
                    options.map((item) => (
                      <Picker.Item key={item.id} label={isArabic ? item.name_ar : item.name_en} value={item.id} />
                    ))
                  ))}
              </Picker>
            </View>
            <RTLText style={styles.label}>{i18n.t('height')}</RTLText>
            <TextInput style={styles.input} placeholder={i18n.t('height')} value={formData.height} onChangeText={(text) => handleChange('height', text)} />
          </AccordionSection>

          {/* المستندات المطلوبة */}
          <AccordionSection
            title={i18n.t('requirementdocuments')}
            isCollapsed={collapse.documents}
            toggle={() => toggleSection('documents')}
          >
            <RTLText style={styles.label}>{i18n.t('sitemap')}</RTLText>
            <TouchableOpacity style={styles.uploadButton} onPress={() => pickDocument('siteMap')}>
              <RTLText>{formData.sitemapname || (formData.siteMap ? i18n.t('sitemapuploaded') : i18n.t('uploadsitemap'))}</RTLText>
            </TouchableOpacity>
            <RTLText style={styles.label}>{i18n.t('titledeed')}</RTLText>
            <TouchableOpacity style={styles.uploadButton} onPress={() => pickDocument('titleDeed')}>
              <RTLText>{formData.titledeedname || (formData.titleDeed ? i18n.t('titledeeduploaded') : i18n.t('uploadtitledeed'))}</RTLText>
            </TouchableOpacity>
            <RTLText style={styles.label}>{i18n.t('otherdocument')}</RTLText>
            <TouchableOpacity style={styles.uploadButton} onPress={() => pickDocument('otherDoc')}>
              <RTLText>{formData.otherdocumentname || (formData.otherDoc ? i18n.t('otherdocumentuploaded') : i18n.t('uploadotherdocument'))}</RTLText>
            </TouchableOpacity>
            {showPreviewButton && (
              <View style={{ margin: 10 }}>
                <Button title={i18n.t('previewfile')} onPress={openPreview} />
              </View>
            )}

          </AccordionSection>

          <View style={{ marginHorizontal: 20 }}>
            <Button title={i18n.t('next')} onPress={() => goToPage(1)} />
          </View>

        </ScrollView>

        {/* الصفحة الثانية - كما كانت */}
        <ScrollView contentContainerStyle={styles.page} key="2">
          <RTLText style={styles.header}>{i18n.t('evaluationvacantland')}</RTLText>

          <AccordionSection
            title={i18n.t('landareaevaluation')}
            isCollapsed={collapse.evaluation}
            toggle={() => toggleSection('evaluation')}
          >
            <SectionLabel title={i18n.t('valuedependcost')} />
            <RTLText style={styles.label}>{i18n.t('pricearealand')}</RTLText>
            {showBuildArea && showExtraFields && (
              <View >
                <RTLText style={styles.label}>{i18n.t('buildarea')}</RTLText>
                <TextInput style={styles.input} placeholder={i18n.t('buildarea')} onBlur={(text) => handleCommaBlur('efratio', formData.efratio)} value={formData.efratio} onChangeText={(text) => handleSmartChange('efratio', text)} keyboardType="numeric" />
              </View>
            )}

            <RTLText style={styles.label}>{i18n.t('pricesqf')}</RTLText>
            <TextInput style={styles.input} placeholder={i18n.t('sqf')} onBlur={(text) => handleCommaBlur('areaprice', formData.areaprice)} value={formData.areaprice} onChangeText={(text) => handleSmartChange('areaprice', text)} keyboardType="numeric" />

            <RTLText style={styles.label}>{i18n.t('pricesqm')}</RTLText>
            <TextInput style={styles.input} placeholder={i18n.t('sqm')} onBlur={(text) => handleCommaBlur('areapricesqm', formData.areapricesqm)} value={formData.areapricesqm} onChangeText={(text) => handleSmartChange('areapricesqm', text)} keyboardType="numeric" />

            <RTLText style={styles.label}>{i18n.t('grossvalue')}</RTLText>
            <TextInput style={styles.input} placeholder={i18n.t('grossvalue')} onBlur={(text) => handleCommaBlur('grossvalue', formData.grossvalue)} value={formData.grossvalue} onChangeText={(text) => handleChange('grossvalue', text)} keyboardType="numeric" />
            <View style={styles.dottedLine} />
            {/* Is Show Certificate Note */}
            <RTLText style={styles.label}>{i18n.t('showcertificatenote')}</RTLText>
            <View style={styles.pickerWrapper}>
              <Picker
                style={{ height: 70 }}
                selectedValue={formData.isshownote}
                onValueChange={(itemValue) => handleChange('isshownote', itemValue)}
              >
                <Picker.Item label={i18n.t('yes')} value="true" />
                <Picker.Item label={i18n.t('no')} value="false" />
              </Picker>
            </View>

            <RTLText style={styles.label}>{i18n.t('note')}</RTLText>
            <TextInput style={[styles.input, { height: 100 }]} placeholder={i18n.t('note')} multiline value={formData.note} onChangeText={(text) => handleChange('note', text)} />
          </AccordionSection>

          <AccordionSection
            title={i18n.t('certificatesection')}
            isCollapsed={collapse.certificate}
            toggle={() => toggleSection('certificate')}
          >
            <RTLText style={styles.label}>{i18n.t('certificatenote')}</RTLText>
            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder={i18n.t('printcertificatenote')}
              multiline
              value={formData.certificatenote}
              onChangeText={(text) => handleChange('certificatenote', text)}
            />
          </AccordionSection>

          <Button title={i18n.t('submit')} onPress={handleSubmit} />
        </ScrollView>
      </PagerView>
      <FilePreviewModal
        visible={previewVisible}
        files={previewFiles}
        onClose={() => setPreviewVisible(false)} />
    </View>

  );
}

export default VacantLand;

const styles = StyleSheet.create({
  pagerView: { backgroundColor: '#fff', flex: 1 },
  page: {
    backgroundColor: '#fff',
    padding: 20, paddingBottom: 100
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10,
    marginVertical: 5, borderRadius: 6
  },
  inputarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    height: 150,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  uploadButton: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  accordionContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    overflow: 'hidden',
  },
  accordionHeader: {
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  accordionHeaderText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  accordionContent: {
    padding: 10,
    backgroundColor: '#fff',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginVertical: 5,
    height: 50,              // نفس ارتفاع الحقول
    justifyContent: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  dottedLine: {
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    borderColor: '#d9d9d9', // light gray (adjust as needed)
    marginVertical: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  labelContainer: {
    backgroundColor: '#4A90E2', // اللون الأزرق المشابه
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  labelText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});


