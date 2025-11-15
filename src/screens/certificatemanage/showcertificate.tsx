import { print_certificate_api } from '@/constant/DXBConstant';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';

 

const ShowCertificateScreen = ({ navigation, route }: any) => {

    const { policyid, policytype } = route.params;

    const certificateUrl = `${print_certificate_api}?policyid=${policyid}&policytype=${policytype}`;


    return (
        <View style={styles.container}>
            <WebView
                originWhitelist={['*']}
                source={{ uri: certificateUrl }}
                style={{ flex: 1 }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
            /> 
        </View>
    );
};


export default ShowCertificateScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
