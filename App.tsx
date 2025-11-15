
import i18n, { loadLanguage } from '@/Services/i18n';
import * as NavigationBar from 'expo-navigation-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import 'react-native-gesture-handler';
import Reanimated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
void Reanimated;
//import { Drawer } from 'expo-router/drawer';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MenuUserScreen from '@/src/screens/authentication/usermenu';
import ManageCertifScreen from '@/src/screens/certificatemanage';
import DashboardScreen from '@/src/screens/dashboard/index';
import EvaFormScreen from '@/src/screens/evaformmanage';
import ManageFinanceScreen from '@/src/screens/financemanage';
import ManageFormScreen from '@/src/screens/formmanage';
import AdminPanelScreen from '@/src/screens/mainpanel/adminscreen';
import ManagePolicyScreen from '@/src/screens/policymanage';
import SettingScreen from '@/src/screens/settings/index';

import BuildingLandPolicy from '@/src/screens/policymanage/newpolicy/building';
import OfficePolicy from '@/src/screens/policymanage/newpolicy/office';
import ShopPolicy from '@/src/screens/policymanage/newpolicy/shop';
import UnderConstPolicy from '@/src/screens/policymanage/newpolicy/underconst';
import UnitPolicy from '@/src/screens/policymanage/newpolicy/unit';
import VacantLandPolicy from '@/src/screens/policymanage/newpolicy/vacantland';
import VillaPolicy from '@/src/screens/policymanage/newpolicy/villa';

import EvaluatBuilding from '@/src/screens/evaformmanage/intermpolicy/building';
import EvaluatOffice from '@/src/screens/evaformmanage/intermpolicy/office';
import EvaluatShop from '@/src/screens/evaformmanage/intermpolicy/shop';
import EvaluatUnderConst from '@/src/screens/evaformmanage/intermpolicy/underconst';
import EvaluatUnit from '@/src/screens/evaformmanage/intermpolicy/unit';
import EvaluatVacantLand from '@/src/screens/evaformmanage/intermpolicy/vacantland';
import EvaluatVilla from '@/src/screens/evaformmanage/intermpolicy/villa';

import BuildingForm from '@/src/screens/formmanage/newform/building';
import OfficeForm from '@/src/screens/formmanage/newform/office';
import ShopForm from '@/src/screens/formmanage/newform/shop';
import UnderConstForm from '@/src/screens/formmanage/newform/underconst';
import UnitForm from '@/src/screens/formmanage/newform/unit';
import VacantLandForm from '@/src/screens/formmanage/newform/vacantland';
import VillaForm from '@/src/screens/formmanage/newform/villa';

import InvoiceManageScreen from '@/src/screens/settings/invoicmanage';
import MenuManageScreen from '@/src/screens/settings/menu';
import AddMenuManageScreen from '@/src/screens/settings/menu/addmenu';
import OptionSetScreen from '@/src/screens/settings/optionset';
import UserManageScreen from '@/src/screens/settings/user';
import AddUserManageScreen from '@/src/screens/settings/user/adduser';

import GenericAddFormScreen from '@/src/screens/settings/optionset/GenericMasterList/GenericAddFormScreen';
import GenericMasterListScreen from '@/src/screens/settings/optionset/GenericMasterList/GenericMasterListScreen';
import AppInfoScreen from '@/src/screens/settings/optionset/applicantinfo';
import AddAppInfoScreen from '@/src/screens/settings/optionset/applicantinfo/addapplicantinfo';
import AreaNameScreen from '@/src/screens/settings/optionset/areaname';
import AddAreaNameScreen from '@/src/screens/settings/optionset/areaname/addareaname';
import BaseEvaluateScreen from '@/src/screens/settings/optionset/baseevaluate';
import FeesPolicyScreen from '@/src/screens/settings/optionset/feespolicy';
import AddFeesPolicyScreen from '@/src/screens/settings/optionset/feespolicy/addfeespolicy';
import GovTaxScreen from '@/src/screens/settings/optionset/govtax';
import AddGovTaxScreen from '@/src/screens/settings/optionset/govtax/addgovtax';
import LandStatusScreen from '@/src/screens/settings/optionset/landstatus';
import PurposeEvaluateScreen from '@/src/screens/settings/optionset/purposeevaluation';
import SystemFormsScreen from '@/src/screens/settings/optionset/systemforms';
import TypeBuildScreen from '@/src/screens/settings/optionset/typebuild';
import MainProjectScreen from '@/src/screens/settings/optionset/unitmainproject';
import SubProjectScreen from '@/src/screens/settings/optionset/unitsubproject';
import UsageEvaluatScreen from '@/src/screens/settings/optionset/usageevaulation';

