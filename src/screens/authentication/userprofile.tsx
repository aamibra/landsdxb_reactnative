import { editprofile_api } from '@/constant/DXBConstant';
import api from '@/Services/axiosInstance';
import i18n from '@/Services/i18n';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface RNFile {
    uri: string;
    type: string;
    name: string;
}

const EditProfileScreen = ({ navigation }: any) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [avatar, setAvatar] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const defaultAvatar = require('@/assets/images/user-placeholder.png');

      useLayoutEffect(() => {
        navigation.setOptions({
          title: i18n.t('userprofile'),
        });
      }, [navigation, i18n.language]);
      

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userfirstname = await AsyncStorage.getItem('FirstName');
                const userlastname  = await AsyncStorage.getItem('LastName');
                const useravatar    = await AsyncStorage.getItem('AvatarUrl');

                if (userfirstname) setFirstName(userfirstname);
                if (userlastname) setLastName(userlastname);
                if (useravatar) setAvatar({ uri: useravatar });
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        };

        loadUserData();
    }, []);

    // طلب صلاحية الوصول للصور عند أول محاولة
    const requestPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
               i18n.t('permission') ,
               i18n.t('permissionaccesstophoto')
            );
            return false;
        }
        return true;
    };

    const selectAvatar = async () => {
        const hasPermission = await requestPermission();
        if (!hasPermission) return;

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsEditing: true,
            aspect: [1, 1], // شكل مربع
            allowsMultipleSelection: false,
        });

        if (!result.canceled) {
            // في الإصدار الحديث، قد تكون النتيجة assets array
            // إذا كان result.assets موجود نستخدمه:
            if (result.assets && result.assets.length > 0) {
                const asset = result.assets[0];

                const fileName = asset.fileName || asset.uri.split('/').pop() || 'avatar.jpg';
                const ext = fileName.split('.').pop()?.toLowerCase();

                // لا نلمس asset.type لأنه مقيّد بـ Expo
                let mimeType: string;
                if (ext === 'png') {
                    mimeType = 'image/png';
                } else if (ext === 'jpg' || ext === 'jpeg') {
                    mimeType = 'image/jpeg';
                } else {
                    mimeType = 'application/octet-stream';
                }

                const fileToUpload = {
                    uri: asset.uri,
                    name: fileName,
                    type: mimeType, // هذا للـ FormData فقط
                };

                setAvatar(fileToUpload);



            } else {
                // للنسخ القديمة أو fallback
                setAvatar({
                    uri: result.uri,
                    type: 'image/jpeg',
                    name: result.uri.split('/').pop() || 'avatar.jpg',
                });
            }
        }
    };


    const handleUpdateProfile = async () => {
        // ✅ تحقق من الحقول المطلوبة
        if (!firstName || !lastName) {
            Alert.alert( i18n.t('error') , i18n.t('firstandlastnamearerequired'));
            return;
        }

        setLoading(true);

        try {
            // -------------------------
            // 1️⃣ إعداد FormData
            // -------------------------
            const formData = new FormData();
            formData.append('FirstName', firstName);
            formData.append('LastName', lastName);

            if (newPassword.trim() !== '') {
                formData.append('NewPassword', newPassword);
            }

            // أضف الصورة فقط إذا تم تغييرها
            if (avatar && avatar.uri && !avatar.uri.startsWith('http')) {
                const file: RNFile = {
                    uri: avatar.uri,
                    type: avatar.type || 'image/jpeg',
                    name: avatar.name || 'avatar.jpg',
                };
                // @ts-ignore
                formData.append('Avatar', file);
            }

           
            const response = await api.post(editprofile_api, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // Content-Type is handled automatically
                },
            });

            // -------------------------
            // 3️⃣ تحديث AsyncStorage
            // -------------------------
            await AsyncStorage.setItem('FirstName', firstName);
            await AsyncStorage.setItem('LastName', lastName);

            if (response.data.user?.avatar) {
                await AsyncStorage.setItem('AvatarUrl', response.data.user.avatar);
            } else if (avatar?.uri) {
                await AsyncStorage.setItem('AvatarUrl', avatar.uri);
            }
           
            navigation.goBack();
        } catch (error: any) {
            if (error.response) {
                console.error('❌ Error Status:', error.response.status);
                console.error('❌ Error Data:', error.response.data);
            } else {
                console.error('❌ Request Error:', error.message);
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="close-outline" size={28} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}> {i18n.t('updatepersonaleprofile')} </Text>
            </View>

            {/* Avatar */}
            <TouchableOpacity onPress={selectAvatar} style={styles.avatarContainer}>
                <Image
                    source={avatar?.uri ? { uri: avatar.uri } : defaultAvatar}
                    style={styles.avatar}
                />
                <View style={styles.editIconContainer}>
                    <Ionicons name="camera-outline" size={18} color="#fff" />
                </View>
            </TouchableOpacity>

            {/* Inputs */}
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder={i18n.t('firstname')}
                    value={firstName}
                    onChangeText={setFirstName}
                />

                <TextInput
                    style={styles.input}
                    placeholder={i18n.t('lastname')} 
                    value={lastName}
                    onChangeText={setLastName}
                />

                <TextInput
                    style={styles.input}
                    placeholder={i18n.t('password')} 
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                />

                <TouchableOpacity
                    style={[styles.saveButton, loading && { opacity: 0.7 }]}
                    onPress={handleUpdateProfile}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveButtonText}>{i18n.t('savedata')}</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8faff',
    },
    header: {
        backgroundColor: '#81bdff',
        height: 140,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        justifyContent: 'flex-end',
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        padding: 5,
    },
    headerTitle: {
        color: '#fff',
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    avatarContainer: {
        alignSelf: 'center',
        marginTop: 10,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 60,
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#81bdff',
        borderRadius: 15,
        padding: 5,
        elevation: 3,
    },
    form: {
        paddingHorizontal: 20,
        marginTop: 30,
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    saveButton: {
        backgroundColor: '#81bdff',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
