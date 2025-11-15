import { updategovermenttax_api } from '@/constant/DXBConstant';
import i18n from '@/Services/i18n';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';

const EditGovTaxScreen = ({ navigation, route }: any) => {
  const isEdit = route.params?.mode === 'edit';
  const taxItem = route.params?.taxItem;

  const [taxNumber, setTaxNumber] = useState('');
  const [vat, setVat] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t('addgovtax'),
    });
  }, [navigation, i18n.language]);

  useEffect(() => {
    if (isEdit && taxItem) {
      setTaxNumber(taxItem.taxnumber);
      setVat(taxItem.vat);
    }
  }, [isEdit, taxItem]);

  const handleSubmit = async () => {
    if (!taxNumber || !vat) {
      Alert.alert( i18n.t('validation') , i18n.t('pleasefillallfields'));
      return;
    }

    const taxData = {
      id: isEdit ? taxItem.id : undefined,
      taxnumber: taxNumber,
      vat: vat,
    };

    const url = updategovermenttax_api;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taxData),
      });

      const data = await response.json();

      if (response.ok) {
        navigation.goBack();
      } else {
        const errorMessages = data.Errors?.join('\n') || i18n.t('unknownerror') ;
        Alert.alert( i18n.t('validationerrors') , errorMessages);
      }
    } catch (error) {
      console.error(i18n.t('errorsubmittingtaxinfo_') , error);
      Alert.alert(i18n.t('error') , i18n.t('somethingwentwrong'));
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={i18n.t('taxnumber')} 
        value={taxNumber}
        onChangeText={setTaxNumber}
      />
      <TextInput
        style={styles.input}
        placeholder={i18n.t('vat')} 
        value={vat}
        onChangeText={setVat}
        keyboardType="decimal-pad"
      />

      <Button
        title={isEdit ? i18n.t('updatetaxinfo') : i18n.t('createtaxinfo') }
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

export default EditGovTaxScreen;
