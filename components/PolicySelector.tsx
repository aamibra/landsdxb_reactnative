import i18n from '@/Services/i18n';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import RTLText from './RTLText';

export interface PolicySelectorHandle {
  openActionSheet: () => void;
  closeActionSheet: () => void;
}

interface PolicySelectorProps {
  navigation: any;
}

// تعريف السياسات
const policyKeys = [
  { id: '1', key: 'vacantpolicy' },
  { id: '2', key: 'buildingpolicy' },
  { id: '3', key: 'unitpolicy' },
  { id: '4', key: 'officepolicy' },
  { id: '5', key: 'shoppolicy' },
  { id: '6', key: 'underconstpolicy' },
  { id: '7', key: 'villapolicy' },
];

const PolicySelector = forwardRef<PolicySelectorHandle, PolicySelectorProps>(
  ({ navigation }, ref) => {
    const actionSheetRef = useRef<React.ElementRef<typeof ActionSheet>>(null);
    const isRTL = i18n.language  === 'ar';
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

    const handlePolicyNavigation = (id: string) => {
      switch (id) {
        case '1': navigation.navigate('vacantpolicy', { mode: 'new' }); break;
        case '2': navigation.navigate('buildingpolicy', { mode: 'new' }); break;
        case '3': navigation.navigate('unitpolicy', { mode: 'new' }); break;
        case '4': navigation.navigate('officepolicy', { mode: 'new' }); break;
        case '5': navigation.navigate('shoppolicy', { mode: 'new' }); break;
        case '6': navigation.navigate('underconstpolicy', { mode: 'new' }); break;
        case '7': navigation.navigate('villapolicy', { mode: 'new' }); break;
        default: alert(i18n.t('unsupportedPolicy')); break;
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
          <RTLText style={[styles.sheetTitle]}>
            {i18n.t('selectyourpolicy')}
          </RTLText>

          {policyKeys.map((policy, index) => (
            <View key={policy.id}>
              <Pressable
                onPress={() => handlePolicyNavigation(policy.id)}
                style={({ pressed }) => [
                  styles.optionButton,
                  pressed && { backgroundColor: '#f0f0f0' },
                ]}
              >
                <RTLText style={[styles.optionText]}>
                  {i18n.t(policy.key)}
                </RTLText>
              </Pressable>

              {index !== policyKeys.length - 1 && <View style={styles.divider} />}
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
            <RTLText style={[styles.cancelText]}>
              {i18n.t('cancel')} 
            </RTLText>
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



export default PolicySelector;
