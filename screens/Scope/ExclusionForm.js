import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Switch,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import { ALCANCE_THEME, CATEGORIA_EXCLUSION } from '../../utils/alcanceConstants';
import { validateExclusion } from '../../utils/alcanceValidation';

const ExclusionForm = ({ exclusion, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    elementoExcluido: exclusion?.elementoExcluido || '',
    categoria: exclusion?.categoria || '',
    justificacion: exclusion?.justificacion || '',
    responsableDecision: exclusion?.responsableDecision || '',
    fechaExclusion: exclusion?.fechaExclusion || new Date().toISOString(),
    revisionPendiente: exclusion?.revisionPendiente !== undefined ? exclusion.revisionPendiente : false,
    proximaRevision: exclusion?.proximaRevision || null,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [justificacionLength, setJustificacionLength] = useState(exclusion?.justificacion?.length || 0);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));

    if (field === 'justificacion') {
      setJustificacionLength(value.length);
    }

    const validation = validateExclusion({ ...formData, [field]: value });
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

    const validation = validateExclusion(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      alert(`Por favor corrija los siguientes errores:\n\n${Object.values(validation.errors).join('\n')}`);
      return;
    }

    onSave(formData);
  };

  const showError = (field) => touched[field] && errors[field];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.warningBanner}>
        <Ionicons name="alert-circle" size={24} color={ALCANCE_THEME.colors.warning} />
        <View style={styles.warningTextContainer}>
          <Text style={styles.warningTitle}>Justificación Requerida</Text>
          <Text style={styles.warningDescription}>
            ISO 27001 requiere justificación documentada para cada exclusión del alcance (cláusula 4.3)
          </Text>
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Elemento Excluido <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, showError('elementoExcluido') && styles.inputError]}
          placeholder="Ej: Proceso de Auditoría Externa"
          value={formData.elementoExcluido}
          onChangeText={(value) => handleChange('elementoExcluido', value)}
          maxLength={200}
        />
        {showError('elementoExcluido') && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color={ALCANCE_THEME.colors.error} />
            <Text style={styles.errorText}>{errors.elementoExcluido}</Text>
          </View>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Categoría <Text style={styles.required}>*</Text>
        </Text>
        <View style={[styles.pickerContainer, showError('categoria') && styles.inputError]}>
          <Picker
            selectedValue={formData.categoria}
            onValueChange={(value) => handleChange('categoria', value)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione una categoría..." value="" />
            {Object.keys(CATEGORIA_EXCLUSION).map((key) => (
              <Picker.Item key={key} label={CATEGORIA_EXCLUSION[key]} value={CATEGORIA_EXCLUSION[key]} />
            ))}
          </Picker>
        </View>
        {showError('categoria') && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color={ALCANCE_THEME.colors.error} />
            <Text style={styles.errorText}>{errors.categoria}</Text>
          </View>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Justificación <Text style={styles.required}>*</Text>
        </Text>
        <Text style={styles.helpText}>
          Mínimo 50 caracteres. Explique claramente por qué este elemento no puede ser incluido en el alcance del SGSI.
        </Text>
        <TextInput
          style={[styles.textArea, showError('justificacion') && styles.inputError]}
          placeholder="Justifique de manera detallada la exclusión del elemento..."
          value={formData.justificacion}
          onChangeText={(value) => handleChange('justificacion', value)}
          multiline
          numberOfLines={6}
          maxLength={1000}
          textAlignVertical="top"
        />
        <View style={styles.charCountContainer}>
          <Text style={[
            styles.charCount,
            justificacionLength < 50 && styles.charCountError,
            justificacionLength >= 50 && justificacionLength < 100 && styles.charCountWarning,
            justificacionLength >= 900 && styles.charCountWarning,
          ]}>
            {justificacionLength}/1000 caracteres
            {justificacionLength < 50 && ` (mínimo 50)`}
          </Text>
        </View>
        {showError('justificacion') && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color={ALCANCE_THEME.colors.error} />
            <Text style={styles.errorText}>{errors.justificacion}</Text>
          </View>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Responsable de la Decisión <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, showError('responsableDecision') && styles.inputError]}
          placeholder="Nombre y cargo del responsable"
          value={formData.responsableDecision}
          onChangeText={(value) => handleChange('responsableDecision', value)}
          maxLength={100}
        />
        {showError('responsableDecision') && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color={ALCANCE_THEME.colors.error} />
            <Text style={styles.errorText}>{errors.responsableDecision}</Text>
          </View>
        )}
        <Text style={styles.helpText}>
          Debe ser una persona con autoridad para tomar decisiones sobre el alcance del SGSI
        </Text>
      </View>

      <View style={styles.fieldContainer}>
        <View style={styles.switchContainer}>
          <View style={styles.switchLabel}>
            <Text style={styles.label}>Revisión Pendiente</Text>
            <Text style={styles.helpText}>¿Esta exclusión requiere revisión periódica?</Text>
          </View>
          <Switch
            value={formData.revisionPendiente}
            onValueChange={(value) => handleChange('revisionPendiente', value)}
            trackColor={{ false: '#DDD', true: ALCANCE_THEME.colors.warning }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {formData.revisionPendiente && (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Próxima Revisión</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={formData.proximaRevision ? new Date(formData.proximaRevision).toISOString().split('T')[0] : ''}
            onChangeText={(value) => handleChange('proximaRevision', value ? new Date(value).toISOString() : null)}
          />
          <Text style={styles.helpText}>
            Fecha en la que se debe revisar si esta exclusión sigue siendo válida
          </Text>
        </View>
      )}

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={20} color={ALCANCE_THEME.colors.primary} />
        <Text style={styles.infoText}>
          Las exclusiones deben ser aprobadas por la alta dirección y revisadas periódicamente. Cada exclusión debe estar alineada con los objetivos del negocio y la gestión de riesgos.
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
          title={exclusion ? 'Actualizar' : 'Guardar'}
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
  warningBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderRadius: ALCANCE_THEME.borderRadius.sm,
    padding: ALCANCE_THEME.spacing.md,
    marginBottom: ALCANCE_THEME.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: ALCANCE_THEME.colors.warning,
    gap: ALCANCE_THEME.spacing.sm,
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: ALCANCE_THEME.typography.fontWeightBold,
    color: '#E65100',
    marginBottom: 4,
  },
  warningDescription: {
    fontSize: 12,
    color: '#E65100',
    lineHeight: 16,
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
    minHeight: 120,
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
  charCountError: {
    color: ALCANCE_THEME.colors.error,
    fontWeight: ALCANCE_THEME.typography.fontWeightMedium,
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

export default ExclusionForm;
