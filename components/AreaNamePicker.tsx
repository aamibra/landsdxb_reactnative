import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { active_areaname_api } from '@/constant/DXBConstant';
import api from '@/Services/axiosInstance';
import i18n from '@/Services/i18n';
import RTLText from './RTLText';

// هنا ضع رابط API الخاص بـ AreaName

const PAGE_SIZE = 20;

interface AreaNamePickerProps {
  value: string;
  selectedLabel?: string;
  onChange: (id: string, label: string) => void;
}

const AreaNamePicker = ({ value, selectedLabel, onChange }: AreaNamePickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [areaList, setAreaList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [label, setLabel] = useState('');


  const isArabic = i18n.t('lang') === 'ar';

  useEffect(() => {
    if (selectedLabel) {
      setLabel(selectedLabel);
    }
  }, [selectedLabel]);

  useEffect(() => {
    if (modalVisible) {
      fetchAreas(true);
    }
  }, [searchQuery, modalVisible]);

  const fetchAreas = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;

    setLoading(true);
    try {
      const res = await api.get(active_areaname_api, {
        params: {
          page: reset ? 1 : currentPage,
          limit: PAGE_SIZE,
          search: searchQuery,
        },
        headers: {
          'Accept-Language': i18n.t('lang'),
        },
      });

      // Filter only status === 1
      const newItems = res.data.data.filter((item: any) => item.status === 1);
      const total = res.data.total;

      setAreaList(reset ? newItems : [...areaList, ...newItems]);
      setHasMore((reset ? newItems.length : areaList.length + newItems.length) < total);
      setCurrentPage(reset ? 2 : currentPage + 1);
    } catch (err) {
      console.error('Failed to load area names:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item: any) => {
    const label = `${item.areacode ?? ''} | ${isArabic ? item.arabicname ?? '' : item.englishname ?? ''}`;
    onChange(item.id.toString(), label);
    setLabel(label);
    setModalVisible(false);
      Keyboard.dismiss();
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
    <RTLText>{label || i18n.t('selectareaname')}</RTLText>
  </TouchableOpacity>

  {/* الـ Modal */}
  <Modal visible={modalVisible} animationType="slide" transparent={false}>
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        placeholder={i18n.t('searchareas')}
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
        data={areaList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelect(item)}>
            <RTLText style={{ padding: 10 }}>
              {item.areacode} | {isArabic ? item.arabicname : item.englishname}
            </RTLText>
          </TouchableOpacity>
        )}
        onEndReached={() => fetchAreas()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        keyboardShouldPersistTaps="handled"
      />
      <View style={{ marginHorizontal: 20, marginTop: 10 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            Keyboard.dismiss();
            setModalVisible(false);
          }}
        >
          <RTLText style={styles.buttonText}>{i18n.t('close')}</RTLText>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
</View>
);

};

export default AreaNamePicker;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  }
});