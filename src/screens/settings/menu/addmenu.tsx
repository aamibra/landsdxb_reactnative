import { creatmenu_api, getmenu_api, getrole_api, updatemenu_api } from '@/constant/DXBConstant';
import i18n from '@/Services/i18n';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { MultiSelect } from 'react-native-element-dropdown';
import ParentMenuPicker from './ParentMenuPicker';

const AddMenuScreen = ({ navigation, route }: any) => {
    const isEdit = route.params?.mode === 'edit';
    const menuid = route.params?.menuid;

    const [loading, setLoading] = useState(true);
    // const [parentMenus, setParentMenus] = useState<any[]>([]);

    // States
    const [parentid, setParentId] = useState('');
    const [parentname, setParentName] = useState('');
    const [order, setOrder] = useState('');
    const [englishName, setEnglishName] = useState('');
    const [arabicName, setArabicName] = useState('');
    const [url, setUrl] = useState('');
    const [icon, setIcon] = useState('');
    const [status, setStatus] = useState(1);
    const [openStatus, setOpenStatus] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState('');
    const [roleOptions, setRoleOptions] = useState('');
    const [statusItems, setStatusItems] = useState([
        { label: i18n.t('selectstatus'), value: null },
        { label: i18n.t('active'), value: 1 },
        { label: i18n.t('inactive'), value: 2 },
    ]);



    // Fetch data on load if edit mode
    useEffect(() => {
        const titlepage = isEdit ? i18n.t('updatemenu') : i18n.t('creatmenu');
        navigation.setOptions({ title: titlepage });

        const loadData = async () => {
            try {
                if (isEdit && menuid) {
                    const res = await axios.get(getmenu_api, {
                        params: {
                            menuid: menuid,
                        },
                    });

                    const data = res.data;
                    setParentId(data.parentid?.toString() || '');
                    setParentName(data.parentname || '');
                    setOrder(data.order?.toString() || '');
                    setEnglishName(data.enname || '');
                    setArabicName(data.arname || '');
                    setUrl(data.url || '');
                    setIcon(data.icon || '');
                    setStatus(data.status || 1);
                    setSelectedRoles(data.roles || '');
                }
            } catch (error) {
                console.error('Error loading menu:', error);
                Alert.alert(i18n.t('error'), i18n.t('failedtoloaddata'));
            } finally {
                setLoading(false);
            }
        };


        loadData();
    }, [isEdit, menuid, navigation]);


    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch(getrole_api);
                const data = await response.json();

                if (Array.isArray(data) && data.length > 0 && data.every(item => item.label && item.value)) {
                    // Valid array and items have expected shape
                    setRoleOptions(data);
                } else {
                    console.warn("Invalid or unexpected data from server:", data);
                    setRoleOptions([]); // fallback to empty array
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
                setRoleOptions([]); // Fallback to empty array on error
            }
        };

        fetchRoles();
    }, []);




    const handleSubmit = async () => {
        if (!englishName || !arabicName || !order || !selectedRoles || !status) {
            Alert.alert(i18n.t('validation'), i18n.t('pleasefillallfields'));
            return;
        }

        const menuData = {
            id: isEdit ? menuid : undefined,
            parentid: parentid ? parseInt(parentid) : null,
            order: parseInt(order),
            enname: englishName,
            arname: arabicName,
            url: url || "",
            icon: icon || "",
            statusid: status,
            roles: selectedRoles || []
        };

        const endpoint = isEdit
            ? updatemenu_api
            : creatmenu_api;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([menuData]),
            });

            const data = await response.json();

            if (response.ok) {
                navigation.goBack();
            } else {
                console.log('Server response:', data);

                let errorMessages = i18n.t('unknownerror');

                if (data.Errors) {
                    errorMessages = data.Errors.join('\n');
                } else if (data.Message) {
                    errorMessages = data.Message;
                } else if (typeof data === 'string') {
                    errorMessages = data;
                } else {
                    errorMessages = JSON.stringify(data, null, 2);
                }

                Alert.alert(i18n.t('validationerrors'), errorMessages);
            }
        } catch (error) {
            console.error(i18n.t('errorsubmittingmenu_'), error);
            Alert.alert(i18n.t('error'), i18n.t('somethingwentwrongwhilesubmittingthemenu'));
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={80} // Adjust based on header height if needed
        >
            <ScrollView contentContainerStyle={{ ...styles.container, flexGrow: 1 }} keyboardShouldPersistTaps="handled" nestedScrollEnabled>
                <TextInput
                    style={styles.input}
                    placeholder={i18n.t('englishname')}
                    value={englishName}
                    onChangeText={setEnglishName}
                />
                <TextInput
                    style={styles.input}
                    placeholder={i18n.t('arabicname')}
                    value={arabicName}
                    onChangeText={setArabicName}
                />
                <TextInput
                    style={styles.input}
                    placeholder={i18n.t('order')}
                    value={order}
                    onChangeText={setOrder}
                    keyboardType="numeric"
                />
                <View >
                    <ParentMenuPicker
                        value={parentid}
                        selectedLabel={parentname}
                        onChange={(id, label) => {
                            setParentId(id);
                            setParentName(label);
                        }}
                    />
                </View>
                <TextInput
                    style={styles.input}
                    placeholder={i18n.t('url')}
                    value={url}
                    onChangeText={setUrl}
                />
                <TextInput
                    style={styles.input}
                    placeholder={i18n.t('icon')}
                    value={icon}
                    onChangeText={setIcon}
                />
                <MultiSelect
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={Array.isArray(roleOptions) ? roleOptions : []} // ✅ Always pass an array
                    labelField="label"
                    valueField="value"
                    placeholder={i18n.t('selectroles')}
                    search
                    searchPlaceholder={i18n.t('searchroles_')}
                    value={selectedRoles}
                    onChange={item => {
                        setSelectedRoles(item);
                    }}
                    selectedStyle={styles.selectedStyle}
                />
                <View style={styles.pickerContainer}>
                    <DropDownPicker
                        listMode="SCROLLVIEW"
                        open={openStatus}
                        value={status}
                        items={statusItems}
                        setOpen={setOpenStatus}
                        setValue={setStatus}
                        setItems={setStatusItems}
                        placeholder={i18n.t('selectstatus')}
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        placeholderStyle={styles.placeholderStyle}
                        labelStyle={styles.labelStyle}
                        arrowIconStyle={styles.arrowIcon}
                    />

                </View>
                <Button title={isEdit ? i18n.t('updatemenu') : i18n.t('savemenu')} onPress={handleSubmit} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 12,
        borderRadius: 5,
    },
    pickerContainer: {
        marginTop: 10,
        zIndex: 10,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    placeholderStyle: {
        fontSize: 16,
        color: '#999',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#000',
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    selectedStyle: {
        borderRadius: 12,
    },
    dropdownContainer: {
        borderColor: '#ccc',
        borderRadius: 8,
    },

    labelStyle: {
        color: '#333',
        fontSize: 14,
    },
    arrowIcon: {
        tintColor: '#555', // لون سهم القائمة
    },
});

export default AddMenuScreen;

