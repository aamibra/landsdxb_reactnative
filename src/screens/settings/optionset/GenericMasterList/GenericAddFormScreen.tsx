
import { MasterModelConfig } from '@/constant/MasterModelConfig';
import i18n from '@/Services/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
    Alert,
    Button,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

const GenericAddFormScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<any>();
      
   const [isArabic, setIsArabic] = useState(false);
   const [switchLanguage, setSwitchLanguage] = useState('ar'); // opposite by default
   
    const model = route.params?.model;
    const isEdit = route.params?.mode === 'edit';
    const data = route.params?.data || {};
    const extraParams = route.params?.extra || {}; // For values like systemformid
    
      useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('appLanguage');
        const lang = storedLanguage || 'en'; 
        setSwitchLanguage(storedLanguage === 'en' ? 'ar' : 'en');
        setIsArabic(lang === 'ar');
      } catch (error) {
        console.log('Error fetching language:', error);
      }
    };

    fetchLanguage();
  }, []);


    const config = MasterModelConfig[model];
    if (!config) return <Text> {i18n.t('invalidmodel_')}  {model}</Text>;

    useLayoutEffect(() => {
        if (model) {
            const title =  isEdit ? i18n.t(config.editformtitle) : i18n.t(config.addformtitle) ;
            navigation.setOptions({ title });
        }
    }, [navigation, model]);

    const [formState, setFormState] = useState({});

    useEffect(() => {
        if (Object.keys(formState).length === 0) {
            const initial = {};
            config.formFields.forEach(field => {
                initial[field.name] = isEdit ? data[field.name] ?? '' : '';
            });

            Object.entries(extraParams).forEach(([k, v]) => {
                initial[k] = v;
            });

            setFormState(initial);
        }
    }, [formState]); // ✅ Won’t loop if formState is initialized


    const handleChange = (fieldName: string, value: any) => {
        setFormState(prev => ({ ...prev, [fieldName]: value }));
    };

    const handleSubmit = async () => {
        const requiredFields = config.formFields.map(f => f.name);
        const missing = requiredFields.find(key => !formState[key] && formState[key] !== 0);

        if (missing) {
            Alert.alert( i18n.t('validationerror'), ` ${i18n.t('pleasefillin_')}  ${missing}`);
            return;
        }

        const payload = {
            ...formState,
            id: isEdit ? data.id : undefined,
        };

        try {
            const url = isEdit ? config.api.update : config.api.create;

            console.log('Submitting to URL:', url);
            console.log('Payload:', payload);

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const text = await res.text();
            console.log('Raw response:', text);

            let result;
            try {
                result = JSON.parse(text);
            } catch (e) {
                result = { message: text };
            }

            if (res.ok) {
                navigation.goBack();
            } else {
                console.log('Error status:', res.status);
                Alert.alert( i18n.t('error') , result?.message || text || 'Unknown error occurred');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            Alert.alert( i18n.t('error'), i18n.t('submissionfailed'));
        }

    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {config.formFields.map(field => {
                if (field.type === 'picker') {
                    return (
                        <View key={field.name} style={styles.pickerContainer}>
                            <Picker
                                selectedValue={formState[field.name]}
                                onValueChange={val => handleChange(field.name, val)}
                            >
                                <Picker.Item label={`-- ${i18n.t('select')}  ${i18n.t(field.label)} --`} value={null} />
                                {field.options.map(option => (
                                    <Picker.Item
                                        key={option.value}
                                        label={i18n.t(option.label)}
                                        value={option.value}
                                    />
                                ))}
                            </Picker>
                        </View>
                    );
                }

                return (
                    <TextInput
                        key={field.name}
                        style={styles.input}
                        placeholder={i18n.t(field.label)}
                        value={formState[field.name]?.toString() ?? ''}
                        onChangeText={text => handleChange(field.name, text)}
                    />
                );
            })}

            <Button
                title={isEdit ? i18n.t('update') : i18n.t('create') }
                onPress={handleSubmit}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    input: {
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 6,
        padding: 10,
        marginBottom: 12,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginBottom: 10,
        paddingHorizontal: Platform.OS === 'ios' ? 8 : 0,
        justifyContent: 'center',
        height: 50,
        overflow: 'hidden',
    },
});

export default GenericAddFormScreen;