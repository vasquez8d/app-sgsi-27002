import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchBarEnhanced from '../../components/SearchBarEnhanced';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import MacroprocesoPickerFilter from '../../components/MacroprocesoPickerFilter';
import MetricCard from '../../components/MetricCard';
import FilterChip from '../../components/FilterChip';
import ProcesoCard from '../../components/ProcesoCard';
import { ALCANCE_THEME, MACROPROCESOS, ESTADO_PROCESO, CRITICIDAD_LEVELS } from '../../utils/alcanceConstants';
import { getProcesos, addProceso, updateProceso, deleteProceso } from '../../services/alcance/alcanceCRUD';
import { updateCompletitud, initAlcanceTables } from '../../services/alcance/alcanceService';
import { validateProceso } from '../../utils/alcanceValidation';
import ProcesoForm from './ProcesoForm';
import logger from '../../utils/logger';
import { insertProcesosEjemplo } from '../../utils/insertProcesosEjemplo';

const ProcesosScreen = ({ navigation }) => {
  const [procesos, setProcesos] = useState([]);
  const [filteredProcesos, setFilteredProcesos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMacroproceso, setSelectedMacroproceso] = useState('Todos');
  const [selectedEstado, setSelectedEstado] = useState('Todos');
  const [selectedCriticidad, setSelectedCriticidad] = useState('Todas');
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProceso, setEditingProceso] = useState(null);

  useEffect(() => {
    logger.componentMount('ProcesosScreen');
    initAlcanceTables();
    loadProcesos();
    
    return () => {
      logger.componentUnmount('ProcesosScreen');
    };
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedMacroproceso, selectedEstado, selectedCriticidad, procesos]);

  const loadProcesos = () => {
    try {
      logger.performanceStart('loadProcesos');
      const data = getProcesos();
      setProcesos(data);
      logger.performanceEnd('loadProcesos');
      logger.info('ProcesosScreen', `📊 Cargados ${data.length} procesos`);
    } catch (error) {
      logger.error('ProcesosScreen', 'Error cargando procesos', error);
      setProcesos([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    loadProcesos();
    await updateCompletitud();
    setRefreshing(false);
  };

  const applyFilters = () => {
    let filtered = [...procesos];

    // Filtro de búsqueda
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.nombreProceso.toLowerCase().includes(query) ||
          p.macroproceso.toLowerCase().includes(query) ||
          p.responsableArea?.toLowerCase().includes(query)
      );
    }

    // Filtro por macroproceso
    if (selectedMacroproceso !== 'Todos') {
      filtered = filtered.filter((p) => p.macroproceso === selectedMacroproceso);
    }

    // Filtro por estado
    if (selectedEstado !== 'Todos') {
      filtered = filtered.filter((p) => p.estado === selectedEstado);
    }

    // Filtro por criticidad
    if (selectedCriticidad !== 'Todas') {
      filtered = filtered.filter((p) => p.criticidad === selectedCriticidad);
    }

    setFilteredProcesos(filtered);
  };

  const handleAddProceso = () => {
    setEditingProceso(null);
    setModalVisible(true);
  };

  const handleInsertarEjemplos = () => {
    Alert.alert(
      'Insertar Datos de Ejemplo',
      '¿Deseas cargar 25 procesos de ejemplo para una empresa de fabricación de pinturas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Insertar',
          onPress: () => {
            try {
              const count = insertProcesosEjemplo();
              loadProcesos();
              Alert.alert('Éxito', `${count} procesos de ejemplo insertados correctamente`);
            } catch (error) {
              Alert.alert('Error', 'No se pudieron insertar los procesos: ' + error.message);
            }
          },
        },
      ]
    );
  };

  const handleEditProceso = (proceso) => {
    setEditingProceso(proceso);
    setModalVisible(true);
  };

  const handleSaveProceso = async (procesoData) => {
    logger.info('ProcesosScreen', '💾 Intentando guardar proceso', { nombre: procesoData.nombreProceso });
    
    const validation = validateProceso(procesoData);
    if (!validation.isValid) {
      logger.validationError('ProcesosScreen', 'Proceso', validation.errors);
      alert(`Errores de validación:\n${Object.values(validation.errors).join('\n')}`);
      return;
    }
    
    logger.validationSuccess('ProcesosScreen', 'Proceso', procesoData);

    if (editingProceso) {
      logger.info('ProcesosScreen', `✏️ Actualizando proceso existente: ${editingProceso.id}`);
      const result = updateProceso(editingProceso.id, procesoData);
      if (result.success) {
        logger.info('ProcesosScreen', '✅ Proceso actualizado exitosamente');
        loadProcesos();
        await updateCompletitud();
        setModalVisible(false);
        Alert.alert('Éxito', `Proceso "${procesoData.nombreProceso}" actualizado correctamente`);
      } else {
        logger.error('ProcesosScreen', 'Error al actualizar proceso', new Error(result.error));
        alert('Error al actualizar el proceso: ' + result.error);
      }
    } else {
      logger.info('ProcesosScreen', '➕ Agregando nuevo proceso');
      const result = addProceso(procesoData);
      if (result.success) {
        logger.info('ProcesosScreen', `✅ Proceso guardado exitosamente con ID: ${result.id}`);
        loadProcesos();
        await updateCompletitud();
        setModalVisible(false);
        Alert.alert('Éxito', `Proceso "${procesoData.nombreProceso}" guardado correctamente.\n\nAhora puedes verlo en la lista.`);
      } else {
        logger.error('ProcesosScreen', 'Error al agregar proceso', new Error(result.error));
        alert('Error al agregar el proceso: ' + result.error);
      }
    }
  };

  const handleDeleteProceso = (id, nombre) => {
    if (confirm(`¿Está seguro de eliminar el proceso "${nombre}"?`)) {
      const result = deleteProceso(id);
      if (result.success) {
        loadProcesos();
        updateCompletitud();
      } else {
        alert('Error al eliminar el proceso: ' + result.error);
      }
    }
  };

  // Memoized color functions para optimizar performance
  const getEstadoColor = useCallback((estado) => {
    switch (estado) {
      case 'Incluido':
        return ALCANCE_THEME.colors.success;
      case 'Excluido':
        return ALCANCE_THEME.colors.error;
      case 'En Evaluación':
        return ALCANCE_THEME.colors.warning;
      default:
        return ALCANCE_THEME.colors.textSecondary;
    }
  }, []);

  const getCriticidadColor = useCallback((criticidad) => {
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
        return ALCANCE_THEME.colors.textSecondary;
    }
  }, []);

  // Función para obtener icono según tipo de filtro
  const getEstadoIcon = useCallback((estado) => {
    switch (estado) {
      case 'Incluido':
        return 'checkmark-circle-outline';
      case 'Excluido':
        return 'close-circle-outline';
      case 'En Evaluación':
        return 'time-outline';
      default:
        return 'apps-outline';
    }
  }, []);

  const getCriticidadIcon = useCallback((criticidad) => {
    switch (criticidad) {
      case 'Crítica':
        return 'alert-circle';
      case 'Alta':
        return 'alert';
      case 'Media':
        return 'warning-outline';
      case 'Baja':
        return 'information-circle-outline';
      default:
        return 'layers-outline';
    }
  }, []);

  // Render optimizado con memoización
  const renderProcesoCard = useCallback(({ item }) => (
    <ProcesoCard
      proceso={item}
      onEdit={handleEditProceso}
      onDelete={handleDeleteProceso}
      getEstadoColor={getEstadoColor}
      getCriticidadColor={getCriticidadColor}
    />
  ), [handleEditProceso, handleDeleteProceso, getEstadoColor, getCriticidadColor]);

  // Key extractor optimizado
  const keyExtractor = useCallback((item) => item.id, []);

  // getItemLayout para optimizar FlatList
  const getItemLayout = useCallback((data, index) => ({
    length: 160, // Altura aproximada del card
    offset: 160 * index,
    index,
  }), []);

  // Memoizar cálculos de métricas
  const metrics = useMemo(() => {
    const totalProcesos = procesos.length;
    const totalIncluidos = procesos.filter((p) => p.estado === 'Incluido').length;
    const totalEvaluacion = procesos.filter((p) => p.estado === 'En Evaluación').length;
    const totalExcluidos = procesos.filter((p) => p.estado === 'Excluido').length;
    const criticaAlta = procesos.filter((p) => p.criticidad === 'Crítica' || p.criticidad === 'Alta').length;
    const criticaMedia = procesos.filter((p) => p.criticidad === 'Media').length;
    const criticaBaja = procesos.filter((p) => p.criticidad === 'Baja').length;

    return {
      totalProcesos,
      totalIncluidos,
      totalEvaluacion,
      totalExcluidos,
      criticaAlta,
      criticaMedia,
      criticaBaja,
    };
  }, [procesos]);

  // Verificar si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    return selectedMacroproceso !== 'Todos' || 
           selectedEstado !== 'Todos' || 
           selectedCriticidad !== 'Todas' ||
           searchQuery.trim() !== '';
  }, [selectedMacroproceso, selectedEstado, selectedCriticidad, searchQuery]);

  // Función para limpiar todos los filtros
  const clearAllFilters = useCallback(() => {
    setSelectedMacroproceso('Todos');
    setSelectedEstado('Todos');
    setSelectedCriticidad('Todas');
    setSearchQuery('');
  }, []);



  return (
    <View style={styles.container}>
      {/* Dashboard de Métricas Optimizado */}
      <View style={styles.dashboardContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dashboardContent}
          testID="metrics-dashboard"
        >
          <MetricCard
            icon="apps-outline"
            iconColor={ALCANCE_THEME.colors.primary}
            value={metrics.totalProcesos}
            label="Total"
            backgroundColor={`${ALCANCE_THEME.colors.primary}08`}
            borderColor={`${ALCANCE_THEME.colors.primary}30`}
            testID="metric-total"
            accessibilityLabel={`Total de procesos: ${metrics.totalProcesos}`}
          />
          <MetricCard
            icon="checkmark-circle-outline"
            iconColor={ALCANCE_THEME.colors.success}
            value={metrics.totalIncluidos}
            label="Incl."
            backgroundColor={`${ALCANCE_THEME.colors.success}08`}
            borderColor={`${ALCANCE_THEME.colors.success}30`}
            valueColor={ALCANCE_THEME.colors.success}
            testID="metric-incluidos"
            accessibilityLabel={`Procesos incluidos: ${metrics.totalIncluidos}`}
          />
          <MetricCard
            icon="time-outline"
            iconColor={ALCANCE_THEME.colors.warning}
            value={metrics.totalEvaluacion}
            label="Eval."
            backgroundColor={`${ALCANCE_THEME.colors.warning}08`}
            borderColor={`${ALCANCE_THEME.colors.warning}30`}
            valueColor={ALCANCE_THEME.colors.warning}
            testID="metric-evaluacion"
            accessibilityLabel={`Procesos en evaluación: ${metrics.totalEvaluacion}`}
          />
          <MetricCard
            icon="close-circle-outline"
            iconColor={ALCANCE_THEME.colors.error}
            value={metrics.totalExcluidos}
            label="Excl."
            backgroundColor={`${ALCANCE_THEME.colors.error}08`}
            borderColor={`${ALCANCE_THEME.colors.error}30`}
            valueColor={ALCANCE_THEME.colors.error}
            testID="metric-excluidos"
            accessibilityLabel={`Procesos excluidos: ${metrics.totalExcluidos}`}
          />
          <View style={[styles.metricCardCriticidad, styles.metricCard]}>
            <View style={styles.criticidadHeader}>
              <Ionicons name="warning-outline" size={14} color="#DC2626" />
              <Text style={styles.metricLabelSmall}>Critic.</Text>
            </View>
            <View style={styles.criticidadBadges}>
              <View style={styles.criticidadBadge}>
                <View style={[styles.criticidadDot, { backgroundColor: '#DC2626' }]} />
                <Text style={styles.criticidadText}>A {metrics.criticaAlta}</Text>
              </View>
              <View style={styles.criticidadBadge}>
                <View style={[styles.criticidadDot, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.criticidadText}>M {metrics.criticaMedia}</Text>
              </View>
              <View style={styles.criticidadBadge}>
                <View style={[styles.criticidadDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.criticidadText}>B {metrics.criticaBaja}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Tag de filtro activo de macroproceso */}
      {selectedMacroproceso !== 'Todos' && (
        <View style={styles.activeFilterTag}>
          <Text style={styles.activeFilterText}>
            Macroproceso: {selectedMacroproceso}
          </Text>
          <TouchableOpacity
            onPress={() => setSelectedMacroproceso('Todos')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            testID="clear-macroproceso-filter"
            accessibilityLabel="Quitar filtro de macroproceso"
            accessibilityRole="button"
          >
            <Ionicons name="close-circle" size={20} color={ALCANCE_THEME.colors.primary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Barra de búsqueda mejorada con debounce y clear */}
      <View style={styles.searchContainer}>
        <SearchBarEnhanced
          placeholder="Buscar procesos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          testID="search-procesos"
          accessibilityLabel="Buscar procesos por nombre, macroproceso o responsable"
        />
      </View>

      {/* Filtros - Macroproceso con Picker o Chips según cantidad */}
      {Object.keys(MACROPROCESOS).length > 4 ? (
        <View style={styles.pickerFilterContainer}>
          <MacroprocesoPickerFilter
            macroprocesos={MACROPROCESOS}
            selectedValue={selectedMacroproceso}
            onValueChange={setSelectedMacroproceso}
          />
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          <Text style={styles.filterLabel}>Macroproceso:</Text>
          {renderFilterChip('Todos', selectedMacroproceso === 'Todos', () =>
            setSelectedMacroproceso('Todos')
          )}
          {Object.keys(MACROPROCESOS).map((key) => (
            <React.Fragment key={key}>
              {renderFilterChip(
                MACROPROCESOS[key],
                selectedMacroproceso === MACROPROCESOS[key],
                () => setSelectedMacroproceso(MACROPROCESOS[key])
              )}
            </React.Fragment>
          ))}
        </ScrollView>
      )}

      {/* Filtros de Estado optimizados con iconos */}
      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          <Text style={styles.filterLabel}>Estado:</Text>
          <FilterChip
            label="Todos"
            isSelected={selectedEstado === 'Todos'}
            onPress={() => setSelectedEstado('Todos')}
            icon={getEstadoIcon('Todos')}
            testID="filter-estado-todos"
            accessibilityLabel="Filtrar por todos los estados"
          />
          {Object.keys(ESTADO_PROCESO).map((key) => (
            <FilterChip
              key={key}
              label={ESTADO_PROCESO[key]}
              isSelected={selectedEstado === ESTADO_PROCESO[key]}
              onPress={() => setSelectedEstado(ESTADO_PROCESO[key])}
              icon={getEstadoIcon(ESTADO_PROCESO[key])}
              testID={`filter-estado-${key.toLowerCase()}`}
              accessibilityLabel={`Filtrar por estado ${ESTADO_PROCESO[key]}`}
            />
          ))}
        </ScrollView>
      </View>

      {/* Filtros de Criticidad optimizados con iconos */}
      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          <Text style={styles.filterLabel}>Criticidad:</Text>
          <FilterChip
            label="Todas"
            isSelected={selectedCriticidad === 'Todas'}
            onPress={() => setSelectedCriticidad('Todas')}
            icon={getCriticidadIcon('Todas')}
            testID="filter-criticidad-todas"
            accessibilityLabel="Filtrar por todas las criticidades"
          />
          {Object.keys(CRITICIDAD_LEVELS).map((key) => (
            <FilterChip
              key={key}
              label={CRITICIDAD_LEVELS[key]}
              isSelected={selectedCriticidad === CRITICIDAD_LEVELS[key]}
              onPress={() => setSelectedCriticidad(CRITICIDAD_LEVELS[key])}
              icon={getCriticidadIcon(CRITICIDAD_LEVELS[key])}
              testID={`filter-criticidad-${key.toLowerCase()}`}
              accessibilityLabel={`Filtrar por criticidad ${CRITICIDAD_LEVELS[key]}`}
            />
          ))}
        </ScrollView>
      </View>

      {/* Botón para limpiar todos los filtros */}
      {hasActiveFilters && (
        <View style={styles.clearFiltersContainer}>
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={clearAllFilters}
            testID="clear-all-filters"
            accessibilityLabel="Limpiar todos los filtros"
            accessibilityRole="button"
          >
            <Ionicons name="close-circle-outline" size={18} color={ALCANCE_THEME.colors.primary} />
            <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Lista de procesos optimizada con performance mejorada */}
      <FlatList
        data={filteredProcesos}
        renderItem={renderProcesoCard}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={10}
        removeClippedSubviews={true}
        testID="procesos-list"
        ListEmptyComponent={
          <View>
            <EmptyState
              icon="folder-open-outline"
              title="No hay procesos"
              description={
                searchQuery || selectedMacroproceso !== 'Todos'
                  ? 'No se encontraron procesos con los filtros aplicados'
                  : 'Agrega tu primer proceso al alcance del SGSI'
              }
            />
            {procesos.length === 0 && (
              <TouchableOpacity
                style={styles.btnEjemplo}
                onPress={handleInsertarEjemplos}
              >
                <Ionicons name="flask-outline" size={20} color={ALCANCE_THEME.colors.primary} />
                <Text style={styles.btnEjemploText}>Cargar Datos de Ejemplo</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {/* FAB con accesibilidad mejorada */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={handleAddProceso}
        testID="fab-add-proceso"
        accessibilityLabel="Agregar nuevo proceso"
        accessibilityRole="button"
        accessibilityHint="Abre el formulario para crear un nuevo proceso"
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Modal de formulario */}
      <Modal visible={modalVisible} onClose={() => setModalVisible(false)} title={editingProceso ? 'Editar Proceso' : 'Nuevo Proceso'}>
        <ProcesoForm
          proceso={editingProceso}
          onSave={handleSaveProceso}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ALCANCE_THEME.colors.background,
  },
  dashboardContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dashboardContent: {
    paddingHorizontal: ALCANCE_THEME.spacing.sm,
    paddingVertical: ALCANCE_THEME.spacing.sm,
    gap: ALCANCE_THEME.spacing.xs,
  },
  metricCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 8,
    minWidth: 70,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  metricCardPrimary: {
    backgroundColor: `${ALCANCE_THEME.colors.primary}08`,
    borderColor: `${ALCANCE_THEME.colors.primary}30`,
  },
  metricCardSuccess: {
    backgroundColor: `${ALCANCE_THEME.colors.success}08`,
    borderColor: `${ALCANCE_THEME.colors.success}30`,
  },
  metricCardWarning: {
    backgroundColor: `${ALCANCE_THEME.colors.warning}08`,
    borderColor: `${ALCANCE_THEME.colors.warning}30`,
  },
  metricCardError: {
    backgroundColor: `${ALCANCE_THEME.colors.error}08`,
    borderColor: `${ALCANCE_THEME.colors.error}30`,
  },
  metricCardCriticidad: {
    minWidth: 90,
    alignItems: 'flex-start',
    backgroundColor: '#FEF3C7',
    borderColor: '#FCD34D',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '700',
    color: ALCANCE_THEME.colors.primary,
    marginTop: 2,
  },
  metricLabel: {
    fontSize: 11,
    color: ALCANCE_THEME.colors.textSecondary,
    marginTop: 1,
    fontWeight: '600',
  },
  metricLabelSmall: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginLeft: 2,
  },
  criticidadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  criticidadBadges: {
    gap: 2,
    width: '100%',
  },
  criticidadBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  criticidadDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  criticidadText: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '500',
  },
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabsContent: {
    paddingHorizontal: 12,
    gap: 4,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    position: 'relative',
  },
  tabActive: {
    // Tab activo sin background, solo indicador
  },
  tabText: {
    fontSize: 13,
    color: ALCANCE_THEME.colors.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    fontSize: 13,
    color: ALCANCE_THEME.colors.primary,
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 12,
    right: 12,
    height: 2,
    backgroundColor: ALCANCE_THEME.colors.primary,
    borderRadius: 1,
  },
  searchContainer: {
    paddingHorizontal: ALCANCE_THEME.spacing.md,
    paddingVertical: ALCANCE_THEME.spacing.sm,
    backgroundColor: '#FFFFFF',
  },
  pickerFilterContainer: {
    paddingHorizontal: ALCANCE_THEME.spacing.md,
    paddingVertical: ALCANCE_THEME.spacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: ALCANCE_THEME.colors.text,
    marginRight: 10,
    marginBottom: 0,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChipSelected: {
    backgroundColor: ALCANCE_THEME.colors.primary,
    borderColor: ALCANCE_THEME.colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  filterChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContent: {
    padding: ALCANCE_THEME.spacing.md,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: ALCANCE_THEME.borderRadius.md,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  cardHeaderText: {
    marginLeft: 8,
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: ALCANCE_THEME.typography.fontWeightBold,
    color: ALCANCE_THEME.colors.text,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: ALCANCE_THEME.colors.textSecondary,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionButton: {
    padding: 6,
  },
  cardDescription: {
    fontSize: 13,
    color: ALCANCE_THEME.colors.text,
    lineHeight: 18,
    marginBottom: 8,
  },
  cardDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    color: ALCANCE_THEME.colors.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: ALCANCE_THEME.spacing.xs,
    flexWrap: 'wrap',
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
  btnEjemplo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${ALCANCE_THEME.colors.primary}15`,
    borderWidth: 1,
    borderColor: ALCANCE_THEME.colors.primary,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 40,
    marginTop: 20,
    gap: 8,
  },
  btnEjemploText: {
    fontSize: 14,
    fontWeight: '600',
    color: ALCANCE_THEME.colors.primary,
  },
  // Nuevos estilos para UX mejorada
  activeFilterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: `${ALCANCE_THEME.colors.primary}10`,
    borderLeftWidth: 3,
    borderLeftColor: ALCANCE_THEME.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  activeFilterText: {
    fontSize: 14,
    color: ALCANCE_THEME.colors.primary,
    fontWeight: '600',
    flex: 1,
  },
  clearFiltersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: `${ALCANCE_THEME.colors.primary}08`,
    borderWidth: 1,
    borderColor: `${ALCANCE_THEME.colors.primary}30`,
    gap: 6,
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '600',
    color: ALCANCE_THEME.colors.primary,
  },
  metricCard: {
    padding: 8,
    minWidth: 70,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 6,
    borderWidth: 1,
  },
});

export default ProcesosScreen;
