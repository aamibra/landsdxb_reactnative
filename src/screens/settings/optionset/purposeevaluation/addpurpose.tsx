import { creatpurpose_api, updatepurpose_api } from '@/constant/DXBConstant';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Platform, StyleSheet, TextInput, View } from 'react-native';

const AddPurposeScreen = ({ navigation, route }: any) => {
  const isEdit = route.params?.mode === 'edit';
  const purpose = route.params?.purpose;

  const [englishname, setEnglish] = useState('');
  const [arabicname, setArabic] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (isEdit && purpose) {
      setEnglish(purpose.englishname);
      setArabic(purpose.arabicname);
      setStatus(purpose.status);
    }
  }, [isEdit, purpose]);

  const handleSubmit = async () => {
    if (!englishname || !arabicname || status == null) {
      Alert.alert('Validation', 'Please fill all fields');
      return;
    }

    const purposeData = {
      id: isEdit ? purpose.id : undefined,
      englishname,
      arabicname,
      status,
    };

    const url = isEdit
      ? updatepurpose_api // replace with your update API
      : creatpurpose_api; // replace with your create API

    try {
      const response = await fetch(url, {
        method: 'POST', // or PUT based on your API
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purposeData),
      });

      const data = await response.json();

      if (response.ok) {
        navigation.goBack();
      } else {
        const errorMessages = data.Errors?.join('\n') || 'Unknown error';
        Alert.alert('Validation Errors', errorMessages);
      }
    } catch (error) {
      console.error('Error submitting purpose:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="English Name"
        value={englishname}
        onChangeText={setEnglish}
      />
      <TextInput
        style={styles.input}
        placeholder="Arabic Name"
        value={arabicname}
        onChangeText={setArabic}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={status}
          onValueChange={(itemValue) => setStatus(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="-- Select Status --" value={null} />
          <Picker.Item label="Active" value={1} />
          <Picker.Item label="Inactive" value={0} />
        </Picker>
      </View>

      <Button
        title={isEdit ? 'Update Purpose' : 'Create Purpose'}
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

export default AddPurposeScreen;
