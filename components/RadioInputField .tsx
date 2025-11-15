import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export const RadioInputField = ({ label, value, onBlur ,onChange, selected, onSelect }) => {
  return (
  <View style={styles.radioFieldContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputRow}>
      <TouchableOpacity onPress={onSelect} style={styles.radioCircle}>
        {selected && <View style={styles.selectedDot} />}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        onBlur={onBlur}
        placeholder={label}
        keyboardType="numeric"
      />
    </View>
  </View>
);

};

const styles = StyleSheet.create({
  radioFieldContainer: {
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3490faff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#3490faff',
  },
  label: {
    marginBottom: 4,
    fontSize: 13,
    color: '#333',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});
