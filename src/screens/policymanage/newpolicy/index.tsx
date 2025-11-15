
import { fetchAndCacheDropdown } from '@/Services/MyService';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { FlatList, Text, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-paper';

const items = [
    { id: '1', title: 'Vacant Land'                  , path: '../policymanage/newpolicy/vacantland'   },
    { id: '2', title: 'Building Valuation'           , path: '../policymanage/newpolicy/building'     },
    { id: '3', title: 'Unit Valuation (Residential)' , path: '../policymanage/newpolicy/unit'         },
    { id: '4', title: 'Office Valuation'             , path: '../policymanage/newpolicy/office'       },
    { id: '5', title: 'Shop Valuation'               , path: '../policymanage/newpolicy/shop'         },
    { id: '6', title: 'Under Construction'           , path: '../policymanage/newpolicy/underconst'   },
    { id: '7', title: 'Villa Valuation'              , path: '../policymanage/newpolicy/villa'        } 
 ];


  const NewPolicy = ( ) => {
     
   const router = useRouter();
    
   const hasLoadedCache = React.useRef(false); //  this flag ensures it runs only once

     React.useEffect(() => {
   
       
   
       const loadData = async () => { 
          await fetchAndCacheDropdown(); 
       };
   
       if (!hasLoadedCache.current){
        loadData(); 
         hasLoadedCache.current = true;
       }  
   
     }, []);
   

     const handleItemClick = (item: any) => {  
       router.replace( `${item.path}`);  

     };
       
     const renderItem = ({ item }: any ) => (

       <TouchableOpacity onPress={() => handleItemClick(item) }>
         <Text>{item.title}</Text>
       </TouchableOpacity>

     );

     return( 
         <FlatList
           style={{ backgroundColor: colors?.background }}
           renderItem={renderItem}
           keyExtractor={(item) => item.id}
           ItemSeparatorComponent={Divider}
           data={items}
           alwaysBounceVertical={false}
         /> 
     );
    
        
  };


 NewPolicy.title = 'Select New Policy';

export default NewPolicy;