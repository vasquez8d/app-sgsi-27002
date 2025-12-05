import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ALCANCE_THEME } from '../utils/alcanceConstants';

/**
 * Filtro de Incluido/Excluido usando Picker
 */
const IncluidoPickerFilter = ({ selectedValue, onValueChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Estado de Inclusión</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
          mode="dropdown"
        >
          <Picker.Item label="Todos" value="Todos" />
          <Picker.Item label="✓ Incluido" value="Incluido" />
          <Picker.Item label="✗ Excluido" value="Excluido" />
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: ALCANCE_THEME.colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pickerContainer: {
    backgroundColor: ALCANCE_THEME.colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ALCANCE_THEME.colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  picker: {
    height: 44,
    width: '100%',
  },
});

export default IncluidoPickerFilter;
