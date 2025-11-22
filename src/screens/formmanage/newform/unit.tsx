import { AccordionSection } from '@/components/AccordionSection';
import AreaNamePicker from '@/components/AreaNamePicker';
import FilePreviewModal from '@/components/FilePreviewModal';
import RTLText from '@/components/RTLText';
import { applyMask } from '@/constant/applyMask';
import { creatunitform_api, e } from '@/constant/DXBConstant';
import { getDropdownDataWithCache } from '@/Services/CacheService';
import i18n from '@/Services/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';


const SectionLabel = ({ title }: any) => {
  return (
    <View style={styles.labelContainer}>
      <RTLText style={styles.labelText}>{title}</RTLText>
    </View>
  );
};

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

export default function UnitForm({ navigation, route }: any) {

  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isArabic, setIsArabic] = useState(false);
  const [switchLanguage, setSwitchLanguage] = useState('ar');
  const [previewFiles, setPreviewFiles] = useState([]); // ⬅️ List of files
  const [showPreviewButton, setShowPreviewButton] = useState(false);

  const [dropdown, setDropdown] = useState<Record<string, { id: number; text: string, name_en: string, name_ar: string }[]>>({});
  const [showExtraFields, setShowExtraFields] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t('unitform'),
    });
  }, [navigation, i18n.language]);

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
 

  const [formData, setFormData] = useState({
    applicantname: '',
    applicantmobile: '',
    applicantemail: '',
    deliveryaddress: '',
    applicanttrn: '',
    typeofvaluation: '',
    purpose: '',
    // RealEstate Section
    areaname: '',
    areanameid: '',
    arealabel: '',
    plotnumber: '',
    municipaltynumber: '',
    areasize: '',
    arearatio: '',
    landareasqm: '',
    areaallowed: '',
    categoryownland: '',
    landtypeno: '',
    usage: '',
    height: '',
    // Unit Section  
    unitnumber: '',
    projectname: '',
    subproject: '',
    completiondate: '',
    buildingnumber: '',
    numberoffloors: '',
    unitstatus: '',
    isrent: '0',
    rentvalue: '',
    sizeunite: '',
    sizeunitesqm: '',
    siteMap: null,
    sitemapid: '',
    sitemapname: '',
    sitemapimg: '',
    titleDeed: null,
    titledeedid: '',
    titledeedname: '',
    titledeedimg: '',
    otherDoc: null,
    otherdocumentid: '',
    otherdocumentname: '',
    otherdocumentimg: '',
  });


  // useEffect(() => {
  //   const loadData = async () => {
  //     const drpmenu = await getCachedDropdownMenu();

  //     if (drpmenu != null) {
  //       setDropdown(drpmenu); // ✅ Set state from returned data
  //     } else {
  //       await fetchAndCacheDropdown();
  //     }
  //   };

  //   loadData();
  // }, []);

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


  const [collapse, setCollapse] = useState({
    applicant: false,
    realEstate: false,
    unit: false,
    documents: false,
  });

  const toggleSection = (section: any) => {
    setCollapse((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (key: any, value: any) => {
    // setFormData((prev) => ({ ...prev, [key]: value }));
    setFormData(prev => {
      const updatedForm = { ...prev, [key]: value };

      // إذا غيّر المستخدم categoryLand
      if (key === 'categoryownland') {
        if (value === '1') {
          // Arabian Gulf → أظهر الحقول
          setShowExtraFields(true);
          //  updatedForm.landareagrossvalue = '';
        } else {
          // Citizen → أخفِ الحقول وامسح القيم
          setShowExtraFields(false);
          updatedForm.arearatio = '';
          updatedForm.areaallowed = '';
          // updatedForm.landareagrossvalue = '';
        }
      }

      if (key === 'unitstatus') {
        if (value == '2') {
          updatedForm.isrent = '0';
          updatedForm.rentvalue = '';
        }
      }


      return updatedForm;
    });

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


  const cleanNumber = (val) => {
    if (!val) return NaN;

    const cleaned = val.toString().replace(/,/g, '');

    return isNaN(cleaned) ? NaN : parseFloat(cleaned);
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


  const handleSubmit = async () => {
    //console.log('Form Data:', formData);
    //alert('Form submitted! Check console.');

    try {
      setLoading(true);

      let areasize = removeCommas(formData.areasize) || '';
      let arearatio = removeCommas(formData.arearatio) || '';
      let sizeunite = removeCommas(formData.sizeunite) || '';
      let rentvalue = removeCommas(formData.rentvalue) || '';

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
      ServerData.append("unitnumber", formData.unitnumber);
      ServerData.append("projectname", formData.projectname);
      ServerData.append("subproject", formData.subproject);
      ServerData.append("completiondate", formData.completiondate);
      ServerData.append("buildingnumber", formData.buildingnumber);
      ServerData.append("numberoffloors", formData.numberoffloors);
      ServerData.append("unitstatus", formData.unitstatus);
      ServerData.append("isrent", formData.isrent);
      ServerData.append("rentvalue", rentvalue);
      ServerData.append("sizeunite", formData.sizeunite);

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

      if (formData.titledeedid) {
        ServerData.append("titledeedid", formData.titledeedid);
      }
      if (formData.sitemapid) {
        ServerData.append("sitemapid", formData.sitemapid);
      }
      if (formData.otherdocumentid) {
        ServerData.append("otherdocumentid", formData.otherdocumentid);
      }


      const response = await fetch(
        creatunitform_api,
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


  };

  const handleSmartChange = (field: any, value: any) => {
    const numericValue = value.replace(/[^0-9.]/g, '');

    setFormData(prev => {
      const updated = { ...prev, [field]: numericValue };

      const landArea = cleanNumber(updated.areasize);
      const landAreaSQM = cleanNumber(updated.landareasqm);
      const arearatio = cleanNumber(updated.arearatio);
      const ratioAllowed = cleanNumber(updated.areaallowed);
      const sizeunite = cleanNumber(updated.sizeunite);
      const sizeunitesqm = cleanNumber(updated.sizeunitesqm);


      const landType = updated.categoryownland;


      // --------------------------------------
      // 1. التحويل بين SQF <-> SQM

      if (field === 'landareasqm') {
        if (numericValue === '') {
          updated.areasize = '';
          updated.arearatio = '';
          updated.areaallowed = '';
        } else {

          let landarea = (parseFloat(numericValue) * e).toFixed(2);
          landarea = numberCommas(landarea);
          updated.areasize = landarea;

          if (!isNaN(arearatio) && arearatio !== 0) {
            let allowed = (arearatio * (parseFloat(numericValue) * e)).toFixed(2);
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
        } else {
          let landsqm = (parseFloat(numericValue) / e).toFixed(2);
          landsqm = numberCommas(landsqm);
          updated.landareasqm = landsqm;

          if (!isNaN(arearatio) && arearatio !== 0) {
            let allowed = (arearatio * numericValue).toFixed(2);
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
          updated.areaallowed = '';
        } else {
          if (!isNaN(landArea) && landArea !== 0) {
            let allowed = (parseFloat(numericValue) * landArea).toFixed(2);
            allowed = numberCommas(allowed);
            updated.areaallowed = allowed;
          } else {
            updated.arearatio = '';
            updated.areaallowed = '';
          }
        }
      }

      if (field === 'areaallowed') {
        if (numericValue === '') {
          updated.arearatio = '';
        } else {
          if (!isNaN(landArea) && landArea !== 0) {
            let FARatio = (ratioAllowed / landArea).toFixed(2);
            FARatio = numberCommas(FARatio);
            updated.arearatio = FARatio;
          } else {
            updated.arearatio = '';
            updated.areaallowed = '';
          }
        }
      }

      if (field === 'sizeunite') {
        if (numericValue === '') {
          updated.sizeunitesqm = '';
        } else {
          let unitareasqm = (parseFloat(numericValue) / e).toFixed(2);
          unitareasqm = numberCommas(unitareasqm);
          updated.sizeunitesqm = unitareasqm;
        }
      }

      if (field === 'sizeunitesqm') {
        if (numericValue === '') {
          updated.sizeunite = '';
        } else {
          let unitarea = (parseFloat(numericValue) * e).toFixed(2);
          unitarea = numberCommas(unitarea);
          updated.sizeunite = unitarea;
        }
      }

      return updated;
    });
  };


  // --- for email ----
  // Allow only valid email characters as user types
  const handleEmailChange = (key: any, value: any) => {
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
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.page} key="1">
        <RTLText style={styles.header}>{i18n.t('unitform')}</RTLText>
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
          <RTLText style={styles.label}>{i18n.t('mobile')}</RTLText>
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
                .filter(([key]) => key === 'unitevatype')
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
          <RTLText style={styles.label}>{i18n.t('landtypenumber')}</RTLText>
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
          <TextInput style={styles.input} placeholder={i18n.t('landareasqf')} value={formData.areasize} onChangeText={(text) => handleSmartChange('areasize', text)} keyboardType="numeric" />
          <RTLText style={styles.label}>{i18n.t('landareasqm')}</RTLText>
          <TextInput style={styles.input} placeholder={i18n.t('landareasqm')} value={formData.landareasqm} onChangeText={(text) => handleSmartChange('landareasqm', text)} keyboardType="numeric" />

          {showExtraFields && (
            <View>
              <RTLText style={styles.label}>{i18n.t('arearatio')}</RTLText>
              <TextInput style={styles.input} placeholder={i18n.t('arearatio')} value={formData.arearatio} onChangeText={(text) => handleSmartChange('arearatio', text)} keyboardType="numeric" />
              <RTLText style={styles.label}>{i18n.t('ratioallowd')}</RTLText>
              <TextInput style={styles.input} placeholder={i18n.t('ratioallowd')} value={formData.areaallowed} onChangeText={(text) => handleSmartChange('areaallowed', text)} keyboardType="numeric" />
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

        {/* معلومات الوحدة */}
        <AccordionSection
          title={i18n.t('unitinformationresidential')}
          isCollapsed={collapse.unit}
          toggle={() => toggleSection('unit')}
        >
          <RTLText style={styles.label}>{i18n.t('mainprojectname')}</RTLText>
          <View style={styles.pickerWrapper}>
            <Picker
              style={{ height: 70 }}
              selectedValue={formData.projectname}
              onValueChange={(itemValue: string) => handleChange('projectname', itemValue)}
            >
              <Picker.Item label={i18n.t('selectprojectname')} value={null} />
              {Object.entries(dropdown)
                .filter(([key]) => key === 'project')
                .map(([menuKey, options]) => (
                  options.map((item) => (
                    <Picker.Item key={item.id} label={isArabic ? item.name_ar : item.name_en} value={item.id} />
                  ))
                ))}
            </Picker>
          </View>
          <RTLText style={styles.label}>{i18n.t('subproject')}</RTLText>
          <View style={styles.pickerWrapper}>
            <Picker
              style={{ height: 70 }}
              selectedValue={formData.subproject}
              onValueChange={(itemValue: string) => handleChange('subproject', itemValue)}
            >
              <Picker.Item label={i18n.t('selectsubproject')} value={null} />
              {Object.entries(dropdown)
                .filter(([key]) => key === 'subproject')
                .map(([menuKey, options]) => (
                  options.map((item) => (
                    <Picker.Item key={item.id} label={isArabic ? item.name_ar : item.name_en} value={item.id} />
                  ))
                ))}
            </Picker>
          </View>
          <RTLText style={styles.label}>{i18n.t('datecompletion')}</RTLText>
          <TextInput style={styles.input} placeholder={i18n.t('datecompletion')} value={formData.completiondate} onChangeText={(text) => handleChange('completiondate', text)} />
          <RTLText style={styles.label}>{i18n.t('buildingnumber')}</RTLText>
          <TextInput style={styles.input} placeholder={i18n.t('buildingnumber')} value={formData.buildingnumber} onChangeText={(text) => handleChange('buildingnumber', text)} />
          <RTLText style={styles.label}>{i18n.t('numberoffloors')}</RTLText>
          <TextInput style={styles.input} placeholder={i18n.t('numberoffloors')} value={formData.numberoffloors} onChangeText={(text) => handleChange('numberoffloors', text)} />
          <RTLText style={styles.label}>{i18n.t('unitnumber')}</RTLText>
          <TextInput style={styles.input} placeholder={i18n.t('unitnumber')} value={formData.unitnumber} onChangeText={(text) => handleChange('unitnumber', text)} />
          <RTLText style={styles.label}>{i18n.t('unitareasqf')}</RTLText>
          <TextInput style={styles.input} placeholder={i18n.t('unitareasqf')} value={formData.sizeunite} onChangeText={(text) => handleSmartChange('sizeunite', text)} keyboardType="numeric" />
          <RTLText style={styles.label}>{i18n.t('unitareasqm')}</RTLText>
          <TextInput style={styles.input} placeholder={i18n.t('unitareasqm')} value={formData.sizeunitesqm} onChangeText={(text) => handleSmartChange('sizeunitesqm', text)} keyboardType="numeric" />
          <RTLText style={styles.label}>{i18n.t('unitstatus')}</RTLText>
          <View style={styles.pickerWrapper}>
            <Picker
              style={{ height: 70 }}
              selectedValue={formData.unitstatus}
              onValueChange={(itemValue: string) => handleChange('unitstatus', itemValue)}
            >
              <Picker.Item label={i18n.t('selectunitstatus')} value={null} />
              {Object.entries(dropdown)
                .filter(([key]) => key === 'unitsituation')
                .map(([menuKey, options]) => (
                  options.map((item) => (
                    <Picker.Item key={item.id} label={isArabic ? item.name_ar : item.name_en} value={item.id} />
                  ))
                ))}
            </Picker>
          </View>
          {formData.unitstatus == '1' && (
            <View>
              <RTLText style={styles.label}>{i18n.t('isitrented')}</RTLText>
              <View style={styles.pickerWrapper}>
                <Picker
                  style={{ height: 70 }}
                  selectedValue={formData.isrent}
                  onValueChange={(itemValue) => handleChange('isrent', itemValue)}
                >
                  <Picker.Item label={i18n.t('isitrented')} value="" />
                  <Picker.Item label={i18n.t('yes')} value="1" />
                  <Picker.Item label={i18n.t('no')} value="0" />
                </Picker>
              </View>

              {formData.isrent == '1' && (
                <View>
                  <RTLText style={styles.label}>{i18n.t('rentvalue')}</RTLText>
                  <TextInput style={styles.input} placeholder={i18n.t('rentvalue')} value={formData.rentvalue} onChangeText={(text) => handleChange('rentvalue', text)} onBlur={() => handleCommaBlur('rentvalue', formData.rentvalue)} keyboardType="numeric" />
                </View>
              )}
            </View>
          )}

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

        <Button title={i18n.t('submit')} onPress={handleSubmit} />
      </ScrollView>
      <FilePreviewModal
        visible={previewVisible}
        files={previewFiles}
        onClose={() => setPreviewVisible(false)} />
    </View>
  );


};


const styles = StyleSheet.create({
  pagerView: { backgroundColor: '#fff', flex: 1 },
  page: {
    backgroundColor: '#fff',
    padding: 20, paddingBottom: 100
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
  custominput: {
    padding: 5, marginVertical: 2
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  dottedLine: {
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    borderColor: '#d9d9d9', // light gray (adjust as needed)
    marginVertical: 20,
  },
});



