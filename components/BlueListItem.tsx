import React from "react";
import { I18nManager, Platform, StyleSheet, TouchableOpacity, View } from "react-native";

const BlueListItem = React.memo(({ children, onPress, style }: any) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{ width: "100%" }}
    >
      <View style={[styles.card, style]}>
        {children}
      </View>
    </TouchableOpacity>
  );
});

export default BlueListItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    ...(Platform.OS === "android"
      ? {
          borderStartWidth: 4,
          borderStartColor: "#007AFF",
        }
      : {
          borderRightWidth: I18nManager.isRTL ? 4 : 0,
          borderLeftWidth: I18nManager.isRTL ? 0 : 4,
          borderColor: "#007AFF",
        }),
  },
});
