import { applincantinfo_api, deleteapplincantinfo_api } from '@/constant/DXBConstant';
import i18n from '@/Services/i18n';
import { useActionSheet } from '@expo/react-native-action-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, I18nManager, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';



const PAGE_SIZE = 10;

const AppInfoScreen = () => {
   const navigation = useNavigation();
   const isFocused = useIsFocused();
   const { showActionSheetWithOptions } = useActionSheet();
 
   const [isArabic, setIsArabic] = useState(false);
   const [switchLanguage, setSwitchLanguage] = useState('ar'); // opposite by default

   const [applicantList, setApplicantList] = useState([]);
   const [page, setPage] = useState(1);
   const [hasMore, setHasMore] = useState(true);
   const [loading, setLoading] = useState(false);
   const [refreshing, setRefreshing] = useState(false);
   const [searchQuery, setSearchQuery] = useState('');

   useLayoutEffect(() => {
      navigation.setOptions({
         title: i18n.t('applicantinfo'),
      });
   }, [navigation, i18n.language]);

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


   const fetchApplicants = async (reset = false) => {
      if (loading) return;

      try {
         if (reset) setRefreshing(true);
         else setLoading(true);

         const currentPage = reset ? 1 : page;

         const res = await axios.get(`${applincantinfo_api}`, {
            params: { page: currentPage, limit: PAGE_SIZE, search: searchQuery },
         });

         const newData = res.data.data || res.data;
         const total = res.data.total || 1000;

         if (reset) {
            setApplicantList(newData);
            setPage(2);
         } else {
            setApplicantList(prev => [...prev, ...newData]);
            setPage(currentPage + 1);
         }

         const newHasMore = (reset ? newData.length : applicantList.length + newData.length) < total;
         setHasMore(newHasMore);
      } catch (err) {
         Alert.alert(i18n.t('error'), i18n.t('failedtoloadapplicants'));
      } finally {
         setLoading(false);
         setRefreshing(false);
      }
   };

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
                     await axios.get(`${deleteapplincantinfo_api}`, {
                        params: { optionid: id },
                     });
                  } catch (err) {
                     console.error(i18n.t('errordeletingapplicant_'), err);
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
      fetchApplicants(true);
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
      if (!loading && hasMore && applicantList.length > 0) {
         fetchApplicants();
      }
   };

   const handleItemPress = (item: any) => {
      const options = [i18n.t('edit'), i18n.t('delete'), i18n.t('cancel')];
      const cancelButtonIndex = 2;

      showActionSheetWithOptions(
         {
            options,
            cancelButtonIndex,
            title: `${i18n.t('actionsfor')}  ${item.applicantname}`,
         },
         async (selectedIndex) => {
            switch (selectedIndex) {
               case 0:
                  navigation.navigate('addapplicantinfo', { mode: 'edit', applicant: item });
                  break;
               case 1:
                  await deleteApplicant(item.id);
                  break;
               default:
                  break;
            }
         }
      );
   };

   const renderItem = ({ item }: any) => (
      <TouchableOpacity onPress={() => handleItemPress(item)}>
         <View style={styles.card}>
            <View style={styles.row}>
               <Text style={styles.label}>{i18n.t('name_')}</Text>
               <Text style={styles.value}>{item.applicantname}</Text>
            </View>

            <View style={styles.row}>
               <Text style={styles.label}>{i18n.t('mobile_')}</Text>
               <Text style={styles.value}>{item.mobile}</Text>
            </View>

            <View style={styles.row}>
               <Text style={styles.label}>{i18n.t('email_')}</Text>
               <Text style={styles.value}>{item.email}</Text>
            </View>

            <View style={styles.row}>
               <Text style={styles.label}>{i18n.t('address_')}</Text>
               <Text style={styles.value}>{item.address}</Text>
            </View>
         </View>
      </TouchableOpacity>
   );

   return (
      <View style={{ flex: 1 }}>
         <TextInput
            style={styles.searchInput}
            placeholder={i18n.t('searchapplicant_')}
            value={searchQuery}
            onChangeText={setSearchQuery}
         />

         <FlatList
            data={applicantList}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            initialNumToRender={10}
            windowSize={5}
            ListFooterComponent={
               loading && !refreshing && applicantList.length > 0 ? (
                  <ActivityIndicator style={{ marginVertical: 20 }} />
               ) : null
            }
            ListEmptyComponent={
               !loading && !refreshing ? (
                  <View style={{ padding: 20, alignItems: 'center' }}>
                     <Text>No applicants found.</Text>
                  </View>
               ) : null
            }
         />

         <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate('addapplicantinfo')}
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


export default AppInfoScreen;
