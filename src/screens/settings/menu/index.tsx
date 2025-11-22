import BaseListScreen from '@/components/BaseListScreen';
import RTLText from '@/components/RTLText';
import { activemenu_api, deactivemenu_api, deletemenu_api, menu_api } from '@/constant/DXBConstant';
import FlatListStyles from '@/constant/LandsDxbStyle';
import api from '@/Services/axiosInstance';
import i18n from '@/Services/i18n';
import React, { useLayoutEffect, useRef } from 'react';
import {
  Alert,
  StyleSheet,
  View
} from 'react-native';

 
const MenuScreen = ({ navigation, route }: any) => {
  const listRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t('menumanage'),
    });
  }, [navigation, i18n.language]);


  const deleteMenuItem = async (id) => {
    Alert.alert(i18n.t('confirmdelete'), i18n.t('areyousure'), [
      { text: i18n.t('cancel'), style: 'cancel' },
      {
        text: i18n.t('ok'), onPress: async () => {
          try {
            await api.get(`${deletemenu_api}`, { params: { id } });
             listRef.current?.refresh();
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
       listRef.current?.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const deactivateMenu = async (id) => {
    try {
      await api.get(`${deactivemenu_api}`, { params: { id } });
       listRef.current?.refresh();
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <BaseListScreen
      ref={listRef}
      fetchData={async (page, search) => {
        const res = await api.get(menu_api, {
          params: { page, limit: 20, search },
        });

        return {
          data: res.data.data,
          total: res.data.total
        };
      }}

      renderItemCard={(item) => {
        return (
          <View style={FlatListStyles.itemCard}>
            <View style={FlatListStyles.row}>
              <RTLText style={FlatListStyles.label}>{i18n.t("englishname_")}</RTLText>
              <RTLText style={FlatListStyles.value}>{item.enname}</RTLText>
            </View>
            <View style={FlatListStyles.row}>
              <RTLText style={FlatListStyles.label}>{i18n.t("arabicname_")}</RTLText>
              <RTLText style={FlatListStyles.value}>{item.arname}</RTLText>
            </View>
            <View style={FlatListStyles.row}>
              <RTLText style={FlatListStyles.label}>{i18n.t("parent_")}</RTLText>
              <RTLText style={FlatListStyles.value}>{item.enparent}</RTLText>
            </View>
            <View style={FlatListStyles.row}>
              <RTLText style={FlatListStyles.label}>{i18n.t("url_")}</RTLText>
              <RTLText style={FlatListStyles.value}>{item.url}</RTLText>
            </View>
            <View style={FlatListStyles.row}>
              <RTLText style={FlatListStyles.label}>{i18n.t("icon_")}</RTLText>
              <RTLText style={FlatListStyles.value}>{item.icon}</RTLText>
            </View>
            <View style={FlatListStyles.row}>
              <RTLText style={FlatListStyles.label}>{i18n.t("status_")}</RTLText>
              <RTLText style={[styles.value, item.statusid === 1 ? styles.active : styles.inactive]}>{ item.statusid === 1 ? i18n.t('enabled')  : i18n.t('inactive')}</RTLText>
            </View>
            <View style={FlatListStyles.row}>
              <RTLText style={FlatListStyles.label}>{i18n.t("roles_")}</RTLText>
              <RTLText style={styles.value}>{item.roles?.join(', ') || '-'}</RTLText>
            </View>
          </View>
        );
      }}


      /* ActionSheet عند الضغط على عنصر */
      actionSheetOptions={(item) => ({
        title: `${i18n.t('actionsfor')} ${item.enname}`,
        options: [i18n.t('edit'), i18n.t('delete'), item.statusid !== 1 ? i18n.t('activate') : i18n.t('deactivate'), i18n.t('cancel')],
        cancelIndex: 3,
        onSelect: async (i : any) => {
          if (i === 0) navigation.navigate('addmenu', { mode: 'edit', menuid: item.id });
          if (i === 1) await deleteMenuItem(item.id);
          if (i === 2) item.statusid !== 1 ? await activateMenu(item.id) : await deactivateMenu(item.id);
        }
      })}

      /* ActionSheet زر الإضافة */
      onAddPress={() => { navigation.navigate('addmenu') }}
    />
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