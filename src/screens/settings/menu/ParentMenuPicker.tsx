import { menu_api } from '@/constant/DXBConstant';
import api from '@/Services/axiosInstance';
import i18n from '@/Services/i18n';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const PAGE_SIZE = 20;

interface ParentMenuPickerProps {
  value: string;
  selectedLabel?: string;
  onChange: (id: string, label: string) => void;
}

const ParentMenuPicker = ({ value, selectedLabel, onChange }: ParentMenuPickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuList, setMenuList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [label, setLabel] = useState('');

  // Set initial label when component mounts or selectedLabel changes
  useEffect(() => {
    if (selectedLabel) {
      setLabel(selectedLabel);
    }
  }, [selectedLabel]);

  // Fetch menu list when modal opens or search changes
  useEffect(() => {
    if (modalVisible) {
      fetchMenus(true);
    }
  }, [searchQuery, modalVisible]);

  const fetchMenus = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;

    setLoading(true);
    try {
      const res = await api.get(menu_api, {
        params: {
          page: reset ? 1 : currentPage,
          limit: PAGE_SIZE,
          search: searchQuery,
        },
      });

      const newItems = res.data.data;
      const total = res.data.total;

      setMenuList(reset ? newItems : [...menuList, ...newItems]);
      setHasMore((reset ? newItems.length : menuList.length + newItems.length) < total);
      setCurrentPage(reset ? 2 : currentPage + 1);
    } catch (err) {
      console.error('Failed to load parent menus:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item: any) => {
    onChange(item.id.toString(), item.enname);
    setLabel(item.enname);
    setModalVisible(false);
  };

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="small" color="#000" style={{ margin: 10 }} />;
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
        }}
      >
        <Text>{label || i18n.t('selectparentmenu_placeholder')}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1, padding: 16 }}>
          <TextInput
            placeholder={ i18n.t('searchparentmenus')}  
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setCurrentPage(1);
              setHasMore(true);
            }}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 10,
              marginBottom: 10,
              borderRadius: 5,
            }}
          />

          <FlatList
            data={menuList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelect(item)}>
                <Text style={{ padding: 10 }}>{item.enname}</Text>
              </TouchableOpacity>
            )}
            onEndReached={() => fetchMenus()}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
          />
          <Button title={ i18n.t('close')}  onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

export default ParentMenuPicker;

