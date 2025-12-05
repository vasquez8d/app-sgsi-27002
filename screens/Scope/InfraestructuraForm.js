import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import { ALCANCE_THEME, TIPO_ACTIVO_INFRA, CRITICIDAD_LEVELS, ESTADO_ACTIVO } from '../../utils/alcanceConstants';
import { validateInfraestructura } from '../../utils/alcanceValidation';

const InfraestructuraForm = ({ infraestructura, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    identificador: infraestructura?.identificador || '',
    tipoActivo: infraestructura?.tipoActivo || '',
    sitio: infraestructura?.sitio || '',
    unidadNegocio: infraestructura?.unidadNegocio || '',
    ubicacionFisica: infraestructura?.ubicacionFisica || '',
    propietario: infraestructura?.propietario || '',
    sistemaOperativo: infraestructura?.sistemaOperativo || '',
    funcion: infraestructura?.funcion || '',
    criticidad: infraestructura?.criticidad || 'Media',
    estadoActivo: infraestructura?.estadoActivo || 'Activo',
    incluido: infraestructura?.incluido !== undefined ? infraestructura.incluido : true,
    observaciones: infraestructura?.observaciones || '',
    justificacion: infraestructura?.justificacion || '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [justificacionLength, setJustificacionLength] = useState(infraestructura?.justificacion?.length || 0);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));

    if (field === 'justificacion') {
      setJustificacionLength(value.length);
    }

    const validation = validateInfraestructura({ ...formData, [field]: value });
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

  const handleSubmit = () => {
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const validation = validateInfraestructura(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      alert(`Por favor corrija los siguientes errores:\n\n${Object.values(validation.errors).join('\n')}`);
      return;
    }

    onSave(formData);
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

  const showError = (field) => touched[field] && errors[field];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Identificador <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, showError('identificador') && styles.inputError]}
          placeholder="Ej: Servidor Aplicaciones APP-01"
          value={formData.identificador}
          onChangeText={(value) => handleChange('identificador', value)}
          maxLength={100}
        />
        {showError('identificador') && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color={ALCANCE_THEME.colors.error} />
            <Text style={styles.errorText}>{errors.identificador}</Text>
          </View>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Tipo de Activo <Text style={styles.required}>*</Text>
        </Text>
        <View style={[styles.pickerContainer, showError('tipoActivo') && styles.inputError]}>
          <Picker
            selectedValue={formData.tipoActivo}
            onValueChange={(value) => handleChange('tipoActivo', value)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione un tipo..." value="" />
            {Object.keys(TIPO_ACTIVO_INFRA).map((key) => (
              <Picker.Item key={key} label={TIPO_ACTIVO_INFRA[key]} value={TIPO_ACTIVO_INFRA[key]} />
            ))}
          </Picker>
        </View>
        {showError('tipoActivo') && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color={ALCANCE_THEME.colors.error} />
            <Text style={styles.errorText}>{errors.tipoActivo}</Text>
          </View>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Sitio <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, showError('sitio') && styles.inputError]}
          placeholder="Ej: Oficina Central"
          value={formData.sitio}
          onChangeText={(value) => handleChange('sitio', value)}
        />
        {showError('sitio') && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color={ALCANCE_THEME.colors.error} />
            <Text style={styles.errorText}>{errors.sitio}</Text>
          </View>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Unidad de Negocio</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Informática"
          value={formData.unidadNegocio}
          onChangeText={(value) => handleChange('unidadNegocio', value)}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Ubicación Física</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Av. Javier Prado Este 2499, San Borja"
          value={formData.ubicacionFisica}
          onChangeText={(value) => handleChange('ubicacionFisica', value)}
          multiline
          numberOfLines={2}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Propietario <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, showError('propietario') && styles.inputError]}
          placeholder="Ej: Gerencia de Informática"
          value={formData.propietario}
          onChangeText={(value) => handleChange('propietario', value)}
        />
        {showError('propietario') && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color={ALCANCE_THEME.colors.error} />
            <Text style={styles.errorText}>{errors.propietario}</Text>
          </View>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Sistema Operativo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Windows Server 2019"
          value={formData.sistemaOperativo}
          onChangeText={(value) => handleChange('sistemaOperativo', value)}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Función</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Servidor de aplicaciones corporativas"
          value={formData.funcion}
          onChangeText={(value) => handleChange('funcion', value)}
          multiline
          numberOfLines={2}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Criticidad <Text style={styles.required}>*</Text>
        </Text>
        {renderCriticidadChips()}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Estado del Activo <Text style={styles.required}>*</Text>
        </Text>
        <View style={[styles.pickerContainer, showError('estadoActivo') && styles.inputError]}>
          <Picker
            selectedValue={formData.estadoActivo}
            onValueChange={(value) => handleChange('estadoActivo', value)}
            style={styles.picker}
          >
            {Object.keys(ESTADO_ACTIVO).map((key) => (
              <Picker.Item key={key} label={ESTADO_ACTIVO[key]} value={ESTADO_ACTIVO[key]} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Observaciones</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Información adicional relevante..."
          value={formData.observaciones}
          onChangeText={(value) => handleChange('observaciones', value)}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.fieldContainer}>
        <View style={styles.switchContainer}>
          <View style={styles.switchLabel}>
            <Text style={styles.label}>Incluir en el Alcance</Text>
            <Text style={styles.helpText}>¿Este activo forma parte del alcance del SGSI?</Text>
          </View>
          <Switch
            value={formData.incluido}
            onValueChange={(value) => handleChange('incluido', value)}
            trackColor={{ false: '#DDD', true: ALCANCE_THEME.colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Justificación de Exclusión - Solo si no está incluido */}
      {!formData.incluido && (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Justificación de Exclusión <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.helpText}>
            Según ISO 27001:2013 (Cláusula 4.3), debe documentar y justificar cualquier exclusión del alcance del SGSI.
          </Text>
          <TextInput
            style={[
              styles.textArea,
              errors.justificacion && touched.justificacion && styles.inputError,
            ]}
            value={formData.justificacion}
            onChangeText={(value) => handleChange('justificacion', value)}
            onBlur={() => setTouched((prev) => ({ ...prev, justificacion: true }))}
            placeholder="Ej: Infraestructura legacy en proceso de descontinuación programada para Q1 2026..."
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
          {errors.justificacion && touched.justificacion && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color={ALCANCE_THEME.colors.danger} />
              <Text style={styles.errorText}>{errors.justificacion}</Text>
            </View>
          )}
          {justificacionLength < 30 && justificacionLength > 0 && (
            <View style={styles.warningContainer}>
              <Ionicons name="warning" size={16} color={ALCANCE_THEME.colors.warning} />
              <Text style={styles.warningText}>
                Se requiere una justificación de al menos 30 caracteres para cumplir con ISO 27001
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={20} color={ALCANCE_THEME.colors.primary} />
        <Text style={styles.infoText}>
          Los activos de infraestructura crítica deben ser protegidos según ISO 27002 controles A.8 y A.11
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          title="Cancelar"
          onPress={onCancel}
          variant="outline"
          style={styles.button}
        />
        <Button
          title={infraestructura ? 'Actualizar' : 'Guardar'}
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
  textArea: {
    minHeight: 80,
    paddingTop: ALCANCE_THEME.spacing.sm,
  },
  inputError: {
    borderColor: ALCANCE_THEME.colors.error,
    borderWidth: 2,
  },
  checkboxContainer: {
    marginTop: ALCANCE_THEME.spacing.sm,
    gap: ALCANCE_THEME.spacing.sm,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ALCANCE_THEME.spacing.sm,
    gap: ALCANCE_THEME.spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: ALCANCE_THEME.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: ALCANCE_THEME.colors.primary,
    borderColor: ALCANCE_THEME.colors.primary,
  },
  checkboxLabel: {
    fontSize: 15,
    color: ALCANCE_THEME.colors.text,
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
    backgroundColor: ALCANCE_THEME.colors.primary,
    borderColor: ALCANCE_THEME.colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: ALCANCE_THEME.colors.text,
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: ALCANCE_THEME.typography.fontWeightMedium,
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
    fontWeight: '600',
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: ALCANCE_THEME.borderRadius.sm,
    padding: ALCANCE_THEME.spacing.md,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  switchLabel: {
    flex: 1,
    marginRight: ALCANCE_THEME.spacing.md,
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
  helpText: {
    fontSize: 12,
    color: ALCANCE_THEME.colors.textSecondary,
    marginTop: ALCANCE_THEME.spacing.xs,
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

export default InfraestructuraForm;
