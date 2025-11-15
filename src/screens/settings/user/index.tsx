import { activeusers_api, deactiveusers_api, deleteusers_api, rooturl, users_api } from '@/constant/DXBConstant';
import api from '@/Services/axiosInstance';
import i18n from '@/Services/i18n';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
   ActivityIndicator,
   Alert,
   FlatList,
   Image,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View
} from 'react-native';


const PAGE_SIZE = 10;

const UserScreen = () => {
   const navigation = useNavigation();
   const isFocused = useIsFocused();
   const { showActionSheetWithOptions } = useActionSheet();

   const [userList, setUserList] = useState([]);
   const [page, setPage] = useState(1);
   const [hasMore, setHasMore] = useState(true);
   const [loading, setLoading] = useState(false);
   const [refreshing, setRefreshing] = useState(false);
   const [searchQuery, setSearchQuery] = useState('');

   useLayoutEffect(() => {
      navigation.setOptions({
         title: i18n.t('usersmanage'),
      });
   }, [navigation, i18n.language]);


   const fetchUsers = async (reset = false) => {
      if (loading) return;

      try {
         if (reset) setRefreshing(true);
         else setLoading(true);

         const currentPage = reset ? 1 : page;

         const res = await api.get(`${users_api}`, {
            params: { page: currentPage, limit: PAGE_SIZE, search: searchQuery },
            timeout: 120000 // 60 seconds
         });

         const newData = res.data.data || res.data;
         const total = res.data.total || 1000;

         if (reset) {
            setUserList(newData);
            setPage(2);
         } else {
            setUserList(prev => [...prev, ...newData]);
            setPage(currentPage + 1);
         }

         const newHasMore = (reset ? newData.length : userList.length + newData.length) < total;
         setHasMore(newHasMore);
      } catch (err) {
         Alert.alert(i18n.t('error'), i18n.t('failedtoloadusers'));
      } finally {
         setLoading(false);
         setRefreshing(false);
      }
   };

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
                     await axios.get(`${deleteusers_api}`, { params: { userid: userid } });
                  } catch (err) {
                     console.error('Delete failed:', err);
                  }
                  onRefresh();
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
                  onRefresh();
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
                  onRefresh();
               },
            },
         ]
      );
   };

   const onRefresh = () => {
      setRefreshing(true);
      setHasMore(true);
      fetchUsers(true);
   };

   useEffect(() => {
      if (isFocused) {
         onRefresh();
      }
   }, [isFocused]);

   useEffect(() => {
      const delayDebounce = setTimeout(() => {
         onRefresh();
      }, 500);
      return () => clearTimeout(delayDebounce);
   }, [searchQuery]);

   const handleEndReached = () => {
      if (!loading && hasMore && userList.length > 0) {
         fetchUsers();
      }
   };

   const handleItemPress = (user: any) => {
      const isLocked = user.islocked;
      const options = [i18n.t('edit'), i18n.t('delete'), isLocked ? i18n.t('activate') : i18n.t('deactivate'), i18n.t('cancel')];
      const cancelButtonIndex = 3;

      showActionSheetWithOptions(
         {
            options,
            cancelButtonIndex,
            title: `${i18n.t('actionsfor')} ${user.firstname} ${user.lastname}`,
         },
         async (selectedIndex) => {
            switch (selectedIndex) {
               case 0:
                  navigation.navigate('adduser', { mode: 'edit', userId: user.userid });
                  break;
               case 1:
                  await deleteUser(user.userid);
                  break;
               case 2:
                  if (isLocked) await activateUser(user.userid);
                  else await deactivateUser(user.userid);
                  break;
               default:
                  break;
            }
         }
      );
   };

   const renderItem = ({ item }: any) => {
      const userPicture =
         item.userpicture && item.userpicture.trim() !== ''
            ? rooturl + item.userpicture
            : null;

      return (
         <TouchableOpacity onPress={() => handleItemPress(item)}>
            <View style={styles.itemContainer}>
               {/* صورة المستخدم */}
               {userPicture ? (
                  <Image
                     source={{ uri: userPicture }}
                     style={styles.userImage}
                  />
               ) : (
                  <Image
                     source={require('@/assets/images/user-placeholder.png')}
                     style={styles.userImage}
                  />
               )}
               <View style={styles.row}>
                  <Text style={styles.label}>{i18n.t('name_')}</Text>
                  <Text style={styles.title}>{item.firstname} {item.lastname}</Text>
               </View> 
               <View style={styles.row}>
                  <Text style={styles.label}>{i18n.t('username_')}</Text>
                  <Text style={styles.value}>{item.username}</Text>
               </View>

               <View style={styles.row}>
                  <Text style={styles.label}>{i18n.t('email_')}</Text>
                  <Text style={styles.value}>{item.email}</Text>
               </View>

               <View style={styles.row}>
                  <Text style={styles.label}>{i18n.t('role_')}</Text>
                  <Text style={styles.value}>{item.role}</Text>
               </View>

               <View style={styles.row}>
                  <Text style={styles.label}>{i18n.t('status_')}</Text>
                  <Text style={[styles.value, item.islocked ? styles.inactive : styles.active]}>
                     {item.islocked ? i18n.t('locked')  : i18n.t('active') }
                  </Text>
               </View>
            </View>
         </TouchableOpacity>
      );

   };

   return (
      <View style={{ flex: 1 }}>
         <TextInput
            style={styles.searchInput}
            placeholder={i18n.t('searchusers_')}
            value={searchQuery}
            onChangeText={setSearchQuery}
         />

         <FlatList
            data={userList}
            keyExtractor={(item, index) => `${item.userid}-${index}`}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loading && !refreshing ? <ActivityIndicator /> : null}
            ListEmptyComponent={!loading && !refreshing ? (
               <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text>{i18n.t('nousersfound')}</Text>
               </View>
            ) : null}
         />

         <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate('adduser')}
         >
            <Text style={styles.fabIcon}>＋</Text>
         </TouchableOpacity>
      </View>
   );
};

const styles = StyleSheet.create({
   listContainer: { padding: 16 },
   searchInput: {
      margin: 16,
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
   },
   fab: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      backgroundColor: '#2196F3',
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
   },
   fabIcon: {
      color: 'white',
      fontSize: 24,
      lineHeight: 28,
   },
   itemContainer: {
      backgroundColor: '#fff',
      padding: 16,
      borderRadius: 10,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
   },
   title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333',
   },
   row: {
      flexDirection: 'row',
      marginBottom: 6,
   },
   label: {
      fontWeight: '600',
      color: '#555',
      width: 90,
   },
   value: {
      flex: 1,
      color: '#666',
   },
   active: {
      color: 'green',
      fontWeight: '700',
   },
   inactive: {
      color: 'red',
      fontWeight: '700',
   },
   userImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginBottom: 10,
      alignSelf: 'center', // لجعلها وسط العنصر
      backgroundColor: '#eee',
   },
});

export default UserScreen;
