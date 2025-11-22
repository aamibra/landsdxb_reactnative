import BaseListScreen from '@/components/BaseListScreen';
import RTLText from '@/components/RTLText';
import {
  activepolicyprice_api,
  deactivepolicyprice_api,
  deletepolicyprice_api,
  policyprice_api,
} from '@/constant/DXBConstant';
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
 
const FeesPolicyScreen = ({ navigation, route }: any) => {
  // ✅ systemformid passed from previous screen
  const { systemformid } = route.params;
  const listRef = useRef(null);


  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t('feespolicy'),
    });
  }, [navigation, i18n.language]);



  const confirmDelete = (id: number) => {
    Alert.alert(i18n.t('confirmdelete'), i18n.t('aresurewantdeletefee'), [
      { text: i18n.t("cancel"), style: 'cancel' },
      {
        text: i18n.t('ok'),
        onPress: async () => {
          try {
            await api.get(deletepolicyprice_api, { params: { optionid: id } });
            listRef.current?.refresh();
          } catch {
            Toast.show({ type: 'error', text1: i18n.t('error'), text2: i18n.t('failedtodelete'), position: 'bottom' });
          }
        },
      },
    ]);
  };

  const toggleStatus = async (id: number, activate: boolean) => {
    const request_api = activate ? activepolicyprice_api : deactivepolicyprice_api;
    try {
      await api.get(request_api, { params: { optionid: id } });
      listRef.current?.refresh();
    } catch {
      Toast.show({ type: 'error', text1: i18n.t('error'), text2: `${i18n.t('failedto')} ${activate ? i18n.t('active') : i18n.t('deactivate')}`, position: 'bottom' });
    }
  };

  return (
    <BaseListScreen
      ref={listRef}
      fetchData={async (page, search) => {
        const res = await api.get(policyprice_api, {
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
              <RTLText style={FlatListStyles.label}>{i18n.t('englishname_')}</RTLText>
              <RTLText style={FlatListStyles.value}>{item.englishname}</RTLText>
            </View>
            <View style={FlatListStyles.row}>
              <RTLText style={FlatListStyles.label}>{i18n.t('arabicname_')}</RTLText>
              <RTLText style={FlatListStyles.value}>{item.arabicname}</RTLText>
            </View>
            <View style={FlatListStyles.row}>
              <RTLText style={FlatListStyles.label}>{i18n.t('servicefees_')}</RTLText>
              <RTLText style={FlatListStyles.value}>{item.servicefees}</RTLText>
            </View>
            <View style={FlatListStyles.row}>
              <RTLText style={FlatListStyles.label}>{i18n.t('status_')}</RTLText>
              <RTLText style={[FlatListStyles.value, item.status === 1 ? FlatListStyles.active : FlatListStyles.inactive]}>{item.status === 1 ? i18n.t('enabled') : i18n.t('inactive')}</RTLText>
            </View>
          </View>
        );
      }}


      /* ActionSheet عند الضغط على عنصر */
      actionSheetOptions={(item) => {
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

        return ({
          title: `${i18n.t('actionsfor')} ${isRTL ? item.arabicname  : item.englishname}`,
          options: options,
          cancelIndex: cancelButtonIndex,
          onSelect: async (selected: any) => {
            if (selected === actions.edit) {
              navigation.navigate('addfeespolicy', { mode: 'edit', pricePolicy: item, systemformid: systemformid, });
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
          }
        });
      }}
 
      /* ActionSheet زر الإضافة */
      onAddPress={() => { navigation.navigate('addfeespolicy', { mode: 'create', systemformid }) }}
    />
  );
};
 
export default FeesPolicyScreen;
