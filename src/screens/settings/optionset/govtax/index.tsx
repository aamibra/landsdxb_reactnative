import { activegovermenttax_api, deactivegovermenttax_api, govermenttax_api } from '@/constant/DXBConstant';
import i18n from '@/Services/i18n';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


interface GovermentTaxModel {
  id: number;
  taxnumber: string;
  vat: string;
  dstatus: string;
  isactive: number; // 1 = active, 0 = inactive
}


const GovermentTaxScreen = () => {
  const navigation = useNavigation();
  const { showActionSheetWithOptions } = useActionSheet();
  const [item, setItem] = useState<GovermentTaxModel | null>(null);
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t('govermenttax'),
    });
  }, [navigation, i18n.language]);

  // Fetch item
  const fetchItem = async () => {
    try {
      setLoading(true);
      const res = await axios.get(govermenttax_api);
      setItem(res.data);
    } catch (error) {
      Alert.alert(i18n.t('error') , i18n.t('failedtoloadtaxdata'));
    } finally {
      setLoading(false);
    }
  };

  // Block (deactivate)
  const blockItem = async () => {
    if (!item) return;
    try {
      setLoading(true);
      await axios.get(deactivegovermenttax_api, { params: { optionid: item.id } });
      await fetchItem();
    } catch (error) {
      Alert.alert(i18n.t('error'),  i18n.t('failedtobloacktaxitem'));
    } finally {
      setLoading(false);
    }
  };

  // Activate
  const activateItem = async () => {
    if (!item) return;
    try {
      setLoading(true);
      await axios.get(activegovermenttax_api, { params: { optionid: item.id } });
      await fetchItem();
    } catch (error) {
      Alert.alert(i18n.t('error'), i18n.t('failedtoactivatetaxitem') );
    } finally {
      setLoading(false);
    }
  };


  const onPressItem = () => {
    if (!item) return;

    const options = [i18n.t('edit') , item.isactive === 1 ? i18n.t('setinactive') : i18n.t('setactive') ,  i18n.t('cancel') ];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: ` ${i18n.t('actionsfor')} #${item.taxnumber}`,
      },
      (selectedIndex) => {
        if (selectedIndex === 0) {
          navigation.navigate('addgovtax', { mode: 'edit', taxItem: item });

        } else if (selectedIndex === 1) {
          if (item.isactive === 1) {
            // Currently active => block
            Alert.alert(
              i18n.t('confirm') ,
              i18n.t('areyousurewantsettaxinactive') ,
              [
                { text: i18n.t('cancel') , style: 'cancel' },
                { text: i18n.t('ok') , onPress: () => blockItem() },
              ]
            );
          } else {
            // Currently inactive => activate
            Alert.alert(
              i18n.t('confirm') ,
              i18n.t('areyousurewantsettaxactive'),
              [
                { text: i18n.t('cancel'), style: 'cancel' },
                { text: i18n.t('ok') , onPress: () => activateItem() },
              ]
            );
          }
        }
      }
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchItem();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  if (!item) {
    return (
      <View  >
        <Text> {i18n.t('notaxdatafound')} </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressItem} style={styles.card}>
        <Text style={styles.label}>{i18n.t('taxnumber_')}</Text>
        <Text style={styles.value}>{item.taxnumber}</Text>

        <Text style={styles.label}>{i18n.t('vatnumber_')}</Text>
        <Text style={styles.value}>{item.vat}</Text>

        <Text style={styles.label}>{i18n.t('status_')}</Text>
        <Text style={[styles.value, { color: item.isactive === 1 ? 'green' : 'red' }]}>
          {item.isactive === 1 ? i18n.t('active') : i18n.t('inactive') }
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    elevation: 3,
  },
  label: { fontWeight: 'bold', fontSize: 16, marginTop: 10 },
  value: { fontSize: 16, marginTop: 4 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default GovermentTaxScreen;