import InvoiceReportScreen from '@/src/screens/settings/invoicmanage/invoicereport';
import AddInvoiceReportScreen from '@/src/screens/settings/invoicmanage/invoicereport/addinvoicereport';

import PriceOfferScreen from '@/src/screens/settings/invoicmanage/priceoffer';
import AddPriceOfferScreen from '@/src/screens/settings/invoicmanage/priceoffer/addpriceoffer';

import LoginScreen from '@/src/screens/authentication/login';
import SplashScreen from '@/src/screens/authentication/splashscreen';
import EditProfileScreen from '@/src/screens/authentication/userprofile';


//import * as SplashScreen from 'expo-splash-screen'; 
import { navigationRef } from '@/Services/navigationRef'; // تأكد من المسار
import NoInternetScreen from '@/src/screens/NoInternetScreen';
import ShowCertificateScreen from '@/src/screens/certificatemanage/showcertificate';
import ShowInvoiceScreen from '@/src/screens/financemanage/showinvoice';
import ShowTaxInvoiceScreen from '@/src/screens/financemanage/showtaxinvoice';
import NetInfo from '@react-native-community/netinfo';


// SplashScreen.preventAutoHideAsync(); // تمنع الإخفاء التلقائي

const Stack = createStackNavigator();




function OptionSetStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OptionSetMain"
        component={OptionSetScreen}
        options={{ title: 'Option Set' }}
      />
      <Stack.Screen name="areaname" component={AreaNameScreen} options={{ title: 'Area Name' }} />
      <Stack.Screen name="addareaname" component={AddAreaNameScreen} options={{ title: 'Add Area Name' }} />
      <Stack.Screen name="purposeevaluation" component={PurposeEvaluateScreen} options={{ title: 'Purpose Evaluation' }} />
      <Stack.Screen name="usageevaluation" component={UsageEvaluatScreen} options={{ title: 'Usage Evaluation' }} />
      <Stack.Screen name="typebuild" component={TypeBuildScreen} options={{ title: 'Type Build' }} />
      <Stack.Screen name="baseevaluation" component={BaseEvaluateScreen} options={{ title: 'Base Evaluation' }} />
      <Stack.Screen name="landstatus" component={LandStatusScreen} options={{ title: 'Land Status' }} />
      <Stack.Screen name="unitmainproject" component={MainProjectScreen} options={{ title: 'Unit Main Project' }} />
      <Stack.Screen name="unitsubproject" component={SubProjectScreen} options={{ title: 'Unit SubProject' }} />
      <Stack.Screen name="applicantinfo" component={AppInfoScreen} options={{ title: 'Applicant Info' }} />
    </Stack.Navigator>
  );
}

function SettingsStack() {

  return (
    <Stack.Navigator>
      <Stack.Screen name="SettingMain" component={SettingScreen} options={{ title: 'Settings', headerShown: false }} />

    </Stack.Navigator>
  );

  // <Stack.Screen
  //     name="OptionSet"
  //     component={OptionSetStack} 
  //     options={{ title: 'Option Set' }}
  //   />


}



