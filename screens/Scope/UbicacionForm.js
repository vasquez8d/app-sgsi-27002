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
import { ALCANCE_THEME, TIPO_UBICACION } from '../../utils/alcanceConstants';
import { validateUbicacion } from '../../utils/alcanceValidation';

const UbicacionForm = ({ ubicacion, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nombreSitio: ubicacion?.nombreSitio || '',
    direccion: ubicacion?.direccion || '',
    tipo: ubicacion?.tipo || '',
    activosPresentes: ubicacion?.activosPresentes || [],
    responsableSitio: ubicacion?.responsableSitio || '',
    incluido: ubicacion?.incluido !== undefined ? ubicacion.incluido : true,
    coordenadas: ubicacion?.coordenadas || { lat: null, lng: null },
    observaciones: ubicacion?.observaciones || '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));

    const validation = validateUbicacion({ ...formData, [field]: value });
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

  const handleCoordenadasChange = (field, value) => {
    const numValue = value === '' ? null : parseFloat(value);
    const newCoordenadas = { ...formData.coordenadas, [field]: numValue };
    handleChange('coordenadas', newCoordenadas);
  };

  const handleSubmit = () => {
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const validation = validateUbicacion(formData);
    
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
          Nombre del Sitio <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, showError('nombreSitio') && styles.inputError]}
          placeholder="Ej: Oficina Central"
          value={formData.nombreSitio}
          onChangeText={(value) => handleChange('nombreSitio', value)}
          maxLength={100}
        />
        {showError('nombreSitio') && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color={ALCANCE_THEME.colors.error} />
            <Text style={styles.errorText}>{errors.nombreSitio}</Text>
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
            {Object.keys(TIPO_UBICACION).map((key) => (
              <Picker.Item key={key} label={TIPO_UBICACION[key]} value={TIPO_UBICACION[key]} />
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
        <Text style={styles.label}>Dirección</Text>
        <TextInput
          style={styles.input}
          placeholder="Dirección completa del sitio"
          value={formData.direccion}
          onChangeText={(value) => handleChange('direccion', value)}
          multiline
          numberOfLines={2}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Responsable del Sitio</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre del responsable"
          value={formData.responsableSitio}
          onChangeText={(value) => handleChange('responsableSitio', value)}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Coordenadas Geográficas (Opcional)</Text>
        <View style={styles.coordenadasContainer}>
          <View style={styles.coordenadaField}>
            <Text style={styles.coordenadaLabel}>Latitud</Text>
            <TextInput
              style={[styles.input, showError('coordenadas') && styles.inputError]}
              placeholder="-90.0 a 90.0"
              value={formData.coordenadas.lat !== null ? formData.coordenadas.lat.toString() : ''}
              onChangeText={(value) => handleCoordenadasChange('lat', value)}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.coordenadaField}>
            <Text style={styles.coordenadaLabel}>Longitud</Text>
            <TextInput
              style={[styles.input, showError('coordenadas') && styles.inputError]}
              placeholder="-180.0 a 180.0"
              value={formData.coordenadas.lng !== null ? formData.coordenadas.lng.toString() : ''}
              onChangeText={(value) => handleCoordenadasChange('lng', value)}
              keyboardType="numeric"
            />
          </View>
        </View>
        {showError('coordenadas') && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color={ALCANCE_THEME.colors.error} />
            <Text style={styles.errorText}>{errors.coordenadas}</Text>
          </View>
        )}
        <Text style={styles.helpText}>
          Las coordenadas permiten geolocalizar el sitio en un mapa
        </Text>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Observaciones</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Información adicional sobre la ubicación..."
          value={formData.observaciones}
          onChangeText={(value) => handleChange('observaciones', value)}
          multiline
          numberOfLines={3}
          maxLength={500}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.fieldContainer}>
        <View style={styles.switchContainer}>
          <View style={styles.switchLabel}>
            <Text style={styles.label}>Incluir en el Alcance</Text>
            <Text style={styles.helpText}>¿Esta ubicación forma parte del alcance del SGSI?</Text>
          </View>
          <Switch
            value={formData.incluido}
            onValueChange={(value) => handleChange('incluido', value)}
            trackColor={{ false: '#DDD', true: ALCANCE_THEME.colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={20} color={ALCANCE_THEME.colors.primary} />
        <Text style={styles.infoText}>
          Las ubicaciones físicas definen dónde se encuentran los activos y operaciones del SGSI
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
          title={ubicacion ? 'Actualizar' : 'Guardar'}
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
  coordenadasContainer: {
    flexDirection: 'row',
    gap: ALCANCE_THEME.spacing.md,
  },
  coordenadaField: {
    flex: 1,
  },
  coordenadaLabel: {
    fontSize: 12,
    color: ALCANCE_THEME.colors.textSecondary,
    marginBottom: 4,
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

export default UbicacionForm;
