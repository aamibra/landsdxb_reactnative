import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from "react";
import {
  ActivityIndicator,
  FlatList,
  I18nManager,
  RefreshControl,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import i18n from '@/Services/i18n';
import FlatListStyles from '@/constant/LandsDxbStyle';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Ionicons } from '@expo/vector-icons';
import RTLText from "./RTLText";

const isRTL = I18nManager.isRTL;

const BaseListScreen = forwardRef(({
  fetchData,
  renderItemCard,
  actionSheetOptions,
  onAddPressActionSheet,
  onAddPress,
}: any, ref) => {

  const { showActionSheetWithOptions } = useActionSheet();

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  useImperativeHandle(ref, () => ({
    refresh: () => loadItems(true),
  }));


  const loadItems = async (reset = false) => {
    if (loading) return;

    try {
      if (reset) setRefreshing(true);
      else setLoading(true);

      const currentPage = reset ? 1 : page;

      const result = await fetchData(currentPage, search);

      if (reset) {
        setItems(result.data);
        setPage(2);
      } else {
        setItems(prev => [...prev, ...result.data]);
        setPage(currentPage + 1);
      }

      setHasMore((reset ? result.data.length : items.length + result.data.length) < result.total);

    } catch (e) {
      console.log("FETCH ERROR:", e);
      setErrorMessage(i18n.t('failedtoloaddata'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  const openItemSheet = (item) => {
    const conf = actionSheetOptions(item);

    showActionSheetWithOptions(
      {
        ...(conf.title ? { title: conf.title } : {}),
        options: conf.options,
        cancelButtonIndex: conf.cancelIndex,
      },
      async (index) => {
        await conf.onSelect(index);
      }
    );
  };



  const openAddSheet = () => {
    if (onAddPressActionSheet) {
      const conf = onAddPressActionSheet();
      showActionSheetWithOptions(
        {
          options: conf.options,
          cancelButtonIndex: conf.cancelIndex,
        },
        conf.onSelect
      );

    } else if (onAddPress) {
      onAddPress();
    }
  };


  useEffect(() => {
    loadItems(true);
  }, []);


  useEffect(() => {
    const timeout = setTimeout(() => loadItems(true), 500);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleEndReached = () => {
    if (!loading && hasMore && items.length > 0) {
      loadItems();
    }
  };


  return (
    <View style={styles.container}>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#888" />
        <TextInput
          style={styles.searchInput}
          placeholder={i18n.t('search_')}
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={20} color="#aaa" />
          </TouchableOpacity>
        ) : null}
      </View>

      <FlatList
        data={items}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openItemSheet(item)}>
            {renderItemCard(item)}
          </TouchableOpacity>
        )}
        contentContainerStyle={FlatListStyles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadItems(true)}
            colors={['#007AFF']}
            tintColor={'#007AFF'}
            progressBackgroundColor="#fff"
          />
        }
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
              <View style={FlatListStyles.errorContainer}>
                <RTLText style={FlatListStyles.errorText}>{errorMessage}</RTLText>
                <TouchableOpacity style={FlatListStyles.retryButton} onPress={() => loadItems(true)}>
                  <RTLText style={FlatListStyles.retryButtonText}>{i18n.t('retry')}</RTLText>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="document-outline" size={48} color="#ccc" />
                <RTLText style={styles.emptyText}>{i18n.t('nodataavailable')}</RTLText>
              </View>
            )
          ) : null
        }
      />

      {(onAddPressActionSheet || onAddPress) && (
        <TouchableOpacity style={styles.fab} onPress={openAddSheet}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}

    </View>
  );
});


export default BaseListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", paddingHorizontal: 15 },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 10,
    paddingHorizontal: 10,
    elevation: 2,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 8,
    marginLeft: 6,
    textAlign: isRTL ? "right" : "left",
  },

  emptyContainer: { padding: 40, alignItems: "center" },
  emptyText: { color: "#999", marginTop: 10 },

  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  }
});
