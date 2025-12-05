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
 * Componente de filtro por tipo de unidad organizativa
 */
const TipoUnidadPickerFilter = ({ tiposUnidad, selectedValue, onValueChange }) => {
  const [pickerVisible, setPickerVisible] = useState(false);

  // Preparar opciones: ['Todos', ...valores de tipos de unidad]
  const options = ['Todos', ...Object.values(tiposUnidad)];

  // Seleccionar opción
  const selectOption = (value) => {
    onValueChange(value);
    setPickerVisible(false);
  };

  // Determinar texto del botón
  const getButtonText = () => {
    if (selectedValue === 'Todos') {
      return 'Seleccionar tipo';
    }
    return selectedValue;
  };

  // Determinar si hay filtro activo
  const hasActiveFilter = selectedValue !== 'Todos';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tipo de Unidad:</Text>
      
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
              <Text style={styles.modalTitle}>Seleccionar Tipo de Unidad</Text>
              <TouchableOpacity 
                onPress={() => setPickerVisible(false)} 
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={ALCANCE_THEME.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.optionsContainer}>
              {options.map((option, index) => {
                const isSelected = option === selectedValue;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionItemSelected,
                    ]}
                    onPress={() => selectOption(option)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionContent}>
                      <Ionicons
                        name={option === 'Todos' ? 'apps-outline' : 'business-outline'}
                        size={20}
                        color={isSelected ? ALCANCE_THEME.colors.primary : ALCANCE_THEME.colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={ALCANCE_THEME.colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: ALCANCE_THEME.spacing.md,
    paddingVertical: ALCANCE_THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  label: {
    fontSize: 13,
    fontWeight: ALCANCE_THEME.typography.fontWeightMedium,
    color: ALCANCE_THEME.colors.textSecondary,
    marginBottom: ALCANCE_THEME.spacing.xs,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: ALCANCE_THEME.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  pickerButtonActive: {
    backgroundColor: `${ALCANCE_THEME.colors.primary}08`,
    borderColor: ALCANCE_THEME.colors.primary,
  },
  pickerIcon: {
    marginRight: 4,
  },
  pickerButtonText: {
    flex: 1,
    fontSize: 14,
    color: ALCANCE_THEME.colors.textSecondary,
  },
  pickerButtonTextActive: {
    color: ALCANCE_THEME.colors.primary,
    fontWeight: ALCANCE_THEME.typography.fontWeightMedium,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: ALCANCE_THEME.spacing.xs,
    paddingVertical: ALCANCE_THEME.spacing.xs,
    gap: 6,
  },
  clearButtonText: {
    fontSize: 13,
    color: ALCANCE_THEME.colors.error,
    fontWeight: ALCANCE_THEME.typography.fontWeightMedium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ALCANCE_THEME.spacing.lg,
    paddingVertical: ALCANCE_THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: ALCANCE_THEME.typography.fontWeightBold,
    color: ALCANCE_THEME.colors.text,
  },
  closeButton: {
    padding: 4,
  },
  optionsContainer: {
    maxHeight: 400,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ALCANCE_THEME.spacing.lg,
    paddingVertical: ALCANCE_THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionItemSelected: {
    backgroundColor: `${ALCANCE_THEME.colors.primary}08`,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    fontSize: 15,
    color: ALCANCE_THEME.colors.text,
  },
  optionTextSelected: {
    color: ALCANCE_THEME.colors.primary,
    fontWeight: ALCANCE_THEME.typography.fontWeightMedium,
  },
});

export default TipoUnidadPickerFilter;
