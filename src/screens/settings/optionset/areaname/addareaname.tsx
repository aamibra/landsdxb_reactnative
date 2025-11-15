import { creatarea_api, updatearea_api } from '@/constant/DXBConstant';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Platform, StyleSheet, TextInput, View } from 'react-native';


const AddAreaNameScreen = ({ navigation, route }: any) => {
    const isEdit = route.params?.mode === 'edit';
    const area = route.params?.area;


    const [code, setCode] = useState('');
    const [englishname, setEnglish] = useState('');
    const [arabicname, setArabic] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (isEdit && area) {

            setCode(area.areacode);
            setEnglish(area.englishname);
            setArabic(area.arabicname);
            setStatus(area.status);
        }
    }, [isEdit, area]);

    const handleSubmit = async () => {
        if (!code || !englishname || !arabicname || !status) {
            Alert.alert('Validation', 'Please fill all fields');
            return;
        }

        const editareaData = {
            id: isEdit ? area.id : undefined,
            code,
            englishname,
            arabicname,
            status,
        };

        const createAreaData = {
            code,
            englishname,
            arabicname,
            status,
        };

        if (isEdit) {
            try {
                const response = await fetch(`${updatearea_api}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editareaData),
                });

                const data = await response.json();

                if (response.ok) {
                    navigation.goBack();
                } else {
                    const errorMessages = data.Errors?.join('\n') || 'Unknown error';
                    Alert.alert('Validation Errors', errorMessages);
                }

            } catch (error) {
                console.error('Error submitting area:', error);
                Alert.alert('Error', 'Something went wrong while creating the area');
            }

        } else {

            try {
                const response = await fetch(`${creatarea_api}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(createAreaData),
                });

                const data = await response.json();

                if (response.ok) {
                    navigation.goBack();
                } else {
                    const errorMessages = data.Errors?.join('\n') || 'Unknown error';
                    Alert.alert('Validation Errors', errorMessages);
                }

            } catch (error) {
                console.error('Error submitting area:', error);
                Alert.alert('Error', 'Something went wrong while creating the area');
            }
        }
    };

    return (
        <View style={styles.container}>

            <TextInput style={styles.input} placeholder="English Name" value={englishname} onChangeText={setEnglish} />
            <TextInput style={styles.input} placeholder="Arabic Name" value={arabicname} onChangeText={setArabic} />
            <TextInput style={styles.input} placeholder="Code" value={code} onChangeText={setCode} />
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={status}
                    onValueChange={(itemValue) => setStatus(itemValue)}
                    style={styles.picker}
                    mode="dropdown" // optional: use 'dialog' on Android if needed
                    dropdownIconColor="#333"
                >
                    <Picker.Item label="-- Select Status --" value={null} />
                    <Picker.Item label="Active" value={1} />
                    <Picker.Item label="Inactive" value={2} />
                </Picker>
            </View>

            <Button title={isEdit ? 'Update Area' : 'Save Area'} onPress={handleSubmit} />
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
        height: 50, // important: give enough height
        overflow: 'hidden',
    },
    picker: {
        width: '100%',
        //  height: Platform.OS === 'ios' ? 200 : '100%', // Ensures full visibility on iOS
        color: '#000',
    },
});

export default AddAreaNameScreen;
