
import { creatusers_api, getrole_api, getuser_api, rooturl, updateusers_api } from '@/constant/DXBConstant';
import api from '@/Services/axiosInstance';
import i18n from '@/Services/i18n';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Button,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const AddUserManageScreen = ({ navigation, route }: any) => {
    const isEdit = route.params?.mode === 'edit';
    const userId = route.params?.userId;

    const [loading, setLoading] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [picture, setPicture] = useState<string | null>(null);
    const [roleOptions, setRoleOptions] = useState('');


    useEffect(() => {
        const pageTitle = isEdit ? i18n.t('updateuser') : i18n.t('createuser');
        navigation.setOptions({ title: pageTitle });

        const loadUserData = async () => {
            try {
                setLoading(true); // show loading while fetching

                if (isEdit && userId) {
                    const res = await api.get(getuser_api, {
                        params: {
                            userid: userId,
                        },
                    });

                    const user = res.data;
                    const userpicture = user.showpicture ? rooturl + user.showpicture : '';
                    // console.log(user);
                    setFirstName(user.firstname || '');
                    setLastName(user.lastname || '');
                    setUsername(user.username || '');
                    setEmail(user.email || '');
                    setPassword(''); // leave empty when editing
                    setRole(user.role || '');
                    setPicture(userpicture || null);
                }
            } catch (error) {
                console.error('Error loading user data:', error);
                Alert.alert(i18n.t('error') , i18n.t('failedtoloadusers'));
            } finally {
                setLoading(false); // hide loading
            }
        };

        loadUserData();
    }, [isEdit, userId, navigation]);



    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch(getrole_api);
                const data = await response.json();

                if (Array.isArray(data) && data.length > 0 && data.every(item => item.label && item.value)) {
                    // Valid array and items have expected shape
                    setRoleOptions(data);
                } else {
                    console.warn("Invalid or unexpected data from server:", data);
                    setRoleOptions([]); // fallback to empty array
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
                setRoleOptions([]); // Fallback to empty array on error
            }
        };

        fetchRoles();
    }, []);

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setPicture(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!firstName || !lastName || !username || !email || (!isEdit && !password) || !role) {
            Alert.alert( i18n.t('validation') , i18n.t('pleasefillinallrequiredfields') );
            return;
        }

        const formData = new FormData();

        if (isEdit && userId) {
            formData.append('userid', userId.toString());
        }

        formData.append('FirstName', firstName);
        formData.append('LastName', lastName);
        formData.append('Username', username);
        formData.append('Email', email);
        formData.append('Role', role);

        // فقط إذا تم اختيار صورة
        if (picture && !picture.startsWith('http')) {
            const fileName = picture.split('/').pop();
            const fileType = fileName?.split('.').pop();

            formData.append('Picture', {
                uri: picture,
                name: fileName || 'photo.jpg',
                type: `image/${fileType || 'jpeg'}`,
            } as any); // TypeScript bypass
        }

         
        if (!isEdit) {
            if (!password) {
                Alert.alert(i18n.t('validation'), i18n.t('passwordisrequiredfornewusers')  );
                return;
            }
            formData.append('Password', password);
        } else if (password && password.trim() !== '') {
            // فقط أرسلها في التعديل إذا المستخدم كتب شيئًا
            formData.append('Password', password);
        }

        try {
            setLoading(true);

            const response = await fetch(
                isEdit ? updateusers_api : creatusers_api,
                {
                    method: 'POST',
                    body: formData,
                    headers: {
                        Accept: 'application/json', 
                    },
                }
            );

            const responseData = await response.json().catch(() => null);

            if (response.ok) {
                navigation.goBack();
            } else {
                console.log('Server response error:', responseData || response);

                let errorMessages = i18n.t('unknownerror')  ;

                if (responseData) {
                    if (responseData.Errors) {
                        errorMessages = Object.values(responseData.Errors).flat().join('\n');
                    } else if (responseData.Message) {
                        errorMessages = responseData.Message;
                    } else {
                        errorMessages = JSON.stringify(responseData, null, 2);
                    }
                }

                Alert.alert(i18n.t('validationerrors') , errorMessages);
            }
        } catch (error) {
            console.error('Error submitting user:', error);
            Alert.alert(i18n.t('error') , i18n.t('somethingwentwrongwhilesubmittingtheuser'));
        } finally {
            setLoading(false);
        }
 
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={i18n.t('firstname') } 
                value={firstName}
                onChangeText={setFirstName}
            />
            <TextInput
                style={styles.input}
                placeholder={i18n.t('lastname') } 
                value={lastName}
                onChangeText={setLastName}
            />
            <TextInput
                style={styles.input}
                placeholder={i18n.t('username') } 
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder={i18n.t('email') } 
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder={i18n.t('password') } 
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Picker
                selectedValue={role}
                onValueChange={setRole}
                style={styles.input}
            >
                <Picker.Item label={i18n.t('selectarole') }  value="" />
                {Array.isArray(roleOptions) &&
                    roleOptions.map((r, index) => (
                        <Picker.Item key={index} label={r.label} value={r.value} />
                    ))}
            </Picker>

            <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
                {picture ? (
                    <Image source={{ uri: picture }} style={styles.image} />
                ) : (
                    <Text>{i18n.t('selectpersonalpicture') }</Text>
                )}
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
                <Button title={i18n.t('save') }  onPress={handleSubmit} />
                <Button title={i18n.t('close') } color="gray" onPress={() => navigation.goBack()} />
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    imagePicker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default AddUserManageScreen;