import { MasterModelConfig } from '@/constant/MasterModelConfig';
import i18n from '@/Services/i18n';
import { useActionSheet } from '@expo/react-native-action-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    I18nManager,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const PAGE_SIZE = 10;

const GenericMasterListScreen = ({ route }: any) => { 
   const [isArabic, setIsArabic] = useState(false);

    const model = route.params?.model;
    const config = MasterModelConfig[model];

    if (!config) {
        return (
            <View style={styles.centered}>
                <Text> {i18n.t('unknownmodel_')}  {model}</Text>
            </View>
        );
    }

    useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('appLanguage');
        const lang = storedLanguage || 'en'; 
        setIsArabic(lang === 'ar');
      } catch (error) {
        console.log('Error fetching language:', error);
      }
    };

    fetchLanguage();
  }, []);
     
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const { showActionSheetWithOptions } = useActionSheet();

    const [dataList, setDataList] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');


    const fetchData = async (reset = false) => {
        if (loading) return;
        try {
            reset ? setRefreshing(true) : setLoading(true);
            const currentPage = reset ? 1 : page;

            const res = await axios.get(config.api.list, {
                params: {
                    page: currentPage,
                    limit: PAGE_SIZE,
                    search: searchQuery,
                },
            });

            const newData = res.data.data || res.data;
            const total = res.data.total || 1000;

            if (reset) {
                setDataList(newData);
                setPage(2);
            } else {
                setDataList(prev => [...prev, ...newData]);
                setPage(currentPage + 1);
            }

            const newHasMore = (reset ? newData.length : dataList.length + newData.length) < total;
            setHasMore(newHasMore);
        } catch (error) {
            Alert.alert(i18n.t('error'), i18n.t('failedtoloaddata'));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        setHasMore(true);
        fetchData(true);
    };

    useLayoutEffect(() => {
        if (model) {
            const title = i18n.t(config.mastertitle);
            navigation.setOptions({ title });
        }
    }, [navigation, model]);

    useEffect(() => {
        if (isFocused) {
            onRefresh();
        }
    }, [isFocused]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            onRefresh();
        }, 500);
        return () => clearTimeout(debounce);
    }, [searchQuery]);



    const handleEndReached = () => {
        if (!loading && hasMore && dataList.length > 0) {
            fetchData();
        }
    };

    const handleItemPress = (item: any) => {
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

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
                title: `${i18n.t('actionsfor')}  ${item[config.titleField]}`,
            },
            selectedIndex => {
                if (actions[selectedIndex]) {
                    actions[selectedIndex]();
                }
            }
        );
    };

    const confirmDelete = (id: number) => {
        Alert.alert(i18n.t('confirmdelete'), i18n.t('aresurewantdeleteitem'), [
            { text: i18n.t('cancel'), style: 'cancel' },
            {
                text: i18n.t('ok'),
                onPress: async () => {
                    try {
                        await axios.get(config.api.delete, { params: { optionid: id } });
                        onRefresh();
                    } catch (error) {
                        Alert.alert(i18n.t('error'), i18n.t('failedtodeleteitem'));
                    }
                },
            },
        ]);
    };

    const activate = async (id: number) => {
        try {
            await axios.get(config.api.activate, { params: { optionid: id } });
            onRefresh();
        } catch (err) {
            Alert.alert(i18n.t('error'), i18n.t('failedtoactivate'));
        }
    };

    const deactivate = async (id: number) => {
        try {
            await axios.get(config.api.deactivate, { params: { optionid: id } });
            onRefresh();
        } catch (err) {
            Alert.alert(i18n.t('error'), i18n.t('failedtodeactivate'));
        }
    };

    const renderItem = ({ item }: any) => (
        // <Text style={styles.title}>{item[config.titleField]}</Text>
        // <Text key={field}>
        //     {i18n.t(label)}: {value}
        // </Text>
        <TouchableOpacity onPress={() => handleItemPress(item)}>
            <View style={styles.card} >
                {config.displayFields.map(field => {
                    const label = config.displayLabels?.[field] || field;
                    const value =
                        field === 'status'
                            ? item[field] === 1
                                ? i18n.t('active')
                                : i18n.t('inactive')
                            : item[field];

                    return (
                        <View key={field} style={styles.row}>
                            <Text style={styles.label}>{i18n.t(label)}</Text>
                            <Text style={styles.value}>{value}</Text>
                        </View>
                    );
                })}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1 }}>
            <TextInput
                style={styles.searchInput}
                placeholder={`${i18n.t('search')}  ${i18n.t(config.mastertitle)}...`}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <FlatList
                data={dataList}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={renderItem}
                refreshing={refreshing}
                onRefresh={onRefresh}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    loading && !refreshing ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null
                }
                ListEmptyComponent={
                    !loading && !refreshing ? (
                        <View style={styles.centered}>
                            <Text>No items found.</Text>
                        </View>
                    ) : null
                }
            />
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('masterform', { model: config.formRoute, mode: 'create' })}
            >
                <Text style={styles.fabIcon}>＋</Text>
            </TouchableOpacity>
        </View>
    );


};

const styles = StyleSheet.create({
    itemContainer: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 8,
        marginBottom: 12,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    searchInput: {
        margin: 16,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#2196F3',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fabIcon: {
        color: 'white',
        fontSize: 24,
        lineHeight: 28,
    },
    centered: {
        padding: 20,
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
        marginVertical: 8,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    row: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        marginVertical: 4,
        flexWrap: 'wrap',
    },
    label: {
        fontWeight: 'bold',
        color: '#333',
        fontSize: 15,
        marginHorizontal: 6,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    value: {
        color: '#555',
        fontSize: 15,
        flexShrink: 1,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
});

export default GenericMasterListScreen;