import React, { useRef, useState } from 'react';
import {
  Button,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PagerView from 'react-native-pager-view';

const FilePreviewModal = ({ visible, files, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef(null);

  if (!files || files.length === 0) return null;

  const renderFile = (file, index) => {
    const type = file.type || '';
    const name = file.name || file.label || '';
    const isImage = type.includes('image') || name.match(/\.(jpg|jpeg|png|gif)$/i);

    return (
      <View key={index.toString()} style={styles.page}>
        {isImage ? (
          <Image source={{ uri: file.uri }} style={styles.image} />
        ) : (
          <Text style={styles.unsupported}>⚠️ نوع الملف غير مدعوم للمعاينة</Text>
        )}
        <Text style={styles.fileName}>{file.label || file.name || 'ملف'}</Text>
      </View>
    );
  };

  const goToPage = (pageIndex) => {
    if (pagerRef.current) {
      pagerRef.current.setPage(pageIndex);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <PagerView
          style={styles.pager}
          initialPage={0}
          orientation="horizontal"
          onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
          ref={pagerRef}
        >
          {files.map((file, index) => renderFile(file, index))}
        </PagerView>

        <View style={styles.pageIndicator}>
          <Text>{`${currentPage + 1} / ${files.length}`}</Text>
        </View>

        <View style={styles.navButtons}>
          <TouchableOpacity
            disabled={currentPage === 0}
            onPress={() => goToPage(currentPage - 1)}
            style={[
              styles.navButton,
              currentPage === 0 && styles.disabledButton,
            ]}
          >
            <Text style={styles.navButtonText}>السابق</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={currentPage === files.length - 1}
            onPress={() => goToPage(currentPage + 1)}
            style={[
              styles.navButton,
              currentPage === files.length - 1 && styles.disabledButton,
            ]}
          >
            <Text style={styles.navButtonText}>التالي</Text>
          </TouchableOpacity>
        </View>

        {/* زر الإغلاق فقط */}
        <View style={styles.buttonsContainer}>
          <Button title="إغلاق" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  pager: { flex: 1 },
  page: { alignItems: 'center', justifyContent: 'center', padding: 20 },
  image: { width: '100%', height: 300, resizeMode: 'contain' },
  unsupported: { fontSize: 16, color: 'red', marginVertical: 20 },
  fileName: { marginTop: 10, fontSize: 16, fontWeight: 'bold' },
  pageIndicator: { alignItems: 'center', paddingVertical: 10 },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  navButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  navButtonText: { color: 'white', fontSize: 16 },
  disabledButton: { backgroundColor: '#ccc' },
  buttonsContainer: { padding: 20 },
});

export default FilePreviewModal;
