 
import RTLText from '@/components/RTLText';
import i18n from '@/Services/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';




const AccordionList = [
  { id: '1', title: 'menumanage' , isdynamic: false, model: 'MenuManage' },
  { id: '2', title: 'usersmanage' , isdynamic: false, model: 'UserManage' },
  { id: '3', title: 'invoicemanage' , isdynamic: false, model: 'InvoiceManage' },
  { id: '4', title: 'optionset' , isdynamic: false, model: 'OptionSet' },
];

const ItemList = [
  { id: '1', title:   'applicantinfo'     , accordiontype: 4, isdynamic: false, model: 'applicantinfo' },
  { id: '2', title:   'areaname'          , accordiontype: 4, isdynamic: false, model: 'areaname' },
  { id: '3', title:   'purposeevaluation' , accordiontype: 4, isdynamic: true, model: 'purpose' },
  { id: '4', title:   'usageevaluation'   , accordiontype: 4, isdynamic: true, model: 'usageevaluation' },
  { id: '5', title:   'buildtype'         , accordiontype: 4, isdynamic: true, model: 'buildtype' },
  { id: '6', title:   'baseevaluation'    , accordiontype: 4, isdynamic: true, model: 'baseevaluation' },
  { id: '7', title:   'landstatus'        , accordiontype: 4, isdynamic: true, model: 'landstatus' },
  { id: '8', title:   'systemforms'       , accordiontype: 4, isdynamic: false, model: 'systemforms' },
  { id: '9', title:   'unitmainproject'   , accordiontype: 4, isdynamic: true, model: 'unitmainproject' },
  { id: '10', title:  'unitsubproject'   , accordiontype: 4, isdynamic: true, model: 'unitsubproject' },
  { id: '13', title:  'govermenttax'     , accordiontype: 4, isdynamic: false, model: 'govtax' },
  { id: '11', title:  'priceoffer'       , accordiontype: 3, isdynamic: false, model: 'PriceOffer' },
  { id: '12', title:  'invoicereport'    , accordiontype: 3, isdynamic: false, model: 'InvoiceReport' },
];

/*function navigateToPath(navigation, path) {
 const parts = path.split('/');
 let route = { name: parts[0] };
 let current = route;

 for (let i = 1; i < parts.length; i++) {
   current.params = { screen: parts[i] };
   current = current.params;
 }

 navigation.navigate(route);
}
*/
export default function Index({ navigation }: any) { 
   const [isArabic, setIsArabic] = useState(false);
   const [switchLanguage, setSwitchLanguage] = useState('ar'); // opposite by default
 

  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t('setting'),
    });
  }, [navigation, i18n.language]);

    useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('appLanguage');
        const lang = storedLanguage || 'en'; 
        setSwitchLanguage(storedLanguage === 'en' ? 'ar' : 'en');
        setIsArabic(lang === 'ar');
      } catch (error) {
        console.log('Error fetching language:', error);
      }
    };

    fetchLanguage();
  }, []);

  const [openAccordions, setOpenAccordions] = useState<string[]>(
    AccordionList.map((a) => a.id) // مفتوحة افتراضيًا
  );
 
  const toggleAccordion = (id: string) => {
    setOpenAccordions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };


  const handlePress = (item: any) => {
    if (item.isdynamic) {
      navigation.navigate('masterlist', { model: `${item.model}` });
    } else {
      navigation.navigate(`${item.model}`);
    }
  };

  return ( 
      <ScrollView>
        {AccordionList.map((accordion) => {
          const nestedItems = ItemList.filter(
            (item) => item.accordiontype.toString() === accordion.id
          ); 
          const isOpen = openAccordions.includes(accordion.id);

          return (
            <View key={accordion.id}>
              <TouchableOpacity
                onPress={() =>
                  nestedItems.length > 0
                    ? toggleAccordion(accordion.id)
                    : handlePress(accordion)
                }
                style={styles.accordionHeader}
              >
                <RTLText style={styles.accordionHeaderText}>{ i18n.t(accordion.title)}</RTLText>
                <RTLText>{nestedItems.length > 0 ? (isOpen ? '▲' : '▼') : ''}</RTLText>
              </TouchableOpacity>

              {isOpen &&
                nestedItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handlePress(item)}
                    style={styles.item}
                  >
                    <RTLText style={styles.itemText}>{ i18n.t(item.title)}</RTLText>
                  </TouchableOpacity>
                ))}
            </View>
          );
        })}
      </ScrollView> 
  );

};


const styles = StyleSheet.create({
  accordionHeader: {
    padding: 16,
    backgroundColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  accordionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  item: {
    padding: 14,
    paddingLeft: 32,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  itemText: {
    fontSize: 14,
  },
});