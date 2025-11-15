import {
  activepolicyprice_api,
  deactivepolicyprice_api,
  deletepolicyprice_api,
  policyprice_api,
} from '@/constant/DXBConstant';
import i18n from '@/Services/i18n';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
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

const FeesPolicyScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const isFocused = useIsFocused();
  const { showActionSheetWithOptions } = useActionSheet();

  // ✅ systemformid passed from previous screen
  const { systemformid } = route.params;

  const [policyList, setPolicyList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t('feespolicy'),
    });
  }, [navigation, i18n.language]);

  const fetchPolicies = async (reset = false) => {
    if (loading) return;
    try {
      if (reset) setRefreshing(true);
      else setLoading(true);

      const currentPage = reset ? 1 : page;

      const res = await axios.get(policyprice_api, {
        params: {
          systemformid, // ✅ pass from route params
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

      const newHasMore = (reset ? newData.length : policyList.length + newData.length) < total;
      setHasMore(newHasMore);
    } catch {
      Alert.alert(i18n.t('error'), i18n.t('failedtoloadfeepolicies'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setHasMore(true);
    fetchPolicies(true);
  };

  useEffect(() => {
    if (isFocused) onRefresh();
  }, [isFocused]);

  useEffect(() => {
    const debounce = setTimeout(onRefresh, 500);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleItemPress = (item: any) => {
    const isLocked = item.status !== 1;
    const isCore = item.core === true || item.core === 1;

    // مفاتيح ثابتة، والترجمة بتنعرض للمستخدم حسب اللغة
    const actions = {
      edit: i18n.t('edit'),
      delete: i18n.t('delete'),
      activate: i18n.t('active'),
      deactivate: i18n.t('deactivate'),
      cancel: i18n.t('cancel'),
    };

    const options = [actions.edit];

    if (!isCore) {
      options.push(actions.delete);
    }

    options.push(isLocked ? actions.activate : actions.deactivate);
    options.push(actions.cancel);

    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: `${i18n.t('actionsfor')} ${item.englishname}`,
      },
      (index) => {
        const selected = options[index];

        if (selected === actions.edit) {
          navigation.navigate('addfeespolicy', {
            mode: 'edit',
            pricePolicy: item,
           systemformid :  systemformid,
          });
        }
        else if (selected === actions.delete) {
          confirmDelete(item.id);
        }
        else if (selected === actions.activate) {
          toggleStatus(item.id, true);
        }
        else if (selected === actions.deactivate) {
          toggleStatus(item.id, false);
        }
        // "cancel" لا يحتاج إجراء
      }
    );
  };


  const confirmDelete = (id: number) => {
    Alert.alert(i18n.t('confirmdelete'), i18n.t('aresurewantdeletefee'), [
      { text: i18n.t("cancel"), style: 'cancel' },
      {
        text: i18n.t('ok'),
        onPress: async () => {
          try {
            await axios.get(deletepolicyprice_api, { params: { optionid: id } });
            onRefresh();
          } catch {
            Alert.alert(i18n.t("error"), i18n.t('failedtodelete'));
          }
        },
      },
    ]);
  };

  const toggleStatus = async (id: number, activate: boolean) => {
    const api = activate ? activepolicyprice_api : deactivepolicyprice_api;
    try {
      await axios.get(api, { params: { optionid: id } });
      onRefresh();
    } catch {
      Alert.alert(i18n.t('error'), `${i18n.t('failedto')} ${activate ? i18n.t('active') : i18n.t('deactivate')}.`);
    }
  };

  const handleEndReached = () => {
    if (!loading && hasMore && policyList.length > 0) fetchPolicies();
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
          <Text style={styles.label}>{i18n.t('servicefees_')}</Text>
          <Text style={styles.value}>{item.servicefees}</Text>
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
        placeholder={i18n.t("searchfeepolicies_")}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={policyList}
        keyExtractor={(item, i) => `${item.id}-${i}`}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && !refreshing ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null}
        ListEmptyComponent={
          !loading && !refreshing && (
            <View style={styles.centered}>
              <Text>No fee policies found.</Text>
            </View>
          )
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate('addfeespolicy', { mode: 'create', systemformid })
        }
      >
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    marginHorizontal: 16,
  },
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
  },
  fabIcon: { color: 'white', fontSize: 24, lineHeight: 28 },
  centered: { padding: 20, alignItems: 'center' },
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

export default FeesPolicyScreen;
