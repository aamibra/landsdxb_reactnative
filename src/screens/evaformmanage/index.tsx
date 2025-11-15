import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { evaformland_api } from '@/constant/DXBConstant';
import api from '@/Services/axiosInstance';
import i18n from '@/Services/i18n';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';


const PAGE_SIZE = 20;

const EvaFormScreen = ({ navigation }: any) => {
  const isFocused = useIsFocused();
  const { showActionSheetWithOptions } = useActionSheet();

  const [formList, setFormList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchForms = async (reset = false) => {
    if (loading) return;

    try {
      if (reset) setRefreshing(true);
      else setLoading(true);

      const currentPage = reset ? 1 : page;

      const res = await api.get(`${evaformland_api}`, {
        params: {
          page: currentPage,
          limit: PAGE_SIZE,
          search: searchQuery,
        },
      });

      const newData = res.data.data || res.data;
      const total = res.data.total || 1000;

      if (reset) {
        setFormList(newData);
        setPage(2);
      } else {
        setFormList(prev => [...prev, ...newData]);
        setPage(currentPage + 1);
      }

      const newHasMore =
        (reset ? newData.length : formList.length + newData.length) < total;
      setHasMore(newHasMore);
    } catch (error) {
      setErrorMessage(i18n.t('failedtofetchforms'));
      Toast.show({ type: 'error', text1: i18n.t('error'), text2: i18n.t('failedtofetchforms'), position: 'bottom' });
      // Alert.alert('Error', 'Failed to fetch forms');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };



  const onRefresh = () => {
    setRefreshing(true);
    setHasMore(true);
    fetchForms(true);
  };

  const handleEndReached = () => {
    if (!loading && hasMore && formList.length > 0) {
      fetchForms();
    }
  };

  const handleItemPress = (item: any) => {
    const options = ['Edit', 'Cancel'];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: `${i18n.t('actionsfor')}  ${item.formnumber}`,
      },
      async (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            handleEditFormNavigation(item.formtypeid, item.formid);
            break;
          default:
            break;
        }
      }
    );
  };


  const handleEditFormNavigation = (formtypeid: any, formid: any) => {
    switch (formtypeid) {
      case 1:
        navigation.navigate('evavacantform', { formid: formid });
        break;
      case 2:
        navigation.navigate('evabuildform', { formid: formid });
        break;
      case 3:
        navigation.navigate('evaunitform', { formid: formid });
        break;
      case 4:
        navigation.navigate('evaofficeform', { formid: formid });
        break;
      case 5:
        navigation.navigate('evashopform', { formid: formid });
        break;
      case 6:
        navigation.navigate('evaunderconstform', { formid: formid });
        break;
      case 7:
        navigation.navigate('evavillform', { formid: formid });
        break;
      default:
        Alert.alert(i18n.t('alert'), i18n.t('noavailableform'));
        break;
    }
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

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemPress(item)} activeOpacity={0.8}>
      <View style={styles.itemCard}>
        {/* رقم النموذج */}
        <Text style={styles.itemTitle}>#{item.formnumber}</Text>

        {/* السطور */}
        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('formtype_')}</Text>
          <Text style={styles.value}>{item.enformtype}</Text>
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
      {/* ======= شريط البحث ======= */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={i18n.t('searchforms')}
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

      {/* ======= القائمة ======= */}
      <FlatList
        data={formList}
        keyExtractor={(item, index) => `${item.formid}-${index}`}
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
                <Text style={styles.emptyText}>{i18n.t('noformsfound')}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 15,
  },
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
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginVertical: 6,
    borderRadius: 10,
    padding: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
  },
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
    borderLeftColor: '#007AFF', // لون مميز للبطاقة
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


export default EvaFormScreen;