import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  TouchableOpacity,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ALCANCE_THEME, ALCANCE_ICONS } from '../../utils/alcanceConstants';
import { formatDateTime } from '../../utils/helpers';
import Header from '../../components/Header';
import AlcanceCard from '../../components/AlcanceCard';
import { getAlcanceData, calculateCompletitud, initAlcanceTables } from '../../services/alcance/alcanceService';

const AlcanceDashboard = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    metadata: {
      nombreProyecto: 'SGSI ISO 27002:2013',
      estado: 'Borrador',
      completitud: 0,
      version: '1.0',
    },
    procesos: [],
    unidades: [],
    ubicaciones: [],
    infraestructura: [],
    exclusiones: [],
    validacion: {
      fechaValidez: new Date(),
      proximaRevision: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
  });
  const [stats, setStats] = useState({
    procesosTotal: 0,
    procesosIncluidos: 0,
    unidadesTotal: 0,
    unidadesIncluidas: 0,
    ubicacionesTotal: 0,
    ubicacionesIncluidas: 0,
    infraestructuraTotal: 0,
    infraestructuraIncluida: 0,
    exclusionesTotal: 0,
    exclusionesPendientes: 0,
  });

  useEffect(() => {
    initAlcanceTables();
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const alcanceData = await getAlcanceData();
      setData(alcanceData);
      
      // Calcular estadísticas
      const newStats = {
        procesosTotal: alcanceData.procesos.length,
        procesosIncluidos: alcanceData.procesos.filter(p => p.estado === 'Incluido').length,
        unidadesTotal: alcanceData.unidades.length,
        unidadesIncluidas: alcanceData.unidades.filter(u => u.incluida).length,
        ubicacionesTotal: alcanceData.ubicaciones.length,
        ubicacionesIncluidas: alcanceData.ubicaciones.filter(u => u.incluido).length,
        infraestructuraTotal: alcanceData.infraestructura.length,
        infraestructuraIncluida: alcanceData.infraestructura.filter(i => i.incluidoAlcance).length,
        exclusionesTotal: alcanceData.exclusiones.length,
        exclusionesPendientes: alcanceData.exclusiones.filter(e => e.revisionPendiente).length,
      };
      setStats(newStats);
      
      // Calcular completitud
      const completitud = calculateCompletitud(alcanceData);
      setData(prev => ({
        ...prev,
        metadata: { ...prev.metadata, completitud },
      }));
    } catch (error) {
      console.error('Error loading alcance data:', error);
      Alert.alert('Error', 'No se pudo cargar la información del alcance');
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    loadData();
  }, [loadData]);

  const getCompletitudColor = (value) => {
    if (value >= 80) return ALCANCE_THEME.colors.success;
    if (value >= 50) return ALCANCE_THEME.colors.warning;
    return ALCANCE_THEME.colors.danger;
  };

  const formatLastUpdate = (date) => {
    if (!date) return 'Nunca';
    return formatDateTime(date).split(' ')[0];
  };

  return (
    <View style={styles.container}>
      <Header
        title="Gestión del Alcance"
        subtitle="ISO/IEC 27001 - Punto 4.3"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        {/* Header Card con Estado y Completitud */}
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={styles.headerInfo}>
              <Text style={styles.projectName}>{data.metadata.nombreProyecto}</Text>
              <Text style={styles.version}>Versión {data.metadata.version}</Text>
            </View>
            <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(data.metadata.estado) }]}>
              <Text style={styles.estadoText}>{data.metadata.estado}</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Completitud del Documento</Text>
              <Text style={[styles.progressValue, { color: getCompletitudColor(data.metadata.completitud) }]}>
                {data.metadata.completitud}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${data.metadata.completitud}%`,
                    backgroundColor: getCompletitudColor(data.metadata.completitud),
                  },
                ]}
              />
            </View>
          </View>

          {/* Alertas */}
          {data.metadata.completitud < 80 && (
            <View style={styles.alertBox}>
              <Ionicons name="alert-circle" size={20} color={ALCANCE_THEME.colors.warning} />
              <Text style={styles.alertText}>
                Se requiere al menos 80% de completitud para aprobar el documento
              </Text>
            </View>
          )}

          {stats.exclusionesPendientes > 0 && (
            <View style={[styles.alertBox, { backgroundColor: ALCANCE_THEME.colors.danger + '15' }]}>
              <Ionicons name="time-outline" size={20} color={ALCANCE_THEME.colors.danger} />
              <Text style={[styles.alertText, { color: ALCANCE_THEME.colors.danger }]}>
                {stats.exclusionesPendientes} exclusion(es) pendiente(s) de revisión
              </Text>
            </View>
          )}
        </View>

        {/* Cards de Secciones */}
        <View style={styles.sectionsContainer}>
          <AlcanceCard
            icon={ALCANCE_ICONS.procesos}
            title="Procesos y Servicios"
            metrics={`${stats.procesosIncluidos} de ${stats.procesosTotal} incluidos`}
            badge={{ count: stats.procesosTotal, color: ALCANCE_THEME.colors.primary }}
            lastUpdate={formatLastUpdate(data.metadata.fechaCreacion)}
            onPress={() => navigation.navigate('Procesos')}
          />

          <AlcanceCard
            icon={ALCANCE_ICONS.unidades}
            title="Unidades Organizativas"
            metrics={`${stats.unidadesIncluidas} de ${stats.unidadesTotal} en alcance`}
            badge={{ count: stats.unidadesTotal, color: ALCANCE_THEME.colors.primaryLight }}
            lastUpdate={formatLastUpdate(data.metadata.fechaCreacion)}
            onPress={() => navigation.navigate('Unidades')}
          />

          <AlcanceCard
            icon={ALCANCE_ICONS.ubicaciones}
            title="Ubicaciones Físicas"
            metrics={`${stats.ubicacionesIncluidas} de ${stats.ubicacionesTotal} sitios`}
            badge={{ count: stats.ubicacionesTotal, color: ALCANCE_THEME.colors.info }}
            lastUpdate={formatLastUpdate(data.metadata.fechaCreacion)}
            onPress={() => navigation.navigate('Ubicaciones')}
          />

          <AlcanceCard
            icon={ALCANCE_ICONS.infraestructura}
            title="Infraestructura TI"
            metrics={`${stats.infraestructuraIncluida} de ${stats.infraestructuraTotal} activos`}
            badge={{ count: stats.infraestructuraTotal, color: ALCANCE_THEME.colors.success }}
            lastUpdate={formatLastUpdate(data.metadata.fechaCreacion)}
            onPress={() => navigation.navigate('Infraestructura')}
          />

          <AlcanceCard
            icon={ALCANCE_ICONS.exclusiones}
            title="Exclusiones"
            metrics={`${stats.exclusionesTotal} elementos excluidos`}
            badge={{ 
              count: stats.exclusionesPendientes, 
              color: stats.exclusionesPendientes > 0 ? ALCANCE_THEME.colors.danger : ALCANCE_THEME.colors.textSecondary 
            }}
            lastUpdate={formatLastUpdate(data.metadata.fechaCreacion)}
            onPress={() => navigation.navigate('Exclusiones')}
          />

          <AlcanceCard
            icon={ALCANCE_ICONS.validacion}
            title="Validación y Aprobación"
            status={data.metadata.estado}
            metrics={`Próxima revisión: ${formatLastUpdate(data.validacion.proximaRevision)}`}
            onPress={() => navigation.navigate('Validacion')}
          />
        </View>

        {/* Información Adicional */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={ALCANCE_THEME.colors.info} />
          <Text style={styles.infoText}>
            El alcance del SGSI define los límites y aplicabilidad del sistema de gestión según ISO/IEC 27001:2013 punto 4.3
          </Text>
        </View>
      </ScrollView>

      {/* FAB - Acciones Rápidas */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          Alert.alert(
            'Acciones Rápidas',
            'Seleccione una acción',
            [
              { text: 'Agregar Proceso', onPress: () => navigation.navigate('Procesos') },
              { text: 'Agregar Unidad', onPress: () => navigation.navigate('Unidades') },
              { text: 'Ver Resumen', onPress: () => navigation.navigate('Validacion') },
              { text: 'Cancelar', style: 'cancel' },
            ]
          );
        }}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const getEstadoColor = (estado) => {
  switch (estado) {
    case 'Aprobado':
    case 'Vigente':
      return ALCANCE_THEME.colors.success;
    case 'En Revisión':
      return ALCANCE_THEME.colors.warning;
    case 'Borrador':
      return ALCANCE_THEME.colors.textSecondary;
    default:
      return ALCANCE_THEME.colors.border;
  }
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
  headerCard: {
    backgroundColor: ALCANCE_THEME.colors.surface,
    borderRadius: ALCANCE_THEME.borderRadius.lg,
    padding: ALCANCE_THEME.spacing.lg,
    marginBottom: ALCANCE_THEME.spacing.lg,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: ALCANCE_THEME.spacing.lg,
  },
  headerInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ALCANCE_THEME.colors.text,
    marginBottom: ALCANCE_THEME.spacing.xs,
  },
  version: {
    fontSize: 14,
    color: ALCANCE_THEME.colors.textSecondary,
  },
  estadoBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  estadoText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  progressSection: {
    marginBottom: ALCANCE_THEME.spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ALCANCE_THEME.spacing.sm,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: ALCANCE_THEME.colors.text,
  },
  progressValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    backgroundColor: ALCANCE_THEME.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ALCANCE_THEME.colors.warning + '15',
    padding: ALCANCE_THEME.spacing.md,
    borderRadius: ALCANCE_THEME.borderRadius.sm,
    marginTop: ALCANCE_THEME.spacing.md,
  },
  alertText: {
    flex: 1,
    marginLeft: ALCANCE_THEME.spacing.sm,
    fontSize: 13,
    color: ALCANCE_THEME.colors.warning,
    lineHeight: 18,
  },
  sectionsContainer: {
    marginBottom: ALCANCE_THEME.spacing.lg,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: ALCANCE_THEME.colors.info + '10',
    padding: ALCANCE_THEME.spacing.md,
    borderRadius: ALCANCE_THEME.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: ALCANCE_THEME.colors.info,
    marginBottom: ALCANCE_THEME.spacing.xl * 2,
  },
  infoText: {
    flex: 1,
    marginLeft: ALCANCE_THEME.spacing.sm,
    fontSize: 13,
    color: ALCANCE_THEME.colors.textSecondary,
    lineHeight: 18,
  },
  fab: {
    position: 'absolute',
    right: ALCANCE_THEME.spacing.lg,
    bottom: ALCANCE_THEME.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ALCANCE_THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});

export default AlcanceDashboard;
