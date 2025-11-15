import { useActionSheet } from '@expo/react-native-action-sheet';
import { useIsFocused, useNavigation } from '@react-navigation/native';
//import axios from 'axios';
import api from '@/Services/axiosInstance';
import i18n from '@/Services/i18n';
import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';
import mime from 'react-native-mime-types';

import PolicySelector from '@/components/PolicySelector';
import { deletepolicyland_api, download_picture_api, policyland_api } from '@/constant/DXBConstant';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Platform, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';



const PAGE_SIZE = 20;

const PolicyScreen = ( ) => {
   const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { showActionSheetWithOptions } = useActionSheet();
  const [policyList, setPolicyList] = useState([]);
  //const [policies, setPolicies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const policyRef = useRef<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const policies = [
    { id: '1', title: i18n.t('vacantpolicy') },
    { id: '2', title: i18n.t('buildingpolicy') },
    { id: '3', title: i18n.t('unitpolicy') },
    { id: '4', title: i18n.t('officepolicy') },
    { id: '5', title: i18n.t('shoppolicy') },
    { id: '6', title: i18n.t('underconstpolicy') },
    { id: '7', title: i18n.t('villapolicy') }
  ];


  /*
  useEffect(() => {
    const fetchPolicy = async () => {
      setLoading(true);
      try {
        const res = await api.get(getpolicy_api); // 👈 استخدام axios بدلاً من fetch

        const data = res.data;

        if (data.succeeded) {
          setPolicies(data.result); // ← تحتوي على [ { id, englishname, arabicname }, ... ]
        } else {
          console.error("خطأ:", data.errors);
        }
      } catch (err) {
        console.error("فشل جلب النماذج:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, []);
*/


  const openMenu = () => {
    navigation.navigate('UserMenu');
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t('policiesmanage'),
     // headerLeft: () => (
     //   <TouchableOpacity onPress={() => openMenu()} style={{ marginLeft: 15 }}>
    //      <Text style={{ fontSize: 22 }}>☰</Text>
    //    </TouchableOpacity>
    //  ),
    });
  }, [navigation]);

  const fetchPolicies = async (reset = false) => {
    if (loading) return;

    try {
      if (reset) setRefreshing(true);
      else setLoading(true);

      const currentPage = reset ? 1 : page;

      const res = await api.get(`${policyland_api}`, {
        params: {
          page: currentPage,
          limit: PAGE_SIZE,
          search: searchQuery,
        },
      });

      const newData = res.data.data || res.data;
      const total = res.data.total || 1000;

      if (reset) {
        setPolicyList(newData);
        setPage(2);
      } else {
        setPolicyList(prev => [...prev, ...newData]);
        setPage(currentPage + 1);
      }

      const newHasMore =
        (reset ? newData.length : policyList.length + newData.length) < total;
      setHasMore(newHasMore);
    } catch (error) {
      // Alert.alert( i18n.t('error') , i18n.t('failedtofetchpolicies') );
      setErrorMessage(i18n.t('failedtofetchpolicies'));
      Toast.show({
        type: 'error', text1: i18n.t('error'), text2: i18n.t('failedtofetchpolicies'),
        position: 'bottom'
      });

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const deletePolicy = async (id: number) => {
    Alert.alert(
      i18n.t('confirmdelete'),
      i18n.t('aresurewantdeletepolicy'),
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        {
          text: i18n.t('ok'),
          onPress: async () => {
            try {
              await api.get(`${deletepolicyland_api}`, { params: { policyid: id } });
              onRefresh();
            } catch (err) {
              console.error(err);

              Toast.show({ type: 'error', text1: i18n.t('error'), text2: i18n.t('failedtodeletepolicy'),  position: 'bottom'  });
              // Alert.alert(i18n.t('error'), i18n.t('failedtodeletepolicy'));
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    setHasMore(true);
    fetchPolicies(true);
  };

  const handleEndReached = () => {
    if (!loading && hasMore && policyList.length > 0) {
      fetchPolicies();
    }
  };

  const handleItemPress = (item: any) => {
    const options = [i18n.t('edit'), i18n.t('printcertificate'), i18n.t('printinvoice'), i18n.t('taxinvoice'), i18n.t('downloadpicture'), i18n.t('delete'), i18n.t('cancel')];
    const cancelButtonIndex = 6;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: `${i18n.t('actionsfor')} ${item.policynumber}`,
      },
      async (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            handleEditPolicyNavigation(item.formtypeid, item.policyid);
            break;
          case 1:
            //navigation.navigate('showcertificate', {  policyid: item.policyid , policytype: item.formtypeid });  
            // navigation.navigate('showinvoice', {  policyid: item.policyid , policytype: item.formtypeid });  
            navigation.navigate('showcertificate', { policyid: item.policyid, policytype: item.formtypeid });
            break;
          case 2:
            navigation.navigate('showinvoice', { policyid: item.policyid, policytype: item.formtypeid });
            break;
          case 3:
            navigation.navigate('showtaxinvoice', { policyid: item.policyid, policytype: item.formtypeid });
            break;
          case 4:
            ShareFile(item.policyid, item.formtypeid);
            break;
          case 5:
            await deletePolicy(item.policyid);
            break;
          default:
            break;
        }
      }
    );
  };


  useEffect(() => {
    if (isFocused) {
      onRefresh();
    }
  }, [isFocused]);

  useEffect(() => {
    const delay = setTimeout(() => {
      onRefresh();
    }, 500);
    return () => clearTimeout(delay);
  }, [searchQuery]);


  const handlePolicyOption = () => {
    if (!policies.length) {
      Alert.alert(i18n.t('alert'), i18n.t('noavailablepolicies'));
      return;
    }

    const isRTL = i18n.t('lang') === 'ar';// i18n.locale === 'ar'; 
    const options = policies.map(p => (isRTL ? '\u200F' + p.title : p.title));
    options.push(isRTL ? '\u200F' + i18n.t('cancel') : i18n.t('cancel'));
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: isRTL ? '\u200F' + i18n.t('selectyourpolicy') : i18n.t('selectyourpolicy'),
      },
      (selectedIndex) => {
        if (selectedIndex === cancelButtonIndex) return;

        const selectedForm = policies[selectedIndex];
        handlePolicyNavigation(selectedForm.id, navigation);
      }
    );
  };


  /*
  const handlePolicyOption = () => {
    if (!policies.length) {
      Alert.alert("تنبيه", "لا يوجد نماذج متاحة حالياً.");
      return;
    }

    const options = policies.map(p => p.englishname);
    options.push('cancel');
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title:  i18n.t('selectyourpolicy') ,
      },
      (selectedIndex) => {
        if (selectedIndex === cancelButtonIndex) return;

        const selectedForm = policies[selectedIndex];
        handlePolicyNavigation(selectedForm.id, selectedForm);
      }
    );
  };*/


  const downloadFile = async (policyid: number, policytype: number) => {
    try {
      const downloadUrl = `${download_picture_api}?policyid=${policyid}&policytype=${policytype}`;
      const fileName = `policy_document_${policyid}_${policytype}.zip`;
      const fileUri = FileSystem.documentDirectory + fileName;

      const downloadResumable = FileSystem.createDownloadResumable(
        downloadUrl,
        fileUri,
        {
          headers: {
            // Authorization: `Bearer ${token}`, // إذا احتجت مصادقة
          },
        }
      );

      const { uri, status } = await downloadResumable.downloadAsync();

      if (status === 200) {

        if (Platform.OS === 'android') {
          const mimeType = mime.lookup(uri) || '*/*';

          IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
            data: uri,
            flags: 1,
            type: mimeType,
          });
        } else {
          Alert.alert('غير مدعوم على iOS', 'فتح الملفات تلقائيًا غير متاح في iOS من مساحة التطبيق.');
        }

        // Alert.alert('تم التحميل بنجاح', `تم حفظ الملف في: ${uri}`);
      } else {
        Alert.alert('فشل التحميل', `رمز الحالة: ${status}`);
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء تحميل الملف.');
    }
  };

  const ShareFile = async (policyid: number, policytype: number) => {
    try {
      const downloadUrl = `${download_picture_api}?policyid=${policyid}&policytype=${policytype}`;
      const fileUri = FileSystem.documentDirectory + `policy_document_${policyid}_${policytype}.zip`;

      const downloadResumable = FileSystem.createDownloadResumable(
        downloadUrl,
        fileUri,
        {
          headers: {
            // Authorization: `Bearer ${token}`,
          },
        }
      );

      const { uri, status } = await downloadResumable.downloadAsync();

      if (status === 200) {
        // Alert.alert('Download successful', 'File saved at: ' + uri);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        } else {
          Alert.alert('Sharing not available');
        }
      } else {
        Alert.alert('Download failed', `Status code: ${status}`);
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Something went wrong while downloading.');
    }
  };


  const handlePolicyNavigation = (formId: any, formItem: any) => {
    switch (formId) {
      case 1:
        navigation.navigate('vacantpolicy', { mode: 'new' });
        break;
      case 2:
        navigation.navigate('buildingpolicy', { mode: 'new' });
        break;
      case 3:
        navigation.navigate('unitpolicy', { mode: 'new' });
        break;
      case 4:
        navigation.navigate('officepolicy', { mode: 'new' });
        break;
      case 5:
        navigation.navigate('shoppolicy', { mode: 'new' });
        break;
      case 6:
        navigation.navigate('underconstpolicy', { mode: 'new' });
        break;
      case 7:
        navigation.navigate('villapolicy', { mode: 'new' });
        break;
      default:
        Alert.alert(i18n.t('alert'), i18n.t('unsupportedpolicy'));
        break;
    }
  };

  const handleEditPolicyNavigation = (formtypeid: any, policyid: any) => {
    switch (formtypeid) {
      case 1:
        navigation.navigate('vacantpolicy', { mode: 'edit', policyid: policyid });
        break;
      case 2:
        navigation.navigate('buildingpolicy', { mode: 'edit', policyid: policyid });
        break;
      case 3:
        navigation.navigate('unitpolicy', { mode: 'edit', policyid: policyid });
        break;
      case 4:
        navigation.navigate('officepolicy', { mode: 'edit', policyid: policyid });
        break;
      case 5:
        navigation.navigate('shoppolicy', { mode: 'edit', policyid: policyid });
        break;
      case 6:
        navigation.navigate('underconstpolicy', { mode: 'edit', policyid: policyid });
        break;
      case 7:
        navigation.navigate('villapolicy', { mode: 'edit', policyid: policyid });
        break;
      default:
        Alert.alert(i18n.t('alert'), i18n.t('modelisnotsupported'));
        break;
    }
  };


  const renderItem = ({ item }: any) => (
    <TouchableOpacity onPress={() => handleItemPress(item)} activeOpacity={0.8}>
      <View style={styles.itemCard}>
        {/* رقم البوليصة */}
        <Text style={styles.itemTitle}>#{item.policynumber}</Text>

        {/* التفاصيل */}
        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('formtype_')}</Text>
          <Text style={styles.value}>{item.formtypename}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('name_')}</Text>
          <Text style={styles.value}>{item.applicantname}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('mobile_')}</Text>
          <Text style={styles.value}>{item.applicantmobile}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('email_')}</Text>
          <Text style={styles.value}>{item.applicantemail}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('createdon_')}</Text>
          <Text style={styles.value}>{item.createdon}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* ====== شريط البحث ====== */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={i18n.t('searchpolicies')}
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#aaa" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* ====== قائمة البوالص ====== */}
      <FlatList
        data={policyList}
        keyExtractor={(item, index) => `${item.policyid}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && !refreshing ? (
            <ActivityIndicator style={{ marginVertical: 20 }} size="small" color="#007AFF" />
          ) : null
        }
        ListEmptyComponent={
          !loading && !refreshing ? (
            errorMessage ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
                  <Text style={styles.retryButtonText}>{i18n.t('retry')}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="document-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>{i18n.t('nopoliciesfound')}</Text>
              </View>
            )
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}     // Android
            tintColor={'#007AFF'}    // iOS
            progressBackgroundColor="#fff"
          />
        } 
      />

      {/* ====== زر إضافة ====== */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => policyRef.current?.openActionSheet()}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* ====== نافذة اختيار ====== */}
      <PolicySelector ref={policyRef} navigation={navigation} />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 15,
  },
  /*** شريط البحث ***/
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginVertical: 10,
    borderRadius: 12,
    paddingHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 15,
    color: '#333',
  },

  /*** قائمة البطاقات ***/
  listContainer: {
    paddingBottom: 80,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    color: '#111',
    flexShrink: 1,
    textAlign: 'right',
  },

  /*** حالة فارغة ***/
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 15,
    color: '#999',
  },

  /*** زر عائم (Floating Action Button) ***/
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#007AFF',
    width: 55,
    height: 55,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },

  errorContainer: {
    backgroundColor: '#fdecea',
    borderRadius: 6,
    padding: 12,
    marginHorizontal: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#f5c2c0',
    alignItems: 'center',
  },
  errorText: {
    color: '#b71c1c',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 6,
  },
  retryButton: {
    backgroundColor: '#b71c1c',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});



export default PolicyScreen;

