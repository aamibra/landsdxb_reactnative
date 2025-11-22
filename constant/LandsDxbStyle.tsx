import { I18nManager, Platform, StyleSheet } from 'react-native';

const FlatListStyles = StyleSheet.create({
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
        textAlign: I18nManager.isRTL ? "right" : "left",
    },
    listContainer: {
        paddingBottom: 80,
        // direction: I18nManager.isRTL ? 'rtl' : 'ltr'
    },
    itemCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        marginVertical: 10,
        elevation: 3,

        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },

        ...(Platform.OS === 'android'
            ? {
                borderStartWidth: 5,
                borderStartColor: '#007AFF',
            }
            : {
                borderRightWidth: I18nManager.isRTL ? 5 : 0,
                borderLeftWidth: I18nManager.isRTL ? 0 : 5,
                borderColor: '#007AFF',
            }),
    },
    itemTitle: {

        fontSize: 16,
        fontWeight: '700',
        color: '#222',
        marginBottom: 10,
        // alignItems: 'flex-start',
    },
    labelDirection: {
        flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 6,
    },
    label: {
        width: '32%',
        fontSize: 13,
        color: '#444',
        fontWeight: '600',
    },
    value: {
        width: '68%',
        fontSize: 13,
        color: '#111',
        flexShrink: 1,
        lineHeight: 18,
    },
    numberValue: {
        width: '68%',
        fontSize: 13,
        color: '#111',
        flexShrink: 1,
        textAlign: 'left',
        writingDirection: 'ltr',
        unicodeBidi: 'plaintext',
    },
    centered: {
        padding: 20,
        alignItems: 'center',
    },
    userImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 10,
        alignSelf: 'center', // لجعلها وسط العنصر
        backgroundColor: '#eee',
    },
    active: {
        color: 'green',
        fontWeight: '700',
    },
    inactive: {
        color: 'red',
        fontWeight: '700',
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

export default FlatListStyles;