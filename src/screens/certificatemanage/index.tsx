import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { policyland_api } from '@/constant/DXBConstant';
import api from '@/Services/axiosInstance';
import i18n from '@/Services/i18n';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';


const PAGE_SIZE = 20;

const CertificateScreen = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const { showActionSheetWithOptions } = useActionSheet();

    const [formList, setFormList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const fetchForms = async (reset = false) => {
        if (loading) return;

        try {
            if (reset) setRefreshing(true);
            else setLoading(true);

            const currentPage = reset ? 1 : page;

            const res = await api.get(`${policyland_api}`, {
                params: {
                    page: currentPage,
                    limit: PAGE_SIZE,
                    search: searchQuery,
                },
            });

            const newData = res.data.data || res.data;
            const total = res.data.total || 1000;

            if (reset) {
                setFormList(newData);
                setPage(2);
            } else {
                setFormList(prev => [...prev, ...newData]);
                setPage(currentPage + 1);
            }

            const newHasMore = (reset ? newData.length : formList.length + newData.length) < total;
            setHasMore(newHasMore);
        } catch (error) {
            // Alert.alert('Error', 'Failed to fetch forms');
            setErrorMessage(i18n.t('failedtofetchpolicies'));
            Toast.show({ type: 'error', text1: i18n.t('error'), text2: i18n.t('failedtofetchpolicies'), position: 'bottom' });

        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };



    const onRefresh = () => {
        setRefreshing(true);
        setHasMore(true);
        fetchForms(true);
    };

    const handleEndReached = () => {
        if (!loading && hasMore && formList.length > 0) {
            fetchForms();
        }
    };

    const handleItemPress = (item: any) => {
        const options = [i18n.t('cancel')];
        const cancelButtonIndex = 2;

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
                title: `${i18n.t('actionsfor')} ${item.policynumber}`,
            },
            async (selectedIndex) => {
                switch (selectedIndex) {
                    case 0:
                        break;
                    default:
                        break;
                }
            }
        );
    };


    const handleFormOption = () => {
        const forms = [
            { id: 1, name: 'Vacant Land' },
            { id: 2, name: 'Building Valuation' },
            { id: 3, name: 'Unit Valuation (Residential)' },
            { id: 4, name: 'Office Valuation' },
            { id: 5, name: 'Shop Valuation' },
            { id: 6, name: 'UnderConst Valuation' },
            { id: 7, name: 'Villa Valuation' },
        ];

        // Create the list of names for the action sheet
        const options = forms.map(f => f.name);
        options.push('Cancel'); // Cancel button label
        const cancelButtonIndex = options.length - 1;

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
                title: "Select your Form",
            },
            (selectedIndex) => {
                if (selectedIndex === cancelButtonIndex) return;

                const selectedForm = forms[selectedIndex]; // Get the full object
                handleFormNavigation(selectedForm.id);     // Use the ID
            }
        );


    };


    const handleFormNavigation = (formtypeid) => {
        switch (formtypeid) {
            case 1:
                navigation.navigate('vacantform');
                break;
            case 2:
                navigation.navigate('buildform');
                break;
            case 3:
                navigation.navigate('unitform');
                break;
            case 4:
                navigation.navigate('officeform');
                break;
            case 5:
                navigation.navigate('shopform');
                break;
            case 6:
                navigation.navigate('underconstform');
                break;
            case 7:
                navigation.navigate('villform');
                break;
            default:
                Alert.alert("تنبيه", "هذا النموذج غير مدعوم حالياً.");
                break;
        }
    };




    useEffect(() => {
        if (isFocused) {
            onRefresh();
        }
    }, [isFocused]);

    useEffect(() => {
        const delay = setTimeout(() => {
            onRefresh();
        }, 500);
        return () => clearTimeout(delay);
    }, [searchQuery]);

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleItemPress(item)} activeOpacity={0.8}>
            <View style={styles.itemCard}>
                {/* رقم الوثيقة */}
                <Text style={styles.itemTitle}>#{item.policynumber}</Text>

                {/* التفاصيل */}
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.t('formtype_')}</Text>
                    <Text style={styles.value}>{item.formtypename}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.t('name_')}</Text>
                    <Text style={styles.value}>{item.applicantname}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.t('mobile_')}</Text>
                    <Text style={styles.value}>{item.applicantmobile}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.t('email_')}</Text>
                    <Text style={styles.value}>{item.applicantemail}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>{i18n.t('createdon_')}</Text>
                    <Text style={styles.value}>{item.createdon}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* ====== مربع البحث ====== */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder={i18n.t('searchpolicies')}
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery ? (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={20} color="#aaa" />
                    </TouchableOpacity>
                ) : null}
            </View>

            {/* ====== قائمة النماذج ====== */}
            <FlatList
                data={formList}
                keyExtractor={(item, index) => `${item.formid}-${index}`}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                refreshing={refreshing}
                onRefresh={onRefresh}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    loading && !refreshing ? (
                        <ActivityIndicator style={{ marginVertical: 20 }} size="small" color="#007AFF" />
                    ) : null
                }
                ListEmptyComponent={
                    !loading && !refreshing ? (
                        errorMessage ? (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{errorMessage}</Text>
                                <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
                                    <Text style={styles.retryButtonText}>{i18n.t('retry')}</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="document-outline" size={48} color="#ccc" />
                                <Text style={styles.emptyText}>{i18n.t('nopoliciesfound')}</Text>
                            </View>
                        )
                    ) : null
                } 
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#007AFF']}     // Android
                        tintColor={'#007AFF'}    // iOS
                        progressBackgroundColor="#fff"
                    />
                } 
            />

        </View>
    );
};

const styles = StyleSheet.create({
    /*** الصفحة الأساسية ***/
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 15,
    },

    /*** شريط البحث ***/
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginVertical: 10,
        borderRadius: 12,
        paddingHorizontal: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    searchIcon: {
        marginRight: 6,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 8,
        fontSize: 15,
        color: '#333',
    },

    /*** قائمة البطاقات ***/
    listContainer: {
        paddingBottom: 80,
    },
    itemCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginVertical: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#222',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
    },
    label: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    value: {
        fontSize: 13,
        color: '#111',
        flexShrink: 1,
        textAlign: 'right',
    },

    /*** حالة فارغة ***/
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        marginTop: 10,
        fontSize: 15,
        color: '#999',
    },

    /*** زر عائم (Floating Action Button) ***/
    fab: {
        position: 'absolute',
        bottom: 25,
        right: 25,
        backgroundColor: '#007AFF',
        width: 55,
        height: 55,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
    },
    errorContainer: {
        backgroundColor: '#fdecea',
        borderRadius: 6,
        padding: 12,
        marginHorizontal: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#f5c2c0',
        alignItems: 'center',
    },
    errorText: {
        color: '#b71c1c',
        textAlign: 'center',
        fontSize: 14,
        marginBottom: 6,
    },
    retryButton: {
        backgroundColor: '#b71c1c',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 4,
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});


export default CertificateScreen;