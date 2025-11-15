import { creatbuildbase_api, updatebuildbase_api } from '@/constant/DXBConstant';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Platform, StyleSheet, TextInput, View } from 'react-native';


const AddBuildBaseScreen = ({ navigation, route }: any) => {
  const isEdit = route.params?.mode === 'edit';
  const buildBase = route.params?.buildBase;

  const [enName, setEnName] = useState('');
  const [arName, setArName] = useState('');
  const [status, setStatus] = useState<number | null>(null);

  useEffect(() => {
    if (isEdit && buildBase) {
      setEnName(buildBase.en_name);
      setArName(buildBase.ar_name);
      setStatus(buildBase.status);
    }
  }, [isEdit, buildBase]);

  const handleSubmit = async () => {
    if (!enName || !arName || status === null) {
      Alert.alert('Validation', 'Please fill all fields');
      return;
    }

    const buildBaseData = {
      id: isEdit ? buildBase.id : undefined,
      en_name: enName,
      ar_name: arName,
      status,
    };

    const url = isEdit
      ? updatebuildbase_api
      : creatbuildbase_api;

    try {
      const response = await fetch(url, {
        method: 'POST', // Or PUT, depending on your API
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buildBaseData),
      });

      const data = await response.json();

      if (response.ok) {
        navigation.goBack();
      } else {
        const errorMessages = data.Errors?.join('\n') || 'Unknown error';
        Alert.alert('Validation Errors', errorMessages);
      }
    } catch (error) {
      console.error('Error submitting build base:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="English Name"
        value={enName}
        onChangeText={setEnName}
      />
      <TextInput
        style={styles.input}
        placeholder="Arabic Name"
        value={arName}
        onChangeText={setArName}
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
        title={isEdit ? 'Update Build Base' : 'Create Build Base'}
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

export default AddBuildBaseScreen;
