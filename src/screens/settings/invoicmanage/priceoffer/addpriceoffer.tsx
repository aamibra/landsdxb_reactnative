import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

// API endpoints
import { creatofferprice_api, getevaluationtype_api, getofferprice_api, getpolicytype_api, updateofferprice_api } from '@/constant/DXBConstant';
import api from "@/Services/axiosInstance";
import i18n from "@/Services/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";


interface Valuation {
  id: number;
  text: string;
  name_en: string;
  name_ar: string;
}

interface Invoice {
  id: number;
  policyType: string | null;
  valuations: Valuation[];
  valuation: Valuation | null;
  price: number;
  qty: number;
}

export default function AddPriceOfferScreen({ navigation, route }: any) {

  const [offerId, setOfferId] = useState(null);
  const [policyTypes, setPolicyTypes] = useState([{ id: 0, text: '', name_en: '', name_ar: '' }]);
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 1,
      policyType: null,
      valuations: [{ id: 0, text: '', name_en: '', name_ar: '' }],
      valuation: null,
      price: 0,
      qty: 1,
    },
  ]);
  // User form fields 
  const [applicantTRN, setApplicantTRN] = useState("");
  const [quotationDate, setQuotationDate] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantMobile, setApplicantMobile] = useState("");
  const [address, setAddress] = useState("");
 
  const [isArabic, setIsArabic] = useState(false);
  const [switchLanguage, setSwitchLanguage] = useState('ar'); // opposite by default


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


  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t('addpriceoffer'),
    });
  }, [navigation, i18n.language]);

  useEffect(() => {
    const idFromParams = route.params?.offerid;
    if (idFromParams) {
      setOfferId(idFromParams);
      fetchQuotation(idFromParams);
    }

    fetchPolicyTypes();

  }, []);

  const fetchPolicyTypes = async () => {
    try {
      const res = await api.get(getpolicytype_api);
      setPolicyTypes(res.data);
    } catch (error) {
      console.error("Error fetching policy types:", error);
    }
  };

  const fetchValuations = async (formid) => {
    try {
      const res = await api.get(getevaluationtype_api, { params: { formid: formid } });
      return res.data;
    } catch (error) {
      console.error("Error fetching evaluation types:", error);
      return [];
    }
  };

  const fetchQuotation = async (id) => {
    try {
      const res = await axios.get(getofferprice_api, {
        params: { quotid: id }
      });

      const data = res.data;

      setApplicantName(data.applicantname);
      setApplicantEmail(data.email);
      setApplicantMobile(data.mobile);
      setAddress(data.address);
      setApplicantTRN(data.applicanttrn);
      setQuotationDate(data.quotationdate); // تأكد من التنسيق

      let invoiceIdCounter = 1;

      // تحويل quotItems إلى نفس شكل الفواتير في الواجهة
      const mappedInvoices = await Promise.all(data.quotItems.map(async (item, index) => {
        const valuations = await fetchValuations(item.policytypeid);

        return {
          id: `invoice_${invoiceIdCounter++}` + Date.now() + index,
          policyType: item.policytypeid,
          valuations: valuations,
          valuation: item.typeofvaluatid,
          price: parseFloat(item.typeofvaluatItems?.[0]?.price || "0"),
          qty: item.quantity,
        };
      }));

      setInvoices(mappedInvoices);
    } catch (error) {
      console.error("خطأ في تحميل عرض السعر:", error);
      Alert.alert(i18n.t('error'), i18n.t('failedtoloadserverdata'));
    }
  };


  const addInvoice = () => {
    if (invoices.length >= 10) {
      Alert.alert(i18n.t('alert'), i18n.t('cannotaddmorethan10invoices'));
      return;
    }
    setInvoices([
      ...invoices,
      {
        id: Date.now(),
        policyType: null,
        valuations: [],
        valuation: null,
        price: 0,
        qty: 1,
      },
    ]);
  };

  const removeInvoice = (id) => {
    setInvoices(invoices.filter((item) => item.id !== id));
  };

  const updatePolicyType = async (id, policyId) => {
    const valuations = await fetchValuations(policyId);
    setInvoices((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
            ...item,
            policyType: policyId,
            valuations: valuations,
            valuation: null,
            price: 0,
          }
          : item
      )
    );
  };

  const updateValuation = (id, valuationId) => {
    setInvoices((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const val = item.valuations.find((v) => v.id === valuationId);
          return { ...item, valuation: valuationId, price: parseFloat(val?.price || 0) };
        }
        return item;
      })
    );
  };

  const updateQty = (id, qty) => {
    setInvoices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: parseInt(qty) || 1 } : item))
    );
  };

  const totalAll = invoices.reduce((sum, item) => sum + item.price * item.qty, 0);

  const submitData = async () => {
    if (!applicantName || !quotationDate) {
      Alert.alert(i18n.t('error'), i18n.t('pleasefillallfields'));
      return;
    }

    const quotItems = invoices.map((item) => {
      const valuationObj = item.valuations?.find((v) => v.id === item.valuation);

      return {
        policytypeid: item.policyType,
        typeofvaluatid: item.valuation,
        quantity: item.qty,
        typeofvaluatItems: [
          {
            id: item.valuation,
            text: valuationObj ? (isArabic ? valuationObj.name_ar : valuationObj.name_en) : '',
            price: item.price.toString(),
          },
        ],
      };
    });

    const payload = {
      applicantname: applicantName,
      mobile: applicantMobile,
      email: applicantEmail,
      address: address,
      applicanttrn: applicantTRN,
      quotationdate: quotationDate, // "yyyy-MM-dd"
      quotItems: quotItems,
    };


    if (offerId) {
      payload.offerid = offerId; // التعديل
    }

    const url = offerId
      ? updateofferprice_api
      : creatofferprice_api;

    try {
      const res = await axios.post(url, payload);
      if (res.status === 200) {
        navigation.goBack();

      } else {
        Alert.alert(i18n.t('error'), i18n.t('failedtosavedata'));
      }
    } catch (error) {
      console.error(error);
      Alert.alert(i18n.t('error'), i18n.t('failedtoconnectserver'));
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* بيانات المستخدم */}
      <Text style={styles.title}> {i18n.t('clientdata')} </Text>

      <Text style={styles.label}>{i18n.t('applicanttrn')} </Text>
      <TextInput style={styles.input} value={applicantTRN} onChangeText={setApplicantTRN} placeholder={i18n.t('applicanttrn')} />

      <Text style={styles.label}>{i18n.t('quotationdate')} </Text>
      <TextInput style={styles.input} value={quotationDate} onChangeText={setQuotationDate} placeholder={i18n.t('dateformat')} />

      <Text style={styles.label}>{i18n.t('applicantname')}</Text>
      <TextInput style={styles.input} value={applicantName} onChangeText={setApplicantName} placeholder={i18n.t('applicantname')} />

      <Text style={styles.label}>{i18n.t('applicantemail')}</Text>
      <TextInput style={styles.input} value={applicantEmail} onChangeText={setApplicantEmail} keyboardType="email-address" placeholder={i18n.t('applicantemail')} />

      <Text style={styles.label}>{i18n.t('applicantmobile')} </Text>
      <TextInput style={styles.input} value={applicantMobile} onChangeText={setApplicantMobile} keyboardType="phone-pad" placeholder={i18n.t('applicantmobile')} />

      <Text style={styles.label}>{i18n.t('address')}</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        numberOfLines={4}
        value={address}
        onChangeText={setAddress}
        placeholder={i18n.t('address')}
      />

      {/* الفواتير */}
      <Text style={styles.title}>{i18n.t('invoices')}</Text>

      {invoices.map((item) => (
        <View key={item.id} style={styles.card}>
          <TouchableOpacity onPress={() => removeInvoice(item.id)} style={styles.deleteBtn}>
            <Text style={styles.deleteText}>X</Text>
          </TouchableOpacity>

          <Text style={styles.label}>{i18n.t('documenttype')}</Text>
          <Picker
            selectedValue={item.policyType}
            style={styles.picker}
            onValueChange={(value) => updatePolicyType(item.id, value)}
          >
            <Picker.Item label={i18n.t('select')} value={null} />
            {policyTypes.map((pt) => (
              <Picker.Item key={pt.id} label={isArabic ? pt.name_ar : pt.name_en} value={pt.id} />
            ))}
          </Picker>

          <Text style={styles.label}>{i18n.t('valuationtype')}</Text>
          <Picker
            selectedValue={item.valuation}
            style={styles.picker}
            onValueChange={(value) => updateValuation(item.id, value)}
          >
            <Picker.Item label={i18n.t('select')} value={null} />
            {item.valuations.map((v) => (
              <Picker.Item key={v.id} label={isArabic ? v.name_ar : v.name_en} value={v.id} />
            ))}
          </Picker>

          <View style={styles.fieldRow}>
            <Text style={styles.label}>{i18n.t('price')} :</Text>
            <Text style={styles.value}>{item.price}</Text>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.label}>{i18n.t('quantity')} :</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={item.qty.toString()}
              onChangeText={(text) => updateQty(item.id, text)}
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.label}>{i18n.t('total')} :</Text>
            <Text style={styles.value}>{item.price * item.qty}</Text>
          </View>
        </View>
      ))}

      <TouchableOpacity onPress={addInvoice} style={styles.addBtn}>
        <Text style={styles.addBtnText}>{i18n.t('addinvoice')}</Text>
      </TouchableOpacity>

      <Text style={styles.totalLabel}>{i18n.t('grandtotal')} : {totalAll}</Text>

      <TouchableOpacity onPress={submitData} style={[styles.addBtn, { backgroundColor: "green" }]}>
        <Text style={styles.addBtnText}>{i18n.t('savedata')} </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  label: { fontSize: 14, fontWeight: "bold", marginTop: 8, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  picker: {
    height: 50,
    fontSize: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    position: "relative",
  },
  deleteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "red",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  value: {
    marginLeft: 8,
    fontSize: 14,
  },
  addBtn: {
    backgroundColor: "blue",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 16,
  },
  addBtnText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 16,
    textAlign: "center",
  },
});