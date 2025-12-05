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
import TipoActivoInfraPickerFilter from '../../components/TipoActivoInfraPickerFilter';
import EstadoActivoPickerFilter from '../../components/EstadoActivoPickerFilter';
import CriticidadPickerFilter from '../../components/CriticidadPickerFilter';
import InfraestructuraCard from '../../components/InfraestructuraCard';
import FilterChip from '../../components/FilterChip';
import MetricCard from '../../components/MetricCard';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import { ALCANCE_THEME, TIPO_ACTIVO_INFRA, CRITICIDAD_LEVELS, ESTADO_ACTIVO } from '../../utils/alcanceConstants';
import { getInfraestructura, addInfraestructura, updateInfraestructura, deleteInfraestructura } from '../../services/alcance/alcanceCRUD';
import { updateCompletitud } from '../../services/alcance/alcanceService';
import { insertInfraestructuraEjemplo } from '../../utils/insertInfraestructuraEjemplo';
import { calculateMetricCardWidth } from '../../utils/responsive';
import InfraestructuraForm from './InfraestructuraForm';

const InfraestructuraScreen = ({ navigation }) => {
  const [infraestructura, setInfraestructura] = useState([]);
  const [filteredInfra, setFilteredInfra] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTipoActivo, setSelectedTipoActivo] = useState('Todos');
  const [selectedCriticidad, setSelectedCriticidad] = useState('Todas');
  const [selectedEstado, setSelectedEstado] = useState('Todos');
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingInfra, setEditingInfra] = useState(null);

  useEffect(() => {
    loadInfraestructura();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedTipoActivo, selectedCriticidad, selectedEstado, infraestructura]);

  const loadInfraestructura = useCallback(() => {
    const data = getInfraestructura();
    setInfraestructura(data);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    loadInfraestructura();
    await updateCompletitud();
    setRefreshing(false);
  }, [loadInfraestructura]);

  const applyFilters = useCallback(() => {
    let filtered = [...infraestructura];

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.identificador.toLowerCase().includes(query) ||
          i.sitio?.toLowerCase().includes(query) ||
          i.propietario?.toLowerCase().includes(query) ||
          i.unidadNegocio?.toLowerCase().includes(query)
      );
    }

    if (selectedTipoActivo !== 'Todos') {
      filtered = filtered.filter((i) => i.tipoActivo === selectedTipoActivo);
    }

    if (selectedCriticidad !== 'Todas') {
      filtered = filtered.filter((i) => i.criticidad === selectedCriticidad);
    }

    if (selectedEstado !== 'Todos') {
      filtered = filtered.filter((i) => i.estadoActivo === selectedEstado);
    }

    setFilteredInfra(filtered);
  }, [searchQuery, selectedTipoActivo, selectedCriticidad, selectedEstado, infraestructura]);

  const handleAddInfra = () => {
    setEditingInfra(null);
    setModalVisible(true);
  };

  const handleEditInfra = (infra) => {
    setEditingInfra(infra);
    setModalVisible(true);
  };

  const handleSaveInfra = async (infraData) => {
    if (editingInfra) {
      const result = updateInfraestructura(editingInfra.id, infraData);
      if (result.success) {
        loadInfraestructura();
        await updateCompletitud();
        setModalVisible(false);
      } else {
        alert('Error al actualizar infraestructura: ' + result.error);
      }
    } else {
      const result = addInfraestructura(infraData);
      if (result.success) {
        loadInfraestructura();
        await updateCompletitud();
        setModalVisible(false);
      } else {
        alert('Error al agregar infraestructura: ' + result.error);
      }
    }
  };

  const handleDeleteInfra = (id) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Está seguro que desea eliminar este activo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const result = deleteInfraestructura(id);
            if (result.success) {
              loadInfraestructura();
              await updateCompletitud();
            } else {
              Alert.alert('Error', 'No se pudo eliminar el activo');
            }
          },
        },
      ]
    );
  };

  const handleInsertarEjemplos = () => {
    Alert.alert(
      'Cargar Datos de Ejemplo',
      'Se cargarán 15 activos de infraestructura de ejemplo. Esta acción recreará la tabla.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cargar',
          onPress: async () => {
            const result = insertInfraestructuraEjemplo();
            if (result.success) {
              loadInfraestructura();
              await updateCompletitud();
              Alert.alert('Éxito', `Se cargaron ${result.count} activos de ejemplo`);
            } else {
              Alert.alert('Error', 'No se pudieron cargar los datos de ejemplo');
            }
          },
        },
      ]
    );
  };

  const handleBorrarTodos = () => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Está seguro que desea eliminar TODOS los ${infraestructura.length} activos? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar Todo',
          style: 'destructive',
          onPress: async () => {
            infraestructura.forEach((infra) => {
              deleteInfraestructura(infra.id);
            });
            loadInfraestructura();
            await updateCompletitud();
            Alert.alert('Éxito', 'Todos los activos han sido eliminados');
          },
        },
      ]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedTipoActivo('Todos');
    setSelectedCriticidad('Todas');
    setSelectedEstado('Todos');
  };

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.trim() !== '' ||
      selectedTipoActivo !== 'Todos' ||
      selectedCriticidad !== 'Todas' ||
      selectedEstado !== 'Todos'
    );
  }, [searchQuery, selectedTipoActivo, selectedCriticidad, selectedEstado]);

  const getTipoActivoIcon = useCallback((tipo) => {
    switch (tipo) {
      case 'Personas':
        return 'people-outline';
      case 'Aplicaciones':
        return 'apps-outline';
      case 'Información':
        return 'document-text-outline';
      case 'Hardware':
        return 'hardware-chip-outline';
      case 'Infraestructura':
        return 'server-outline';
      case 'Servicios tercerizados':
        return 'cloud-outline';
      default:
        return 'cube-outline';
    }
  }, []);

  const getTipoActivoColor = useCallback((tipo) => {
    switch (tipo) {
      case 'Personas':
        return '#8B5CF6';
      case 'Aplicaciones':
        return '#3B82F6';
      case 'Información':
        return '#10B981';
      case 'Hardware':
        return '#F59E0B';
      case 'Infraestructura':
        return '#EF4444';
      case 'Servicios tercerizados':
        return '#06B6D4';
      default:
        return ALCANCE_THEME.colors.info;
    }
  }, []);

  const metrics = useMemo(() => {
    const total = infraestructura.length;
    const incluidos = infraestructura.filter((i) => i.incluido).length;
    const criticidadAlta = infraestructura.filter((i) => i.criticidad === 'Alta').length;
    const activos = infraestructura.filter((i) => i.estadoActivo === 'Activo').length;
    
    const porTipo = {};
    Object.values(TIPO_ACTIVO_INFRA).forEach((tipo) => {
      porTipo[tipo] = infraestructura.filter((i) => i.tipoActivo === tipo).length;
    });

    return { total, incluidos, criticidadAlta, activos, porTipo };
  }, [infraestructura]);

  const totalMetrics = 1 + Object.values(metrics.porTipo).filter(count => count > 0).length;
  const cardWidth = useMemo(() => calculateMetricCardWidth(totalMetrics, 62, 6), [totalMetrics]);

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
            icon="cube-outline"
            iconColor={ALCANCE_THEME.colors.primary}
            value={metrics.total}
            label="Total"
            backgroundColor={`${ALCANCE_THEME.colors.primary}08`}
            borderColor={`${ALCANCE_THEME.colors.primary}30`}
            testID="metric-total"
            accessibilityLabel={`Total de activos: ${metrics.total}`}
            width={cardWidth}
          />
          {Object.keys(metrics.porTipo).map((tipo) => {
            const count = metrics.porTipo[tipo];
            if (count === 0) return null;
            
            const icon = getTipoActivoIcon(tipo);
            const color = getTipoActivoColor(tipo);
            const labelMap = {
              'Personas': 'Person.',
              'Aplicaciones': 'Apps',
              'Información': 'Info',
              'Hardware': 'Hard.',
              'Infraestructura': 'Infra.',
              'Servicios tercerizados': 'Serc. Terc.',
            };
            const displayLabel = labelMap[tipo] || tipo;

            return (
              <MetricCard
                key={tipo}
                icon={icon}
                iconColor={color}
                value={count}
                label={displayLabel}
                backgroundColor={`${color}08`}
                borderColor={`${color}30`}
                valueColor={color}
                testID={`metric-${tipo}`}
                accessibilityLabel={`${tipo}: ${count}`}
                width={cardWidth}
              />
            );
          })}
        </ScrollView>
      </View>

      {/* Búsqueda Mejorada */}
      <View style={styles.searchContainer}>
        <SearchBarEnhanced
          placeholder="Buscar por identificador, sitio, propietario..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filtro de Tipo de Activo con Picker */}
      <TipoActivoInfraPickerFilter
        tiposActivo={TIPO_ACTIVO_INFRA}
        selectedValue={selectedTipoActivo}
        onValueChange={setSelectedTipoActivo}
      />

      {/* Filtro de Estado del Activo con Picker */}
      <EstadoActivoPickerFilter
        estadosActivo={ESTADO_ACTIVO}
        selectedValue={selectedEstado}
        onValueChange={setSelectedEstado}
      />

      {/* Filtro de Criticidad con Picker */}
      <CriticidadPickerFilter
        criticidades={CRITICIDAD_LEVELS}
        selectedValue={selectedCriticidad}
        onValueChange={setSelectedCriticidad}
      />

      {/* Botón limpiar filtros */}
      {hasActiveFilters && (
        <View style={styles.clearFiltersContainer}>
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={clearAllFilters}
          >
            <Ionicons name="close-circle-outline" size={20} color={ALCANCE_THEME.colors.error} />
            <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Lista de infraestructura */}
      <FlatList
        data={filteredInfra}
        renderItem={({ item }) => (
          <InfraestructuraCard
            infraestructura={item}
            onEdit={handleEditInfra}
            onDelete={handleDeleteInfra}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <EmptyState
            icon="server"
            title="No hay activos de infraestructura"
            description={
              hasActiveFilters
                ? 'No se encontraron activos con los filtros aplicados'
                : 'Agrega los primeros activos de infraestructura TI'
            }
          />
        }
      />

      {/* FAB para agregar o cargar datos */}
      {infraestructura.length === 0 ? (
        <TouchableOpacity style={styles.fabExample} onPress={handleInsertarEjemplos}>
          <MaterialCommunityIcons name="database-plus" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity style={styles.fab} onPress={handleAddInfra}>
            <Ionicons name="add" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.fabDelete} onPress={handleBorrarTodos}>
            <MaterialCommunityIcons name="delete-sweep" size={28} color="#FFFFFF" />
          </TouchableOpacity> */}
        </>
      )}

      {/* Modal de formulario */}
      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={editingInfra ? 'Editar Activo' : 'Nuevo Activo de Infraestructura'}
      >
        <InfraestructuraForm
          infraestructura={editingInfra}
          onSave={handleSaveInfra}
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
    paddingVertical: ALCANCE_THEME.spacing.sm,
    alignItems: 'center',
    gap: ALCANCE_THEME.spacing.xs,
    paddingRight: ALCANCE_THEME.spacing.md,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: ALCANCE_THEME.colors.text,
    marginRight: ALCANCE_THEME.spacing.xs,
  },
  clearFiltersContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: ALCANCE_THEME.spacing.md,
    paddingVertical: ALCANCE_THEME.spacing.sm,
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
    bottom: ALCANCE_THEME.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ALCANCE_THEME.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  fabDelete: {
    position: 'absolute',
    right: ALCANCE_THEME.spacing.lg,
    bottom: ALCANCE_THEME.spacing.lg + 70,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ALCANCE_THEME.colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});

export default InfraestructuraScreen;
