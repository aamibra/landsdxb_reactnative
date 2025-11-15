import i18n from "@/Services/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from 'expo-localization';
import * as Updates from 'expo-updates';
import React, { useEffect, useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    I18nManager,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const MenuUserScreen = ({ navigation }: any) => {
    const [isArabic, setIsArabic] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [avatar, setAvatar] = useState<any>(null);

   // I18nManager.allowRTL(true);
  //  I18nManager.forceRTL(true);
   // i18n.locale = 'ar';
i18n.changeLanguage('ar');
    const isRTL = Localization.getLocales()[0].languageCode; // إذا اللغة عربية، RTL
    console.log("is language support arabic : " + isRTL);
    
    const defaultAvatar = require('@/assets/images/user-placeholder.png');

    const toggleLanguage = async () => {
        setIsArabic(isArabic);
         I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
   i18n.changeLanguage('ar');
   // i18n.locale = 'ar';
    await Updates.reloadAsync();
        // هنا تقدر تضيف كود لتبديل اللغة في تطبيقك
    };


    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userfirstname = await AsyncStorage.getItem('FirstName');
                const userlastname = await AsyncStorage.getItem('LastName');
                const useravatar = await AsyncStorage.getItem('AvatarUrl');

                if (userfirstname) setFirstName(userfirstname);
                if (userlastname) setLastName(userlastname);
                if (useravatar) setAvatar(useravatar);
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        };

        loadUserData();
    }, []);


    const menuItems = [
        { title: isArabic ? "لوحة التحكم" : "Dashboard", icon: "view-dashboard", model: 'DashboardScreen' },
        { title: isArabic ? "إدارة الوثائق" : "Policies Manage", icon: "file-document", model: 'ManagePolicy' },
        { title: isArabic ? "إدارة النماذج" : "Forms Manage", icon: "file-document", model: 'ManageForm' },
        { title: isArabic ? "إدارة الفواتير" : "Invoice Manage", icon: "file-document", model: 'ManageFinance' },
        { title: isArabic ? "إدارة الشهادات" : "Certificate Manage", icon: "file-document", model: 'ManageCertif' },
        { title: isArabic ? "الإعدادات" : "Settings", icon: "cog", model: 'SettingMain' },
    ];


    const handlePress = (item: any) => {
        navigation.reset({
            index: 0,
            routes: [{ name: `${item.model}` }], // 👈 your new root screen
        }); 
    };


    const displayName = `${firstName ?? ''} ${lastName ?? ''}`.trim() || 'guse';

    return (
        <SafeAreaView style={styles.container} >
            <View  >
                {/* الجزء العلوي */}
                <View
                    style={{
                        backgroundColor: '#81bdff',
                        padding: 20,
                        alignItems: isArabic ? 'flex-end' : 'flex-start',
                        position: 'relative', // for absolute icon positioning
                    }}
                >
                    {/* ⚙️ Gear Icon Button */}
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            top: 10,
                            right: isArabic ? undefined : 65,
                            left: isArabic ? 65 : undefined,
                            backgroundColor: 'rgba(255,255,255,0.25)',
                            padding: 8,
                            borderRadius: 20,
                        }}
                        onPress={() => navigation.navigate('EditProfileScreen')}
                    >
                        <Ionicons name="settings-outline" size={22} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            top: 10,
                            right: isArabic ? undefined : 20,
                            left: isArabic ? 20 : undefined,
                            backgroundColor: 'rgba(255,255,255,0.25)',
                            padding: 8,
                            borderRadius: 20,
                        }}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="close" size={22} color="#fff" />
                    </TouchableOpacity>


                    <Image
                        source={avatar ? { uri: avatar } : defaultAvatar}
                        style={{
                            height: 80,
                            width: 80,
                            borderRadius: 40,
                            marginBottom: 10,
                            marginTop: 50,
                        }}
                    />

                    <Text
                        style={{
                            color: '#fff',
                            fontSize: 18,
                            fontFamily: 'Roboto-Medium',
                            marginBottom: 5,
                            textAlign: isArabic ? 'right' : 'left',
                            writingDirection: isArabic ? 'rtl' : 'ltr',
                        }}
                    >
                        {displayName}
                    </Text>
                </View>

                {/* القائمة */}
                <ScrollView style={styles.menuContainer}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem} onPress={() => handlePress(item)} >
                            <Icon name={item.icon} size={22} color="#555" />
                            <Text style={styles.menuText}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Footer */}
                <View
                    style={{
                        padding: 20,
                        borderTopWidth: 1,
                        borderTopColor: '#ccc',
                    }}
                >
                    {/* Language Toggle */}
                    <TouchableOpacity
                        onPress={() => {
                            toggleLanguage();
                            // Updates.reloadAsync();
                        }}
                        style={{ paddingVertical: 15 }}
                    >
                        <View
                            style={{
                                flexDirection: isArabic ? 'row-reverse' : 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Ionicons name="language" size={22} />
                            <Text
                                style={{
                                    fontSize: 15,
                                    fontFamily: 'Roboto-Medium',
                                    marginHorizontal: 5,
                                    writingDirection: isArabic ? 'rtl' : 'ltr',
                                }}
                            >
                                {isArabic ? 'English' : 'العربية'}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Logout */}
                    <TouchableOpacity style={{ paddingVertical: 15 }}>
                        <View
                            style={{
                                flexDirection: isArabic ? 'row-reverse' : 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Ionicons name="exit-outline" size={22} />
                            <Text
                                style={{
                                    fontSize: 15,
                                    fontFamily: 'Roboto-Medium',
                                    marginHorizontal: 5,
                                    writingDirection: isArabic ? 'rtl' : 'ltr',
                                }}
                            >
                                {i18n.t('logout')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>




            </View>
        </SafeAreaView>
    );
};

export default MenuUserScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f6fa",

    },
    header: {
        backgroundColor: "#77b5fe",
        paddingVertical: 40,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    username: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    menuContainer: {
        paddingHorizontal: 15,
        marginTop: 10,
    },
    menuItem: {
        backgroundColor: "#f1f2f6",
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        marginBottom: 10,
    },
    menuText: {
        marginLeft: 10,
        fontSize: 16,
        color: "#333",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
    },
    footerItem: {
        flexDirection: "row",
        alignItems: "center",
    },
});
