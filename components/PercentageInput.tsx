import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const PercentageInput = ({ value, onChange, step = 1 }) => {
  const handleDecrease = () => {
    const newValue = Math.max(0, (parseFloat(value) || 0) - step);
    onChange(newValue.toString());
  };

  const handleIncrease = () => {
    const newValue = (parseFloat(value) || 0) + step;
    onChange(newValue.toString());
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleDecrease} style={styles.button}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>

      <View style={styles.percentBox}>
        <Text style={styles.percentSymbol}>%</Text>
      </View>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={value}
        onChangeText={onChange}
        placeholder="0"
      />

      <TouchableOpacity onPress={handleIncrease} style={styles.button}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  button: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  percentBox: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentSymbol: {
    fontSize: 14,
    color: '#444',
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    fontSize: 16,
  },
});

export default PercentageInput;
