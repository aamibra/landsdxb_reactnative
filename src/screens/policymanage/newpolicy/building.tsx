import { AccordionSection } from '@/components/AccordionSection';
import AreaNamePicker from '@/components/AreaNamePicker';
import FilePreviewModal from '@/components/FilePreviewModal';
import PercentageInput from '@/components/PercentageInput';
import { RadioInputField } from '@/components/RadioInputField ';
import { applyMask, cleanNumber, numberCommas, numberWithCommas } from '@/constant/applyMask';
import { creatbuildingpolicy_api, e, getbuildingpolicy_api, updatebuildingpolicy_api } from '@/constant/DXBConstant';
import api from '@/Services/axiosInstance';
import { getDropdownDataWithCache } from '@/Services/CacheService';
import i18n from '@/Services/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import PagerView from 'react-native-pager-view';



const SectionLabel = ({ title }: any) => {
  return (
    <View style={styles.labelContainer}>
      <Text style={styles.labelText}>{title}</Text>
    </View>
  );
};

function removeCommas(str) {
  if (str == null) return '';
  return str.toString().trim().replace(/,/g, '');
}

 
export default function BuildingLandPolicy({ navigation, route }: any) {
  const isEdit = route.params?.mode === 'edit';
  const policyid = route.params?.policyid;
  const [language, setLanguage] = useState('en');
  const [isArabic, setIsArabic] = useState(false);
  const [switchLanguage, setSwitchLanguage] = useState('ar'); // opposite by default

  const [loading, setLoading] = useState(false);
  const [dropdown, setDropdown] = useState<Record<string, { id: number; text: string, name_en: string, name_ar: string }[]>>({});
  const pagerRef = useRef(null);
  const [showBuildArea, setShowBuildArea] = useState(true);
  const [showNumberRoom, setNumberRoom] = useState(false);

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFiles, setPreviewFiles] = useState([]); // ⬅️ List of files
  const [showPreviewButton, setShowPreviewButton] = useState(false);

  const [showExtraFields, setShowExtraFields] = useState(false);

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
    policyid: '',
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
    landareaprice: '',
    landareapricesqm: '',
    efratio: '',
    landareagrossvalue: '',
    buildareaprice: '',
    buildareapricesqm: '',
    buildareagrossvalue: '',
    percentcost: '',
    costrealestate: '',
    incomepercent: '',
    incomegrossery: '',
    comparerealestate: '',
    selectedvalue: '',
    selectedgroup: 0,
    modification_reason: '',
    isshownote: 'false',
    note: '',
    certificatenote: '',
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
    dependcost: false,
    dependincome: false,
    dependcompare: false,
    finalvalue: false,
    certificate: false
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t('buildingpolicy'),
    });
  }, [navigation, i18n.language]);

  useEffect(() => {
    const loadPolicy = async () => {
      if (!isEdit || !policyid) return;

      try {
        const res = await api.get(getbuildingpolicy_api, {
          params: { policyid },
        });

        if (res.status === 200 && res.data) {
          const data = res.data;

          setFormData({
            policyid: data.policyid || '',
            applicantname: data.applicantname || '',
            applicantmobile: data.applicantmobile || '',
            applicantemail: data.applicantemail || '',
            deliveryaddress: data.deliveryaddress || '',
            applicanttrn: data.applicanttrn || '',
            purposeevaluation: data.purposeevaluation || '',
            typeofvaluation: data.typeofvaluation || '',
            landtypenumber: data.landtypenumber?.toString() || '',
            categoryownland: data.categoryownland?.toString() || '',
            areanameid: data.areanameid?.toString() || '',
            areaname: data.areaname || '',
            arealabel: '',
            usage: data.usage || '',
            plotnumber: data.plotnumber || '',
            municipaltynumber: data.municipaltynumber || '',
            areasize: data.areasize || '',
            landareasqm: '',
            arearatio: data.arearatio || '',
            areaallowed: '',
            height: data.height || '',
            buildbaseevaluat: data.buildbaseevaluat || '',
            buildingtype: data.buildingtype || '',
            buildingareasize: data.buildingareasize || '',
            buildingareasizesqm: '',
            buildingage: data.buildingage || '',
            numberunite: data.numberunite || '',
            numberfloor: data.numberfloor || '',
            numberroomlabor: data.numberroomlabor || '',
            annualrent: data.annualrent || '',
            landareaprice: data.landareaprice || '',
            landareapricesqm: '',
            efratio: data.efratio || '',
            landareagrossvalue: data.landareagrossvalue || '',
            buildareaprice: data.buildareaprice || '',
            buildareapricesqm: '',
            buildareagrossvalue: data.buildareagrossvalue || '',
            percentcost: data.percentcost || '',
            costrealestate: data.costrealestate || '',
            incomepercent: data.incomepercent || '',
            incomegrossery: data.incomegrossery || '',
            comparerealestate: data.comparerealestate || '',
            selectedvalue: data.selectedvalue || '',
            selectedgroup: data.selectedgroup || '',
            modification_reason: data.modification_reason || '',
            isshownote: data.isshownote || 'false',
            note: data.note || '',
            certificatenote: data.certificatenote || '',
            siteMap: null,
            sitemapid: data.sitemapid || '',
            sitemapname: data.sitemapname || '',
            sitemapimg: data.sitemapimg || '',
            titleDeed: null,
            titledeedid: data.titledeedid || '',
            titledeedname: data.titledeedname || '',
            titledeedimg: data.titledeedimg || '',
            otherDoc: null,
            otherdocumentid: data.otherdocumentid || '',
            otherdocumentname: data.otherdocumentname || '',
            otherdocumentimg: data.otherdocumentimg || '',
          });

          setShowExtraFields(data.categoryownland?.toString() === '1');
          // setShowBuildArea(formData.buildingtype === '1');

          setFormData(prev => {

            let areasize = data.areasize || '';
            let arearatio = data.arearatio || '';
            let efratio = data.efratio || '';
            let landareaprice = data.landareaprice || '';
            let landareagrossvalue = data.landareagrossvalue || '';
            let areaname = data.areaname;
            let buildingareasize = data.buildingareasize || '';
            let buildareaprice = data.buildareaprice || '';
            let buildareagrossvalue = data.buildareagrossvalue || '';
            let costrealestate = data.costrealestate || '';
            let incomegrossery = data.incomegrossery || '';
            let comparerealestate = data.comparerealestate || '';
            let selectedvalue = data.selectedvalue || '';
            let annualrent = data.annualrent || '';

            if (areaname != null && areaname !== '') {
              prev.areanameid = areaname.areanameid;
              prev.arealabel = areaname.arealabel;

            } else {
              areaname = '';
            }

            let landareasqm = areasize ? (parseFloat(areasize) / e).toFixed(2) : '';
            let landareapricesqm = landareaprice ? (parseFloat(landareaprice) * e).toFixed(2) : '';
            let areaallowed = '';
            let buildingareasizesqm = buildingareasize ? (parseFloat(buildingareasize) / e).toFixed(2) : '';
            let buildareapricesqm = buildareaprice ? (parseFloat(buildareaprice) * e).toFixed(2) : '';

            if (
              arearatio != null &&              // not null and not undefined
              areasize != null &&               // not null and not undefined
              !isNaN(parseFloat(arearatio)) &&  // arearatio can be parsed to number
              !isNaN(parseFloat(areasize))      // areasize can be parsed to number
            ) {
              setShowBuildArea(false);
              // إذا كل شيء صحيح، نفّذ العملية
              areaallowed = (parseFloat(arearatio) * parseFloat(areasize)).toFixed(2);
            } else {
              setShowBuildArea(true);
              // خلاف ذلك، اتركه كـ '' أو قيمة افتراضية
              areaallowed = '';
            }


            areasize = numberWithCommas(data.areasize) || '';
            arearatio = numberWithCommas(arearatio) || '';
            areaallowed = numberWithCommas(areaallowed) || '';
            landareasqm = numberWithCommas(landareasqm) || '';
            landareaprice = numberWithCommas(landareaprice) || '';
            landareapricesqm = numberWithCommas(landareapricesqm) || '';
            buildingareasize = numberWithCommas(buildingareasize) || '';
            annualrent = numberWithCommas(annualrent) || '';
            efratio = numberWithCommas(efratio) || '';
            landareagrossvalue = numberWithCommas(landareagrossvalue) || '';
            buildingareasizesqm = numberWithCommas(buildingareasizesqm) || '';
            buildareaprice = numberWithCommas(buildareaprice) || '';
            buildareapricesqm = numberWithCommas(buildareapricesqm) || '';
            buildareagrossvalue = numberWithCommas(buildareagrossvalue) || '';
            costrealestate = numberWithCommas(costrealestate) || '';
            incomegrossery = numberWithCommas(incomegrossery) || '';
            comparerealestate = numberWithCommas(comparerealestate) || '';
            selectedvalue = numberWithCommas(selectedvalue) || '';

            return {
              ...prev,
              areasize: areasize,
              landareasqm: landareasqm,

              arearatio: arearatio,
              areaallowed: areaallowed,

              buildingareasize: buildingareasize,
              buildingareasizesqm: buildingareasizesqm,
              annualrent: annualrent,

              efratio: efratio,
              landareaprice: landareaprice,
              landareapricesqm: landareapricesqm,
              landareagrossvalue: landareagrossvalue,

              buildareaprice: buildareaprice,
              buildareapricesqm: buildareapricesqm,
              buildareagrossvalue: buildareagrossvalue,

              costrealestate: costrealestate,
              incomegrossery: incomegrossery,
              comparerealestate: comparerealestate,
              selectedvalue: selectedvalue,
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


  /*useEffect(() => {
    const loadData = async () => {
      const drpmenu = await getCachedDropdownMenu();

      if (drpmenu != null) {
        setDropdown(drpmenu); // ✅ Set state from returned data
      } else {
        await fetchAndCacheDropdown();
      }
    };

    loadData();
  }, []);*/


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

  const goToPage = (pageIndex: any) => {
    pagerRef.current?.setPage(pageIndex);
  };

  const handleSubmit = async () => {

    try {
      setLoading(true);

      let areasize = removeCommas(formData.areasize) || '';
      let arearatio = removeCommas(formData.arearatio) || '';
      let areaallowed = removeCommas(formData.areaallowed) || '';
      let landareasqm = removeCommas(formData.landareasqm) || '';
      let landareaprice = removeCommas(formData.landareaprice) || '';
      let landareapricesqm = removeCommas(formData.landareapricesqm) || '';
      let buildingareasize = removeCommas(formData.buildingareasize) || '';
      let annualrent = removeCommas(formData.annualrent) || '';
      let efratio = removeCommas(formData.efratio) || '';
      let landareagrossvalue = removeCommas(formData.landareagrossvalue) || '';
      let buildingareasizesqm = removeCommas(formData.buildingareasizesqm) || '';
      let buildareaprice = removeCommas(formData.buildareaprice) || '';
      let buildareapricesqm = removeCommas(formData.buildareapricesqm) || '';
      let buildareagrossvalue = removeCommas(formData.buildareagrossvalue) || '';
      let costrealestate = removeCommas(formData.costrealestate) || '';
      let incomegrossery = removeCommas(formData.incomegrossery) || '';
      let comparerealestate = removeCommas(formData.comparerealestate) || '';
      let selectedvalue = removeCommas(formData.selectedvalue) || '';
      let selectedgroup = removeCommas(formData.selectedgroup) || '';

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
      ServerData.append("landareaprice", landareaprice);
      ServerData.append("landareapricesqm", landareapricesqm);
      ServerData.append("buildingareasize", buildingareasize);
      ServerData.append("buildbaseevaluat", formData.buildbaseevaluat);
      ServerData.append("buildingtype", formData.buildingtype);
      ServerData.append("buildingage", formData.buildingage);
      ServerData.append("numberunite", formData.numberunite);
      ServerData.append("numberfloor", formData.numberfloor);
      ServerData.append("numberroomlabor", formData.numberroomlabor);
      ServerData.append("percentcost", formData.percentcost);
      ServerData.append("incomepercent", formData.incomepercent);
      ServerData.append("selectedgroup", selectedgroup);
      ServerData.append("modification_reason", formData.modification_reason);
      ServerData.append("annualrent", annualrent);
      ServerData.append("landareagrossvalue", landareagrossvalue);
      ServerData.append("buildingareasizesqm", buildingareasizesqm);
      ServerData.append("buildareaprice", buildareaprice);
      ServerData.append("buildareapricesqm", buildareapricesqm);
      ServerData.append("buildareagrossvalue", buildareagrossvalue);
      ServerData.append("costrealestate", costrealestate);
      ServerData.append("incomegrossery", incomegrossery);
      ServerData.append("comparerealestate", comparerealestate);
      ServerData.append("selectedvalue", selectedvalue);
      ServerData.append("usage", formData.usage);
      ServerData.append("height", formData.height);
      ServerData.append("isshownote", formData.isshownote);
      ServerData.append("note", formData.note);
      ServerData.append("certificatenote", formData.certificatenote);
      ServerData.append("efratio", efratio);

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

      if (isEdit && policyid) {
        ServerData.append("policyid", policyid);
      }


      const response = await fetch(
        isEdit ? updatebuildingpolicy_api : creatbuildingpolicy_api,
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


  const calculateLandAreaGrossValue = (
    categoryownland: string,
    areasize: number,
    arearatio: number,
    areaallowed: number,
    landareaprice: number,
    efratio: number
  ): string => {
    if (!landareaprice) return '';

    if (categoryownland === '2' || categoryownland === '') {
      if (!isNaN(areasize)) {
        return numberCommas((areasize * landareaprice).toFixed(2));
      }
    } else if (categoryownland === '1') {
      if (!isNaN(arearatio) && !isNaN(areasize)) {
        return numberCommas((arearatio * areasize * landareaprice).toFixed(2));
      } else if (!isNaN(efratio)) {
        return numberCommas((efratio * landareaprice).toFixed(2));
      } else if (!isNaN(areasize)) {
        return numberCommas((areasize * landareaprice).toFixed(2));
      }
    }

    return '';
  };

  const calculateBuildAreaGrossValue = (
    buildingareasize: number,
    buildareaprice: number
  ): string => {
    if (!isNaN(buildingareasize) && !isNaN(buildareaprice)) {
      return numberCommas((buildingareasize * buildareaprice).toFixed(2));
    }
    return '';
  };

  const calculateCostRealEstate = (
    landGross: number,
    buildGross: number,
    percent: number
  ): string => {
    if (
      !isNaN(landGross) &&
      !isNaN(buildGross) &&
      landGross > 0 &&
      buildGross > 0
    ) {
      let total = landGross + buildGross;

      // فقط نضيف نسبة إضافية إذا كانت > 0
      if (!isNaN(percent) && percent > 0) {
        const percentValue = percent / 100;
        const additional = total * percentValue;
        total += additional;
      }

      return numberCommas(total.toFixed(2));
    }

    return '';
  };


  const calculateGrossIncome = (
    annualRent: number,
    incomePercent: number
  ): string => {
    if (
      !isNaN(annualRent) &&
      !isNaN(incomePercent) &&
      incomePercent > 0 &&
      annualRent > 0
    ) {
      const percent = incomePercent / 100;
      const total = annualRent / percent;
      return numberCommas(total.toFixed(2));
    }
    return '';
  };

  const handleSmartChange = (field: any, value: any) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    /*
    setFormData(prev => {
      const updated = { ...prev, [field]: numericValue };
       
       const categoryownland = updated.categoryownland;
       const areasize        = cleanNumber(updated.areasize);
       const areasize_sqm    = cleanNumber(updated.landareasqm);            
       const arearatio       = cleanNumber(updated.arearatio);
       const areaallowed     =  cleanNumber(updated.areaallowed);
       
       const landareaprice      =  cleanNumber(updated.landareaprice); 
       const landareaprice_sqm  =  cleanNumber(updated.landareapricesqm); 		   
       const efratio            =  cleanNumber(updated.efratio);                        
       const landareagrossvalue =  cleanNumber(updated.landareagrossvalue);   
        
       const buildingareasize     =  cleanNumber(updated.buildingareasize);       
       const buildingareasize_sqm =  cleanNumber(updated.buildingareasizesqm);  
      
       const buildareaprice       =  cleanNumber(updated.buildareaprice);  
       const buildareaprice_sqm   =  cleanNumber(updated.buildareapricesqm);  
       const buildareagrossvalue  =  cleanNumber(updated.buildareagrossvalue);  
       const percentcost         =  cleanNumber(updated.percentcost); 
       const costrealestate       =  cleanNumber(updated.costrealestate);  

       const annualrent        = cleanNumber(updated.annualrent);   
       const incomepercent     = cleanNumber(updated.incomepercent);  
       const incomegrossery    = cleanNumber(updated.incomegrossery);      		 		               
       const comparerealestate = cleanNumber(updated.comparerealestate);       
       const selectedgroup     = updated.selectedgroup;         		    
       //selectedvalue 
 

       if (field === 'areasize') {
          if (numericValue === '') {
            updated.landareasqm = '';
            updated.arearatio = '';
            updated.areaallowed = '';
            updated.landareagrossvalue = '';

          } else {
            let landsqm = (parseFloat(numericValue) / e).toFixed(2);
            landsqm = numberCommas(landsqm);
            updated.landareasqm = landsqm;
         
            if (!isNaN(arearatio) && arearatio !== 0) {
              let allowed = (arearatio * numericValue).toFixed(2);
              allowed = numberCommas(allowed);
              updated.areaallowed = allowed;
            } 
            if (!isNaN(areaallowed) && areaallowed !== 0) {
              let FARatio = (areaallowed / areasize).toFixed(2);
              FARatio = numberCommas(FARatio);
              updated.arearatio = FARatio;
            }
          } 
       }

       if (field === 'landareasqm') {
          if (numericValue === '') { 
            updated.areasize           = '';
            updated.arearatio          = '';
            updated.areaallowed        = '';
            updated.landareagrossvalue = ''; 
          } else {
         
            let landarea = (parseFloat(numericValue) * e).toFixed(2);
            landarea = numberCommas(landarea);
            updated.areasize = landarea;
         
            if (!isNaN(arearatio) && arearatio !== 0) {
              let allowed = (arearatio * (parseFloat(numericValue) * e)).toFixed(2);
              allowed = numberCommas(allowed);
              updated.areaallowed = allowed;
            } 
            if (!isNaN(areaallowed) && areaallowed !== 0) {
              let FARatio = (areaallowed / (parseFloat(numericValue) * e)).toFixed(2);
              FARatio = numberCommas(FARatio);
              updated.arearatio = FARatio;
            }  
          }
       }
       
       if (field === 'arearatio') {
         if (numericValue === '') {
            setShowBuildArea(numericValue === '');
            updated.landareagrossvalue = '';
            updated.areaallowed = '';
         } else {
           if (!isNaN(areasize) && areasize !== 0) {
             let allowed = (parseFloat(numericValue) * areasize).toFixed(2);
             allowed = numberCommas(allowed);
             updated.areaallowed = allowed;
           } else {
             updated.arearatio = '';
             updated.areaallowed = '';
             updated.landareagrossvalue = '';
           }
         }
       }

       if (field === 'areaallowed') {
           if (numericValue === '') {
              updated.arearatio = '';
           } else {
             if(!isNaN(areasize) && areasize !== 0) {
               let FARatio = (areaallowed / areasize).toFixed(2);
               FARatio = numberCommas(FARatio);
               updated.arearatio = FARatio;
             } else {
               updated.arearatio = '';
               updated.areaallowed = '';
               updated.landareagrossvalue = '';
             }
          }
       }

       if (field === 'landareaprice') {
          if (numericValue === '') {
             updated.landareapricesqm = '';
             updated.landareagrossvalue = '';
          } else {
             let sqm = (parseFloat(numericValue) * e).toFixed(2);
             sqm = numberCommas(sqm);
             updated.landareapricesqm = sqm;
          }
       }

       if (field === 'landareapricesqm') {
         if (numericValue === '') {
            updated.landareaprice = '';
            updated.landareagrossvalue = '';
          } else {
            let sqf = (parseFloat(numericValue) / e).toFixed(2);
            sqf = numberCommas(sqf);
            updated.landareaprice = sqf;
         }
       }
 
       if ((categoryownland === '1' || categoryownland === '') && !isNaN(landareaprice)) {
          if (!isNaN(landareaprice) && !isNaN(areasize)) {
              let grossvalue = (areasize * landareaprice).toFixed(2);
              grossvalue = numberCommas(grossvalue);
              updated.landareagrossvalue = grossvalue;
          } else {
             updated.landareagrossvalue = '';
          } 
       }
      
      if(categoryownland === '2' && !isNaN(landareaprice)) {
         if (!isNaN(arearatio) && !isNaN(areasize)) {
            let grossvalue = (arearatio * areasize * landareaprice).toFixed(2);
            grossvalue = numberCommas(grossvalue);
            updated.landareagrossvalue = grossvalue; 
         } else if (!isNaN(efratio)) {
            let grossvalue = (efratio * landareaprice).toFixed(2);
            grossvalue = numberCommas(grossvalue);
            updated.landareagrossvalue = grossvalue;
   
         } else if (isNaN(arearatio) && isNaN(efratio) && !isNaN(landareaprice) && !isNaN(areasize)) {
            let grossvalue = (areasize * landareaprice).toFixed(2);
             grossvalue = numberCommas(grossvalue);
             updated.landareagrossvalue = grossvalue;
         } else {
            updated.landareagrossvalue = '';
         }       
      }
         
       if(field === 'buildingareasize') {
           if (numericValue === '') {
             updated.buildingareasizesqm = ''; 

          } else {
            let buildsqm = (parseFloat(numericValue) / e).toFixed(2);
            buildsqm = numberCommas(buildsqm);
            updated.buildingareasizesqm = buildsqm; 
          } 
       }
       
       if(field === 'buildingareasizesqm') {
          if (numericValue === '') { 
             updated.buildingareasize = ''; 

          } else { 
            let buildarea = (parseFloat(numericValue) * e).toFixed(2);
            buildarea = numberCommas(buildarea);
            updated.buildingareasize = buildarea; 
          }
       }
   
           // التأكد من أن كل القيم صالحة وغير صفرية
    if (
      !isNaN(landareagrossvalue) &&
      !isNaN(buildareagrossvalue) &&
      !isNaN(percentcost) &&
      landareagrossvalue > 0 &&
      buildareagrossvalue > 0 &&
      percentcost > 0
    ) {
      const totalArea = landareagrossvalue + buildareagrossvalue;
      const percentAsDecimal = percentcost / 100;
      const additionalCost = totalArea * percentAsDecimal;
      const totalCost = totalArea + additionalCost;

      updated.costrealestate = numberCommas(totalCost.toFixed(2));
    } else {
      // إذا القيم غير صالحة، يمكن تصفير أو حذف costrealestate
      updated.costrealestate = '';
    }
       
       if(field === 'buildareaprice') {
          if (numericValue === '') {
             updated.buildareapricesqm   = '';
             updated.buildareagrossvalue = '';
          } else {
             let sqm = (parseFloat(numericValue) * e).toFixed(2);
             sqm = numberCommas(sqm);
             updated.buildareapricesqm = sqm;
          }
       }

       if(field === 'buildareapricesqm') {
          if (numericValue === '') {
            updated.buildareaprice = '';
            updated.buildareagrossvalue = '';
          } else {
            let sqf = (parseFloat(numericValue) / e).toFixed(2);
            sqf = numberCommas(sqf);
            updated.buildareaprice = sqf;
          }
       }
      
      if (!isNaN(buildingareasize) && !isNaN(buildareaprice)) {
          let grossvalue = (buildingareasize * buildareaprice).toFixed(2);
          grossvalue = numberCommas(grossvalue);
          updated.buildareagrossvalue = grossvalue;
      }else{
         updated.buildareagrossvalue = '';
      }
       
  
       if(field === 'percentcost') {
           if (numericValue === '') {
               updated.costrealestate = '';
          }else{       
            if (!isNaN(numericValue) &&!isNaN(landareagrossvalue) && !isNaN(buildareagrossvalue) ) {
               if (numericValue && numericValue != 0) {

                     let sumLandBuild =  landareagrossvalue + buildareagrossvalue;
                     let calculpercent = numericValue / 100;
                     let multiLandBuild = sumLandBuild * calculpercent;
                     sumLandBuild = multiLandBuild + sumLandBuild;

                    let grossvalue = (sumLandBuild).toFixed(2);
                    updated.costrealestate = numberCommas(grossvalue);
                 }              
            }
          }           
       }
       
      

       if(field === 'annualrent') {
          if (numericValue === '') {
              updated.incomegrossery = '';
          }else{
            if (!isNaN(incomepercent) ) {
                if (incomepercent && incomepercent != 0 && numericValue != 0) {
                   let percent = incomepercent / 100;
                   let TotalGrossIncome = numericValue / percent;
                   let tgross = (TotalGrossIncome).toFixed(2);
                  updated.incomegrossery= numberCommas(tgross);
                }          
            }
          }
       }

       if(field === 'incomepercent') {
           if (numericValue === '') {
              updated.incomegrossery = '';
           }else{
            if(!isNaN(annualrent)) {
                 if (annualrent && annualrent != 0 && numericValue != 0) {
                   let percent = numericValue / 100;
                   let TotalGrossIncome = annualrent / percent;
                   let tgross = (TotalGrossIncome).toFixed(2);
                   updated.incomegrossery= numberCommas(tgross);
                 } 
            }
           }
       }

       if(selectedgroup === 1){
          updated.selectedvalue = costrealestate.toString();
       }  
       
       if(selectedgroup === 2){
         updated.selectedvalue =incomegrossery.toString();
       }  

       if(selectedgroup === 3){
         updated.selectedvalue = comparerealestate.toString();
       }  
       

      return updated;
    });
   */

    setFormData(prev => {
      const updated = { ...prev, [field]: numericValue };

      // استخراج القيم المحدثة من updated
      const categoryownland = updated.categoryownland;
      const selectedgroup = updated.selectedgroup;

      const areasize = cleanNumber(updated.areasize);
      const landareasqm = cleanNumber(updated.landareasqm);
      const arearatio = cleanNumber(updated.arearatio);
      const areaallowed = cleanNumber(updated.areaallowed);

      const landareaprice = cleanNumber(updated.landareaprice);
      const landareapricesqm = cleanNumber(updated.landareapricesqm);

      const efratio = cleanNumber(updated.efratio);
      const landareagrossvalue = cleanNumber(updated.landareagrossvalue);

      const buildingareasize = cleanNumber(updated.buildingareasize);
      const buildingareasizesqm = cleanNumber(updated.buildingareasizesqm);

      const buildareaprice = cleanNumber(updated.buildareaprice);
      const buildareapricesqm = cleanNumber(updated.buildareapricesqm);
      const buildareagrossvalue = cleanNumber(updated.buildareagrossvalue);

      const percentcost = cleanNumber(updated.percentcost);
      const costrealestate = cleanNumber(updated.costrealestate);

      const annualrent = cleanNumber(updated.annualrent);
      const incomepercent = cleanNumber(updated.incomepercent);
      const incomegrossery = cleanNumber(updated.incomegrossery);

      const comparerealestate = cleanNumber(updated.comparerealestate);

      // الوحدات: قدم ⇄ متر
      const e = 10.7639;

      // ========== تحديث حسب الحقول ==========
      if (field === 'areasize') {
        if (numericValue === '') {
          updated.landareasqm = '';
          updated.arearatio = '';
          updated.areaallowed = '';
          updated.landareagrossvalue = '';
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
          updated.landareagrossvalue = '';
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
          setShowBuildArea(true);
          updated.landareagrossvalue = '';
          updated.areaallowed = '';
        } else {
          if (!isNaN(areasize) && areasize !== 0) {
            setShowBuildArea(false);
            updated.areaallowed = numberCommas((parseFloat(numericValue) * areasize).toFixed(2));
          } else {
            setShowBuildArea(true);
            updated.arearatio = '';
            updated.areaallowed = '';
            updated.landareagrossvalue = '';
          }
        }
      }

      if (field === 'areaallowed') {
        if (numericValue === '') {
          setShowBuildArea(true);
          updated.arearatio = '';
          updated.areaallowed = '';
          updated.landareagrossvalue = '';
        } else if (!isNaN(areasize) && areasize !== 0) {
          setShowBuildArea(false);
          updated.arearatio = numberCommas((areaallowed / areasize).toFixed(2));
        }
      }

      if (field === 'landareaprice') {
        updated.landareapricesqm = numericValue === ''
          ? ''
          : numberCommas((parseFloat(numericValue) * e).toFixed(2));
      }

      if (field === 'landareapricesqm') {
        updated.landareaprice = numericValue === ''
          ? ''
          : numberCommas((parseFloat(numericValue) / e).toFixed(2));
      }

      if (
        ['areasize', 'landareasqm', 'arearatio', 'areaallowed', 'landareaprice', 'landareapricesqm', 'efratio', 'categoryownland'].includes(field)
      ) {
        // Gross Land Value Calculation
        updated.landareagrossvalue = calculateLandAreaGrossValue(
          categoryownland,
          areasize,
          arearatio,
          areaallowed,
          landareaprice,
          efratio
        );
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

      if (field === 'buildareaprice') {
        updated.buildareapricesqm = numericValue === ''
          ? ''
          : numberCommas((parseFloat(numericValue) * e).toFixed(2));
      }

      if (field === 'buildareapricesqm') {
        updated.buildareaprice = numericValue === ''
          ? ''
          : numberCommas((parseFloat(numericValue) / e).toFixed(2));
      }

      if (
        ['buildingareasize', 'buildingareasizesqm', 'buildareaprice', 'buildareapricesqm'].includes(field)
      ) {
        updated.buildareagrossvalue = calculateBuildAreaGrossValue(buildingareasize, buildareaprice);
      }

      // حساب التكلفة العقارية
      updated.costrealestate = calculateCostRealEstate(
        cleanNumber(updated.landareagrossvalue),
        cleanNumber(updated.buildareagrossvalue),
        cleanNumber(updated.percentcost)
      );

      // إعادة حساب الدخل الإجمالي
      if (field === 'annualrent' || field === 'incomepercent') {
        updated.incomegrossery = calculateGrossIncome(annualrent, incomepercent);
      }

      // تحديد القيمة المختارة حسب المجموعة
      if (selectedgroup === 1) {
        updated.selectedvalue = numberCommas(updated.costrealestate);
      } else if (selectedgroup === 2) {
        updated.selectedvalue = numberCommas(updated.incomegrossery);
      } else if (selectedgroup === 3) {
        updated.selectedvalue = numberCommas(comparerealestate);
      }

      return updated;
    });

  };

  const SelectedGroupChange = (field: any, value: any) => {

    setFormData(prev => {
      const updated = { ...prev, [field]: value };

      let costrealestate = updated.costrealestate;
      let incomegrossery = updated.incomegrossery;
      let comparerealestate = updated.comparerealestate;
      let selectedgroup = updated.selectedgroup;

      if (selectedgroup === 1) {
        updated.selectedvalue = numberCommas(costrealestate);
      }

      if (selectedgroup === 2) {
        updated.selectedvalue = numberCommas(incomegrossery);
      }

      if (selectedgroup === 3) {
        updated.selectedvalue = numberCommas(comparerealestate);
      }

      return updated;
    });
  };

  const handleGrossValueChange = (field: string, value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');

    setFormData(prev => {
      const updated = { ...prev, [field]: numericValue };

      const landAreaGross = cleanNumber(updated.landareagrossvalue);
      const buildAreaGross = cleanNumber(updated.buildareagrossvalue);
      const percentCost = cleanNumber(updated.percentcost);

      const isLandValid = !isNaN(landAreaGross) && landAreaGross > 0;
      const isBuildValid = !isNaN(buildAreaGross) && buildAreaGross > 0;

      if (isLandValid && isBuildValid) {
        let totalCost = landAreaGross + buildAreaGross;

        // فقط أضف النسبة إن كانت > 0
        if (!isNaN(percentCost) && percentCost > 0) {
          const percentAsDecimal = percentCost / 100;
          const additionalCost = totalCost * percentAsDecimal;
          totalCost += additionalCost;
        }

        updated.costrealestate = numberCommas(totalCost.toFixed(2));
      } else {
        // فقط في حالة أن land/build غير صالحة يتم تصفير القيمة
        updated.costrealestate = '';
      }

      return updated;
    });

    /* setFormData(prev => {
       // تحديث الحقل المدخل فقط
       const updated = { ...prev, [field]: numericValue };
 
       // تنظيف وتحويل القيم للأرقام
       const landAreaGross = cleanNumber(updated.landareagrossvalue);
       const buildAreaGross = cleanNumber(updated.buildareagrossvalue);
       const percentCost = cleanNumber(updated.percentcost);
 
       // التأكد من أن كل القيم صالحة وغير صفرية
       if (
         !isNaN(landAreaGross) &&
         !isNaN(buildAreaGross) &&
         !isNaN(percentCost) &&
         landAreaGross > 0 &&
         buildAreaGross > 0 &&
         percentCost > 0
       ) {
         const totalArea = landAreaGross + buildAreaGross;
         const percentAsDecimal = percentCost / 100;
         const additionalCost = totalArea * percentAsDecimal;
         const totalCost = totalArea + additionalCost;
 
         updated.costrealestate = numberCommas(totalCost.toFixed(2));
       } else {
         // إذا القيم غير صالحة، يمكن تصفير أو حذف costrealestate
         updated.costrealestate = '';
       }
 
       return updated;
     }); */

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
    <View style={{ flex: 1 }}>
      <PagerView style={styles.pagerView} initialPage={0} ref={pagerRef}>
        {/* الصفحة الأولى */}
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

          <Button title={i18n.t('next')} onPress={() => goToPage(1)} />
        </ScrollView>

        {/* الصفحة الثانية - كما كانت */}
        <ScrollView contentContainerStyle={styles.page} key="2">
          <Text style={styles.header}>{i18n.t('evaluationbuilding')}</Text>

          <AccordionSection
            title={i18n.t('valuedependcost')}
            isCollapsed={collapse.dependcost}
            toggle={() => toggleSection('dependcost')}
          >
            <SectionLabel title={i18n.t('accordingtoland')} />

            {showBuildArea && showExtraFields && (
              <View>
                <Text style={styles.label}>{i18n.t('buildarea')}</Text>
                <TextInput style={styles.input} placeholder={i18n.t('buildarea')} value={formData.efratio} onBlur={() => handleCommaBlur('efratio', formData.efratio)} onChangeText={(text) => handleSmartChange('efratio', text)} keyboardType="numeric" />
              </View>
            )}

            <Text style={styles.label}>{i18n.t('pricesqf')}</Text>
            <TextInput style={styles.input} placeholder={i18n.t('pricesqf')} value={formData.landareaprice} onBlur={(text) => handleCommaBlur('landareaprice', formData.landareaprice)} onChangeText={(text) => handleSmartChange('landareaprice', text)} keyboardType="numeric" />
            <Text style={styles.label}>{i18n.t('pricesqm')}</Text>
            <TextInput style={styles.input} placeholder={i18n.t('pricesqm')} value={formData.landareapricesqm} onBlur={(text) => handleCommaBlur('landareapricesqm', formData.landareapricesqm)} onChangeText={(text) => handleSmartChange('landareapricesqm', text)} keyboardType="numeric" />
            <Text style={styles.label}>{i18n.t('grossvalue')}</Text>
            <TextInput style={styles.input} placeholder={i18n.t('grossvalue')} value={formData.landareagrossvalue} onBlur={(text) => handleCommaBlur('landareagrossvalue', formData.landareagrossvalue)} onChangeText={(text) => handleGrossValueChange('landareagrossvalue', text)} keyboardType="numeric" />


            <SectionLabel title={i18n.t('accordingtobuilding')} />
            <Text style={styles.label}>{i18n.t('pricesqf')}</Text>
            <TextInput style={styles.input} placeholder={i18n.t('pricesqf')} value={formData.buildareaprice} onBlur={(text) => handleCommaBlur('buildareaprice', formData.buildareaprice)} onChangeText={(text) => handleSmartChange('buildareaprice', text)} keyboardType="numeric" />
            <Text style={styles.label}>{i18n.t('pricesqm')}</Text>
            <TextInput style={styles.input} placeholder={i18n.t('pricesqm')} value={formData.buildareapricesqm} onBlur={(text) => handleCommaBlur('buildareapricesqm', formData.buildareapricesqm)} onChangeText={(text) => handleSmartChange('buildareapricesqm', text)} keyboardType="numeric" />
            <Text style={styles.label}>{i18n.t('grossvalue')}</Text>
            <TextInput style={styles.input} placeholder={i18n.t('grossvalue')} value={formData.buildareagrossvalue} onBlur={(text) => handleCommaBlur('buildareagrossvalue', formData.buildareagrossvalue)} onChangeText={(text) => handleGrossValueChange('buildareagrossvalue', text)} keyboardType="numeric" />
            <Text style={styles.label}>{i18n.t('precent')}</Text>
            <View style={styles.custominput} >
              <PercentageInput value={formData.percentcost} onChange={(text: any) => handleSmartChange('percentcost', text)} />
            </View>
            <View style={styles.custominput} >
              <RadioInputField
                label={i18n.t('valueofrealestate')}
                value={formData.costrealestate}
                onChange={(text: any) => handleSmartChange('costrealestate', text)}
                onBlur={() => handleCommaBlur('costrealestate', formData.costrealestate)}
                selected={formData.selectedgroup === 1}
                onSelect={() => SelectedGroupChange('selectedgroup', 1)}
              />
            </View>


          </AccordionSection>

          <AccordionSection
            title={i18n.t('valuedependincome')}
            isCollapsed={collapse.dependincome}
            toggle={() => toggleSection('dependincome')}
          >
            <Text style={styles.label}>{i18n.t('precent')} </Text>
            <View style={styles.custominput} >
              <PercentageInput value={formData.incomepercent} onChange={(text: any) => handleSmartChange('incomepercent', text)} />
            </View>
            <View style={styles.custominput} >
              <RadioInputField
                label={i18n.t('valueofrealestate')}
                value={formData.incomegrossery}
                onChange={(text: any) => handleSmartChange('incomegrossery', text)}
                onBlur={() => handleCommaBlur('incomegrossery', formData.incomegrossery)}
                selected={formData.selectedgroup === 2}
                onSelect={() => SelectedGroupChange('selectedgroup', 2)}
              />
            </View>

          </AccordionSection>

          <AccordionSection
            title={i18n.t('valuedependcomparing')}
            isCollapsed={collapse.dependcompare}
            toggle={() => toggleSection('dependcompare')}
          >
            <RadioInputField
              label={i18n.t('valueofrealestate')}
              value={formData.comparerealestate}
              onChange={(text: any) => handleSmartChange('comparerealestate', text)}
              onBlur={() => handleCommaBlur('comparerealestate', formData.comparerealestate)}
              selected={formData.selectedgroup === 3}
              onSelect={() => SelectedGroupChange('selectedgroup', 3)}
            />

          </AccordionSection>

          <AccordionSection
            title={i18n.t('thefinalvalue')}
            isCollapsed={collapse.finalvalue}
            toggle={() => toggleSection('finalvalue')}
          >
            <Text style={styles.label}>{i18n.t('selectionvalue')}</Text>
            <TextInput
              style={styles.input}
              placeholder={i18n.t('selectionvalue')}
              value={formData.selectedvalue}
              onBlur={() => handleCommaBlur('selectedvalue', formData.selectedvalue)}
              onChangeText={(text) => handleChange('selectedvalue', text)}
              keyboardType="numeric"
            />

            <Text style={styles.label}>{i18n.t('reasonofmodification')}</Text>
            <TextInput
              style={styles.inputarea}
              multiline
              value={formData.modification_reason}
              onChangeText={(text) => handleChange('modification_reason', text)}
              placeholder={i18n.t('reasonofmodification')}
            />
            <View style={styles.dottedLine} />
            {/* Is Show Certificate Note */}
            <Text style={styles.label}>{i18n.t('showcertificatenote')}</Text>
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
            <Text style={styles.label}>{i18n.t('note')}</Text>
            <TextInput style={[styles.input, { height: 100 }]} placeholder={i18n.t('note')} multiline value={formData.note} onChangeText={(text) => handleChange('note', text)} />
          </AccordionSection>

          <AccordionSection
            title={i18n.t('certificatesection')}
            isCollapsed={collapse.certificate}
            toggle={() => toggleSection('certificate')}
          >
            <Text style={styles.label}>{i18n.t('certificatenote')}</Text>
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





 