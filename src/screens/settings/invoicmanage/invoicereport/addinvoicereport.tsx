import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import PolicyPicker from "./policypicker"; // عدّل المسار حسب مكان الملف

import { creatreportinvoice_api, getinvoicepolicy_api, getreportinvoice_api, updatereportinvoice_api } from "@/constant/DXBConstant";
import i18n from "@/Services/i18n";

const getPolicyDetailsApi = (policyId) =>
  getinvoicepolicy_api + `?policyid=${policyId}`;


const getReportInvoiceApi = (reportid) =>
  getreportinvoice_api + `?reportid=${reportid}`;

const applyMask = (setter, text, mask) => {
  // simple mask logic
  let masked = text.replace(/\D/g, ''); // remove non-digits
  // apply mask like (999) 999-9999
  if (masked.length > 3) masked = `(${masked.slice(0,3)}) ${masked.slice(3)}`;
  if (masked.length > 9) masked = `${masked.slice(0,9)}-${masked.slice(9,13)}`;
  setter(masked);
};



export default function AddInvoiceReportScreen({ navigation, route }: any) {


  const [reportId, setReportId] = useState(null);
  // بيانات المستخدم
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantMobile, setApplicantMobile] = useState("");
  const [applicantAddress, setApplicantAddress] = useState("");

  // الصفوف الخاصة بالوثائق
  const [rows, setRows] = useState([
    { policyId: null, policyLabel: "", details: null, loading: false },
  ]);


  useLayoutEffect(() => {
    navigation.setOptions({
      title: i18n.t('addinvoicereport'),
    });
  }, [navigation, i18n.language]);


  useEffect(() => {

    rows.forEach((row, index) => {
      if (row.policyId) {
        fetchPolicyDetails(row.policyId, index);
      } else {
        updateRow(index, { details: null });
      }
    });
  }, [rows.map((r) => r.policyId).join()]);


  useEffect(() => {
    const idFromParams = route.params?.reportid;

    if (idFromParams) {
      setReportId(idFromParams);
      fetchReportData(idFromParams);
    }
  }, []);

  const fetchPolicyDetails = async (policyId, rowIndex) => {
    updateRow(rowIndex, { loading: true });
    try {
      const response = await fetch(getPolicyDetailsApi(policyId));
      if (!response.ok) throw new Error(i18n.t('errfetchpolicydata'));
      const data = await response.json();
      updateRow(rowIndex, { details: data, loading: false });
    } catch (error) {
      console.error(error);
      updateRow(rowIndex, { details: null, loading: false });
    }
  };

  // 📡 دالة جلب بيانات التقرير
  const fetchReportData = async (id) => {
    try {
      const res = await fetch(getReportInvoiceApi(id)); // تأكد أن getReportInvoiceApi(id) يرجع URL صحيح
      if (!res.ok) throw new Error(i18n.t('failedtoloadreport'));

      const data = await res.json();

      // تعبئة بيانات العميل
      setApplicantName(data.applicantname || "");
      setApplicantEmail(data.email || "");
      setApplicantMobile(data.mobile || "");
      setApplicantAddress(data.address || "");

      // تحقق من وجود invoiceItems قبل map
      if (Array.isArray(data.invoiceItems) && data.invoiceItems.length > 0) {
        let counter = 1;
        const mappedRows = data.invoiceItems.map((item) => ({
          id: `row_${counter++}`,
          policyId: item.policyid,
          policyLabel: item.policyItem?.policytype || "",
          details: item.policyItem || null,
          loading: false,
        }));

        setRows(mappedRows);
      } else {
        // إذا ما فيه فواتير، نرجع صف واحد فارغ
        setRows([{ id: "row_1", policyId: null, policyLabel: "", details: null, loading: false }]);
      }

    } catch (error) {
      console.error(i18n.t('failedtoloadreport'), error);
      Alert.alert(i18n.t('error'), i18n.t('failedtoloadserverdata'));
    }
  };



  const updateRow = (index, newData) => {
    setRows((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...newData };
      return copy;
    });
  };

  const onPolicyChange = (index, id, label) => {
    updateRow(index, { policyId: id, policyLabel: label });
  };

  const addRow = () => {
    setRows([...rows, { policyId: null, policyLabel: "", details: null, loading: false }]);
  };

  const removeRow = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    // التحقق من تعبئة البيانات الأساسية
    if (!applicantName || !applicantEmail || !applicantMobile || !applicantAddress) {
      Alert.alert(i18n.t('error'), i18n.t('fillallapplicantdata'));
      return;
    }

    // التحقق من وجود وثيقة واحدة على الأقل
    const filledPolicies = rows.filter((row) => row.policyId && row.details);
    if (filledPolicies.length === 0) {
      Alert.alert(i18n.t('error'), i18n.t('selectatleastonepolicy'));
      return;
    }

    // تحديد هل الوضع تعديل أو إضافة جديدة
    const isEditMode = !!reportId;

    // إنشاء الـ payload بناءً على الوضع
    const payload = isEditMode
      ? {
        // ✅ وضع التعديل
        reportid: reportId,
        applicantname: applicantName,
        mobile: applicantMobile,
        email: applicantEmail,
        address: applicantAddress,
        invoiceItems: filledPolicies.map((row) => ({
          policyid: row.policyId,
        })),
      }
      : {
        // ✅ وضع الإضافة
        applicantname: applicantName,
        mobile: applicantMobile,
        email: applicantEmail,
        address: applicantAddress,
        invoiceItems: filledPolicies.map((row) => ({
          policyid: row.policyId,
          policyItem: {
            policyid: row.details.policyid,
            policynumber: row.details.policynumber,
            policytypeid: row.details.policytypeid,
            policytype: row.details.policytype,
            evaluationtypeid: row.details.evaluationtypeid,
            evaluationtype: row.details.evaluationtype,
            price: row.details.price,
            applicantmobile: row.details.applicantmobile,
          },
        })),
      };

    const apiUrl = isEditMode ? updatereportinvoice_api : creatreportinvoice_api;

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
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
    <ScrollView contentContainerStyle={styles.container}>
      {/* معلومات المستخدم */}
      <View style={styles.userInfoBox}>
        <Text style={styles.title}>{i18n.t('applicantinfo')} </Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{i18n.t('applicantname')} </Text>
          <TextInput
            style={styles.input}
            value={applicantName}
            onChangeText={setApplicantName}
            placeholder={i18n.t('applicantname')}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{i18n.t('email')} </Text>
          <TextInput
            style={styles.input}
            value={applicantEmail}
            onChangeText={setApplicantEmail}
            placeholder={i18n.t('email')}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{i18n.t('mobile')}</Text>
          <TextInput
            style={styles.input}
            value={applicantMobile}
            onChangeText={(text) => applyMask(setApplicantMobile, text, '(999) 999-9999')} 
            placeholder={i18n.t('mobile')} 
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{i18n.t('address')}</Text>
          <TextInput
            style={[styles.input, { height: 60 }]}
            value={applicantAddress}
            onChangeText={setApplicantAddress}
            placeholder={i18n.t('address')}
            multiline
          />
        </View>
      </View>

      {/* قائمة البطاقات */}
      {rows.map((row, i) => (
        <View key={i} style={styles.card}>
          <PolicyPicker
            value={row.policyId || ""}
            selectedLabel={row.policyLabel}
            onChange={(id, label) => onPolicyChange(i, id, label)}
          />

          {row.loading && <ActivityIndicator size="small" color="#000" style={{ marginTop: 10 }} />}
          {row.details && (
            <View style={styles.detailsBox}>
              <Text>
                <Text style={styles.bold}>{i18n.t('documenttype')} :</Text> {row.details.policytype}
              </Text>
              <Text>
                <Text style={styles.bold}> {i18n.t('valuationtype')} :</Text> {row.details.evaluationtype}
              </Text>
              <Text>
                <Text style={styles.bold}> {i18n.t('price')} :</Text> {row.details.price}
              </Text>
              <Text>
                <Text style={styles.bold}> {i18n.t('mobile_')} </Text> {row.details.applicantmobile}
              </Text>
            </View>
          )}

          <TouchableOpacity onPress={() => removeRow(i)} style={styles.removeButton}>
            <Text style={{ color: "red", fontWeight: "bold", fontSize: 18 }}>✖</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity onPress={addRow} style={styles.addBtn} >
        <Text style={styles.addBtnText}  > {i18n.t('addnewpolicy')}</Text>
      </TouchableOpacity>


      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={{ fontSize: 18, color: "white", textAlign: "center" }}> {i18n.t('savedata')} </Text>
      </TouchableOpacity>

    </ScrollView>

  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f5f5f5" },

  userInfoBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2, // ظل بسيط (أندرويد)
    shadowColor: "#000", // ظل (آيفون)
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  inputWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },

  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: "relative",
  }, 
  detailsBox: {
    marginTop: 10,
  }, 
  bold: { fontWeight: "bold" }, 
  removeButton: {
    position: "absolute",
    right: 12,
    top: 12,
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
  saveButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 40,
    alignSelf: "center",
    width: "90%",
  },
});

