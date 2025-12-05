import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ALCANCE_THEME } from '../../utils/alcanceConstants';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { getAlcanceData, updateMetadata } from '../../services/alcance/alcanceService';
import { formatDateTime } from '../../utils/helpers';

const ValidacionScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState({
    nombreProyecto: '',
    estado: 'Borrador',
    version: '1.0',
    responsable: { nombre: '', cargo: '', email: '' },
    fechaCreacion: new Date(),
    fechaAprobacion: null,
  });
  const [validacion, setValidacion] = useState({
    fechaValidez: new Date(),
    proximaRevision: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAlcanceData();
      setMetadata(data.metadata);
      setValidacion(data.validacion);
    } catch (error) {
      console.error('Error cargando datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos de validación');
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = () => {
    Alert.alert(
      'Aprobar Documento',
      '¿Está seguro de aprobar el documento de Alcance del SGSI? Esta acción cambiará el estado a "Aprobado".',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aprobar',
          style: 'default',
          onPress: async () => {
            try {
              setLoading(true);
              await updateMetadata({
                ...metadata,
                estado: 'Aprobado',
                fechaAprobacion: new Date().toISOString(),
              });
              Alert.alert('Éxito', 'El documento ha sido aprobado correctamente', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              console.error('Error aprobando documento:', error);
              Alert.alert('Error', 'No se pudo aprobar el documento');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleRechazar = () => {
    Alert.alert(
      'Rechazar/Devolver',
      '¿Desea devolver el documento a estado "Borrador"?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Devolver',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await updateMetadata({
                ...metadata,
                estado: 'Borrador',
                fechaAprobacion: null,
              });
              Alert.alert('Éxito', 'El documento ha sido devuelto a estado Borrador', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              console.error('Error rechazando documento:', error);
              Alert.alert('Error', 'No se pudo cambiar el estado del documento');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const getEstadoColor = () => {
    switch (metadata.estado) {
      case 'Aprobado':
        return ALCANCE_THEME.colors.success;
      case 'En Revisión':
        return ALCANCE_THEME.colors.warning;
      default:
        return ALCANCE_THEME.colors.textSecondary;
    }
  };

  const getEstadoIcon = () => {
    switch (metadata.estado) {
      case 'Aprobado':
        return 'checkmark-circle';
      case 'En Revisión':
        return 'time';
      default:
        return 'document-text-outline';
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Validación y Aprobación"
        subtitle="Gestión del estado del documento"
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Estado Actual */}
        <Card style={styles.estadoCard}>
          <View style={styles.estadoHeader}>
            <Ionicons name={getEstadoIcon()} size={32} color={getEstadoColor()} />
            <View style={styles.estadoInfo}>
              <Text style={styles.estadoLabel}>Estado Actual</Text>
              <Text style={[styles.estadoValue, { color: getEstadoColor() }]}>
                {metadata.estado}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="document-text" size={20} color={ALCANCE_THEME.colors.textSecondary} />
            <Text style={styles.infoLabel}>Proyecto:</Text>
            <Text style={styles.infoValue}>{metadata.nombreProyecto}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="git-branch" size={20} color={ALCANCE_THEME.colors.textSecondary} />
            <Text style={styles.infoLabel}>Versión:</Text>
            <Text style={styles.infoValue}>{metadata.version}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={20} color={ALCANCE_THEME.colors.textSecondary} />
            <Text style={styles.infoLabel}>Creación:</Text>
            <Text style={styles.infoValue}>{formatDateTime(metadata.fechaCreacion)}</Text>
          </View>

          {metadata.fechaAprobacion && (
            <View style={styles.infoRow}>
              <Ionicons name="checkmark-circle" size={20} color={ALCANCE_THEME.colors.success} />
              <Text style={styles.infoLabel}>Aprobación:</Text>
              <Text style={styles.infoValue}>{formatDateTime(metadata.fechaAprobacion)}</Text>
            </View>
          )}
        </Card>

        {/* Información del Responsable */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Responsable del Documento</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="person" size={20} color={ALCANCE_THEME.colors.textSecondary} />
            <Text style={styles.infoLabel}>Nombre:</Text>
            <Text style={styles.infoValue}>
              {metadata.responsable?.nombre || 'No asignado'}
            </Text>
          </View>

          {metadata.responsable?.cargo && (
            <View style={styles.infoRow}>
              <Ionicons name="briefcase" size={20} color={ALCANCE_THEME.colors.textSecondary} />
              <Text style={styles.infoLabel}>Cargo:</Text>
              <Text style={styles.infoValue}>{metadata.responsable.cargo}</Text>
            </View>
          )}

          {metadata.responsable?.email && (
            <View style={styles.infoRow}>
              <Ionicons name="mail" size={20} color={ALCANCE_THEME.colors.textSecondary} />
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{metadata.responsable.email}</Text>
            </View>
          )}
        </Card>

        {/* Fechas de Validación */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Fechas de Validación</Text>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color={ALCANCE_THEME.colors.textSecondary} />
            <Text style={styles.infoLabel}>Vigencia desde:</Text>
            <Text style={styles.infoValue}>{formatDateTime(validacion.fechaValidez)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="alarm-outline" size={20} color={ALCANCE_THEME.colors.warning} />
            <Text style={styles.infoLabel}>Próxima revisión:</Text>
            <Text style={styles.infoValue}>{formatDateTime(validacion.proximaRevision)}</Text>
          </View>

          <View style={styles.alertBox}>
            <Ionicons name="information-circle" size={18} color={ALCANCE_THEME.colors.info} />
            <Text style={styles.alertText}>
              La revisión del alcance se recomienda cada 90 días según ISO 27001:2013
            </Text>
          </View>
        </Card>

        {/* Acciones */}
        <View style={styles.actionsContainer}>
          {metadata.estado !== 'Aprobado' ? (
            <Button
              title="Aprobar Documento"
              onPress={handleAprobar}
              icon={<Ionicons name="checkmark-circle" size={20} color="#FFF" style={{ marginRight: 8 }} />}
              loading={loading}
              style={styles.buttonAprobar}
            />
          ) : (
            <Button
              title="Devolver a Borrador"
              onPress={handleRechazar}
              icon={<Ionicons name="arrow-undo" size={20} color={ALCANCE_THEME.colors.primary} style={{ marginRight: 8 }} />}
              loading={loading}
              variant="secondary"
              style={styles.buttonRechazar}
            />
          )}
        </View>

        {/* Información ISO */}
        <View style={styles.isoBox}>
          <Ionicons name="shield-checkmark" size={20} color={ALCANCE_THEME.colors.info} />
          <Text style={styles.isoText}>
            <Text style={styles.isoBold}>ISO/IEC 27001:2013 - Cláusula 4.3:{'\n'}</Text>
            La organización debe determinar los límites y aplicabilidad del SGSI para establecer su alcance. 
            El documento debe ser aprobado por la dirección y mantenerse actualizado.
          </Text>
        </View>
      </ScrollView>
    </View>
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
  estadoCard: {
    marginBottom: ALCANCE_THEME.spacing.md,
    padding: ALCANCE_THEME.spacing.lg,
  },
  estadoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ALCANCE_THEME.spacing.md,
  },
  estadoInfo: {
    marginLeft: ALCANCE_THEME.spacing.md,
    flex: 1,
  },
  estadoLabel: {
    fontSize: 14,
    color: ALCANCE_THEME.colors.textSecondary,
    marginBottom: 4,
  },
  estadoValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: ALCANCE_THEME.colors.border,
    marginBottom: ALCANCE_THEME.spacing.md,
  },
  card: {
    marginBottom: ALCANCE_THEME.spacing.md,
    padding: ALCANCE_THEME.spacing.lg,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ALCANCE_THEME.colors.text,
    marginBottom: ALCANCE_THEME.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ALCANCE_THEME.spacing.sm,
  },
  infoLabel: {
    fontSize: 14,
    color: ALCANCE_THEME.colors.textSecondary,
    marginLeft: ALCANCE_THEME.spacing.sm,
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    color: ALCANCE_THEME.colors.text,
    fontWeight: '500',
    flex: 1,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: ALCANCE_THEME.colors.background,
    padding: ALCANCE_THEME.spacing.md,
    borderRadius: ALCANCE_THEME.borderRadius.sm,
    marginTop: ALCANCE_THEME.spacing.md,
  },
  alertText: {
    fontSize: 13,
    color: ALCANCE_THEME.colors.textSecondary,
    marginLeft: ALCANCE_THEME.spacing.sm,
    flex: 1,
    lineHeight: 18,
  },
  actionsContainer: {
    marginBottom: ALCANCE_THEME.spacing.md,
  },
  buttonAprobar: {
    backgroundColor: ALCANCE_THEME.colors.success,
  },
  buttonRechazar: {
    backgroundColor: ALCANCE_THEME.colors.warning,
  },
  isoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E0F2FE',
    padding: ALCANCE_THEME.spacing.md,
    borderRadius: ALCANCE_THEME.borderRadius.sm,
    borderLeftWidth: 4,
    borderLeftColor: ALCANCE_THEME.colors.info,
    marginBottom: ALCANCE_THEME.spacing.xl,
  },
  isoText: {
    fontSize: 13,
    color: ALCANCE_THEME.colors.text,
    marginLeft: ALCANCE_THEME.spacing.sm,
    flex: 1,
    lineHeight: 18,
  },
  isoBold: {
    fontWeight: '600',
  },
});

export default ValidacionScreen;
