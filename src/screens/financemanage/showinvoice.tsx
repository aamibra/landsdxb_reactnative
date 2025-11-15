import { print_invoice_api } from '@/constant/DXBConstant';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

 

const ShowInvoiceScreen = ({ navigation, route }: any) => {

    const { policyid, policytype } = route.params;

    const invoiceUrl = `${print_invoice_api}?policyid=${policyid}&policytype=${policytype}`;


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


export default ShowInvoiceScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
