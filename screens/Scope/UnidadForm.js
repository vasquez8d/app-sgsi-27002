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
import { ALCANCE_THEME, TIPO_UNIDAD, ROL_SGSI } from '../../utils/alcanceConstants';
import { validateUnidad } from '../../utils/alcanceValidation';

const UnidadForm = ({ unidad, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nombreUnidad: unidad?.nombreUnidad || '',
    tipo: unidad?.tipo || '',
    nivelJerarquico: unidad?.nivelJerarquico || 1,
    responsable: unidad?.responsable || '',
    rolSGSI: unidad?.rolSGSI || 'Coparticipe',
    procesosAsociados: unidad?.procesosAsociados || [],
    incluida: unidad?.incluida !== undefined ? unidad.incluida : true,
    justificacion: unidad?.justificacion || '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));

    const validation = validateUnidad({ ...formData, [field]: value });
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

    const validation = validateUnidad(formData);
    
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
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Nombre de la Unidad <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, showError('nombreUnidad') && styles.inputError]}
          placeholder="Ej: Departamento de TI"
          value={formData.nombreUnidad}
          onChangeText={(value) => handleChange('nombreUnidad', value)}
          maxLength={100}
        />
        {showError('nombreUnidad') && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color={ALCANCE_THEME.colors.error} />
            <Text style={styles.errorText}>{errors.nombreUnidad}</Text>
          </View>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Tipo <Text style={styles.required}>*</Text>
        </Text>
        <View style={[styles.pickerContainer, showError('tipo') && styles.inputError]}>
          <Picker
            selectedValue={formData.tipo}
            onValueChange={(value) => handleChange('tipo', value)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione un tipo..." value="" />
            {Object.keys(TIPO_UNIDAD).map((key) => (
              <Picker.Item key={key} label={TIPO_UNIDAD[key]} value={TIPO_UNIDAD[key]} />
            ))}
          </Picker>
        </View>
        {showError('tipo') && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color={ALCANCE_THEME.colors.error} />
            <Text style={styles.errorText}>{errors.tipo}</Text>
          </View>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Nivel Jerárquico <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.levelContainer}>
          {[1, 2, 3, 4, 5].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.levelButton,
                formData.nivelJerarquico === level && styles.levelButtonSelected,
              ]}
              onPress={() => handleChange('nivelJerarquico', level)}
            >
              <Text
                style={[
                  styles.levelText,
                  formData.nivelJerarquico === level && styles.levelTextSelected,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.helpText}>1: Dirección, 2: Gerencia, 3: Departamento, 4: Área, 5: Equipo</Text>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Responsable</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre del responsable"
          value={formData.responsable}
          onChangeText={(value) => handleChange('responsable', value)}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Rol en el SGSI <Text style={styles.required}>*</Text>
        </Text>
        <View style={[styles.pickerContainer, showError('rolSGSI') && styles.inputError]}>
          <Picker
            selectedValue={formData.rolSGSI}
            onValueChange={(value) => handleChange('rolSGSI', value)}
            style={styles.picker}
          >
            {Object.keys(ROL_SGSI).map((key) => (
              <Picker.Item key={key} label={ROL_SGSI[key]} value={ROL_SGSI[key]} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <View style={styles.switchContainer}>
          <View style={styles.switchLabel}>
            <Text style={styles.label}>Incluir en el Alcance</Text>
            <Text style={styles.helpText}>¿Esta unidad forma parte del alcance del SGSI?</Text>
          </View>
          <Switch
            value={formData.incluida}
            onValueChange={(value) => handleChange('incluida', value)}
            trackColor={{ false: '#DDD', true: ALCANCE_THEME.colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {!formData.incluida && (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Justificación de Exclusión <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.textArea, showError('justificacion') && styles.inputError]}
            placeholder="Explique por qué esta unidad no se incluye en el alcance..."
            value={formData.justificacion}
            onChangeText={(value) => handleChange('justificacion', value)}
            multiline
            numberOfLines={3}
            maxLength={500}
            textAlignVertical="top"
          />
          {showError('justificacion') && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color={ALCANCE_THEME.colors.error} />
              <Text style={styles.errorText}>{errors.justificacion}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={20} color={ALCANCE_THEME.colors.primary} />
        <Text style={styles.infoText}>
          Las unidades organizativas definen la estructura y responsabilidades del SGSI según ISO 27001
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
          title={unidad ? 'Actualizar' : 'Guardar'}
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
    minHeight: 80,
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
  levelContainer: {
    flexDirection: 'row',
    gap: ALCANCE_THEME.spacing.sm,
  },
  levelButton: {
    flex: 1,
    paddingVertical: ALCANCE_THEME.spacing.md,
    borderRadius: ALCANCE_THEME.borderRadius.sm,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DDD',
  },
  levelButtonSelected: {
    backgroundColor: ALCANCE_THEME.colors.primary,
    borderColor: ALCANCE_THEME.colors.primary,
  },
  levelText: {
    fontSize: 16,
    fontWeight: ALCANCE_THEME.typography.fontWeightBold,
    color: ALCANCE_THEME.colors.textSecondary,
  },
  levelTextSelected: {
    color: '#FFFFFF',
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

export default UnidadForm;
