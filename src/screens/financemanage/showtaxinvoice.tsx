import { print_taxinvoice_api } from '@/constant/DXBConstant';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
 

const ShowTaxInvoiceScreen = ({ navigation, route }: any) => {

    const { policyid, policytype } = route.params;

    const invoiceUrl = `${print_taxinvoice_api}?policyid=${policyid}&policytype=${policytype}`;

    return (
        <View style={styles.container}>
            <WebView
                originWhitelist={['*']}
                source={{ uri: invoiceUrl }}
                style={{ flex: 1 }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
            /> 
        </View>
    );
};


export default ShowTaxInvoiceScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
