import React from "react";
import { I18nManager, Text, TextProps } from "react-native";

export default function RTLText(props: TextProps) {
  return (
    <Text
      {...props}
      style={[
        {
          writingDirection: I18nManager.isRTL ? "rtl" : "ltr",
         // textAlign: I18nManager.isRTL ? "right" : "left", 
        },
        props.style,
      ]}
    >
      {props.children}
    </Text>
  );
}
