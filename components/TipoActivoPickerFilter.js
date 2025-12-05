import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ALCANCE_THEME, TIPO_ACTIVO_UBICACION } from '../utils/alcanceConstants';

/**
 * Filtro multi-selección para tipos de activos en ubicaciones
 */
const TipoActivoPickerFilter = ({ selectedTipos, onSelectionChange }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleTipo = (tipo) => {
    if (selectedTipos.includes(tipo)) {
      onSelectionChange(selectedTipos.filter((t) => t !== tipo));
    } else {
      onSelectionChange([...selectedTipos, tipo]);
    }
  };

  const selectAll = () => {
    onSelectionChange(Object.values(TIPO_ACTIVO_UBICACION));
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  const allSelected = selectedTipos.length === Object.values(TIPO_ACTIVO_UBICACION).length;
  const noneSelected = selectedTipos.length === 0;

  const getDisplayText = () => {
    if (noneSelected) return 'Todos los tipos de activo';
    if (allSelected) return 'Todos los tipos de activo';
    if (selectedTipos.length === 1) return selectedTipos[0];
    return `${selectedTipos.length} tipos seleccionados`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.pickerContent}>
          <Ionicons 
            name="cube-outline" 
            size={20} 
            color={ALCANCE_THEME.colors.primary} 
          />
          <Text style={styles.pickerLabel}>Tipos de Activo:</Text>
          <Text style={styles.pickerValue} numberOfLines={1}>
            {getDisplayText()}
          </Text>
        </View>
        <Ionicons 
          name="chevron-down" 
          size={20} 
          color={ALCANCE_THEME.colors.textSecondary} 
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tipos de Activo</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color={ALCANCE_THEME.colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={selectAll}
                disabled={allSelected}
              >
                <Ionicons 
                  name="checkmark-done" 
                  size={16} 
                  color={allSelected ? ALCANCE_THEME.colors.disabled : ALCANCE_THEME.colors.primary} 
                />
                <Text style={[
                  styles.actionButtonText,
                  allSelected && styles.actionButtonTextDisabled
                ]}>
                  Seleccionar todos
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={clearAll}
                disabled={noneSelected}
              >
                <Ionicons 
                  name="close-circle" 
                  size={16} 
                  color={noneSelected ? ALCANCE_THEME.colors.disabled : ALCANCE_THEME.colors.error} 
                />
                <Text style={[
                  styles.actionButtonText,
                  noneSelected && styles.actionButtonTextDisabled
                ]}>
                  Limpiar
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.optionsList}>
              {Object.values(TIPO_ACTIVO_UBICACION).map((tipo) => {
                const isSelected = selectedTipos.includes(tipo);
                return (
                  <TouchableOpacity
                    key={tipo}
                    style={styles.optionItem}
                    onPress={() => toggleTipo(tipo)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.checkbox,
                      isSelected && styles.checkboxSelected
                    ]}>
                      {isSelected && (
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      )}
                    </View>
                    <Text style={styles.optionText}>{tipo}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
            </TouchableOpacity>
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
    gap: 8,
    minHeight: 44,
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: ALCANCE_THEME.spacing.md,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: ALCANCE_THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ALCANCE_THEME.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: ALCANCE_THEME.colors.text,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: ALCANCE_THEME.spacing.md,
    paddingVertical: ALCANCE_THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: ALCANCE_THEME.colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: ALCANCE_THEME.spacing.xs,
    paddingHorizontal: ALCANCE_THEME.spacing.sm,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: ALCANCE_THEME.colors.text,
  },
  actionButtonTextDisabled: {
    color: ALCANCE_THEME.colors.disabled,
  },
  optionsList: {
    maxHeight: 350,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ALCANCE_THEME.spacing.sm,
    paddingHorizontal: ALCANCE_THEME.spacing.md,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: ALCANCE_THEME.colors.border,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: ALCANCE_THEME.colors.primary,
    borderColor: ALCANCE_THEME.colors.primary,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: ALCANCE_THEME.colors.text,
  },
  applyButton: {
    backgroundColor: ALCANCE_THEME.colors.primary,
    paddingVertical: ALCANCE_THEME.spacing.md,
    marginHorizontal: ALCANCE_THEME.spacing.md,
    marginVertical: ALCANCE_THEME.spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TipoActivoPickerFilter;
