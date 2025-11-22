import BaseListScreen from '@/components/BaseListScreen';
import RTLText from '@/components/RTLText';
import { activesystemform_api, deactivesystemform_api, systemform_api } from '@/constant/DXBConstant';
import FlatListStyles from '@/constant/LandsDxbStyle';
import api from '@/Services/axiosInstance';
import i18n from '@/Services/i18n';
import React, { useLayoutEffect, useRef } from 'react';
import {
  Alert,
  I18nManager,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';

 const isRTL = I18nManager.isRTL;
 
const SystemFormsScreen = ({ navigation, route }: any) => {
  const listRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t('systemforms'),
    });
  }, [navigation, i18n.language]);



  const deactivateSystemForm = async (optionId: number) => {
    Alert.alert(
      i18n.t('confirmlock'),
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
              const response = await api.get(`${deactivesystemform_api}`, {
                params: { optionid: optionId }
              });
              console.log('Deactivate success:', response.data);
            } catch (error) {
              console.error('Error deactivating SystemForm:', error);
              Toast.show({ type: 'error', text1: i18n.t('error'), text2: i18n.t('unexpectederrortryagain'), position: 'bottom' });
            }

            listRef.current?.refresh();
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
        const res = await api.get(systemform_api, {
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
            <RTLText style={FlatListStyles.label}>{i18n.t("englishname_")}</RTLText>
            <RTLText style={FlatListStyles.value}>{item.englishname}</RTLText>
          </View>

          <View style={FlatListStyles.row}>
            <RTLText style={FlatListStyles.label}>{i18n.t("arabicname_")}</RTLText>
            <RTLText style={FlatListStyles.value}>{item.arabicname}</RTLText>
          </View>

          <View style={FlatListStyles.row}>
            <RTLText style={FlatListStyles.label}>{i18n.t("url_")}</RTLText>
            <RTLText style={FlatListStyles.value}>{item.url}</RTLText>
          </View>

          <View style={FlatListStyles.row}>
            <RTLText style={FlatListStyles.label}>{i18n.t("status_")}</RTLText>
            <RTLText style={[FlatListStyles.value, item.status === 1 ? FlatListStyles.active : FlatListStyles.inactive]} >{item.status === 1 ? i18n.t('enabled') : i18n.t('inactive')}</RTLText>
          </View>
        </View>
      )}

      /* ActionSheet عند الضغط على عنصر */
      actionSheetOptions={(item) => ({
        title: `${i18n.t('actionsfor')}  ${isRTL ? item.arabicname  : item.englishname}`,
        options: [i18n.t('showfeespolicy'),
        item.status !== 1 ? i18n.t('unlock') : i18n.t('lock'),
        i18n.t('cancel')
        ],
        cancelIndex: 2,
        onSelect: async (i) => {
          if (i === 0) navigation.navigate('feespolicy', { systemformid: item.id });
          if (i === 1) item.status !== 1 ? await activateSystemForm(item.id) : await deactivateSystemForm(item.id);
        }
      })}

      /* ActionSheet زر الإضافة */
      onAddPress={() => { navigation.navigate('addapplicantinfo') }}
    />
  );
};


export default SystemFormsScreen;

