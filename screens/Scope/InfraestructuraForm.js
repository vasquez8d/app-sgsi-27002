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
    tipoActivo: infraestructura?.tipoActivo || '',
    identificador: infraestructura?.identificador || '',
    ubicacionId: infraestructura?.ubicacionId || '',
    propietarioArea: infraestructura?.propietarioArea || '',
    sistemaOperativo: infraestructura?.sistemaOperativo || '',
    funcion: infraestructura?.funcion || '',
    criticidad: infraestructura?.criticidad || 'Media',
    estadoActivo: infraestructura?.estadoActivo || 'Activo',
    incluidoAlcance: infraestructura?.incluidoAlcance !== undefined ? infraestructura.incluidoAlcance : true,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));

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
          Identificador <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, showError('identificador') && styles.inputError]}
          placeholder="Ej: SRV-WEB-01"
          value={formData.identificador}
          onChangeText={(value) => handleChange('identificador', value)}
          maxLength={50}
        />
        {showError('identificador') && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color={ALCANCE_THEME.colors.error} />
            <Text style={styles.errorText}>{errors.identificador}</Text>
          </View>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Propietario/Área</Text>
        <TextInput
          style={styles.input}
          placeholder="Departamento responsable"
          value={formData.propietarioArea}
          onChangeText={(value) => handleChange('propietarioArea', value)}
        />
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
          placeholder="Ej: Servidor de aplicaciones web"
          value={formData.funcion}
          onChangeText={(value) => handleChange('funcion', value)}
          maxLength={200}
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
        <View style={styles.switchContainer}>
          <View style={styles.switchLabel}>
            <Text style={styles.label}>Incluir en el Alcance</Text>
            <Text style={styles.helpText}>¿Este activo forma parte del alcance del SGSI?</Text>
          </View>
          <Switch
            value={formData.incluidoAlcance}
            onValueChange={(value) => handleChange('incluidoAlcance', value)}
            trackColor={{ false: '#DDD', true: ALCANCE_THEME.colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

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
  inputError: {
    borderColor: ALCANCE_THEME.colors.error,
    borderWidth: 2,
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
