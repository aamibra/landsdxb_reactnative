import { getpolicylist_api } from '@/constant/DXBConstant';
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

 

const PAGE_SIZE = 80;

interface PolicyPickerProps {
  value: string;
  selectedLabel?: string;
  onChange: (id: string, label: string) => void;
}

const PolicyPicker = ({ value, selectedLabel, onChange }: PolicyPickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [policyList, setPolicyList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (selectedLabel) {
      setLabel(selectedLabel);
    }
  }, [selectedLabel]);

  useEffect(() => {
    if (modalVisible) {
      fetchPolicies(true);
    }
  }, [searchQuery, modalVisible]);


const fetchPolicies = async (reset = false) => {
  if (loading || (!hasMore && !reset)) return;

  setLoading(true);

  try {
    const res = await api.get(getpolicylist_api, {
      params: {
        term : searchQuery, // ✅ بدل "term"
        page: reset ? 1 : currentPage,
        limit: PAGE_SIZE,
      },
    });

    const newItems = res.data.data;   // ✅ هذا صحيح حسب كلاس PaginationListModel
    const total = res.data.total;

    const combinedItems = reset ? newItems : [...policyList, ...newItems];

    setPolicyList(combinedItems);
    setHasMore(combinedItems.length < total);
    setCurrentPage(reset ? 2 : currentPage + 1);
  } catch (err) {
    console.error('فشل تحميل الوثائق:', err);
  } finally {
    setLoading(false);
  }
};

  const handleSelect = (item: any) => {
    onChange(item.id, item.text);
    setLabel(item.text);
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
        <Text>{label || i18n.t('selectpolicy_placeholder') }</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1, padding: 16 }}>
          <TextInput
            placeholder={i18n.t('searchpolicies')}
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
            data={policyList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelect(item)}>
                <Text style={{ padding: 10 }}>{item.text}</Text>
              </TouchableOpacity>
            )}
            onEndReached={() => fetchPolicies()}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
          />

          <Button title={i18n.t('close')} onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

export default PolicyPicker;
