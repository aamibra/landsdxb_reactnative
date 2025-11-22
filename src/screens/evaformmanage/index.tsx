import React, { useRef } from 'react';
import { Alert, View } from 'react-native';

import BaseListScreen from '@/components/BaseListScreen';
import RTLText from '@/components/RTLText';
import { evaformland_api } from '@/constant/DXBConstant';
import FlatListStyles from '@/constant/LandsDxbStyle';
import api from '@/Services/axiosInstance';
import formatPhone from '@/Services/HelperService';
import i18n from '@/Services/i18n';



const EvaFormScreen = ({ navigation }: any) => {
  const listRef = useRef(null);


  const handleEditFormNavigation = (formtypeid: any, formid: any) => {
    switch (formtypeid) {
      case 1:
        navigation.navigate('evavacantform', { formid: formid });
        break;
      case 2:
        navigation.navigate('evabuildform', { formid: formid });
        break;
      case 3:
        navigation.navigate('evaunitform', { formid: formid });
        break;
      case 4:
        navigation.navigate('evaofficeform', { formid: formid });
        break;
      case 5:
        navigation.navigate('evashopform', { formid: formid });
        break;
      case 6:
        navigation.navigate('evaunderconstform', { formid: formid });
        break;
      case 7:
        navigation.navigate('evavillform', { formid: formid });
        break;
      default:
        Alert.alert(i18n.t('alert'), i18n.t('noavailableform'));
        break;
    }
  };



  return (
    <BaseListScreen
      ref={listRef}
      fetchData={async (page, search) => {
        const res = await api.get(evaformland_api, {
          params: { page, limit: 20, search },
        });

        return {
          data: res.data.data,
          total: res.data.total
        };
      }}

      renderItemCard={(item) => (
        <View style={FlatListStyles.itemCard}>

          <View style={FlatListStyles.row} >
            <RTLText style={FlatListStyles.label}>{i18n.t("formnumber_")}</RTLText>
            <RTLText style={FlatListStyles.value}>#{item.formnumber}</RTLText>
          </View>

          <View style={FlatListStyles.row}>
            <RTLText style={FlatListStyles.label}>{i18n.t("formtype_")}</RTLText>
            <RTLText style={FlatListStyles.value}>{item.enformtype}</RTLText>
          </View>

          <View style={FlatListStyles.row}>
            <RTLText style={FlatListStyles.label}>{i18n.t("name_")}</RTLText>
            <RTLText style={FlatListStyles.value}>{item.applicantname}</RTLText>
          </View>

          <View style={FlatListStyles.row}>
            <RTLText style={FlatListStyles.label}>{i18n.t("mobile_")}</RTLText>
            <RTLText style={FlatListStyles.value}>{formatPhone(item.applicantmobile)}</RTLText>
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
      actionSheetOptions={(item) => {

        return ({
          title: `${i18n.t('actionsfor')} ${item.formnumber}`,
          options: [
            i18n.t('edit'),
            i18n.t('cancel')
          ],
          cancelIndex: 1,
          onSelect: (i) => {
            if (i === 0) handleEditFormNavigation(item.formtypeid, item.formid);
          }
        });
      }}
 
    />
  );
};




export default EvaFormScreen;