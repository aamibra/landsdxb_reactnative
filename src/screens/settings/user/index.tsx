import BaseListScreen from '@/components/BaseListScreen';
import RTLText from '@/components/RTLText';
import { activeusers_api, deactiveusers_api, deleteusers_api, rooturl, users_api } from '@/constant/DXBConstant';
import FlatListStyles from '@/constant/LandsDxbStyle';
import api from '@/Services/axiosInstance';
import i18n from '@/Services/i18n';
import React, { useLayoutEffect, useRef } from 'react';
import {
   Alert,
   Image,
   View
} from 'react-native';



const UserScreen = ({ navigation, route }: any) => {
   const listRef = useRef(null);

   useLayoutEffect(() => {
      navigation.setOptions({
         title: i18n.t('usersmanage'),
      });
   }, [navigation, i18n.language]);


   const deleteUser = async (userid: string) => {
      Alert.alert(
         i18n.t('confirmdelete'),
         i18n.t('areyousurewantdeleteuser'),
         [
            { text: i18n.t('cancel'), style: 'cancel' },
            {
               text: i18n.t('ok'),
               onPress: async () => {
                  try {
                     await api.get(`${deleteusers_api}`, { params: { userid: userid } });
                  } catch (err) {
                     console.error('Delete failed:', err);
                  }
                    listRef.current?.refresh();
               },
            },
         ]
      );
   };

   const deactivateUser = async (userid: string) => {
      Alert.alert(
         i18n.t('confirmdeactivation'),
         i18n.t('areyousurewantdeactivationuser'),
         [
            { text: i18n.t('cancel'), style: 'cancel' },
            {
               text: i18n.t('ok'),
               onPress: async () => {
                  try {
                     await api.get(`${deactiveusers_api}`, { params: { userid: userid } });
                  } catch (err) {
                     console.error('Deactivation failed:', err);
                  }
                     listRef.current?.refresh();
               },
            },
         ]
      );
   };

   const activateUser = async (userid: string) => {
      Alert.alert(
         i18n.t('confirmactivation'),
         i18n.t('areyousurewantactivateuser'),
         [
            { text: i18n.t('cancel'), style: 'cancel' },
            {
               text: i18n.t('ok'),
               onPress: async () => {
                  try {
                     await api.get(`${activeusers_api}`, { params: { userid: userid } });
                  } catch (err) {
                     console.error('Activation failed:', err);
                  }
                   listRef.current?.refresh();
               },
            },
         ]
      );
   };


   return (
      <BaseListScreen
         ref={listRef}

         fetchData={async (page, search) => {
            const res = await api.get(users_api, {
               params: { page, limit: 20, search },
            });

            return {
               data: res.data.data,
               total: res.data.total
            };
         }}

         renderItemCard={(item) => {
            const userPicture = item.userpicture && item.userpicture.trim() !== '' ? rooturl + item.userpicture : null;

            return (
               <View style={FlatListStyles.itemCard}>
                  {userPicture ? (
                     <Image
                        source={{ uri: userPicture }}
                        style={FlatListStyles.userImage}
                     />
                  ) : (
                     <Image
                        source={require('@/assets/images/user-placeholder.png')}
                        style={FlatListStyles.userImage}
                     />
                  )}
                  <View style={FlatListStyles.row}>
                     <RTLText style={FlatListStyles.label}>{i18n.t('name_')}</RTLText>
                     <RTLText style={FlatListStyles.value}>{item.firstname} {item.lastname}</RTLText>
                  </View>
                  <View style={FlatListStyles.row}>
                     <RTLText style={FlatListStyles.label}>{i18n.t('username_')}</RTLText>
                     <RTLText style={FlatListStyles.value}>{item.username}</RTLText>
                  </View>

                  <View style={FlatListStyles.row}>
                     <RTLText style={FlatListStyles.label}>{i18n.t('email_')}</RTLText>
                     <RTLText style={FlatListStyles.value}>{item.email}</RTLText>
                  </View>

                  <View style={FlatListStyles.row}>
                     <RTLText style={FlatListStyles.label}>{i18n.t('role_')}</RTLText>
                     <RTLText style={FlatListStyles.value}>{item.role}</RTLText>
                  </View>

                  <View style={FlatListStyles.row}>
                     <RTLText style={FlatListStyles.label}>{i18n.t('status_')}</RTLText>
                     <RTLText style={[FlatListStyles.value, item.islocked ? FlatListStyles.inactive : FlatListStyles.active]}>
                        {item.islocked ? i18n.t('locked') : i18n.t('enabled')}
                     </RTLText>
                  </View>
               </View>
            );
         }}

         /* ActionSheet عند الضغط على عنصر */
         actionSheetOptions={(item) => {
            const isLocked = item.islocked;

            return ({
               title: `${i18n.t('actionsfor')} ${item.firstname} ${item.lastname}`,
               options: [
                  i18n.t('edit'),
                  i18n.t('delete'),
                  isLocked ? i18n.t('activate') : i18n.t('deactivate'),
                  i18n.t('cancel')
               ],
               cancelIndex: 3,
               onSelect: async (i) => {
                  if (i === 0) navigation.navigate('adduser', { mode: 'edit', userId: item.userid });
                  if (i === 1) await deleteUser(item.id);
                  if (i === 2) {
                     if (isLocked) {
                        await activateUser(item.userid);
                     } else {
                        await deactivateUser(item.userid);
                     }
                  }
               }
            });
         }}

         /* ActionSheet زر الإضافة */
         onAddPress={() => { navigation.navigate('adduser') }}
      />
   );
};



export default UserScreen;
