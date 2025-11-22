import BaseListScreen from '@/components/BaseListScreen';
import RTLText from '@/components/RTLText';
import { deleteofferprice_api, offerprice_api } from '@/constant/DXBConstant';
import FlatListStyles from '@/constant/LandsDxbStyle';
import api from '@/Services/axiosInstance';
import formatPhone from '@/Services/HelperService';
import i18n from '@/Services/i18n';
import React, { useLayoutEffect, useRef } from 'react';
import {
  Alert,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';


const PriceOfferScreen = ({ navigation, route }: any) => {
  const listRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t('priceoffer'),
    });
  }, [navigation, i18n.language]);

 

  const deleteOffer = async (id: number) => {
    Alert.alert(
      i18n.t('confirmdelete'),
      i18n.t('areyousuredeleteoffer'),
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        {
          text: i18n.t('ok'),
          onPress: async () => {
            try {
              await api.get(`${deleteofferprice_api}`, { params: { id: id } });
            } catch (err) {
              console.error('Delete failed:', err);
              Toast.show({ type: 'error', text1: i18n.t('error'), text2: i18n.t('unexpectederrortryagain'), position: 'bottom' });
            }
            listRef.current?.refresh();
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <BaseListScreen
      ref={listRef}
      fetchData={async (page, search) => {
        const res = await api.get(offerprice_api, {
          params: { page, limit: 20, search },
        });

        return {
          data: res.data.data,
          total: res.data.total
        };
      }}

      renderItemCard={(item) => (
        <View style={FlatListStyles.itemCard}>
          <View style={FlatListStyles.row}>
            <RTLText style={FlatListStyles.label}>{i18n.t("offernumber_")}</RTLText>
            <RTLText style={FlatListStyles.value}>{item.offernumber}</RTLText>
          </View>

          <View style={FlatListStyles.row}>
            <RTLText style={FlatListStyles.label}>{i18n.t("name_")}</RTLText>
            <RTLText style={FlatListStyles.value}>{item.name}</RTLText>
          </View>

          <View style={FlatListStyles.row}>
            <RTLText style={FlatListStyles.label}>{i18n.t("mobile_")}</RTLText>
            <RTLText style={FlatListStyles.value}>{formatPhone(item.mobile)}</RTLText>
          </View>

          <View style={FlatListStyles.row}>
            <RTLText style={FlatListStyles.label}>{i18n.t("email_")}</RTLText>
            <RTLText style={FlatListStyles.value}>{item.email}</RTLText>
          </View>

          <View style={FlatListStyles.row}>
            <RTLText style={FlatListStyles.label}>{i18n.t("issuedate_")}</RTLText>
            <RTLText style={FlatListStyles.value}>{item.issuedate}</RTLText>
          </View>
        </View>
      )}

      /* ActionSheet عند الضغط على عنصر */
      actionSheetOptions={(item) => ({
        options: [
          i18n.t('edit'),
          i18n.t('delete'),
          i18n.t('cancel')
        ],
        cancelIndex: 2,
        onSelect: async (i) => {
          if (i === 0) navigation.navigate('AddPriceOffer', { offerid: item.id });
          if (i === 1) await deleteOffer(item.id);
        }
      })}

      /* ActionSheet زر الإضافة */
      onAddPress={() => { navigation.navigate('AddPriceOffer') }}
    />

  );
};



export default PriceOfferScreen;