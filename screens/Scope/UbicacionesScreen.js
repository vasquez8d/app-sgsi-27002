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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import SearchBarEnhanced from '../../components/SearchBarEnhanced';
import MetricCard from '../../components/MetricCard';
import FilterChip from '../../components/FilterChip';
import TipoUbicacionPickerFilter from '../../components/TipoUbicacionPickerFilter';
import TipoActivoPickerFilter from '../../components/TipoActivoPickerFilter';
import UbicacionCard from '../../components/UbicacionCard';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import { ALCANCE_THEME, TIPO_UBICACION, ESTADO_PROCESO, TIPO_ACTIVO_UBICACION } from '../../utils/alcanceConstants';
import { getUbicaciones, addUbicacion, updateUbicacion, deleteUbicacion } from '../../services/alcance/alcanceCRUD';
import { updateCompletitud } from '../../services/alcance/alcanceService';
import UbicacionForm from './UbicacionForm';
import { insertUbicacionesEjemplo } from '../../utils/insertUbicacionesEjemplo';
import { calculateMetricCardWidth } from '../../utils/responsive';

const UbicacionesScreen = ({ navigation }) => {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [filteredUbicaciones, setFilteredUbicaciones] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('Todos');
  const [selectedTiposActivo, setSelectedTiposActivo] = useState([]);
  const [selectedEstado, setSelectedEstado] = useState('Todos');
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUbicacion, setEditingUbicacion] = useState(null);

  useEffect(() => {
    loadUbicaciones();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedTipo, selectedTiposActivo, selectedEstado, ubicaciones]);

  const loadUbicaciones = useCallback(() => {
    const data = getUbicaciones();
    setUbicaciones(data);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    loadUbicaciones();
    await updateCompletitud();
    setRefreshing(false);
  }, [loadUbicaciones]);

  const applyFilters = useCallback(() => {
    let filtered = [...ubicaciones];

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.nombreSitio.toLowerCase().includes(query) ||
          u.direccion?.toLowerCase().includes(query) ||
          u.tipo.toLowerCase().includes(query) ||
          u.responsableSitio?.toLowerCase().includes(query)
      );
    }

    if (selectedTipo !== 'Todos') {
      filtered = filtered.filter((u) => u.tipo === selectedTipo);
    }

    if (selectedTiposActivo.length > 0) {
      filtered = filtered.filter((u) => {
        if (!u.tiposActivo || u.tiposActivo.length === 0) return false;
        const hasMatch = selectedTiposActivo.some((tipo) => u.tiposActivo.includes(tipo));
        console.log('Filtro Tipos Activo:', {
          ubicacion: u.nombreSitio,
          tiposActivo: u.tiposActivo,
          selectedTipos: selectedTiposActivo,
          hasMatch
        });
        return hasMatch;
      });
    }

    if (selectedEstado === 'Incluido') {
      filtered = filtered.filter((u) => u.incluido);
    } else if (selectedEstado === 'Excluido') {
      filtered = filtered.filter((u) => !u.incluido);
    } else if (selectedEstado === 'En Evaluación') {
      filtered = [];
    }

    setFilteredUbicaciones(filtered);
  }, [searchQuery, selectedTipo, selectedTiposActivo, selectedEstado, ubicaciones]);

  const handleInsertarEjemplos = () => {
    Alert.alert(
      'Insertar Datos de Ejemplo',
      '¿Deseas cargar 15 ubicaciones físicas de ejemplo para la empresa de fabricación de pinturas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Insertar',
          onPress: () => {
            const result = insertUbicacionesEjemplo();
            if (result.success) {
              loadUbicaciones();
              updateCompletitud();
              Alert.alert('Éxito', result.message);
            } else {
              Alert.alert('Error', result.error);
            }
          },
        },
      ]
    );
  };

  const handleBorrarTodos = () => {
    Alert.alert(
      'Borrar Todas las Ubicaciones',
      '⚠️ Esta acción eliminará TODAS las ubicaciones y no se puede deshacer. ¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar Todo',
          style: 'destructive',
          onPress: () => {
            try {
              ubicaciones.forEach((ubicacion) => {
                deleteUbicacion(ubicacion.id);
              });
              loadUbicaciones();
              updateCompletitud();
              Alert.alert('Éxito', 'Todas las ubicaciones han sido eliminadas');
            } catch (error) {
              Alert.alert('Error', 'No se pudieron eliminar las ubicaciones');
            }
          },
        },
      ]
    );
  };

  const handleAddUbicacion = () => {
    setEditingUbicacion(null);
    setModalVisible(true);
  };

  const handleEditUbicacion = useCallback((ubicacion) => {
    setEditingUbicacion(ubicacion);
    setModalVisible(true);
  }, []);

  const handleSaveUbicacion = useCallback(async (ubicacionData) => {
    if (editingUbicacion) {
      const result = updateUbicacion(editingUbicacion.id, ubicacionData);
      if (result.success) {
        loadUbicaciones();
        await updateCompletitud();
        setModalVisible(false);
      } else {
        Alert.alert('Error', 'No se pudo actualizar la ubicación: ' + result.error);
      }
    } else {
      const result = addUbicacion(ubicacionData);
      if (result.success) {
        loadUbicaciones();
        await updateCompletitud();
        setModalVisible(false);
      } else {
        Alert.alert('Error', 'No se pudo agregar la ubicación: ' + result.error);
      }
    }
  }, [editingUbicacion, loadUbicaciones]);

  const handleDeleteUbicacion = useCallback((id, nombre) => {
    Alert.alert(
      'Confirmar Eliminación',
      `¿Está seguro de eliminar la ubicación "${nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            const result = deleteUbicacion(id);
            if (result.success) {
              loadUbicaciones();
              updateCompletitud();
            } else {
              Alert.alert('Error', 'No se pudo eliminar la ubicación: ' + result.error);
            }
          },
        },
      ]
    );
  }, [loadUbicaciones]);

  const getTipoIcon = useCallback((tipo) => {
    switch (tipo) {
      case 'Oficina Principal':
        return 'business-outline';
      case 'Sucursal':
        return 'storefront-outline';
      case 'Remoto':
        return 'laptop-outline';
      case 'Data Center':
        return 'server-outline';
      case 'Cliente':
        return 'people-outline';
      default:
        return 'location-outline';
    }
  }, []);

  const getTipoColor = useCallback((tipo) => {
    switch (tipo) {
      case 'Oficina Principal':
        return '#8B5CF6';
      case 'Sucursal':
        return '#3B82F6';
      case 'Remoto':
        return '#10B981';
      case 'Data Center':
        return '#F59E0B';
      case 'Cliente':
        return '#EF4444';
      default:
        return ALCANCE_THEME.colors.info;
    }
  }, []);

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

  // Memoizar cálculos de métricas
  const metrics = useMemo(() => {
    const totalUbicaciones = ubicaciones.length;
    const totalIncluidas = ubicaciones.filter((u) => u.incluido).length;
    const totalExcluidas = ubicaciones.filter((u) => !u.incluido).length;
    const porTipo = {};
    Object.values(TIPO_UBICACION).forEach((tipo) => {
      porTipo[tipo] = ubicaciones.filter((u) => u.tipo === tipo).length;
    });

    return {
      totalUbicaciones,
      totalIncluidas,
      totalExcluidas,
      porTipo,
    };
  }, [ubicaciones]);

  // Verificar si hay filtros activos
  const hasActiveFilters = useMemo(
    () => selectedTipo !== 'Todos' || selectedTiposActivo.length > 0 || selectedEstado !== 'Todos' || searchQuery.trim() !== '',
    [selectedTipo, selectedTiposActivo, selectedEstado, searchQuery]
  );

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedTipo('Todos');
    setSelectedTiposActivo([]);
    setSelectedEstado('Todos');
  }, []);

  const renderUbicacion = useCallback(({ item }) => (
    <UbicacionCard
      ubicacion={item}
      onEdit={handleEditUbicacion}
      onDelete={handleDeleteUbicacion}
      getTipoIcon={getTipoIcon}
      getTipoColor={getTipoColor}
    />
  ), [handleEditUbicacion, handleDeleteUbicacion, getTipoIcon, getTipoColor]);

  // Calcular ancho responsivo de cards de métricas
  const totalMetrics = 1 + Object.values(metrics.porTipo).filter(count => count > 0).length;
  const metricCardWidth = useMemo(() => calculateMetricCardWidth(totalMetrics, 62, 6), [totalMetrics]);

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
            icon="location-outline"
            iconColor={ALCANCE_THEME.colors.primary}
            value={metrics.totalUbicaciones}
            label="Total"
            backgroundColor={`${ALCANCE_THEME.colors.primary}08`}
            borderColor={`${ALCANCE_THEME.colors.primary}30`}
            testID="metric-total"
            accessibilityLabel={`Total de ubicaciones: ${metrics.totalUbicaciones}`}
            width={metricCardWidth}
          />
          {Object.keys(metrics.porTipo).map((tipo) => {
            const count = metrics.porTipo[tipo];
            if (count === 0) return null;
            
            const iconMap = {
              'Oficina Principal': 'business-outline',
              'Sucursal': 'storefront-outline',
              'Remoto': 'laptop-outline',
              'Data Center': 'server-outline',
              'Cliente': 'people-outline',
            };
            const colorMap = {
              'Oficina Principal': '#8B5CF6',
              'Sucursal': '#3B82F6',
              'Remoto': '#10B981',
              'Data Center': '#F59E0B',
              'Cliente': '#EF4444',
            };
            const labelMap = {
              'Oficina Principal': 'Ofic. Prin.',
              'Data Center': 'DataC.',
            };
            const color = colorMap[tipo] || ALCANCE_THEME.colors.info;
            const displayLabel = labelMap[tipo] || tipo;

            return (
              <MetricCard
                key={tipo}
                icon={iconMap[tipo]}
                iconColor={color}
                value={count}
                label={displayLabel}
                backgroundColor={`${color}08`}
                borderColor={`${color}30`}
                valueColor={color}
                testID={`metric-${tipo}`}
                accessibilityLabel={`${tipo}: ${count}`}
                width={metricCardWidth}
              />
            );
          })}
        </ScrollView>
      </View>

      {/* Búsqueda Mejorada */}
      <View style={styles.searchContainer}>
        <SearchBarEnhanced
          placeholder="Buscar ubicaciones..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filtro de Tipo de Ubicación con Picker */}
      <TipoUbicacionPickerFilter
        tiposUbicacion={TIPO_UBICACION}
        selectedValue={selectedTipo}
        onValueChange={setSelectedTipo}
      />

      {/* Filtro de Tipos de Activo con Picker */}
      <TipoActivoPickerFilter
        selectedTipos={selectedTiposActivo}
        onSelectionChange={setSelectedTiposActivo}
      />

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

      {/* Botón limpiar filtros */}
      {hasActiveFilters && (
        <View style={styles.clearFiltersContainer}>
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={clearAllFilters}
            testID="clear-filters"
          >
            <Ionicons name="close-circle-outline" size={20} color={ALCANCE_THEME.colors.error} />
            <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Lista de Ubicaciones */}
      <FlatList
        data={filteredUbicaciones}
        renderItem={renderUbicacion}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <EmptyState
            icon="location-outline"
            title="No hay ubicaciones"
            description={
              searchQuery || selectedTipo !== 'Todos' || selectedEstado !== 'Todos'
                ? 'No se encontraron ubicaciones con los filtros aplicados'
                : 'Agrega la primera ubicación física al alcance'
            }
          />
        }
      />

      {/* FAB para agregar ubicación */}
      <TouchableOpacity style={styles.fab} onPress={handleAddUbicacion}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* FAB para insertar ejemplos - solo si no hay datos */}
      {ubicaciones.length === 0 && (
        <TouchableOpacity style={styles.fabExample} onPress={handleInsertarEjemplos}>
          <Ionicons name="download-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* FAB para borrar todos los datos - solo si hay datos */}
      {/* {ubicaciones.length > 0 && (
        <TouchableOpacity style={styles.fabDelete} onPress={handleBorrarTodos}>
          <Ionicons name="trash" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )} */}

      {/* Modal para agregar/editar ubicación */}
      <Modal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        title={editingUbicacion ? 'Editar Ubicación' : 'Nueva Ubicación'}
      >
        <UbicacionForm
          ubicacion={editingUbicacion}
          onSave={handleSaveUbicacion}
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
  searchContainer: {
    paddingHorizontal: ALCANCE_THEME.spacing.md,
    paddingVertical: ALCANCE_THEME.spacing.sm,
    backgroundColor: '#FFFFFF',
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filtersContent: {
    paddingHorizontal: ALCANCE_THEME.spacing.md,
    paddingVertical: ALCANCE_THEME.spacing.md,
    gap: ALCANCE_THEME.spacing.xs,
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: ALCANCE_THEME.colors.text,
    marginRight: ALCANCE_THEME.spacing.xs,
  },
  clearFiltersContainer: {
    paddingHorizontal: ALCANCE_THEME.spacing.md,
    paddingVertical: ALCANCE_THEME.spacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ALCANCE_THEME.spacing.xs,
    paddingVertical: ALCANCE_THEME.spacing.xs,
  },
  clearFiltersText: {
    fontSize: 14,
    color: ALCANCE_THEME.colors.error,
    fontWeight: '500',
  },
  listContent: {
    padding: ALCANCE_THEME.spacing.md,
    paddingBottom: 100,
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
  fabExample: {
    position: 'absolute',
    right: ALCANCE_THEME.spacing.lg,
    bottom: ALCANCE_THEME.spacing.lg + 70,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: ALCANCE_THEME.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabDelete: {
    position: 'absolute',
    right: ALCANCE_THEME.spacing.lg,
    bottom: ALCANCE_THEME.spacing.lg + 70,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: ALCANCE_THEME.colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default UbicacionesScreen;
