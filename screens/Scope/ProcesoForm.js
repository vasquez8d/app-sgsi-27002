import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import { ALCANCE_THEME, MACROPROCESOS, ESTADO_PROCESO, CRITICIDAD_LEVELS } from '../../utils/alcanceConstants';
import { validateProceso } from '../../utils/alcanceValidation';

const ProcesoForm = ({ proceso, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    macroproceso: proceso?.macroproceso || '',
    nombreProceso: proceso?.nombreProceso || '',
    responsableArea: proceso?.responsableArea || '',
    descripcion: proceso?.descripcion || '',
    estado: proceso?.estado || 'En Evaluación',
    criticidad: proceso?.criticidad || 'Media',
    fechaInclusion: proceso?.fechaInclusion || new Date().toISOString(),
    procesosRelacionados: proceso?.procesosRelacionados || [],
    justificacion: proceso?.justificacion || '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [descripcionLength, setDescripcionLength] = useState(proceso?.descripcion?.length || 0);
  const [justificacionLength, setJustificacionLength] = useState(proceso?.justificacion?.length || 0);

  const scrollViewRef = useRef(null);
  const nombreRef = useRef(null);
  const responsableRef = useRef(null);
  const descripcionRef = useRef(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));

    if (field === 'descripcion') {
      setDescripcionLength(value.length);
    }
    
    if (field === 'justificacion') {
      setJustificacionLength(value.length);
    }

    // Validación en tiempo real
    const validation = validateProceso({ ...formData, [field]: value });
    if (validation.errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validation.errors[field] }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = () => {
    // Marcar todos los campos como tocados
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validar formulario completo
    const validation = validateProceso(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      
      // Scroll al primer error
      const firstErrorField = Object.keys(validation.errors)[0];
      scrollToField(firstErrorField);
      
      alert(`Por favor corrija los siguientes errores:\n\n${Object.values(validation.errors).join('\n')}`);
      return;
    }

    onSave(formData);
  };

  const scrollToField = (fieldName) => {
    // Implementación simple para hacer scroll
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  const renderCriticidadChips = () => (
    <View style={styles.chipsContainer}>
      {Object.keys(CRITICIDAD_LEVELS).map((key) => {
        const criticidad = CRITICIDAD_LEVELS[key];
        const isSelected = formData.criticidad === criticidad;
        
        return (
          <TouchableOpacity
            key={key}
            style={[
              styles.chip,
              isSelected && styles.chipSelected,
              isSelected && { backgroundColor: getCriticidadColor(criticidad) },
            ]}
            onPress={() => handleChange('criticidad', criticidad)}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
              {criticidad}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const getCriticidadColor = (criticidad) => {
    switch (criticidad) {
      case 'Crítica':
        return ALCANCE_THEME.colors.error;
      case 'Alta':
        return '#FF6B35';
      case 'Media':
        return ALCANCE_THEME.colors.warning;
      case 'Baja':
        return ALCANCE_THEME.colors.success;
      default:
        return ALCANCE_THEME.colors.primary;
    }
  };

  const showError = (field) => touched[field] && errors[field];

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Macroproceso */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Macroproceso <Text style={styles.required}>*</Text>
        </Text>
        <View style={[styles.pickerContainer, showError('macroproceso') && styles.inputError]}>
          <Picker
            selectedValue={formData.macroproceso}
            onValueChange={(value) => handleChange('macroproceso', value)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione un macroproceso..." value="" />
            {Object.keys(MACROPROCESOS).map((key) => (
              <Picker.Item key={key} label={MACROPROCESOS[key]} value={MACROPROCESOS[key]} />
            ))}
          </Picker>
        </View>
        {showError('macroproceso') && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color={ALCANCE_THEME.colors.error} />
            <Text style={styles.errorText}>{errors.macroproceso}</Text>
          </View>
        )}
      </View>

      {/* Nombre del Proceso */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Nombre del Proceso <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          ref={nombreRef}
          style={[styles.input, showError('nombreProceso') && styles.inputError]}
          placeholder="Ej: Gestión de Accesos"
          value={formData.nombreProceso}
          onChangeText={(value) => handleChange('nombreProceso', value)}
          onBlur={() => handleBlur('nombreProceso')}
          maxLength={100}
        />
        {showError('nombreProceso') && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color={ALCANCE_THEME.colors.error} />
            <Text style={styles.errorText}>{errors.nombreProceso}</Text>
          </View>
        )}
      </View>

      {/* Responsable del Área */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Responsable del Área</Text>
        <TextInput
          ref={responsableRef}
          style={styles.input}
          placeholder="Ej: Juan Pérez - TI"
          value={formData.responsableArea}
          onChangeText={(value) => handleChange('responsableArea', value)}
          onBlur={() => handleBlur('responsableArea')}
        />
        <Text style={styles.helpText}>
          Puede seleccionar un miembro del equipo o escribir un nombre
        </Text>
      </View>

      {/* Descripción */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          ref={descripcionRef}
          style={[styles.textArea, showError('descripcion') && styles.inputError]}
          placeholder="Describa el proceso, sus objetivos y alcance..."
          value={formData.descripcion}
          onChangeText={(value) => handleChange('descripcion', value)}
          onBlur={() => handleBlur('descripcion')}
          multiline
          numberOfLines={4}
          maxLength={500}
          textAlignVertical="top"
        />
        <View style={styles.charCountContainer}>
          <Text style={[styles.charCount, descripcionLength > 450 && styles.charCountWarning]}>
            {descripcionLength}/500 caracteres
          </Text>
        </View>
        {showError('descripcion') && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color={ALCANCE_THEME.colors.error} />
            <Text style={styles.errorText}>{errors.descripcion}</Text>
          </View>
        )}
      </View>

      {/* Criticidad */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Criticidad <Text style={styles.required}>*</Text>
        </Text>
        {renderCriticidadChips()}
        {showError('criticidad') && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color={ALCANCE_THEME.colors.error} />
            <Text style={styles.errorText}>{errors.criticidad}</Text>
          </View>
        )}
      </View>

      {/* Estado */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Estado <Text style={styles.required}>*</Text>
        </Text>
        <View style={[styles.pickerContainer, showError('estado') && styles.inputError]}>
          <Picker
            selectedValue={formData.estado}
            onValueChange={(value) => handleChange('estado', value)}
            style={styles.picker}
          >
            {Object.keys(ESTADO_PROCESO).map((key) => (
              <Picker.Item key={key} label={ESTADO_PROCESO[key]} value={ESTADO_PROCESO[key]} />
            ))}
          </Picker>
        </View>
        {showError('estado') && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color={ALCANCE_THEME.colors.error} />
            <Text style={styles.errorText}>{errors.estado}</Text>
          </View>
        )}
      </View>

      {/* Justificación de Exclusión - Solo si estado es Excluido */}
      {formData.estado === 'Excluido' && (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Justificación de Exclusión <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.helpText}>
            Según ISO 27001:2013 (Cláusula 4.3), debe documentar y justificar cualquier exclusión del alcance del SGSI.
          </Text>
          <TextInput
            ref={descripcionRef}
            style={[
              styles.textArea,
              showError('justificacion') && styles.inputError,
            ]}
            value={formData.justificacion}
            onChangeText={(value) => handleChange('justificacion', value)}
            onBlur={() => handleBlur('justificacion')}
            placeholder="Ej: Proceso tercerizado bajo responsabilidad del proveedor según contrato vigente..."
            placeholderTextColor={ALCANCE_THEME.colors.textSecondary}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <View style={styles.charCountContainer}>
            <Text style={[
              styles.charCount,
              justificacionLength < 30 && styles.charCountWarning
            ]}>
              {justificacionLength}/500 caracteres {justificacionLength < 30 && '(mínimo 30)'}
            </Text>
          </View>
          {showError('justificacion') && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color={ALCANCE_THEME.colors.error} />
              <Text style={styles.errorText}>{errors.justificacion}</Text>
            </View>
          )}
          {justificacionLength < 30 && touched.justificacion && (
            <View style={styles.warningContainer}>
              <Ionicons name="warning" size={16} color={ALCANCE_THEME.colors.warning} />
              <Text style={styles.warningText}>
                Se requiere una justificación de al menos 30 caracteres para cumplir con ISO 27001
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Incluir en Alcance Toggle */}
      <View style={styles.fieldContainer}>
        <View style={styles.toggleContainer}>
          <View style={styles.toggleLabel}>
            <Ionicons
              name={formData.estado === 'Incluido' ? 'checkmark-circle' : 'close-circle'}
              size={24}
              color={
                formData.estado === 'Incluido'
                  ? ALCANCE_THEME.colors.success
                  : ALCANCE_THEME.colors.textSecondary
              }
            />
            <Text style={styles.toggleText}>
              {formData.estado === 'Incluido'
                ? 'Proceso incluido en el alcance'
                : 'Proceso no incluido (cambiar estado a "Incluido")'}
            </Text>
          </View>
        </View>
      </View>

      {/* Información adicional */}
      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={20} color={ALCANCE_THEME.colors.primary} />
        <Text style={styles.infoText}>
          Los procesos marcados como "Incluido" formarán parte del alcance del SGSI según ISO 27001 punto 4.3
        </Text>
      </View>

      {/* Botones */}
      <View style={styles.buttonsContainer}>
        <Button
          title="Cancelar"
          onPress={onCancel}
          variant="outline"
          style={styles.button}
        />
        <Button
          title={proceso ? 'Actualizar' : 'Guardar'}
          onPress={handleSubmit}
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: ALCANCE_THEME.spacing.md,
  },
  fieldContainer: {
    marginBottom: ALCANCE_THEME.spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: ALCANCE_THEME.typography.fontWeightMedium,
    color: ALCANCE_THEME.colors.text,
    marginBottom: ALCANCE_THEME.spacing.xs,
  },
  required: {
    color: ALCANCE_THEME.colors.error,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: ALCANCE_THEME.borderRadius.sm,
    paddingHorizontal: ALCANCE_THEME.spacing.md,
    paddingVertical: ALCANCE_THEME.spacing.sm,
    fontSize: 15,
    backgroundColor: '#FFF',
  },
  inputError: {
    borderColor: ALCANCE_THEME.colors.error,
    borderWidth: 2,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: ALCANCE_THEME.borderRadius.sm,
    paddingHorizontal: ALCANCE_THEME.spacing.md,
    paddingVertical: ALCANCE_THEME.spacing.sm,
    fontSize: 15,
    backgroundColor: '#FFF',
    minHeight: 100,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: ALCANCE_THEME.borderRadius.sm,
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 150 : 50,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: ALCANCE_THEME.spacing.xs,
    gap: 4,
  },
  errorText: {
    fontSize: 12,
    color: ALCANCE_THEME.colors.error,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: ALCANCE_THEME.spacing.xs,
    padding: ALCANCE_THEME.spacing.sm,
    backgroundColor: ALCANCE_THEME.colors.warning + '15',
    borderRadius: ALCANCE_THEME.borderRadius.sm,
    gap: 6,
  },
  warningText: {
    fontSize: 12,
    color: ALCANCE_THEME.colors.warning,
    flex: 1,
    lineHeight: 16,
  },
  helpText: {
    fontSize: 12,
    color: ALCANCE_THEME.colors.textSecondary,
    marginTop: ALCANCE_THEME.spacing.xs,
    marginBottom: ALCANCE_THEME.spacing.xs,
    lineHeight: 16,
  },
  charCountContainer: {
    alignItems: 'flex-end',
    marginTop: ALCANCE_THEME.spacing.xs,
  },
  charCount: {
    fontSize: 12,
    color: ALCANCE_THEME.colors.textSecondary,
  },
  charCountWarning: {
    color: ALCANCE_THEME.colors.warning,
    fontWeight: ALCANCE_THEME.typography.fontWeightMedium,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ALCANCE_THEME.spacing.sm,
  },
  chip: {
    paddingHorizontal: ALCANCE_THEME.spacing.md,
    paddingVertical: ALCANCE_THEME.spacing.sm,
    borderRadius: ALCANCE_THEME.borderRadius.full,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  chipSelected: {
    borderColor: 'transparent',
  },
  chipText: {
    fontSize: 14,
    color: ALCANCE_THEME.colors.text,
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: ALCANCE_THEME.typography.fontWeightMedium,
  },
  toggleContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: ALCANCE_THEME.borderRadius.sm,
    padding: ALCANCE_THEME.spacing.md,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  toggleLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ALCANCE_THEME.spacing.sm,
  },
  toggleText: {
    flex: 1,
    fontSize: 14,
    color: ALCANCE_THEME.colors.text,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: ALCANCE_THEME.borderRadius.sm,
    padding: ALCANCE_THEME.spacing.md,
    marginBottom: ALCANCE_THEME.spacing.lg,
    gap: ALCANCE_THEME.spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: ALCANCE_THEME.colors.primary,
    lineHeight: 18,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: ALCANCE_THEME.spacing.md,
    marginTop: ALCANCE_THEME.spacing.md,
  },
  button: {
    flex: 1,
  },
});

export default ProcesoForm;
