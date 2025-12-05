import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ALCANCE_THEME } from '../../utils/alcanceConstants';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { getAlcanceData, saveMetadata } from '../../services/alcance/alcanceService';

const AlcanceConfigScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nombreProyecto: '',
    departamento: '',
    version: '1.0',
    responsableNombre: '',
    responsableCargo: '',
    responsableEmail: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAlcanceData();
      setFormData({
        nombreProyecto: data.metadata.nombreProyecto || '',
        departamento: data.metadata.departamento || '',
        version: data.metadata.version || '1.0',
        responsableNombre: data.metadata.responsable?.nombre || '',
        responsableCargo: data.metadata.responsable?.cargo || '',
        responsableEmail: data.metadata.responsable?.email || '',
      });
    } catch (error) {
      console.error('Error cargando configuración:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos de configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validaciones
    if (!formData.nombreProyecto.trim()) {
      Alert.alert('Error', 'El nombre del proyecto es obligatorio');
      return;
    }

    if (formData.responsableEmail && !isValidEmail(formData.responsableEmail)) {
      Alert.alert('Error', 'El email del responsable no es válido');
      return;
    }

    try {
      setSaving(true);
      
      const metadata = {
        nombreProyecto: formData.nombreProyecto.trim(),
        departamento: formData.departamento.trim(),
        version: formData.version.trim(),
        responsable: {
          nombre: formData.responsableNombre.trim(),
          cargo: formData.responsableCargo.trim(),
          email: formData.responsableEmail.trim(),
        },
      };

      const result = await saveMetadata(metadata);

      if (result.success) {
        Alert.alert(
          'Éxito',
          'La configuración se guardó correctamente',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Error', result.error || 'No se pudo guardar la configuración');
      }
    } catch (error) {
      console.error('Error guardando configuración:', error);
      Alert.alert('Error', 'Ocurrió un error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header
          title="Configuración del Alcance"
          subtitle="Cargando..."
          onBack={() => navigation.goBack()}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <Header
        title="Configuración del Alcance"
        subtitle="Datos principales del documento"
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Información del Proyecto */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Información del Proyecto</Text>

          <Input
            label="Nombre del Proyecto *"
            value={formData.nombreProyecto}
            onChangeText={(text) => setFormData({ ...formData, nombreProyecto: text })}
            placeholder="Ej: SGSI ISO 27002:2013"
            maxLength={100}
            autoCapitalize="words"
          />

          <Input
            label="Departamento / Área"
            value={formData.departamento}
            onChangeText={(text) => setFormData({ ...formData, departamento: text })}
            placeholder="Ej: Tecnología de la Información"
            maxLength={100}
            autoCapitalize="words"
          />

          <Input
            label="Versión del Documento"
            value={formData.version}
            onChangeText={(text) => setFormData({ ...formData, version: text })}
            placeholder="Ej: 1.0"
            maxLength={20}
          />
        </Card>

        {/* Responsable del Documento */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Responsable del Documento</Text>
          
          <Text style={styles.helpText}>
            Persona encargada de mantener y actualizar el documento de alcance del SGSI
          </Text>

          <Input
            label="Nombre Completo"
            value={formData.responsableNombre}
            onChangeText={(text) => setFormData({ ...formData, responsableNombre: text })}
            placeholder="Ej: Juan Pérez García"
            maxLength={100}
            autoCapitalize="words"
          />

          <Input
            label="Cargo"
            value={formData.responsableCargo}
            onChangeText={(text) => setFormData({ ...formData, responsableCargo: text })}
            placeholder="Ej: Oficial de Seguridad de la Información"
            maxLength={100}
            autoCapitalize="words"
          />

          <Input
            label="Email"
            value={formData.responsableEmail}
            onChangeText={(text) => setFormData({ ...formData, responsableEmail: text })}
            placeholder="ejemplo@empresa.com"
            maxLength={100}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </Card>

        {/* Botones de Acción */}
        <View style={styles.actionsContainer}>
          <Button
            title="Guardar Configuración"
            onPress={handleSave}
            loading={saving}
            style={styles.saveButton}
          />

          <Button
            title="Cancelar"
            onPress={() => navigation.goBack()}
            variant="outline"
            disabled={saving}
          />
        </View>

        {/* Información adicional */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            * Campos obligatorios{'\n\n'}
            Esta información se utilizará para identificar el documento de alcance y 
            su responsable en los reportes y validaciones del SGSI.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ALCANCE_THEME.colors.background,
  },
  content: {
    flex: 1,
    padding: ALCANCE_THEME.spacing.md,
  },
  card: {
    marginBottom: ALCANCE_THEME.spacing.md,
    padding: ALCANCE_THEME.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: ALCANCE_THEME.colors.text,
    marginBottom: ALCANCE_THEME.spacing.sm,
  },
  helpText: {
    fontSize: 13,
    color: ALCANCE_THEME.colors.textSecondary,
    marginBottom: ALCANCE_THEME.spacing.md,
    lineHeight: 18,
  },
  actionsContainer: {
    marginBottom: ALCANCE_THEME.spacing.md,
    gap: ALCANCE_THEME.spacing.sm,
  },
  saveButton: {
    backgroundColor: ALCANCE_THEME.colors.success,
  },
  infoBox: {
    backgroundColor: ALCANCE_THEME.colors.surface,
    padding: ALCANCE_THEME.spacing.md,
    borderRadius: ALCANCE_THEME.borderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: ALCANCE_THEME.colors.info,
    marginBottom: ALCANCE_THEME.spacing.xl,
  },
  infoText: {
    fontSize: 13,
    color: ALCANCE_THEME.colors.textSecondary,
    lineHeight: 18,
  },
});

export default AlcanceConfigScreen;
