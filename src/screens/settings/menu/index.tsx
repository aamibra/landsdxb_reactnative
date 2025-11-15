import { activemenu_api, deactivemenu_api, deletemenu_api, menu_api } from '@/constant/DXBConstant';
import api from '@/Services/axiosInstance';
import i18n from '@/Services/i18n';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
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


const PAGE_SIZE = 20;


const MenuItem = React.memo(({ item, onPress }) => (
  <TouchableOpacity onPress={() => onPress(item)}>
    <View style={styles.itemContainer}>
      <View style={styles.row}><Text style={styles.label}>{i18n.t('englishname_')} </Text><Text style={styles.value}>{item.enname}</Text></View>
      <View style={styles.row}><Text style={styles.label}>{i18n.t('arabicname_')} </Text><Text style={styles.value}>{item.arname}</Text></View>
      <View style={styles.row}><Text style={styles.label}>{i18n.t('parent_')} </Text><Text style={styles.value}>{item.enparent}</Text></View>
      <View style={styles.row}><Text style={styles.label}>{i18n.t('url_')}   </Text><Text style={styles.value}>{item.url}</Text></View>
      <View style={styles.row}><Text style={styles.label}>{i18n.t('icon_')}  </Text><Text style={styles.value}>{item.icon}</Text></View>
      <View style={styles.row}><Text style={styles.label}>{i18n.t('status_')}</Text><Text style={[styles.value, item.statusid === 1 ? styles.active : styles.inactive]}>{item.status}</Text></View>
      <View style={styles.row}><Text style={styles.label}>{i18n.t('roles_')} </Text><Text style={styles.value}>{item.roles?.join(', ') || '-'}</Text></View>
    </View>
  </TouchableOpacity>
));

const MenuScreen = () => {
 const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { showActionSheetWithOptions } = useActionSheet();

  const [menuList, setMenuList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  
  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t('menumanage'),
    });
  }, [navigation, i18n.language]);
 
  const fetchMenus = async (reset = false) => {
    if (loading) return; // لو في تحميل ما ينفذ

    try {
      reset ? setRefreshing(true) : setLoading(true);

      const currentPage = reset ? 1 : page;

      const res = await axios.get(`${menu_api}`, {
        params: { page: currentPage, limit: PAGE_SIZE, search: searchQuery },
      });

      const newData = res.data.data || res.data;
      const total = res.data.total || 1000;

      if (reset) {
        setMenuList(newData);
        setPage(2);
      } else {
        setMenuList(prev => [...prev, ...newData]);
        setPage(currentPage + 1);
      }

      // نحدّد هل هناك المزيد للتحميل
      setHasMore((currentPage * PAGE_SIZE) < total);

    } catch (err) {
      Alert.alert( i18n.t('error') , i18n.t('failedtoloadmenuitems'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // دالة واحدة واضحة للتعامل مع نهاية القائمة
  const handleEndReached = () => {
    if (!loading && hasMore && menuList.length > 0) {
      fetchMenus();
    }
  };

  const onRefresh = () => {
    setHasMore(true);
    fetchMenus(true);
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



  const handleItemPress = useCallback((item) => {
    const isInactive = item.statusid !== 1;
    const options = [i18n.t('edit'), i18n.t('delete'), isInactive ? i18n.t('activate') : i18n.t('deactivate') , i18n.t('cancel')];
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: `${i18n.t('actionsfor')} ${item.enname}`
      },
      async (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            navigation.navigate('addmenu', { mode: 'edit', menuid: item.id });
            break;
          case 1:
            await deleteMenuItem(item.id);
            break;
          case 2:
            isInactive ? await activateMenu(item.id) : await deactivateMenu(item.id);
            break;
        }
      }
    );
  }, [navigation]);

  const deleteMenuItem = async (id) => {
    Alert.alert( i18n.t('confirmdelete') , i18n.t('areyousure'), [
      { text: i18n.t('cancel')  , style: 'cancel' },
      {
        text:  i18n.t('ok')  , onPress: async () => {
          try {
            await api.get(`${deletemenu_api}`, { params: { id } });
            onRefresh();
          } catch (err) {
            console.error(err);
          }
        }
      }
    ]);
  };

  const activateMenu = async (id) => {
    try {
      await api.get(`${activemenu_api}`, { params: { id } });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const deactivateMenu = async (id) => {
    try {
      await api.get(`${deactivemenu_api}`, { params: { id } });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const renderItem = useCallback(({ item }) => (
    <MenuItem item={item} onPress={handleItemPress} />
  ), [handleItemPress]);

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={styles.searchInput}
        placeholder={ i18n.t('searchmenu_')} 
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={menuList}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={7}
        removeClippedSubviews={true}
        ListFooterComponent={
          loading && menuList.length > 0 ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null
        }
        ListEmptyComponent={
          !loading && !refreshing ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text>{ i18n.t('nomenuitemsfound')} </Text>
            </View>
          ) : null
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('addmenu')}
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

export default MenuScreen;