export default function App() {
  const Stack = createStackNavigator();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const toggleDrawer = () => setDrawerVisible(!drawerVisible);
  const [isConnected, setIsConnected] = useState(true);
  const [ready, setReady] = useState(false);


  useEffect(() => {
    // 👇 Set Android navigation bar to white with dark icons
    NavigationBar.setBackgroundColorAsync('#ffffff');
    NavigationBar.setButtonStyleAsync('dark');

    const init = async () => {
      await loadLanguage();
      setReady(true);
    };

    init();

  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  if (!isConnected) {
    return <NoInternetScreen />;
  }


  /*
  // ⏳ Wait until language is loaded
  if (loadingLang) {
    return null; // or <SplashScreen />
  } 
  console.log(lang);
*/
  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (

    <View style={{ flex: 1 }}>

      <StatusBar backgroundColor="#4a90e2" barStyle="light-content" translucent={false} />
      <SafeAreaView style={{ flex: 1, flexDirection: 'row' , backgroundColor: '#4a90e2' }}>
        <NavigationContainer ref={navigationRef}>
          <ActionSheetProvider>
            <Stack.Navigator  detachInactiveScreens={true} screenOptions={{ detachPreviousScreen: true, }}  >
              <Stack.Screen name="splashscreen" component={SplashScreen} options={{ headerShown: false, animation: 'none' }} />
              <Stack.Screen name="userlogin" component={LoginScreen} options={{ headerShown: false, animation: 'none' }} />
              <Stack.Screen name="UserMenu" component={MenuUserScreen} options={{ headerShown: false, animation: 'none' }} />
              <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
              <Stack.Screen name="ManagePolicy" component={ManagePolicyScreen} />
              <Stack.Screen name="ManageCertif" component={ManageCertifScreen} />
              <Stack.Screen name="EvaForm" component={EvaFormScreen} />
              <Stack.Screen name="ManageFinance" component={ManageFinanceScreen} />
              <Stack.Screen name="ManageForm" component={ManageFormScreen} />
              <Stack.Screen name="SettingMain" component={SettingScreen} options={{ title: 'Settings' }} />
              <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} options={{ headerShown: false, animation: 'none' }} />
              <Stack.Screen name="adminview" component={AdminPanelScreen} options={{ headerShown: false, animation: 'none' }} />
              <Stack.Screen name="vacantpolicy" component={VacantLandPolicy} options={{ title: i18n.t('vacantpolicy') }} />
              <Stack.Screen name="buildingpolicy" component={BuildingLandPolicy} options={{ title: i18n.t('buildingpolicy'), animation: 'none' }} />
              <Stack.Screen name="unitpolicy" component={UnitPolicy} options={{ title: i18n.t('unitpolicy'), animation: 'none' }} />
              <Stack.Screen name="officepolicy" component={OfficePolicy} options={{ title: i18n.t('officepolicy'), animation: 'none' }} />
              <Stack.Screen name="shoppolicy" component={ShopPolicy} options={{ title: i18n.t('shoppolicy'), animation: 'none' }} />
              <Stack.Screen name="underconstpolicy" component={UnderConstPolicy} options={{ title: i18n.t('underconstpolicy'), animation: 'none' }} />
              <Stack.Screen name="villapolicy" component={VillaPolicy} options={{ title: i18n.t('villapolicy'), animation: 'none' }} />
              <Stack.Screen name="evavacantform" component={EvaluatVacantLand} options={{ title: 'Evalue Vacant Form', animation: 'none' }} />
              <Stack.Screen name="evabuildform" component={EvaluatBuilding} options={{ title: 'Evalue Building Form', animation: 'none' }} />
              <Stack.Screen name="evaofficeform" component={EvaluatOffice} options={{ title: 'Evalue Office Form', animation: 'none' }} />
              <Stack.Screen name="evashopform" component={EvaluatShop} options={{ title: 'Evalue Shop Form', animation: 'none' }} />
              <Stack.Screen name="evaunitform" component={EvaluatUnit} options={{ title: 'Evalue Unit Form', animation: 'none' }} />
              <Stack.Screen name="evaunderconstform" component={EvaluatUnderConst} options={{ title: 'Evalue UnderConst Form', animation: 'none' }} />
              <Stack.Screen name="evavillform" component={EvaluatVilla} options={{ title: 'Evalue Villa Form', animation: 'none' }} />
              <Stack.Screen name="vacantform" component={VacantLandForm} options={{ title: 'Vacant Form', animation: 'none' }} />
              <Stack.Screen name="buildform" component={BuildingForm} options={{ title: 'Building Form', animation: 'none' }} />
              <Stack.Screen name="unitform" component={UnitForm} options={{ title: 'Unit Form', animation: 'none' }} />
              <Stack.Screen name="officeform" component={OfficeForm} options={{ title: 'Office Form', animation: 'none' }} />
              <Stack.Screen name="shopform" component={ShopForm} options={{ title: 'Shop Form', animation: 'none' }} />
              <Stack.Screen name="underconstform" component={UnderConstForm} options={{ title: 'UnderConst Form', animation: 'none' }} />
              <Stack.Screen name="villform" component={VillaForm} options={{ title: 'Villa Form', animation: 'none' }} />
              <Stack.Screen name="areaname" component={AreaNameScreen} options={{ title: 'Area Name' }} />
              <Stack.Screen name="addareaname" component={AddAreaNameScreen} options={{ title: 'Add Area Name' }} />
              <Stack.Screen name="purposeevaluation" component={PurposeEvaluateScreen} options={{ title: 'Purpose Evaluation' }} />
              <Stack.Screen name="usageevaluation" component={UsageEvaluatScreen} options={{ title: 'Usage Evaluation' }} />
              <Stack.Screen name="typebuild" component={TypeBuildScreen} options={{ title: 'Type Build' }} />
              <Stack.Screen name="baseevaluation" component={BaseEvaluateScreen} options={{ title: 'Base Evaluation' }} />
              <Stack.Screen name="landstatus" component={LandStatusScreen} options={{ title: 'Land Status' }} />
              <Stack.Screen name="unitmainproject" component={MainProjectScreen} options={{ title: 'Unit Main Project' }} />
              <Stack.Screen name="unitsubproject" component={SubProjectScreen} options={{ title: 'Unit SubProject' }} />
              <Stack.Screen name="applicantinfo" component={AppInfoScreen} options={{ title: i18n.t('applicantinfo') }} />
              <Stack.Screen name="addapplicantinfo" component={AddAppInfoScreen} options={{ title: 'Add Applicant Info' }} />
              <Stack.Screen name="InvoiceManage" component={InvoiceManageScreen} options={{ title: 'Invoice Manage' }} />
              <Stack.Screen name="InvoiceReport" component={InvoiceReportScreen} options={{ title: 'Invoice Manage' }} />
              <Stack.Screen name="AddInvoiceReport" component={AddInvoiceReportScreen} options={{ title: 'Add Invoice Report' }} />
              <Stack.Screen name="PriceOffer" component={PriceOfferScreen} options={{ title: 'Invoice Manage' }} />
              <Stack.Screen name="AddPriceOffer" component={AddPriceOfferScreen} options={{ title: 'Add Price Offer' }} />
              <Stack.Screen name="MenuManage" component={MenuManageScreen} options={{ title: 'Menu Manage' }} />
              <Stack.Screen name="addmenu" component={AddMenuManageScreen} options={{ title: 'Add Menu' }} />
              <Stack.Screen name="UserManage" component={UserManageScreen} options={{ title: 'User Manage' }} />
              <Stack.Screen name="adduser" component={AddUserManageScreen} options={{ title: 'Add User' }} />
              <Stack.Screen name="systemforms" component={SystemFormsScreen} options={{ title: 'System Forms' }} />
              <Stack.Screen name="feespolicy" component={FeesPolicyScreen} options={{ title: 'Fees Policy' }} />
              <Stack.Screen name="addfeespolicy" component={AddFeesPolicyScreen} options={{ title: 'System Forms' }} />
              <Stack.Screen name="govtax" component={GovTaxScreen} options={{ title: 'Goverment Tax' }} />
              <Stack.Screen name="addgovtax" component={AddGovTaxScreen} options={{ title: 'Add Goverment Tax' }} />
              <Stack.Screen name="masterlist" component={GenericMasterListScreen} />
              <Stack.Screen name="masterform" component={GenericAddFormScreen} />
              <Stack.Screen name="showcertificate" component={ShowCertificateScreen} options={{ title: 'Show Certificate', animation: 'none' }} />
              <Stack.Screen name="showinvoice" component={ShowInvoiceScreen} options={{ title: 'Show Invoice', animation: 'none' }} />
              <Stack.Screen name="showtaxinvoice" component={ShowTaxInvoiceScreen} options={{ title: 'Show Tax Invoice', animation: 'none' }} />

            </Stack.Navigator>

          </ActionSheetProvider>
        </NavigationContainer>
        <Toast />
      </SafeAreaView>
    </View>

  );

  /*
  
         
       
      
    <Drawer.Screen
      name="Vacantland"
      component={VacantLandScreen}
      options={{
        title: 'Vacantland',
        drawerIcon: ({ color, size }) => (
          <Ionicons name="settings" size={size} color={color} />
        ),
        drawerItemStyle: { display: 'none' }, // Hide the item
      }}
     />
   */

  //   <NavigationContainer> </NavigationContainer>

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  menuOption: {
    padding: 10,
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center'
  },
  containerHeadline: {
    fontSize: 24,
    fontWeight: '600',
    padding: 20
  }
});


const navstyle = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: '#f2f2f2',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  itemContainer: {
    marginVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  gradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
