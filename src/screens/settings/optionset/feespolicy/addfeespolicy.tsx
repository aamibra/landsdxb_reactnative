import { creatpolicyprice_api, updatepolicyprice_api } from '@/constant/DXBConstant';
import i18n from '@/Services/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Button, Platform, StyleSheet, TextInput, View } from 'react-native';


const AddFeesPolicyScreen = ({ navigation, route }: any) => {
  const isEdit = route.params?.mode === 'edit';
  const pricePolicy = route.params?.pricePolicy;
  const systemformid = route.params?.systemformid;

  const [englishname, setEnglish] = useState('');
  const [arabicname, setArabic] = useState('');
  const [servicefees, setServiceFees] = useState('');
  const [status, setStatus] = useState<number | null>(null); 
  const [isArabic, setIsArabic] = useState(false);
  const [switchLanguage, setSwitchLanguage] = useState('ar'); // opposite by default

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEdit ? i18n.t('editpricepolicy') : i18n.t('addpricepolicy'),
    });
  }, [navigation, i18n.language]);

  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('appLanguage');
        const lang = storedLanguage || 'en'; 
        setSwitchLanguage(storedLanguage === 'en' ? 'ar' : 'en');
        setIsArabic(lang === 'ar');
      } catch (error) {
        console.log('Error fetching language:', error);
      }
    };

    fetchLanguage();
  }, []);
  
  useEffect(() => {
    if (isEdit && pricePolicy) {
      setEnglish(pricePolicy.englishname);
      setArabic(pricePolicy.arabicname);
      setServiceFees(pricePolicy.servicefees);
      setStatus(pricePolicy.status);
    }
  }, [isEdit, pricePolicy]);

  const handleSubmit = async () => {
    if (!englishname || !arabicname || !servicefees || status === null) {
      Alert.alert(i18n.t('validation'), i18n.t('pleasefillallfields'));
      return;
    }

    const pricePolicyData = {
      id: isEdit ? pricePolicy.id : undefined,
      systemformid, // coming from route.params
      englishname,
      arabicname,
      servicefees,
      status,
    };

    const url = isEdit
      ? updatepolicyprice_api
      : creatpolicyprice_api;

    try {
      const response = await fetch(url, {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pricePolicyData),
      });

      const data = await response.json();

      if (response.ok) {
        navigation.goBack();
      } else {
        const errorMessages = data.Errors?.join('\n') || i18n.t('unknownerror');
        Alert.alert(i18n.t('validationerror'), errorMessages);
      }
    } catch (error) {
      console.error(i18n.t('errorsubmittingpricepolicy_'), error);
      Alert.alert(i18n.t('error'), i18n.t('somethingwentwrong'));
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={i18n.t('englishname')}
        value={englishname}
        onChangeText={setEnglish}
      />
      <TextInput
        style={styles.input}
        placeholder={i18n.t('arabicname')}
        value={arabicname}
        onChangeText={setArabic}
      />
      <TextInput
        style={styles.input}
        placeholder={i18n.t('servicefees')}
        value={servicefees}
        onChangeText={setServiceFees}
        keyboardType="decimal-pad"
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={status}
          onValueChange={(itemValue) => setStatus(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label={i18n.t('selectstatus')} value={null} />
          <Picker.Item label={i18n.t('active')} value={1} />
          <Picker.Item label={i18n.t('inactive')} value={0} />
        </Picker>
      </View>

      <Button
        title={isEdit ? i18n.t('updatepricepolicy') : i18n.t('createpricepolicy')}
        onPress={handleSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingHorizontal: Platform.OS === 'ios' ? 8 : 0,
    justifyContent: 'center',
    height: 50,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    color: '#000',
  },
});

export default AddFeesPolicyScreen;
