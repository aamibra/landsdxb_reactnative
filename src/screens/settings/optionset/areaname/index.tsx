import { activearea_api, areaname_api, deactivearea_api, deletearea_api } from '@/constant/DXBConstant';
import i18n from '@/Services/i18n';

import { useActionSheet } from '@expo/react-native-action-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
   ActivityIndicator,
   Alert,
   FlatList,
   I18nManager,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View
} from 'react-native';

const API_URL = areaname_api;

const PAGE_SIZE = 10;

const AreaNameScreen = () => {
   const navigation = useNavigation();
   const isFocused = useIsFocused();
   const { showActionSheetWithOptions } = useActionSheet();  
   const [isArabic, setIsArabic] = useState(false);
   const [switchLanguage, setSwitchLanguage] = useState('ar'); // opposite by default

   const [areaList, setAreaList] = useState([]);
   const [page, setPage] = useState(1);
   const [hasMore, setHasMore] = useState(true);
   const [loading, setLoading] = useState(false);
   const [refreshing, setRefreshing] = useState(false);
   const [searchQuery, setSearchQuery] = useState('');

   useEffect(() => {
      const fetchLanguage = async () => {
         try {
            const storedLanguage = await AsyncStorage.getItem('appLanguage');
            const lang = storedLanguage || 'en'; 
            setSwitchLanguage(storedLanguage === 'en' ? 'ar' : 'en');
            setIsArabic(lang === 'ar');
         } catch (error) {
            console.log('Error fetching language:', error);
         }
      };

      fetchLanguage();
   }, []);


   useLayoutEffect(() => {
      navigation.setOptions({
         title: i18n.t('areaname'),
      });
   }, [navigation, i18n.language]);

   const fetchAreas = async (reset = false) => {
      if (loading) return;

      // In fetchAreas
      try {
         if (reset) setRefreshing(true);
         else setLoading(true);

         const currentPage = reset ? 1 : page;

         const res = await axios.get(`${API_URL}`, {
            params: { page: currentPage, limit: PAGE_SIZE, search: searchQuery },
         });

         const newData = res.data.data || res.data;
         const total = res.data.total || 1000;

         if (reset) {
            setAreaList(newData);
            setPage(2);
         } else {
            setAreaList(prev => [...prev, ...newData]);
            setPage(currentPage + 1);
         }

         // Correctly set hasMore to prevent looping
         const newHasMore = (reset ? newData.length : areaList.length + newData.length) < total;
         setHasMore(newHasMore);
      } catch (err) {
         Alert.alert(i18n.t('error'), i18n.t('failedtoloadareas'));
      } finally {
         setLoading(false);
         setRefreshing(false); // reset both states after fetch
      }
   };


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
                     const response = await axios.get(`${deletearea_api}`, {
                        params: { optionid: optionId }
                     });
                     console.log('Delete success:', response.data);
                  } catch (error) {
                     console.error('Error deleting area name:', error);
                  }
                  onRefresh();
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
                     const response = await axios.get(`${deactivearea_api}`, {
                        params: { optionid: optionId }
                     });
                     console.log('Deactivate success:', response.data);
                  } catch (error) {
                     console.error('Error deactivating area:', error);
                  }

                  onRefresh();
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
                     const response = await axios.get(`${activearea_api}`, {
                        params: { optionid: optionId }
                     });
                     console.log('Activate success:', response.data);
                  } catch (error) {
                     console.error('Error activating area:', error);
                  }

                  onRefresh();
               },
            },
         ],
         { cancelable: false }
      );

   };


   const onRefresh = () => {
      setRefreshing(true);
      setHasMore(true);
      fetchAreas(true); // reset = true
   };

   useEffect(() => {
      if (isFocused) {
         onRefresh(); // load first page again
      }
   }, [isFocused]);

   // Trigger search with debounce
   useEffect(() => {
      const delayDebounce = setTimeout(() => {
         onRefresh();
      }, 500); // 500ms debounce

      return () => clearTimeout(delayDebounce);
   }, [searchQuery]);


   const handleEndReached = () => {
      if (!loading && hasMore && areaList.length > 0) {
         fetchAreas();
      }
   };

   const handleItemPress = (item: any) => {
      const isLocked = item.status !== 1;
      const options = [i18n.t('edit'), i18n.t('delete'), isLocked ? i18n.t('unlock') : i18n.t('lock'), i18n.t('cancel')];
      const cancelButtonIndex = 3;

      showActionSheetWithOptions(
         {
            options,
            cancelButtonIndex,
            title: `${i18n.t('youchose_')} ${item.englishname}`,
         },
         async (selectedIndex) => {
            switch (selectedIndex) {
               case 0:
                  navigation.navigate('addareaname', { mode: 'edit', area: item });
                  break;
               case 1:
                  await deleteAreaName(item.id);
                  //onRefresh();
                  break;
               case 2:
                  if (isLocked) {
                     await activateArea(item.id);
                  } else {
                     await deactivateArea(item.id);
                  }
                  // onRefresh();
                  break;
               default:
                  break;
            }
         }
      );
   };

   const renderItem = ({ item }: any) => (
      <TouchableOpacity onPress={() => handleItemPress(item)}>
         <View style={styles.itemContainer}>
            <Text style={styles.title}>{item.englishname}</Text>
            <Text>Code: {item.areacode}</Text>
            <Text>English: {item.englishname}</Text>
            <Text>Arabic: {item.arabicname}</Text>
            <Text>Status: {item.status === 1 ? i18n.t('active') : i18n.t('inactive')}</Text>
         </View>
      </TouchableOpacity>
   );

   return (
      <View style={{ flex: 1 }}>
         <TextInput
            style={styles.searchInput}
            placeholder="Search area..."
            value={searchQuery}
            onChangeText={setSearchQuery}
         />
         <FlatList
            data={areaList}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onEndReached={() => {
               if (areaList.length > 0) handleEndReached();
            }}
            onEndReachedThreshold={0.5}
            initialNumToRender={10}
            windowSize={5}
            ListFooterComponent={
               // Show spinner only if loading more items (pagination)
               loading && !refreshing && areaList.length > 0 ? (
                  <ActivityIndicator style={{ marginVertical: 20 }} />
               ) : null
            }
            ListEmptyComponent={
               // Show message if list is empty
               !loading && !refreshing ? (
                  <View style={{ padding: 20, alignItems: 'center' }}>
                     <Text>No areas found.</Text>
                  </View>
               ) : null
            }
         />
         <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate('addareaname')}
         >
            <Text style={styles.fabIcon}>＋</Text>
         </TouchableOpacity>
      </View>
   );
};

const styles = StyleSheet.create({
   listContainer: { padding: 16 },
   itemContainer: { backgroundColor: '#fff', padding: 14, borderRadius: 8, marginBottom: 12 },
   title: { fontSize: 16, fontWeight: 'bold' },
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
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
   },
   fabIcon: {
      color: 'white',
      fontSize: 24,
      lineHeight: 28,
   },
   card: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 12,
      marginVertical: 8,
      marginHorizontal: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 3,
   },
   row: {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      marginVertical: 4,
      flexWrap: 'wrap',
   },
   label: {
      fontWeight: 'bold',
      color: '#333',
      fontSize: 15,
      marginHorizontal: 6,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
   },
   value: {
      color: '#555',
      fontSize: 15,
      flexShrink: 1,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
   },
});

export default AreaNameScreen;
