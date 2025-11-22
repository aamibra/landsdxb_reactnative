import BaseListScreen from '@/components/BaseListScreen';
import RTLText from '@/components/RTLText';
import FlatListStyles from '@/constant/LandsDxbStyle';
import { MasterModelConfig } from '@/constant/MasterModelConfig';
import api from '@/Services/axiosInstance';
import i18n from '@/Services/i18n';
import React, { useLayoutEffect, useRef } from 'react';
import {
    Alert,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';



const GenericMasterListScreen = ({ navigation, route }: any) => {
    const listRef = useRef(null);


    const model = route.params?.model;
    const config = MasterModelConfig[model];

    if (!config) {
        return (
            <View style={FlatListStyles.centered}>
                <RTLText> {i18n.t('unknownmodel_')}  {model}</RTLText>
            </View>
        );
    }


    useLayoutEffect(() => {
        if (model) {
            const title = i18n.t(config.mastertitle);
            navigation.setOptions({ title });
        }
    }, [navigation, model]);



    const confirmDelete = (id: number) => {
        Alert.alert(i18n.t('confirmdelete'), i18n.t('aresurewantdeleteitem'), [
            { text: i18n.t('cancel'), style: 'cancel' },
            {
                text: i18n.t('ok'),
                onPress: async () => {
                    try {
                        await api.get(config.api.delete, { params: { optionid: id } });
                        listRef.current?.refresh();
                    } catch (error) {
                        Toast.show({ type: 'error', text1: i18n.t('error'), text2: i18n.t('failedtodeleteitem'), position: 'bottom' });
                    }
                },
            },
        ]);
    };

    const activate = async (id: number) => {
        try {
            await api.get(config.api.activate, { params: { optionid: id } });
            listRef.current?.refresh();
        } catch (err) {
            Toast.show({ type: 'error', text1: i18n.t('error'), text2: i18n.t('failedtoactivate'), position: 'bottom' });
        }
    };

    const deactivate = async (id: number) => {
        try {
            await api.get(config.api.deactivate, { params: { optionid: id } });
            listRef.current?.refresh();
        } catch (err) {
            Toast.show({ type: 'error', text1: i18n.t('error'), text2: i18n.t('failedtodeactivate'), position: 'bottom' });
        }
    };


    return (
        <BaseListScreen
            ref={listRef}
            fetchData={async (page, search) => {
                const res = await api.get(config.api.list, {
                    params: { page, limit: 20, search },
                });

                return {
                    data: res.data.data,
                    total: res.data.total
                };
            }}

            renderItemCard={(item) => (
                <View style={FlatListStyles.itemCard}>
                    {config.displayFields.map(field => {
                        const label = config.displayLabels?.[field] || field;
                        const value = field === 'status' ? item[field] === 1 ? i18n.t('enabled') : i18n.t('inactive') : item[field];
                        const statestyle = field === 'status' ? [FlatListStyles.value, item.islocked ? FlatListStyles.inactive : FlatListStyles.active] : FlatListStyles.value;

                        return (
                            <View key={field} style={FlatListStyles.row}>
                                <RTLText style={FlatListStyles.label}>{i18n.t(label)}</RTLText>
                                <RTLText style={statestyle}>{value}</RTLText>
                            </View>
                        );
                    })}
                </View>
            )}

            /* ActionSheet عند الضغط على عنصر */
            actionSheetOptions={(item) => {
                const options = [i18n.t('edit')];
                const actions: any = {
                    0: () => navigation.navigate('masterform', { model: config.formRoute, mode: 'edit', data: item })
                };

                let actionIndex = 1;

                // Safely check if core is not true
                const isCore = item.core === true || item.core === 1 || item.core === 'true';

                if (!isCore) {
                    options.push(i18n.t('delete'));
                    actions[actionIndex++] = () => confirmDelete(item.id);
                }

                if (config.hasStatus !== false && config.api.activate && config.api.deactivate) {
                    const isLocked = item.status !== 1;
                    options.push(isLocked ? i18n.t('active') : i18n.t('deactivate'));
                    actions[actionIndex++] = () => (isLocked ? activate(item.id) : deactivate(item.id));
                }

                options.push(i18n.t('cancel'));
                const cancelButtonIndex = options.length - 1;

                return ({
                    title: `${i18n.t('actionsfor')}  ${item[config.titleField]}`,
                    options: options,
                    cancelIndex: cancelButtonIndex,
                    onSelect: async (selectedIndex: any) => {
                        if (actions[selectedIndex]) {
                            actions[selectedIndex]();
                        }
                    }
                });
            }}

            /* ActionSheet زر الإضافة */
            onAddPress={() => { navigation.navigate('masterform', { model: config.formRoute, mode: 'create' }) }}
        />
    );


};



export default GenericMasterListScreen;