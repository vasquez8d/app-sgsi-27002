import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import SearchBar from '../../components/SearchBar';
import Badge from '../../components/Badge';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import { ALCANCE_THEME, MACROPROCESOS, ESTADO_PROCESO, CRITICIDAD_LEVELS } from '../../utils/alcanceConstants';
import { getProcesos, addProceso, updateProceso, deleteProceso } from '../../services/alcance/alcanceCRUD';
import { updateCompletitud, initAlcanceTables } from '../../services/alcance/alcanceService';
import { validateProceso } from '../../utils/alcanceValidation';
import ProcesoForm from './ProcesoForm';
import logger from '../../utils/logger';

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

  const handleEditProceso = (proceso) => {
    setEditingProceso(proceso);
    setModalVisible(true);
  };

  const handleSaveProceso = async (procesoData) => {
    const validation = validateProceso(procesoData);
    if (!validation.isValid) {
      alert(`Errores de validación:\n${Object.values(validation.errors).join('\n')}`);
      return;
    }

    if (editingProceso) {
      const result = updateProceso(editingProceso.id, procesoData);
      if (result.success) {
        loadProcesos();
        await updateCompletitud();
        setModalVisible(false);
      } else {
        alert('Error al actualizar el proceso: ' + result.error);
      }
    } else {
      const result = addProceso(procesoData);
      if (result.success) {
        loadProcesos();
        await updateCompletitud();
        setModalVisible(false);
      } else {
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

  const getEstadoColor = (estado) => {
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
  };

  const getCriticidadColor = (criticidad) => {
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
  };

  const renderFilterChip = (label, isSelected, onPress) => (
    <TouchableOpacity
      style={[styles.filterChip, isSelected && styles.filterChipSelected]}
      onPress={onPress}
    >
      <Text style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderProcesoCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <MaterialCommunityIcons
            name="office-building"
            size={24}
            color={ALCANCE_THEME.colors.primary}
          />
          <View style={styles.cardHeaderText}>
            <Text style={styles.cardTitle}>{item.nombreProceso}</Text>
            <Text style={styles.cardSubtitle}>{item.macroproceso}</Text>
          </View>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditProceso(item)}
          >
            <Ionicons name="pencil" size={20} color={ALCANCE_THEME.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteProceso(item.id, item.nombreProceso)}
          >
            <Ionicons name="trash-outline" size={20} color={ALCANCE_THEME.colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      {item.descripcion && (
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.descripcion}
        </Text>
      )}

      <View style={styles.cardDetails}>
        {item.responsableArea && (
          <View style={styles.detailRow}>
            <Ionicons name="person" size={14} color={ALCANCE_THEME.colors.textSecondary} />
            <Text style={styles.detailText}>{item.responsableArea}</Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={14} color={ALCANCE_THEME.colors.textSecondary} />
          <Text style={styles.detailText}>
            {new Date(item.fechaInclusion).toLocaleDateString('es-ES')}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Badge
          text={item.estado}
          color={getEstadoColor(item.estado)}
        />
        <Badge
          text={item.criticidad}
          color={getCriticidadColor(item.criticidad)}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header con estadísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{procesos.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: ALCANCE_THEME.colors.success }]}>
            {procesos.filter((p) => p.estado === 'Incluido').length}
          </Text>
          <Text style={styles.statLabel}>Incluidos</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: ALCANCE_THEME.colors.warning }]}>
            {procesos.filter((p) => p.estado === 'En Evaluación').length}
          </Text>
          <Text style={styles.statLabel}>En evaluación</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: ALCANCE_THEME.colors.error }]}>
            {procesos.filter((p) => p.estado === 'Excluido').length}
          </Text>
          <Text style={styles.statLabel}>Excluidos</Text>
        </View>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Buscar procesos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filtros */}
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
        {Object.keys(MACROPROCESOS).map((key) =>
          renderFilterChip(
            MACROPROCESOS[key],
            selectedMacroproceso === MACROPROCESOS[key],
            () => setSelectedMacroproceso(MACROPROCESOS[key])
          )
        )}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        <Text style={styles.filterLabel}>Estado:</Text>
        {renderFilterChip('Todos', selectedEstado === 'Todos', () => setSelectedEstado('Todos'))}
        {Object.keys(ESTADO_PROCESO).map((key) =>
          renderFilterChip(
            ESTADO_PROCESO[key],
            selectedEstado === ESTADO_PROCESO[key],
            () => setSelectedEstado(ESTADO_PROCESO[key])
          )
        )}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        <Text style={styles.filterLabel}>Criticidad:</Text>
        {renderFilterChip('Todas', selectedCriticidad === 'Todas', () =>
          setSelectedCriticidad('Todas')
        )}
        {Object.keys(CRITICIDAD_LEVELS).map((key) =>
          renderFilterChip(
            CRITICIDAD_LEVELS[key],
            selectedCriticidad === CRITICIDAD_LEVELS[key],
            () => setSelectedCriticidad(CRITICIDAD_LEVELS[key])
          )
        )}
      </ScrollView>

      {/* Lista de procesos */}
      <FlatList
        data={filteredProcesos}
        renderItem={renderProcesoCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <EmptyState
            icon="folder-open-outline"
            title="No hay procesos"
            description={
              searchQuery || selectedMacroproceso !== 'Todos'
                ? 'No se encontraron procesos con los filtros aplicados'
                : 'Agrega tu primer proceso al alcance del SGSI'
            }
          />
        }
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={handleAddProceso}>
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
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: ALCANCE_THEME.spacing.md,
    paddingHorizontal: ALCANCE_THEME.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: ALCANCE_THEME.typography.fontWeightBold,
    color: ALCANCE_THEME.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: ALCANCE_THEME.colors.textSecondary,
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: ALCANCE_THEME.spacing.md,
    paddingVertical: ALCANCE_THEME.spacing.sm,
    backgroundColor: '#FFFFFF',
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filtersContent: {
    paddingHorizontal: ALCANCE_THEME.spacing.md,
    paddingVertical: ALCANCE_THEME.spacing.sm,
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: ALCANCE_THEME.typography.fontWeightMedium,
    color: ALCANCE_THEME.colors.textSecondary,
    marginRight: ALCANCE_THEME.spacing.sm,
  },
  filterChip: {
    paddingHorizontal: ALCANCE_THEME.spacing.md,
    paddingVertical: ALCANCE_THEME.spacing.xs,
    borderRadius: ALCANCE_THEME.borderRadius.full,
    backgroundColor: '#F5F5F5',
    marginRight: ALCANCE_THEME.spacing.xs,
  },
  filterChipSelected: {
    backgroundColor: ALCANCE_THEME.colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    color: ALCANCE_THEME.colors.textSecondary,
  },
  filterChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: ALCANCE_THEME.typography.fontWeightMedium,
  },
  listContent: {
    padding: ALCANCE_THEME.spacing.md,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: ALCANCE_THEME.borderRadius.md,
    padding: ALCANCE_THEME.spacing.md,
    marginBottom: ALCANCE_THEME.spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: ALCANCE_THEME.spacing.sm,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  cardHeaderText: {
    marginLeft: ALCANCE_THEME.spacing.sm,
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: ALCANCE_THEME.typography.fontWeightBold,
    color: ALCANCE_THEME.colors.text,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: ALCANCE_THEME.colors.textSecondary,
  },
  cardActions: {
    flexDirection: 'row',
    gap: ALCANCE_THEME.spacing.xs,
  },
  actionButton: {
    padding: ALCANCE_THEME.spacing.xs,
  },
  cardDescription: {
    fontSize: 14,
    color: ALCANCE_THEME.colors.text,
    lineHeight: 20,
    marginBottom: ALCANCE_THEME.spacing.sm,
  },
  cardDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ALCANCE_THEME.spacing.md,
    marginBottom: ALCANCE_THEME.spacing.sm,
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
});

export default ProcesosScreen;
