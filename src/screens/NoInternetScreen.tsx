import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function NoInternetScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Image
        source={require('@/assets/images/logo.png')} // تأكد من المسار الصحيح
        style={{ width: 150, height: 150, marginBottom: 30 }}
        resizeMode="contain"
      />
      <Text style={styles.text}>🚫 لا يوجد اتصال بالإنترنت</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
});
