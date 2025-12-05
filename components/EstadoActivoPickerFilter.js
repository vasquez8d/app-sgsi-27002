import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ALCANCE_THEME } from '../utils/alcanceConstants';

/**
 * Componente de filtro picker para seleccionar estado de activo
 */
const EstadoActivoPickerFilter = ({ estadosActivo, selectedValue, onValueChange }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (value) => {
    onValueChange(value);
    setModalVisible(false);
  };

  const getDisplayText = () => {
    if (selectedValue === 'Todos') {
      return 'Todos los estados';
    }
    return selectedValue;
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'Activo':
        return 'checkmark-circle';
      case 'Inactivo':
        return 'close-circle';
      case 'Mantenimiento':
        return 'construct';
      case 'Retirado':
        return 'trash';
      default:
        return 'radio-button-off';
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Activo':
        return ALCANCE_THEME.colors.success;
      case 'Inactivo':
        return ALCANCE_THEME.colors.textSecondary;
      case 'Mantenimiento':
        return ALCANCE_THEME.colors.warning;
      case 'Retirado':
        return ALCANCE_THEME.colors.danger;
      default:
        return ALCANCE_THEME.colors.text;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.pickerContent}>
          <Ionicons name="toggle-outline" size={20} color={ALCANCE_THEME.colors.primary} />
          <Text style={styles.pickerLabel}>Estado:</Text>
          <Text style={styles.pickerValue}>{getDisplayText()}</Text>
        </View>
        <Ionicons name="chevron-down" size={20} color={ALCANCE_THEME.colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar estado del activo</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={ALCANCE_THEME.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.optionsList}>
              <TouchableOpacity
                style={[
                  styles.optionItem,
                  selectedValue === 'Todos' && styles.optionItemSelected,
                ]}
                onPress={() => handleSelect('Todos')}
              >
                <View style={styles.optionContent}>
                  <Ionicons 
                    name="apps" 
                    size={22} 
                    color={ALCANCE_THEME.colors.text} 
                    style={styles.optionIcon}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      selectedValue === 'Todos' && styles.optionTextSelected,
                    ]}
                  >
                    Todos los estados
                  </Text>
                </View>
                {selectedValue === 'Todos' && (
                  <Ionicons name="checkmark" size={20} color={ALCANCE_THEME.colors.primary} />
                )}
              </TouchableOpacity>

              {Object.keys(estadosActivo).map((key) => {
                const estado = estadosActivo[key];
                const isSelected = selectedValue === estado;
                return (
                  <TouchableOpacity
                    key={key}
                    style={[styles.optionItem, isSelected && styles.optionItemSelected]}
                    onPress={() => handleSelect(estado)}
                  >
                    <View style={styles.optionContent}>
                      <Ionicons 
                        name={getEstadoIcon(estado)} 
                        size={22} 
                        color={getEstadoColor(estado)} 
                        style={styles.optionIcon}
                      />
                      <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                        {estado}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark" size={20} color={ALCANCE_THEME.colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {selectedValue !== 'Todos' && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => handleSelect('Todos')}
              >
                <Ionicons name="close-circle-outline" size={20} color={ALCANCE_THEME.colors.error} />
                <Text style={styles.clearButtonText}>Limpiar filtro</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
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
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: ALCANCE_THEME.spacing.sm,
    paddingHorizontal: ALCANCE_THEME.spacing.md,
    backgroundColor: '#F9FAFB',
    borderRadius: ALCANCE_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ALCANCE_THEME.spacing.sm,
    flex: 1,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: ALCANCE_THEME.colors.text,
  },
  pickerValue: {
    fontSize: 14,
    color: ALCANCE_THEME.colors.primary,
    fontWeight: '500',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: ALCANCE_THEME.borderRadius.lg,
    borderTopRightRadius: ALCANCE_THEME.borderRadius.lg,
    maxHeight: '70%',
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
    fontWeight: '600',
    color: ALCANCE_THEME.colors.text,
  },
  optionsList: {
    maxHeight: 400,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    flex: 1,
  },
  optionIcon: {
    marginRight: ALCANCE_THEME.spacing.sm,
  },
  optionText: {
    fontSize: 16,
    color: ALCANCE_THEME.colors.text,
  },
  optionTextSelected: {
    color: ALCANCE_THEME.colors.primary,
    fontWeight: '600',
  },
  clearButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: ALCANCE_THEME.spacing.xs,
    paddingVertical: ALCANCE_THEME.spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  clearButtonText: {
    fontSize: 14,
    color: ALCANCE_THEME.colors.error,
    fontWeight: '500',
  },
});

export default EstadoActivoPickerFilter;
