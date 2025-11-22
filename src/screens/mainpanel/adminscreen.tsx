import CustomDrawerContent from "@/components/CustomDrawerContent";
import i18n from "@/Services/i18n";
import ManageCertifScreen from '@/src/screens/certificatemanage';
import DashboardScreen from '@/src/screens/dashboard/index';
import EvaFormScreen from '@/src/screens/evaformmanage';
import ManageFinanceScreen from '@/src/screens/financemanage';
import ManageFormScreen from '@/src/screens/formmanage';
import ManagePolicyScreen from '@/src/screens/policymanage';

import SettingScreen from '@/src/screens/settings/index';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useState } from "react";
import { Dimensions, I18nManager, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const screenWidth = Dimensions.get('window').width;


const Drawer = createDrawerNavigator();

const AdminScreen = ({ navigation, route }: any) => {
    const [layoutReady, setLayoutReady] = useState(false);
    const [drawerKey, setDrawerKey] = useState(0);


    const isRTL = I18nManager.isRTL;
    console.log(isRTL);
    // Show loading until RTL/language is ready
    if (!layoutReady) {
        return (
            <View
                style={{ flex: 1 }}
                onLayout={() => {
                    setLayoutReady(true);

                    // Slight refresh after layout to fix RTL + animation
                    setTimeout(() => {
                        setDrawerKey((prev) => prev + 1);
                    }, 50);


                }}
            />
        );
    }


    return (
        <Drawer.Navigator
            initialRouteName="Form"
            drawerContent={(props) => <CustomDrawerContent {...props} isRTL={isRTL} />}
            key={'drawer-rtl'}
            screenOptions={{
                drawerPosition: isRTL ? 'right' : 'left',
                drawerType: 'slide',
                drawerStyle: {
                    // width: screenWidth * 0.8,
                    backgroundColor: '#fff',
                    //  flexDirection: 'row-reverse',
                    //   direction: 'rtl'
                },
                drawerLabelStyle: {
                    // textAlign: I18nManager.isRTL ? 'right' : 'left',
                    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
                },
                drawerItemStyle: {
                    // flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
                },
                overlayColor: 'transparent',
            }}
        >
            <Drawer.Screen
                name="Dashboard"
                options={{
                    title: i18n.t('dashboard'),
                    drawerIcon: ({ color, size }) => <Ionicons name="speedometer" size={size} color={color} />

                }}
                component={DashboardScreen}
            />
            <Drawer.Screen
                name="Policy"
                options={{
                    title: i18n.t('policiesmanage'),
                    drawerIcon: ({ color, size }) => <Ionicons name="newspaper" size={size} color={color} />
                }}
                component={ManagePolicyScreen}
            />
            <Drawer.Screen
                name="EvaForm"
                component={EvaFormScreen}
                options={{
                    title: i18n.t('formsmanage'),
                    drawerIcon: ({ color, size }) => <Ionicons name="newspaper" size={size} color={color} />
                }}
            />

            <Drawer.Screen
                name="Form"
                component={ManageFormScreen}
                options={{
                    title: i18n.t('formsmanage'),
                    drawerIcon: ({ color, size }) => <Ionicons name="newspaper" size={size} color={color} />
                }}
            />

            <Drawer.Screen
                name="Finance"
                component={ManageFinanceScreen}
                options={{
                    title: i18n.t('financemanage'),
                    drawerIcon: ({ color, size }) => <Ionicons name="newspaper" size={size} color={color} />
                }}
            />

            <Drawer.Screen
                name="Certif"
                component={ManageCertifScreen}
                options={{
                    title: i18n.t('certificatemanage'),
                    drawerIcon: ({ color, size }) => <Ionicons name="newspaper" size={size} color={color} />
                }}
            />

            <Drawer.Screen
                name="Setting"
                component={SettingScreen}
                options={{
                    title: i18n.t('setting')  ,
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="settings" size={size} color={color} />
                    ),
                }}
            />
        </Drawer.Navigator>
    );
};

export default AdminScreen;