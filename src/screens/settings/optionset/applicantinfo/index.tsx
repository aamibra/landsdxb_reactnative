import BaseListScreen from '@/components/BaseListScreen';
import RTLText from '@/components/RTLText';
import { applincantinfo_api, deleteapplincantinfo_api } from '@/constant/DXBConstant';
import FlatListStyles from '@/constant/LandsDxbStyle';
import api from '@/Services/axiosInstance';
import formatPhone from '@/Services/HelperService';
import i18n from '@/Services/i18n';
import React, { useLayoutEffect, useRef } from 'react';
import { Alert, I18nManager, View } from 'react-native';
import Toast from 'react-native-toast-message';

 const isRTL = I18nManager.isRTL;

const AppInfoScreen = ({ navigation, route }: any) => {
      const listRef = useRef(null);

   useLayoutEffect(() => {
      navigation.setOptions({
         title: i18n.t('applicantinfo'),
      });
   }, [navigation, i18n.language]);

  
   const deleteApplicant = async (id: number) => {
      Alert.alert(
         i18n.t('confirmdelete'),
         i18n.t('aresurewantdeleteapplicant'),
         [
            { text: i18n.t('cancel'), style: 'cancel' },
            {
               text: i18n.t('ok'),
               onPress: async () => {
                  try {
                     await api.get(`${deleteapplincantinfo_api}`, {
                        params: { optionid: id },
                     });
                     
                  } catch (err) {
                     Toast.show({ type: 'error', text1: i18n.t('error'), text2: i18n.t('unexpectederrortryagain'), position: 'bottom' });
                     console.error(i18n.t('errordeletingapplicant_'), err);
                  }

                  listRef.current?.refresh();
               },
            },
         ],
         { cancelable: false }
      );
   };
  
   return (
    <BaseListScreen
         ref={listRef}
         fetchData={async (page, search) => {
            const res = await api.get(applincantinfo_api, {
               params: { page, limit: 20, search },
            });

            return {
               data: res.data.data,
               total: res.data.total
            };
         }}

         renderItemCard={(item) => (
            <View style={FlatListStyles.itemCard}>
               <View style={FlatListStyles.row}>
                  <RTLText style={FlatListStyles.label}>{i18n.t("name_")}</RTLText>
                  <RTLText style={FlatListStyles.value}>{item.applicantname}</RTLText>
               </View>

               <View style={FlatListStyles.row}>
                  <RTLText style={FlatListStyles.label}>{i18n.t("mobile_")}</RTLText>
                  <RTLText style={FlatListStyles.value}>{formatPhone( item.mobile)}</RTLText>
               </View>

               <View style={FlatListStyles.row}>
                  <RTLText style={FlatListStyles.label}>{i18n.t("email_")}</RTLText>
                  <RTLText style={FlatListStyles.value}>{item.email}</RTLText>
               </View>

               <View style={FlatListStyles.row}>
                  <RTLText style={FlatListStyles.label}>{i18n.t("address_")}</RTLText>
                  <RTLText style={FlatListStyles.value}>{item.address}</RTLText>
               </View>
            </View>
         )}

         /* ActionSheet عند الضغط على عنصر */
         actionSheetOptions={(item) => ({
            title: `${i18n.t('actionsfor')} ${item.applicantname}`,
            options: [
               i18n.t('edit'),
               i18n.t('delete'),
               i18n.t('cancel')
            ],
            cancelIndex: 2,
            onSelect: async (i) => {
               if (i === 0) navigation.navigate('addapplicantinfo', { mode: 'edit', applicant: item });
               if (i === 1) await deleteApplicant(item.id);
              
            }
         })}

         /* ActionSheet زر الإضافة */
         onAddPress={() => { navigation.navigate('addapplicantinfo' ) }}
      />
   );
};




export default AppInfoScreen;
