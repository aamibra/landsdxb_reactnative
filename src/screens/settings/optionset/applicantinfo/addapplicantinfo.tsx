import { creatapplincantinfo_api, updateapplincantinfo_api } from '@/constant/DXBConstant';
import i18n from '@/Services/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';


const AddApplicantScreen = ({ navigation, route }: any) => {
  const isEdit = route.params?.mode === 'edit';
  const applicant = route.params?.applicant;
 
  const [isArabic, setIsArabic] = useState(false);
  const [switchLanguage, setSwitchLanguage] = useState('ar'); // opposite by default

  const [applicantname, setApplicantName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEdit ? i18n.t('editapplicantinfo') : i18n.t('addapplicantinfo'),
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
    if (isEdit && applicant) {
      setApplicantName(applicant.applicantname);
      setMobile(applicant.mobile);
      setEmail(applicant.email);
      setAddress(applicant.address);
    }
  }, [isEdit, applicant]);

  const handleSubmit = async () => {
    if (!applicantname || !mobile || !email || !address) {
      Alert.alert('Validation', 'Please fill all fields');
      return;
    }

    const applicantData = {
      id: isEdit ? applicant.id : undefined,
      applicantname,
      mobile,
      email,
      address,
    };

    const url = isEdit
      ? updateapplincantinfo_api
      : creatapplincantinfo_api;

    try {
      const response = await fetch(url, {
        method: 'POST', // or 'PUT' depending on your API
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicantData),
      });

      const data = await response.json();

      if (response.ok) {
        navigation.goBack();
      } else {
        const errorMessages = data.Errors?.join('\n') || 'Unknown error';
        Alert.alert('Validation Errors', errorMessages);
      }
    } catch (error) {
      console.error('Error submitting applicant info:', error);
      Alert.alert(i18n.t('error'), i18n.t('somethingwentwrong'));
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={i18n.t('applicantname')}
        value={applicantname}
        onChangeText={setApplicantName}
      />
      <TextInput
        style={styles.input}
        placeholder={i18n.t('mobile')}
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder={i18n.t('email')}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder={i18n.t('deliveryaddress')}
        value={address}
        onChangeText={setAddress}
      />

      <Button
        title={isEdit ? i18n.t('updateapplicant') : i18n.t('createapplicant')}
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
});

export default AddApplicantScreen;
