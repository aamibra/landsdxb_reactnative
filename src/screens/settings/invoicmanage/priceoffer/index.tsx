import { deleteofferprice_api, offerprice_api } from '@/constant/DXBConstant';
import i18n from '@/Services/i18n';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

 
const PAGE_SIZE = 10;

const PriceOfferScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { showActionSheetWithOptions } = useActionSheet();

  const [offerList, setOfferList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

    useLayoutEffect(() => {
      navigation.setOptions({
        title: i18n.t('priceoffer'),
      });
    }, [navigation, i18n.language]);
    
  const fetchOffers = async (reset = false) => {
    if (loading) return;

    try {
      if (reset) setRefreshing(true);
      else setLoading(true);

      const currentPage = reset ? 1 : page;

      const res = await axios.get(`${offerprice_api}`, {
        params: { page: currentPage, limit: PAGE_SIZE, search: searchQuery },
      });

      const newData = res.data.data || res.data;
      const total = res.data.total || 1000;

      if (reset) {
        setOfferList(newData);
        setPage(2);
      } else {
        setOfferList((prev) => [...prev, ...newData]);
        setPage(currentPage + 1);
      }

      const newHasMore =
        (reset ? newData.length : offerList.length + newData.length) < total;
      setHasMore(newHasMore);
    } catch (err) {
      Alert.alert(i18n.t('error'), i18n.t('failedtoloadoffers') );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const deleteOffer = async (id: number) => {
    Alert.alert(
       i18n.t('confirmdelete') ,
      i18n.t('areyousuredeleteoffer'),
      [
        { text: i18n.t('cancel') , style: 'cancel' },
        {
          text: i18n.t('ok') ,
          onPress: async () => {
            try {
              await axios.get(`${deleteofferprice_api}`, { params: { id : id } });
            } catch (err) {
              console.error('Delete failed:', err);
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
    fetchOffers(true);
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
    if (!loading && hasMore && offerList.length > 0) {
      fetchOffers();
    }
  };

  const handleItemPress = (item: any & { statusid?: number; status?: string }) => {
    const isInactive = item.statusid !== 1;
    const options = [i18n.t('edit'), i18n.t('delete'), i18n.t('cancel')];
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: `${i18n.t('actionsfor')} ${item.offernumber}`,
      },
      async (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            navigation.navigate('AddPriceOffer', { offerid: item.id });
            break;
          case 1:
            await deleteOffer(item.id);
            break;      
          default:
            break;
        }
      }
    );
  };

  const renderItem = ({ item }: { item: any & { status?: string; statusid?: number } }) => (
    <TouchableOpacity onPress={() => handleItemPress(item)}>
      <View style={styles.itemContainer}>
        <Text style={styles.title}>{item.offernumber}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('name_')} </Text>
          <Text style={styles.value}>{item.name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('mobile_')} </Text>
          <Text style={styles.value}>{item.mobile}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('email_')} </Text>
          <Text style={styles.value}>{item.email}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{i18n.t('issuedate_')}</Text>
          <Text style={styles.value}>{item.issuedate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={styles.searchInput}
        placeholder={i18n.t('searchoffers_')} 
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={offerList}
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
          loading && !refreshing && offerList.length > 0 ? (
            <ActivityIndicator style={{ marginVertical: 20 }} />
          ) : null
        }
        ListEmptyComponent={
          !loading && !refreshing ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text>{i18n.t('nooffersfound')}</Text>
            </View>
          ) : null
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddPriceOffer')}
      >
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Same styles as before or customize accordingly
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
    flexWrap: 'wrap',
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
});


export default PriceOfferScreen;