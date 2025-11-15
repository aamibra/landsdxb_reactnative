import { AccordionSection } from '@/components/AccordionSection';
import AreaNamePicker from '@/components/AreaNamePicker';
import FilePreviewModal from '@/components/FilePreviewModal';
import { applyMask, cleanNumber, numberCommas } from '@/constant/applyMask';
import { creatbuildingform_api } from '@/constant/DXBConstant';
import { getDropdownDataWithCache } from '@/Services/CacheService';
import i18n from '@/Services/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';



function removeCommas(str) {
  if (str == null) return '';
  return str.toString().trim().replace(/,/g, '');
}


export default function BuildingForm({ navigation, route }: any) {

  const [language, setLanguage] = useState('en');
  const [isArabic, setIsArabic] = useState(false);
  const [switchLanguage, setSwitchLanguage] = useState('ar');
  const [loading, setLoading] = useState(false);
  const [dropdown, setDropdown] = useState<Record<string, { id: number; text: string, name_en: string, name_ar: string }[]>>({});

  const [showNumberRoom, setNumberRoom] = useState(false);

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFiles, setPreviewFiles] = useState([]); // ⬅️ List of files
  const [showPreviewButton, setShowPreviewButton] = useState(false);

  const [showExtraFields, setShowExtraFields] = useState(false);
  const [formData, setFormData] = useState({
    applicantname: '',
    applicantmobile: '',
    applicantemail: '',
    deliveryaddress: '',
    applicanttrn: '',
    typeofvaluation: '',
    purposeevaluation: '',
    landtypenumber: '1',
    categoryownland: '',
    areanameid: '',
    areaname: '',
    arealabel: '',
    usage: '',
    plotnumber: '',
    municipaltynumber: '',
    areasize: '',
    landareasqm: '',
    areaallowed: '',
    arearatio: '',
    height: '',
    buildbaseevaluat: '',
    buildingtype: '',
    buildingareasize: '',
    buildingareasizesqm: '',
    buildingage: '',
    numberunite: '',
    numberfloor: '',
    numberroomlabor: '',
    annualrent: '',
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

 
  const [collapse, setCollapse] = useState({
    applicant: false,
    realEstate: false,
    building: false,
    documents: false,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t('buildingform'),
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
          updatedForm.landareagrossvalue = '';
        } else {
          // Citizen → أخفِ الحقول وامسح القيم
          setShowExtraFields(false);
          updatedForm.arearatio = '';
          updatedForm.areaallowed = '';
          updatedForm.efratio = '';
          updatedForm.landareagrossvalue = '';
        }
      }

      if (key === 'buildingtype') {
        if (value === 1) {
          setNumberRoom(true);
        } else {
          setNumberRoom(false);
          updatedForm.numberroomlabor = '';
        }
      }

      //const buildingtype =  updated.buildingtype


      return updatedForm;
    });

  };

  const pickDocument = async (key) => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

    try {
      setLoading(true);

      let areasize = removeCommas(formData.areasize) || '';
      let arearatio = removeCommas(formData.arearatio) || '';
      let areaallowed = removeCommas(formData.areaallowed) || '';
      let landareasqm = removeCommas(formData.landareasqm) || '';
      let buildingareasize = removeCommas(formData.buildingareasize) || '';
      let annualrent = removeCommas(formData.annualrent) || '';
      let buildingareasizesqm = removeCommas(formData.buildingareasizesqm) || '';


      const ServerData = new FormData();

      ServerData.append("applicantname", formData.applicantname);
      ServerData.append("applicantemail", formData.applicantemail);
      ServerData.append("applicantmobile", formData.applicantmobile);
      ServerData.append("deliveryaddress", formData.deliveryaddress);
      ServerData.append("applicanttrn", formData.applicanttrn);
      ServerData.append("typeofvaluation", formData.typeofvaluation);
      ServerData.append("purposeevaluation", formData.purposeevaluation);
      ServerData.append("areanameid", formData.areanameid);
      ServerData.append("plotnumber", formData.plotnumber);
      ServerData.append("municipaltynumber", formData.municipaltynumber);
      ServerData.append("categoryownland", formData.categoryownland);
      ServerData.append("landtypenumber", formData.landtypenumber);
      ServerData.append("areasize", areasize);
      ServerData.append("arearatio", arearatio);
      ServerData.append("areaallowed", areaallowed);
      ServerData.append("landareasqm", landareasqm);
      ServerData.append("buildingareasize", buildingareasize);
      ServerData.append("buildbaseevaluat", formData.buildbaseevaluat);
      ServerData.append("buildingtype", formData.buildingtype);
      ServerData.append("buildingage", formData.buildingage);
      ServerData.append("numberunite", formData.numberunite);
      ServerData.append("numberfloor", formData.numberfloor);
      ServerData.append("numberroomlabor", formData.numberroomlabor);
      ServerData.append("annualrent", annualrent);
      ServerData.append("buildingareasizesqm", buildingareasizesqm);
      ServerData.append("usage", formData.usage);
      ServerData.append("height", formData.height);

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

      // if (formData.efratio) {

      // }
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
        creatbuildingform_api,
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
    // alert('Form submitted! Check console.');
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



  const handleSmartChange = (field: any, value: any) => {
    const numericValue = value.replace(/[^0-9.]/g, '');

    setFormData(prev => {
      const updated = { ...prev, [field]: numericValue };

      // استخراج القيم المحدثة من updated
      const categoryownland = updated.categoryownland;

      const areasize = cleanNumber(updated.areasize);
      const arearatio = cleanNumber(updated.arearatio);
      const areaallowed = cleanNumber(updated.areaallowed);


      // الوحدات: قدم ⇄ متر
      const e = 10.7639;

      // ========== تحديث حسب الحقول ==========
      if (field === 'areasize') {
        if (numericValue === '') {
          updated.landareasqm = '';
          updated.arearatio = '';
          updated.areaallowed = '';
        } else {
          const sqm = numberCommas((parseFloat(numericValue) / e).toFixed(2));
          updated.landareasqm = sqm;

          if (!isNaN(arearatio) && arearatio !== 0) {
            updated.areaallowed = numberCommas((arearatio * areasize).toFixed(2));
          }

          if (!isNaN(areaallowed) && areaallowed !== 0) {
            updated.arearatio = numberCommas((areaallowed / areasize).toFixed(2));
          }
        }
      }

      if (field === 'landareasqm') {
        if (numericValue === '') {
          updated.areasize = '';
          updated.arearatio = '';
          updated.areaallowed = '';

        } else {
          const sqf = parseFloat(numericValue) * e;
          updated.areasize = numberCommas(sqf.toFixed(2));

          if (!isNaN(arearatio) && arearatio !== 0) {
            updated.areaallowed = numberCommas((arearatio * sqf).toFixed(2));
          }

          if (!isNaN(areaallowed) && areaallowed !== 0) {
            updated.arearatio = numberCommas((areaallowed / sqf).toFixed(2));
          }
        }
      }

      if (field === 'arearatio') {
        if (numericValue === '') {
          updated.areaallowed = '';
        } else {
          if (!isNaN(areasize) && areasize !== 0) {
            updated.areaallowed = numberCommas((parseFloat(numericValue) * areasize).toFixed(2));
          } else {
            updated.arearatio = '';
            updated.areaallowed = '';
          }
        }
      }

      if (field === 'areaallowed') {
        if (numericValue === '') {
          updated.arearatio = '';
          updated.areaallowed = '';
        } else if (!isNaN(areasize) && areasize !== 0) {
          updated.arearatio = numberCommas((areaallowed / areasize).toFixed(2));
        }
      }

      if (field === 'buildingareasize') {
        updated.buildingareasizesqm = numericValue === ''
          ? ''
          : numberCommas((parseFloat(numericValue) / e).toFixed(2));
      }

      if (field === 'buildingareasizesqm') {
        updated.buildingareasize = numericValue === ''
          ? ''
          : numberCommas((parseFloat(numericValue) * e).toFixed(2));
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
        <Text style={styles.header}>{i18n.t('buildingform')}</Text>

        {/* قسم المعلومات الشخصية */}
        <AccordionSection
          title={i18n.t('applicantinfo')}
          isCollapsed={collapse.applicant}
          toggle={() => toggleSection('applicant')}
        >
          <Text style={styles.label}>{i18n.t('applicanttrn')}</Text>
          <TextInput style={styles.input} placeholder={i18n.t('applicanttrn')} value={formData.applicanttrn} onChangeText={(text) => handleChange('applicanttrn', text)} />
          <Text style={styles.label}>{i18n.t('applicantname')}</Text>
          <TextInput style={styles.input} placeholder={i18n.t('applicantname')} value={formData.applicantname} onChangeText={(text) => handleChange('applicantname', text)} />
          <Text style={styles.label}>{i18n.t('mobile')}</Text>
          <TextInput style={styles.input} placeholder={i18n.t('mobile')} value={formData.applicantmobile} onChangeText={(text) => handleChange('applicantmobile', applyMask(text, '(999) 999-9999'))} keyboardType="numeric" />
          <Text style={styles.label}>{i18n.t('email')}</Text>
          <TextInput style={styles.input} placeholder={i18n.t('email')} value={formData.applicantemail} onChangeText={(text) => handleEmailChange('applicantemail', text)} onBlur={(text) => handleBlur('applicantemail')} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
          <Text style={styles.label}>{i18n.t('deliveryaddress')}</Text>
          <TextInput style={styles.inputarea} placeholder={i18n.t('deliveryaddress')} value={formData.deliveryaddress} onChangeText={(text) => handleChange('deliveryaddress', text)} />
          <Text style={styles.label}>{i18n.t('selectpurpose')}</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              style={{ height: 70 }}
              selectedValue={formData.purposeevaluation}
              onValueChange={(itemValue: string) => handleChange('purposeevaluation', itemValue)}
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
          <Text style={styles.label}>{i18n.t('selecttypeofvaluation')}</Text>
          <View style={styles.pickerWrapper} >
            <Picker
              style={{ height: 70 }}
              selectedValue={formData.typeofvaluation}
              onValueChange={(itemValue: string) => handleChange('typeofvaluation', itemValue)}
            >
              <Picker.Item label={i18n.t('selecttypeofvaluation')} value={null} />
              {Object.entries(dropdown)
                .filter(([key]) => key === 'buildevatype')
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
          <Text style={styles.label}>{i18n.t('categoryland')}</Text>
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
          <Text style={styles.label}>{i18n.t('landtypenumber')} </Text>
          <View style={styles.pickerWrapper}>
            <Picker
              style={{ height: 70 }}
              selectedValue={formData.landtypenumber}
              onValueChange={(itemValue) => handleChange('landtypenumber', itemValue)}
            >
              <Picker.Item label={i18n.t('selectlandtypenumber')} value="" />
              <Picker.Item label={i18n.t('plotnumber')} value="1" />
              <Picker.Item label={i18n.t('municipalitynumber')} value="2" />
            </Picker>
          </View>

          {/* باقي الحقول */}
          {/* Show Plot No if landTypeNumber == "1" */}
          {formData.landtypenumber === "1" && (
            <View>
              <Text style={styles.label}>{i18n.t('plotnumber')}</Text>
              <TextInput
                style={styles.input}
                placeholder={i18n.t('plotnumber')}
                value={formData.plotnumber}
                onChangeText={(text) => handleChange('plotnumber', text)}
              />
            </View>
          )}

          {/* Show Municipality No if landTypeNumber == "2" */}
          {formData.landtypenumber === "2" && (
            <View>
              <Text style={styles.label}>{i18n.t('municipalitynumber')}</Text>
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
          <Text style={styles.label}>{i18n.t('selectareaname')}</Text>
          <AreaNamePicker
            value={formData.areanameid}
            selectedLabel={formData.arealabel}
            onChange={(id, label) => {
              setFormData({ ...formData, areanameid: id, arealabel: label });
            }}
          />
          <Text style={styles.label}>{i18n.t('landareasqf')}</Text>
          <TextInput style={styles.input} placeholder={i18n.t('landareasqf')} value={formData.areasize} onBlur={(text) => handleCommaBlur('areasize', formData.areasize)} onChangeText={(text) => handleSmartChange('areasize', text)} keyboardType="numeric" />
          <Text style={styles.label}>{i18n.t('landareasqm')}</Text>
          <TextInput style={styles.input} placeholder={i18n.t('landareasqm')} value={formData.landareasqm} onBlur={(text) => handleCommaBlur('landareasqm', formData.landareasqm)} onChangeText={(text) => handleSmartChange('landareasqm', text)} keyboardType="numeric" />

          {showExtraFields && (
            <View>
              <Text style={styles.label}>{i18n.t('arearatio')}</Text>
              <TextInput style={styles.input} placeholder={i18n.t('arearatio')} value={formData.arearatio} onBlur={(text) => handleCommaBlur('arearatio', formData.arearatio)} onChangeText={(text) => handleSmartChange('arearatio', text)} keyboardType="numeric" />
              <Text style={styles.label}>{i18n.t('ratioallowd')}</Text>
              <TextInput style={styles.input} placeholder={i18n.t('ratioallowd')} value={formData.areaallowed} onBlur={(text) => handleCommaBlur('areaallowed', formData.areaallowed)} onChangeText={(text) => handleSmartChange('areaallowed', text)} keyboardType="numeric" />
            </View>
          )}
          <Text style={styles.label}>{i18n.t('selectusage')}</Text>
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
          <Text style={styles.label}>{i18n.t('height')}</Text>
          <TextInput style={styles.input} placeholder={i18n.t('height')} value={formData.height} onChangeText={(text) => handleChange('height', text)} />
        </AccordionSection>

        {/* معلومات البناء */}
        <AccordionSection
          title={i18n.t('buildinginformation')}
          isCollapsed={collapse.building}
          toggle={() => toggleSection('building')}
        >
          <Text style={styles.label}>{i18n.t('buildingtype')}</Text>
          <View style={styles.pickerWrapper} >
            <Picker
              style={{ height: 70 }}
              selectedValue={formData.buildingtype}
              onValueChange={(itemValue: string) => handleChange('buildingtype', itemValue)}
            >
              <Picker.Item label={i18n.t('selectbuildingtype')} value={null} />
              {Object.entries(dropdown)
                .filter(([key]) => key === 'buildingtype')
                .map(([menuKey, options]) => (
                  options.map((item) => (
                    <Picker.Item key={item.id} label={isArabic ? item.name_ar : item.name_en} value={item.id} />
                  ))
                ))}
            </Picker>
          </View>
          {showNumberRoom && (
            <View>
              <Text style={styles.label}>{i18n.t('numberofrooms')}</Text>
              <TextInput style={styles.input} placeholder={i18n.t('numberofrooms')} value={formData.numberroomlabor} onChangeText={(text) => handleSmartChange('numberroomlabor', text)} />
            </View>
          )}
          <Text style={styles.label}>{i18n.t('buildingareasqf')}</Text>
          <TextInput style={styles.input} placeholder={i18n.t('sqf')} value={formData.buildingareasize} onBlur={(text) => handleCommaBlur('buildingareasize', formData.buildingareasize)} onChangeText={(text) => handleSmartChange('buildingareasize', text)} keyboardType="numeric" />

          <Text style={styles.label}>{i18n.t('buildingareasqm')}</Text>
          <TextInput style={styles.input} placeholder={i18n.t('sqm')} value={formData.buildingareasizesqm} onBlur={(text) => handleCommaBlur('buildingareasizesqm', formData.buildingareasizesqm)} onChangeText={(text) => handleSmartChange('buildingareasizesqm', text)} keyboardType="numeric" />

          <Text style={styles.label}>{i18n.t('revenueannual')}</Text>
          <TextInput style={styles.input} placeholder={i18n.t('revenueannual')} value={formData.annualrent} onBlur={(text) => handleCommaBlur('annualrent', formData.annualrent)} onChangeText={(text) => handleSmartChange('annualrent', text)} keyboardType="numeric" />

          <Text style={styles.label}>{i18n.t('buildingage')}</Text>
          <TextInput style={styles.input} placeholder={i18n.t('buildingage')} value={formData.buildingage} onChangeText={(text) => handleChange('buildingage', text)} />

          <Text style={styles.label}>{i18n.t('unitcount')}</Text>
          <TextInput style={styles.input} placeholder={i18n.t('unitcount')} value={formData.numberunite} onChangeText={(text) => handleChange('numberunite', text)} />

          <Text style={styles.label}>{i18n.t('numberoffloors')}</Text>
          <TextInput style={styles.input} placeholder={i18n.t('numberoffloors')} value={formData.numberfloor} onChangeText={(text) => handleChange('numberfloor', text)} />

          <Text style={styles.label}>{i18n.t('baseevaluate')} </Text>
          <View style={styles.pickerWrapper} >
            <Picker
              style={{ height: 70 }}
              selectedValue={formData.buildbaseevaluat}
              onValueChange={(itemValue: string) => handleChange('buildbaseevaluat', itemValue)}
            >
              <Picker.Item label={i18n.t('selectbuildbaseevaluat')} value={null} />
              {Object.entries(dropdown)
                .filter(([key]) => key === 'baseevaluat')
                .map(([menuKey, options]) => (
                  options.map((item) => (
                    <Picker.Item key={item.id} label={isArabic ? item.name_ar : item.name_en} value={item.id} />
                  ))
                ))}
            </Picker>
          </View>

        </AccordionSection>

        {/* المستندات المطلوبة */}
        <AccordionSection
          title={i18n.t('requirementdocuments')}
          isCollapsed={collapse.documents}
          toggle={() => toggleSection('documents')}
        >
          <Text style={styles.label}>{i18n.t('sitemap')}</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={() => pickDocument('siteMap')}>
            <Text>{formData.sitemapname || (formData.siteMap ? i18n.t('sitemapuploaded') : i18n.t('uploadsitemap'))}</Text>
          </TouchableOpacity>
          <Text style={styles.label}>{i18n.t('titledeed')}</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={() => pickDocument('titleDeed')}>
            <Text>{formData.titledeedname || (formData.titleDeed ? i18n.t('titledeeduploaded') : i18n.t('uploadtitledeed'))}</Text>
          </TouchableOpacity>
          <Text style={styles.label}>{i18n.t('otherdocument')}</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={() => pickDocument('otherDoc')}>
            <Text>{formData.otherdocumentname || (formData.otherDoc ? i18n.t('otherdocumentuploaded') : i18n.t('uploadotherdocument'))}</Text>
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






