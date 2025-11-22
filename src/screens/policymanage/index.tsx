import BaseListScreen from '@/components/BaseListScreen';
//import axios from 'axios';
import api from '@/Services/axiosInstance';
import i18n from '@/Services/i18n';

import RTLText from '@/components/RTLText';
import { deletepolicyland_api, policyland_api } from '@/constant/DXBConstant';
import FlatListStyles from '@/constant/LandsDxbStyle';
import formatPhone from '@/Services/HelperService';
import React, { useRef } from 'react';
import { Alert, I18nManager, View } from 'react-native';
import Toast from 'react-native-toast-message';


const isRTL = I18nManager.isRTL;

export default function PolicyScreen({ navigation }: any) { 
  const listRef = useRef(null);

  // نماذج الوثائق
  const policies = [
    { id: 1, title: i18n.t('vacantpolicy') },
    { id: 2, title: i18n.t('buildingpolicy') },
    { id: 3, title: i18n.t('unitpolicy') },
    { id: 4, title: i18n.t('officepolicy') },
    { id: 5, title: i18n.t('shoppolicy') },
    { id: 6, title: i18n.t('underconstpolicy') },
    { id: 7, title: i18n.t('villapolicy') },
  ];

  // فتح نموذج معين
  const handlePolicyNavigation = (formId) => {
    const screens = {
      1: 'vacantpolicy',
      2: 'buildingpolicy',
      3: 'unitpolicy',
      4: 'officepolicy',
      5: 'shoppolicy',
      6: 'underconstpolicy',
      7: 'villapolicy',
    };
    navigation.navigate(screens[formId], { mode: 'new' });
  };

  const handleEditPolicyNavigation = (formtypeid: any, policyid: any) => {
    switch (formtypeid) {
      case 1:
        navigation.navigate('vacantpolicy', { mode: 'edit', policyid: policyid });
        break;
      case 2:
        navigation.navigate('buildingpolicy', { mode: 'edit', policyid: policyid });
        break;
      case 3:
        navigation.navigate('unitpolicy', { mode: 'edit', policyid: policyid });
        break;
      case 4:
        navigation.navigate('officepolicy', { mode: 'edit', policyid: policyid });
        break;
      case 5:
        navigation.navigate('shoppolicy', { mode: 'edit', policyid: policyid });
        break;
      case 6:
        navigation.navigate('underconstpolicy', { mode: 'edit', policyid: policyid });
        break;
      case 7:
        navigation.navigate('villapolicy', { mode: 'edit', policyid: policyid });
        break;
      default:
        Toast.show({ type: i18n.t('alert'), text1: i18n.t('alert'), text2: i18n.t('modelisnotsupported'), position: 'bottom' });
        break;
    }
  };

  const deletePolicy = async (id: number) => {
    Alert.alert(
      i18n.t('confirmdelete'),
      i18n.t('aresurewantdeletepolicy'),
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        {
          text: i18n.t('ok'),
          onPress: async () => {
            try {
              await api.get(`${deletepolicyland_api}`, { params: { policyid: id } });
              listRef.current?.refresh();
            } catch (err) {
              console.error(err);

              Toast.show({ type: 'error', text1: i18n.t('error'), text2: i18n.t('failedtodeletepolicy'), position: 'bottom' });
              // Alert.alert(i18n.t('error'), i18n.t('failedtodeletepolicy'));
            }
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
        const res = await api.get(policyland_api, {
          params: { page, limit: 20, search },
        });

        return {
          data: res.data.data,
          total: res.data.total
        };
      }}

      renderItemCard={(item) => (
        <View style={FlatListStyles.itemCard}>

          <View style={FlatListStyles.labelDirection}>
            <RTLText style={FlatListStyles.itemTitle}>#{item.policynumber}</RTLText>
          </View>

          <View style={FlatListStyles.row}>
            <RTLText style={FlatListStyles.label}>{i18n.t("policytype_")}</RTLText>
            <RTLText style={FlatListStyles.value}>{item.formtypename}</RTLText>
          </View>

          <View style={FlatListStyles.row}>
            <RTLText style={FlatListStyles.label}>{i18n.t("name_")}</RTLText>
            <RTLText style={FlatListStyles.value}>{item.applicantname}</RTLText>
          </View>

          <View style={FlatListStyles.row}>
            <RTLText style={FlatListStyles.label}>{i18n.t("mobile_")}</RTLText>
            <RTLText style={FlatListStyles.value}>{ formatPhone(item.applicantmobile) }</RTLText>
          </View>

          <View style={FlatListStyles.row}>
            <RTLText style={FlatListStyles.label}>{i18n.t("email_")}</RTLText>
            <RTLText style={FlatListStyles.value}>{item.applicantemail}</RTLText>
          </View>

          <View style={FlatListStyles.row}>
            <RTLText style={FlatListStyles.label}>{i18n.t("createdon_")}</RTLText>
            <RTLText style={FlatListStyles.value}>{item.createdon}</RTLText>
          </View>

        </View>
      )}

      /* ActionSheet عند الضغط على عنصر */
      actionSheetOptions={(item) => ({
        title: `${i18n.t('actionsfor')} ${ item.policynumber }`,
        options: [
          i18n.t('edit'),
          i18n.t('printcertificate'),
          i18n.t('printinvoice'),
          i18n.t('taxinvoice'),
          i18n.t('delete'),
          i18n.t('cancel')
        ],
        cancelIndex: 5,
        onSelect: (i) => {
          if (i === 0) handleEditPolicyNavigation(item.formtypeid, item.policyid);
          if (i === 1) navigation.navigate("showcertificate", { policyid: item.policyid, policytype: item.formtypeid });
          if (i === 2) navigation.navigate("showinvoice", { policyid: item.policyid, policytype: item.formtypeid });
          if (i === 3) navigation.navigate("showtaxinvoice", { policyid: item.policyid, policytype: item.formtypeid });
          if (i === 4)  deletePolicy(item.policyid);
        }
      })}

      /* ActionSheet زر الإضافة */
      onAddPressActionSheet={() => {
        const options = policies.map(p => (isRTL ? '\u200F' + p.title : p.title));
        options.push(i18n.t("cancel"));

        return {
          options,
          cancelIndex: options.length - 1,
          onSelect: (index) => {
            if (index === options.length - 1) return;
            handlePolicyNavigation(policies[index].id);
          }
        };
      }}
    />
  );
}



