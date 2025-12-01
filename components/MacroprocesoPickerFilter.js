import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ALCANCE_THEME } from '../utils/alcanceConstants';

/**
 * Componente simple de filtro por macroproceso
 */
const MacroprocesoPickerFilter = ({ macroprocesos, selectedValue, onValueChange }) => {
  const [pickerVisible, setPickerVisible] = useState(false);

  // Preparar opciones: ['Todos', ...valores de macroprocesos]
  const options = ['Todos', ...Object.values(macroprocesos)];

  // Seleccionar opción
  const selectOption = (value) => {
    onValueChange(value);
    setPickerVisible(false);
  };

  // Determinar texto del botón
  const getButtonText = () => {
    if (selectedValue === 'Todos') {
      return 'Seleccionar macroproceso';
    }
    return selectedValue;
  };

  // Determinar si hay filtro activo
  const hasActiveFilter = selectedValue !== 'Todos';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Macroproceso:</Text>
      
      <TouchableOpacity
        style={[
          styles.pickerButton,
          hasActiveFilter && styles.pickerButtonActive,
        ]}
        onPress={() => setPickerVisible(true)}
        activeOpacity={0.7}
      >
        <Ionicons
          name="filter-outline"
          size={18}
          color={hasActiveFilter ? ALCANCE_THEME.colors.primary : ALCANCE_THEME.colors.textSecondary}
          style={styles.pickerIcon}
        />
        <Text
          style={[
            styles.pickerButtonText,
            hasActiveFilter && styles.pickerButtonTextActive,
          ]}
          numberOfLines={1}
        >
          {getButtonText()}
        </Text>
        <Ionicons
          name="chevron-down"
          size={18}
          color={hasActiveFilter ? ALCANCE_THEME.colors.primary : ALCANCE_THEME.colors.textSecondary}
        />
      </TouchableOpacity>

      {hasActiveFilter && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => onValueChange('Todos')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="close-circle"
            size={20}
            color={ALCANCE_THEME.colors.error}
          />
          <Text style={styles.clearButtonText}>Quitar filtro</Text>
        </TouchableOpacity>
      )}

      {/* Modal Simple */}
      <Modal
        visible={pickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Macroproceso</Text>
              <TouchableOpacity 
                onPress={() => setPickerVisible(false)} 
                style={styles.closeButton}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={ALCANCE_THEME.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.optionsList}>
              {options.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionItem,
                    item === selectedValue && styles.optionItemSelected,
                  ]}
                  onPress={() => selectOption(item)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item === selectedValue && styles.optionTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                  {item === selectedValue && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={ALCANCE_THEME.colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: ALCANCE_THEME.colors.text,
    marginBottom: 8,
    marginLeft: 4,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ALCANCE_THEME.colors.cardBackground,
    borderWidth: 1.5,
    borderColor: ALCANCE_THEME.colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  pickerButtonActive: {
    borderColor: ALCANCE_THEME.colors.primary,
    backgroundColor: `${ALCANCE_THEME.colors.primary}08`,
  },
  pickerIcon: {
    marginRight: 8,
  },
  pickerButtonText: {
    flex: 1,
    fontSize: 15,
    color: ALCANCE_THEME.colors.textSecondary,
  },
  pickerButtonTextActive: {
    color: ALCANCE_THEME.colors.primary,
    fontWeight: '600',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${ALCANCE_THEME.colors.error}08`,
    borderWidth: 1,
    borderColor: `${ALCANCE_THEME.colors.error}40`,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  clearButtonText: {
    fontSize: 13,
    color: ALCANCE_THEME.colors.error,
    fontWeight: '600',
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '60%',
    backgroundColor: ALCANCE_THEME.colors.background,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: ALCANCE_THEME.colors.border,
    backgroundColor: ALCANCE_THEME.colors.cardBackground,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: ALCANCE_THEME.colors.text,
  },
  closeButton: {
    padding: 4,
  },
  optionsList: {
    maxHeight: 400,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: ALCANCE_THEME.colors.border,
    backgroundColor: ALCANCE_THEME.colors.background,
  },
  optionItemSelected: {
    backgroundColor: `${ALCANCE_THEME.colors.primary}08`,
  },
  optionText: {
    fontSize: 16,
    color: ALCANCE_THEME.colors.text,
  },
  optionTextSelected: {
    fontWeight: '600',
    color: ALCANCE_THEME.colors.primary,
  },
});

export default MacroprocesoPickerFilter;
