import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { dashboard_api } from '@/constant/DXBConstant';
import i18n from '@/Services/i18n';
const { width } = Dimensions.get('window');

const CARD_WIDTH = (width - 45) / 2; 

const DashboardScreen = () => {
  const [stats, setStats] = useState({
    countweekpolicy: '',
    countmonthpolicy: '',
    countyearpolicy: '',
    countmonthplotnum: '',
    countyearplotnum: '',
    totalmonthfees: '',
    totalyearfees: '',
  });

  const [refreshing, setRefreshing] = useState(false);
 
  // Function to fetch data
  const fetchStats = async () => {
    try {
      const response = await fetch(dashboard_api);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStats().finally(() => setRefreshing(false));
  }, []);


   const statistics = [
    { label: i18n.t('weeklypolicies_'), value: stats.countweekpolicy },
    { label: i18n.t('monthlypolicies_'), value: stats.countmonthpolicy },
    { label: i18n.t('yearlypolicies_'), value: stats.countyearpolicy },
    { label: i18n.t('monthlyplotnumbers_'), value: stats.countmonthplotnum },
    { label: i18n.t('yearlyplotnumbers_'), value: stats.countyearplotnum },
    { label: i18n.t('totalmonthlyfees_'), value: stats.totalmonthfees },
    { label: i18n.t('totalyearlyfees_'), value: stats.totalyearfees },
  ];

  // تجميع البطاقات في صفوف (2 بطاقة لكل صف)
  const rows = [];
  for (let i = 0; i < statistics.length; i += 2) {
    rows.push(statistics.slice(i, i + 2));
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3399FF" />
      }
    >
      <Text style={styles.title}>{i18n.t('policystatistics')}</Text>

      {rows.map((row, rowIndex) => (
        <View style={styles.row} key={rowIndex}>
          {row.map((item, index) => (
            <View style={styles.card} key={index}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          ))}
          {row.length === 1 && <View style={{ width: CARD_WIDTH }} />} 
          {/* لإبقاء توازن الصف إذا كانت البطاقة الأخيرة مفردة */}
        </View>
      ))}
    </ScrollView>
  );
     
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // خلفية بيضاء
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000', // أزرق خفيف
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#f9f9f9', // خلفية فاتحة للبطاقة
    borderRadius: 12,
    padding: 20,
    width: CARD_WIDTH,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#000', // لمسة أزرق
    fontWeight: '600',
    marginBottom: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
export default DashboardScreen;


