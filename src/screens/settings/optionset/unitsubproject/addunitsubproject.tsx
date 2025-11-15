import { creatsubproject_api, updatesubproject_api } from '@/constant/DXBConstant';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Platform, StyleSheet, TextInput, View } from 'react-native';


const AddSubProjectScreen = ({ navigation, route }: any) => {
  const isEdit = route.params?.mode === 'edit';
  const subProject = route.params?.subProject;

  const [englishname, setEnglish] = useState('');
  const [arabicname, setArabic] = useState('');
  const [status, setStatus] = useState<number | null>(null);

  useEffect(() => {
    if (isEdit && subProject) {
      setEnglish(subProject.englishname);
      setArabic(subProject.arabicname);
      setStatus(subProject.status);
    }
  }, [isEdit, subProject]);

  const handleSubmit = async () => {
    if (!englishname || !arabicname || status === null) {
      Alert.alert('Validation', 'Please fill all fields');
      return;
    }

    const subProjectData = {
      id: isEdit ? subProject.id : undefined,
      englishname,
      arabicname,
      status,
    };

    const url = isEdit
      ? updatesubproject_api
      : creatsubproject_api;

    try {
      const response = await fetch(url, {
        method: 'POST', // Use PUT if your API requires it for update
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subProjectData),
      });

      const data = await response.json();

      if (response.ok) {
        navigation.goBack();
      } else {
        const errorMessages = data.Errors?.join('\n') || 'Unknown error';
        Alert.alert('Validation Errors', errorMessages);
      }
    } catch (error) {
      console.error('Error submitting subproject:', error);
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
        title={isEdit ? 'Update Sub Project' : 'Create Sub Project'}
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

export default AddSubProjectScreen;
