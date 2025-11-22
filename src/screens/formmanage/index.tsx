import api from '@/Services/axiosInstance';
import React, { useLayoutEffect, useRef } from 'react';
import { Alert, I18nManager, View } from 'react-native';
//import axios from 'axios';
import BaseListScreen from '@/components/BaseListScreen';
import RTLText from '@/components/RTLText';
import { clerkformland_api } from '@/constant/DXBConstant';
import FlatListStyles from '@/constant/LandsDxbStyle';
import formatPhone from '@/Services/HelperService';
import i18n from '@/Services/i18n';

const isRTL = I18nManager.isRTL;

const FormScreen = ({ navigation }: any) => {
  const listRef = useRef(null);
  
  const forms = [
    { id: 1, name: i18n.t('vacantlandform') },
    { id: 2, name: i18n.t('buildingform') },
    { id: 3, name: i18n.t('unitformresidential') },
    { id: 4, name: i18n.t('officeform') },
    { id: 5, name: i18n.t('shopform') },
    { id: 6, name: i18n.t('underconstform') },
    { id: 7, name: i18n.t('villaform') },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t('formsmanage')
    });
  }, [navigation]);

 

  const handleFormNavigation = (formtypeid) => {
    switch (formtypeid) {
      case 1:
        navigation.navigate('vacantform');
        break;
      case 2:
        navigation.navigate('buildform');
        break;
      case 3:
        navigation.navigate('unitform');
        break;
      case 4:
        navigation.navigate('officeform');
        break;
      case 5:
        navigation.navigate('shopform');
        break;
      case 6:
        navigation.navigate('underconstform');
        break;
      case 7:
        navigation.navigate('villform');
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
        const res = await api.get(clerkformland_api, {
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
      actionSheetOptions={(item) => {

        return ({
          title: `${i18n.t('actionsfor')} ${item.formnumber}`,
          options: [
            i18n.t('edit'),
            i18n.t('cancel')
          ],
          cancelIndex: 1,
          onSelect: (i) => {
            if (i === 0) console.log("pressed");
          }
        });
      }}

      /* ActionSheet زر الإضافة */
      onAddPressActionSheet={() => {
        const options = forms.map(p => (isRTL ? '\u200F' + p.name : p.name));
        options.push(i18n.t("cancel"));

        return {
          options,
          cancelIndex: options.length - 1,
          onSelect: (index) => {
            if (index === options.length - 1) return;
            handleFormNavigation(forms[index].id);
          }
        };
      }}
    />
  );
};



export default FormScreen;