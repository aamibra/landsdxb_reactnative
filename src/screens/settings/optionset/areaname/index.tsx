import BaseListScreen from '@/components/BaseListScreen';
import RTLText from '@/components/RTLText';
import { activearea_api, areaname_api, deactivearea_api, deletearea_api } from '@/constant/DXBConstant';
import FlatListStyles from '@/constant/LandsDxbStyle';
import api from '@/Services/axiosInstance';
import i18n from '@/Services/i18n';
 
import React, { useLayoutEffect, useRef } from 'react';
import {
   Alert,
   I18nManager,
   View
} from 'react-native';

const isRTL = I18nManager.isRTL;

const AreaNameScreen = ({ navigation, route }: any) => {
   const listRef = useRef(null);


   useLayoutEffect(() => {
      navigation.setOptions({
         title: i18n.t('areaname'),
      });
   }, [navigation, i18n.language]);


   const deleteAreaName = async (optionId: number) => {
      Alert.alert(
         i18n.t('confirmdelete'),
         i18n.t('aresurewantdeleteareaname'),
         [
            {
               text: i18n.t('cancel'),
               onPress: () => console.log('Cancel Pressed'),
               style: 'cancel',
            },
            {
               text: i18n.t('ok'),
               onPress: async () => {
                  // Put your action here
                  try {
                     const response = await api.get(`${deletearea_api}`, {
                        params: { optionid: optionId }
                     });
                     console.log('Delete success:', response.data);
                  } catch (error) {
                     console.error('Error deleting area name:', error);
                  }
                  listRef.current?.refresh();
               },
            },
         ],
         { cancelable: false }
      );
   };

   const deactivateArea = async (optionId: number) => {
      Alert.alert(
         i18n.t('confirmlock'),
         i18n.t('aresurewantlockareaname'),
         [
            {
               text: i18n.t('cancel'),
               onPress: () => console.log('Cancel Pressed'),
               style: 'cancel',
            },
            {
               text: i18n.t('ok'),
               onPress: async () => {
                  // Put your action here
                  try {
                     const response = await api.get(`${deactivearea_api}`, {
                        params: { optionid: optionId }
                     });
                     console.log('Deactivate success:', response.data);
                  } catch (error) {
                     console.error('Error deactivating area:', error);
                  }

                  listRef.current?.refresh();
               },
            },
         ],
         { cancelable: false }
      );

   };

   const activateArea = async (optionId: number) => {

      Alert.alert(
         i18n.t('confirmactivate'),
         i18n.t('aresurewantactivateareaname'),
         [
            {
               text: i18n.t('cancel'),
               onPress: () => console.log('Cancel Pressed'),
               style: 'cancel',
            },
            {
               text: i18n.t('ok'),
               onPress: async () => {
                  // Put your action here
                  try {
                     const response = await api.get(`${activearea_api}`, {
                        params: { optionid: optionId }
                     });
                     console.log('Activate success:', response.data);
                  } catch (error) {
                     console.error('Error activating area:', error);
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
            const res = await api.get(areaname_api, {
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
                  <RTLText style={FlatListStyles.label}>{i18n.t("areacode")}</RTLText>
                  <RTLText style={FlatListStyles.value}>{item.areacode}</RTLText>
               </View>

               <View style={FlatListStyles.row}>
                  <RTLText style={FlatListStyles.label}>{i18n.t("englishname")}</RTLText>
                  <RTLText style={FlatListStyles.value}>{item.englishname}</RTLText>
               </View>

               <View style={FlatListStyles.row}>
                  <RTLText style={FlatListStyles.label}>{i18n.t("arabicname")}</RTLText>
                  <RTLText style={FlatListStyles.value}>{item.arabicname}</RTLText>
               </View>

               <View style={FlatListStyles.row}>
                  <RTLText style={FlatListStyles.label}>{i18n.t("status")}</RTLText>
                  <RTLText style={[FlatListStyles.value, item.islocked ? FlatListStyles.inactive : FlatListStyles.active]} >{item.status === 1 ? i18n.t('enabled') : i18n.t('inactive')}</RTLText>
               </View>
            </View>
         )}

         /* ActionSheet عند الضغط على عنصر */
         actionSheetOptions={(item) => ({
           title: `${i18n.t('actionsfor')} ${item.areacode}`,
            options: [
               i18n.t('edit'),
               i18n.t('delete'),
               item.status !== 1 ? i18n.t('unlock') : i18n.t('lock'),
               i18n.t('cancel')
            ],
            cancelIndex: 3,
            onSelect: (i) => {
               if (i === 0) navigation.navigate('addareaname', { mode: 'edit', area: item });
               if (i === 1) deleteAreaName(item.id);;
               if (i === 2) item.status !== 1 ? activateArea(item.id) : deactivateArea(item.id);
            }
         })}

         /* ActionSheet زر الإضافة */
         onAddPress={() => { navigation.navigate('addareaname') }}
      />

   );
};



export default AreaNameScreen;
