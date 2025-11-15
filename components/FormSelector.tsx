import i18n from '@/Services/i18n';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';

export interface FormSelectorHandle {
  openActionSheet: () => void;
  closeActionSheet: () => void;
}

interface FormSelectorProps {
  navigation: any;
}

// تعريف السياسات
const formKeys = [
  { id: '1', key: 'vacantlandform'    },
  { id: '2', key: 'buildingform'  },
  { id: '3', key: 'unitformresidential'  },
  { id: '4', key: 'officeform'   },
  { id: '5', key: 'shopform'   },
  { id: '6', key: 'underconstform'   },
  { id: '7', key: 'villaform'  },
];

const FormSelector = forwardRef<FormSelectorHandle, FormSelectorProps>(
  ({ navigation }, ref) => {
    const actionSheetRef = useRef<React.ElementRef<typeof ActionSheet>>(null);
    const isRTL = true //i18n.locale === 'ar';
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      openActionSheet: () => {
        setVisible(true);
        actionSheetRef.current?.show();
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();
      },
      closeActionSheet: () => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }).start(() => {
          actionSheetRef.current?.hide();
          setVisible(false);
        });
      },
    }));

    const handleFormNavigation = (id: string) => {
      switch (id) {
        case '1': navigation.navigate('vacantform' ); break;
        case '2': navigation.navigate('buildform' ); break;
        case '3': navigation.navigate('unitform' ); break;
        case '4': navigation.navigate('officeform' ); break;
        case '5': navigation.navigate('shopform' ); break;
        case '6': navigation.navigate('underconstform' ); break;
        case '7': navigation.navigate('villform' ); break;
        default: alert(i18n.t('noavailableform')); break;
      }
      ref.current?.closeActionSheet(); // آمنة الآن
    };

    return (
      <ActionSheet
        ref={actionSheetRef}
        containerStyle={styles.sheetContainer}
        gestureEnabled 
        defaultOverlayOpacity={0}
      >
        {visible && (
          <Animated.View style={[styles.fadeOverlay, { opacity: fadeAnim }]} />
        )}
        <View style={{ padding: 20 }}>
          <Text style={[styles.sheetTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {i18n.t('selectyourform')}
          </Text>

          {formKeys.map((form, index) => (
            <View key={form.id}>
              <Pressable
                onPress={() => handleFormNavigation(form.id)}
                style={({ pressed }) => [
                  styles.optionButton,
                  pressed && { backgroundColor: '#f0f0f0' },
                ]}
              >
                <Text style={[styles.optionText, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {i18n.t(form.key)}
                </Text>
              </Pressable>

              {index !== formKeys.length - 1 && <View style={styles.divider} />}
            </View>
          ))}

          <Pressable
            onPress={() => ref.current?.closeActionSheet()}
            style={({ pressed }) => [
              styles.optionButton,
              { marginTop: 10 },
              pressed && { backgroundColor: '#f0f0f0' },
            ]}
          >
            <Text style={[styles.cancelText, { textAlign: isRTL ? 'right' : 'left' }]}>
              {i18n.t('cancel')}
            </Text>
          </Pressable>
        </View>
      </ActionSheet>
    );
  }
);

const styles = StyleSheet.create({
  sheetContainer: { borderTopLeftRadius: 15, borderTopRightRadius: 15 },
  fadeOverlay: {
    ...StyleSheet.absoluteFillObject, 
    opacity: 0.5,
  },
  sheetTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15 },
  optionButton: { paddingVertical: 15 },
  optionText: { fontSize: 16 },
  cancelText: { fontSize: 16, color: 'red' },
  divider: { height: 1, backgroundColor: '#ddd' },
});



export default FormSelector;
