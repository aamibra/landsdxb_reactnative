import { activesystemform_api, deactivesystemform_api, systemform_api } from '@/constant/DXBConstant';
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
  I18nManager,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const PAGE_SIZE = 10;

const SystemFormsScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { showActionSheetWithOptions } = useActionSheet();

  const [formList, setFormList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t('systemforms'),
    });
  }, [navigation, i18n.language]);

  const fetchForms = async (reset = false) => {
    if (loading) return;

    try {
      if (reset) setRefreshing(true);
      else setLoading(true);

      const currentPage = reset ? 1 : page;

      const res = await api.get(systemform_api, {
        params: { page: currentPage, limit: PAGE_SIZE, search: searchQuery },
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

      const newHasMore = (reset ? newData.length : formList.length + newData.length) < total;
      setHasMore(newHasMore);
    } catch (err) {
      Alert.alert('Error', 'Failed to load system forms.');
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

  useEffect(() => {
    if (isFocused) onRefresh();
  }, [isFocused]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      onRefresh();
    }, 500);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const deactivateSystemForm = async (optionId: number) => {
    Alert.alert(
       i18n.t('confirmlock') ,
      i18n.t('aresurewantlocksystemform'),
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
              const response = await axios.get(`${deactivesystemform_api}`, {
                params: { optionid: optionId }
              });
              console.log('Deactivate success:', response.data);
            } catch (error) {
              console.error('Error deactivating SystemForm:', error);
            }

            onRefresh();
          },
        },
      ],
      { cancelable: false }
    );

  };

  const activateSystemForm = async (optionId: number) => {

    Alert.alert(
      i18n.t('confirmactivate'),
      i18n.t('aresurewantactivatesystemform'),
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
              const response = await api.get(`${activesystemform_api}`, {
                params: { optionid: optionId }
              });
              console.log('Activate success:', response.data);
            } catch (error) {
              console.error('Error activating SystemForm:', error);
            }

            onRefresh();
          },
        },
      ],
      { cancelable: false }
    );

  };


  const handleItemPress = (item: any) => {
    const isLocked = item.status !== 1;
    const options = [i18n.t('showfeespolicy'), isLocked ? i18n.t('unlock') : i18n.t('lock'), i18n.t('cancel')];
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: `${i18n.t('actionsfor')}  ${item.englishname}`,
      },
      async (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            navigation.navigate('feespolicy', { systemformid: item.id });
            break;
          case 1:
            if (isLocked) {
              await activateSystemForm(item.id);
            } else {
              await deactivateSystemForm(item.id);
            }
            // onRefresh();
            break;
          default:
            break;
        }
      }
    );
  };



  const handleEndReached = () => {
    if (!loading && hasMore && formList.length > 0) {
      fetchForms();
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity onPress={() => handleItemPress(item)}>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('englishname_')}</Text>
          <Text style={styles.value}>{item.englishname}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('arabicname_')}</Text>
          <Text style={styles.value}>{item.arabicname}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('url_')}</Text>
          <Text style={styles.value}>{item.url}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('status_')}</Text>
          <Text style={styles.value}>{item.status === 1 ? i18n.t('active') : i18n.t('inactive')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={styles.searchInput}
        placeholder={i18n.t('searchsystemforms_')}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={formList}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && !refreshing ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null
        }
        ListEmptyComponent={
          !loading && !refreshing ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text>No system forms found.</Text>
            </View>
          ) : null
        }
      />

    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
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

export default SystemFormsScreen;

