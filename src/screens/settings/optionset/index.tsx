import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const menuItems = [
   { id: '1' , title: 'Applicant Info'       , url: 'applicantinfo'      },
   { id: '2' , title: 'Area Name'            , url: 'areaname' },
   { id: '3' , title: 'Purpose Evaluation'   , url: 'purposeevaluation'  },
   { id: '4' , title: 'Usage Evaluation'     , url: 'usageevaluation'    },
   { id: '5' , title: 'Type Build'           , url: 'typebuild'          },
   { id: '6' , title: 'Base Evaluation'      , url: 'baseevaluation'     },
   { id: '7' , title: 'Land Status'          , url: 'landstatus'         },
   { id: '8' , title: 'Evaluation Policies'  , url: 'policiesevaluation' },
   { id: '9' , title: 'Unit Main Project'    , url: 'unitmainproject'    },
   { id: '10', title: 'Unit SubProject'      , url: 'unitsubproject'     } 
];


export default function Index({ navigation }) {

   const navigat= useNavigation();

   const handlePress = (item : any) => {
      navigation.navigate( `${item.url}`);  // navigation.navigate(item.url);
   };

  const goBack = () => {
    navigat.goBack(); // This will take you to the previous screen
  };



   const renderItem = ({ item } : any) => (
      <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
         <Text style={styles.title}>{item.title}</Text>
      </TouchableOpacity>
   );

   return (
      <View>
      <Button title="Go Back" onPress={goBack} />
      <FlatList
         data={menuItems}
         keyExtractor={(item) => item.id}
         renderItem={renderItem}
         contentContainerStyle={styles.container}
      />
      </View>
      
   );

};


const styles = StyleSheet.create({
   container: {
      paddingVertical: 20,
   },
   item: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
      backgroundColor: '#f9f9f9',
   },
   title: {
      fontSize: 18,
   },
});