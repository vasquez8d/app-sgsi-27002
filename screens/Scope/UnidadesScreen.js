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
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import MetricCard from '../../components/MetricCard';
import FilterChip from '../../components/FilterChip';
import TipoUnidadPickerFilter from '../../components/TipoUnidadPickerFilter';
import { ALCANCE_THEME, TIPO_UNIDAD, ROL_SGSI, ESTADO_PROCESO } from '../../utils/alcanceConstants';
import { getUnidades, addUnidad, updateUnidad, deleteUnidad, deleteAllUnidades } from '../../services/alcance/alcanceCRUD';
import { updateCompletitud } from '../../services/alcance/alcanceService';
import UnidadForm from './UnidadForm';
import { insertUnidadesEjemplo } from '../../utils/insertUnidadesEjemplo';
import { calculateMetricCardWidth, responsiveConfig } from '../../utils/responsive';

const UnidadesScreen = ({ navigation }) => {
  const [unidades, setUnidades] = useState([]);
  const [filteredUnidades, setFilteredUnidades] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('Todos');
  const [selectedEstado, setSelectedEstado] = useState('Todos');
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUnidad, setEditingUnidad] = useState(null);

  useEffect(() => {
    loadUnidades();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedTipo, selectedEstado, unidades]);

  const loadUnidades = () => {
    const data = getUnidades();
    setUnidades(data);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    loadUnidades();
    await updateCompletitud();
    setRefreshing(false);
  };

  const applyFilters = () => {
    let filtered = [...unidades];

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.nombreUnidad.toLowerCase().includes(query) ||
          (u.tipo && u.tipo.toLowerCase().includes(query)) ||
          u.responsable?.toLowerCase().includes(query)
      );
    }

    if (selectedTipo !== 'Todos') {
      filtered = filtered.filter((u) => u.tipo === selectedTipo);
    }

    if (selectedEstado === 'Incluido') {
      filtered = filtered.filter((u) => u.incluida);
    } else if (selectedEstado === 'Excluido') {
      filtered = filtered.filter((u) => !u.incluida);
    } else if (selectedEstado === 'En Evaluación') {
      // En el futuro podríamos tener un campo de estado más complejo
      filtered = [];
    }

    setFilteredUnidades(filtered);
  };

  const handleAddUnidad = () => {
    setEditingUnidad(null);
    setModalVisible(true);
  };

  const handleInsertarEjemplos = () => {
    Alert.alert(
      'Insertar Datos de Ejemplo',
      '¿Deseas cargar 20 unidades organizativas de ejemplo para la empresa de fabricación de pinturas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Insertar',
          onPress: () => {
            try {
              const count = insertUnidadesEjemplo();
              loadUnidades();
              Alert.alert('Éxito', `${count} unidades de ejemplo insertadas correctamente`);
            } catch (error) {
              Alert.alert('Error', 'No se pudieron insertar las unidades: ' + error.message);
            }
          },
        },
      ]
    );
  };

  const handleLimpiarTodo = () => {
    Alert.alert(
      'Eliminar Todas las Unidades',
      '¿Estás seguro de que deseas eliminar TODAS las unidades organizativas? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar Todo',
          style: 'destructive',
          onPress: () => {
            try {
              const result = deleteAllUnidades();
              if (result.success) {
                loadUnidades();
                Alert.alert('Éxito', 'Todas las unidades han sido eliminadas');
              } else {
                Alert.alert('Error', result.error);
              }
            } catch (error) {
              Alert.alert('Error', 'No se pudieron eliminar las unidades: ' + error.message);
            }
          },
        },
      ]
    );
  };

  const handleEditUnidad = (unidad) => {
    setEditingUnidad(unidad);
    setModalVisible(true);
  };

  const handleSaveUnidad = async (unidadData) => {
    if (editingUnidad) {
      const result = updateUnidad(editingUnidad.id, unidadData);
      if (result.success) {
        loadUnidades();
        await updateCompletitud();
        setModalVisible(false);
        Alert.alert('Éxito', `Unidad "${unidadData.nombreUnidad}" actualizada correctamente`);
      } else {
        Alert.alert('Error', 'No se pudo actualizar la unidad: ' + result.error);
      }
    } else {
      const result = addUnidad(unidadData);
      if (result.success) {
        loadUnidades();
        await updateCompletitud();
        setModalVisible(false);
        Alert.alert('Éxito', `Unidad "${unidadData.nombreUnidad}" guardada correctamente.\n\nAhora puedes verla en la lista.`);
      } else {
        Alert.alert('Error', 'No se pudo agregar la unidad: ' + result.error);
      }
    }
  };

  const handleDeleteUnidad = (id, nombre) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Está seguro de eliminar la unidad "${nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            const result = deleteUnidad(id);
            if (result.success) {
              loadUnidades();
              updateCompletitud();
              Alert.alert('Éxito', 'Unidad eliminada correctamente');
            } else {
              Alert.alert('Error', 'No se pudo eliminar la unidad: ' + result.error);
            }
          }
        }
      ]
    );
  };

  // Memoized color functions
  const getTipoIcon = useCallback((tipo) => {
    switch (tipo) {
      case 'Dirección':
        return 'office-building';
      case 'Gerencia':
        return 'briefcase-outline';
      case 'Departamento':
        return 'account-group';
      case 'Área':
        return 'view-grid';
      case 'Sección':
        return 'view-module';
      default:
        return 'file-document-outline';
    }
  }, []);

  const getTipoColor = useCallback((tipo) => {
    switch (tipo) {
      case 'Dirección':
        return '#8B5CF6';
      case 'Gerencia':
        return '#3B82F6';
      case 'Departamento':
        return '#10B981';
      case 'Área':
        return '#F59E0B';
      case 'Sección':
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
    const totalUnidades = unidades.length;
    const totalIncluidas = unidades.filter((u) => u.incluida).length;
    const totalExcluidas = unidades.filter((u) => !u.incluida).length;
    const porTipo = {};
    Object.values(TIPO_UNIDAD).forEach((tipo) => {
      porTipo[tipo] = unidades.filter((u) => u.tipo === tipo).length;
    });

    return {
      totalUnidades,
      totalIncluidas,
      totalExcluidas,
      porTipo,
    };
  }, [unidades]);

  // Verificar si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    return selectedTipo !== 'Todos' || 
           selectedEstado !== 'Todos' ||
           searchQuery.trim() !== '';
  }, [selectedTipo, selectedEstado, searchQuery]);

  // Función para limpiar todos los filtros
  const clearAllFilters = useCallback(() => {
    setSelectedTipo('Todos');
    setSelectedEstado('Todos');
    setSearchQuery('');
  }, []);

  const renderUnidadCard = useCallback(({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={[
            styles.iconContainer,
            { backgroundColor: `${getTipoColor(item.tipo)}15` }
          ]}>
            <MaterialCommunityIcons
              name={getTipoIcon(item.tipo)}
              size={20}
              color={getTipoColor(item.tipo)}
            />
          </View>
          <View style={styles.cardHeaderText}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.nombreUnidad}</Text>
            <View style={styles.subtitleRow}>
              <Text style={styles.cardSubtitle}>{item.tipo}</Text>
              <View style={styles.divider} />
              <Text style={styles.cardSubtitle}>Nivel {item.nivelJerarquico}</Text>
            </View>
          </View>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditUnidad(item)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="pencil" size={18} color={ALCANCE_THEME.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteUnidad(item.id, item.nombreUnidad)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={18} color={ALCANCE_THEME.colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      {(item.responsable || item.rolSGSI) && (
        <View style={styles.cardDetails}>
          {item.responsable && (
            <View style={styles.detailChip}>
              <Ionicons name="person-outline" size={12} color={ALCANCE_THEME.colors.textSecondary} />
              <Text style={styles.detailText} numberOfLines={1}>{item.responsable}</Text>
            </View>
          )}
          {item.rolSGSI && (
            <View style={styles.detailChip}>
              <MaterialCommunityIcons name="shield-account-outline" size={12} color={ALCANCE_THEME.colors.textSecondary} />
              <Text style={styles.detailText} numberOfLines={1}>{item.rolSGSI}</Text>
            </View>
          )}
        </View>
      )}

      {!item.incluida && item.justificacion && (
        <View style={styles.warningBox}>
          <Ionicons name="alert-circle" size={14} color={ALCANCE_THEME.colors.warning} />
          <Text style={styles.warningText} numberOfLines={2}>
            {item.justificacion}
          </Text>
        </View>
      )}

      <View style={styles.cardFooter}>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.incluida ? `${ALCANCE_THEME.colors.success}15` : `${ALCANCE_THEME.colors.error}15` }
        ]}>
          <Ionicons 
            name={item.incluida ? "checkmark-circle" : "close-circle"} 
            size={12} 
            color={item.incluida ? ALCANCE_THEME.colors.success : ALCANCE_THEME.colors.error} 
          />
          <Text style={[
            styles.statusBadgeText,
            { color: item.incluida ? ALCANCE_THEME.colors.success : ALCANCE_THEME.colors.error }
          ]}>
            {item.incluida ? 'Incluida' : 'Excluida'}
          </Text>
        </View>
        {item.procesosAsociados && item.procesosAsociados.length > 0 && (
          <View style={[styles.statusBadge, { backgroundColor: `${ALCANCE_THEME.colors.primary}15` }]}>
            <Ionicons name="git-network-outline" size={12} color={ALCANCE_THEME.colors.primary} />
            <Text style={[styles.statusBadgeText, { color: ALCANCE_THEME.colors.primary }]}>
              {item.procesosAsociados.length} proceso{item.procesosAsociados.length !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>
    </View>
  ), [getTipoIcon, getTipoColor, handleEditUnidad, handleDeleteUnidad]);

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
            icon="business-outline"
            iconColor={ALCANCE_THEME.colors.primary}
            value={metrics.totalUnidades}
            label="Total"
            backgroundColor={`${ALCANCE_THEME.colors.primary}08`}
            borderColor={`${ALCANCE_THEME.colors.primary}30`}
            testID="metric-total"
            accessibilityLabel={`Total de unidades: ${metrics.totalUnidades}`}
            width={metricCardWidth}
          />
          {Object.keys(metrics.porTipo).map((tipo) => {
            const iconMap = {
              'Dirección': 'business-outline',
              'Gerencia': 'briefcase-outline',
              'Departamento': 'people-outline',
              'Área': 'grid-outline',
              'Sección': 'albums-outline',
            };
            const colorMap = {
              'Dirección': '#8B5CF6',
              'Gerencia': '#3B82F6',
              'Departamento': '#10B981',
              'Área': '#F59E0B',
              'Sección': '#EF4444',
            };
            const labelMap = {
              'Dirección': 'Dir.',
              'Gerencia': 'Ger.',
              'Departamento': 'Dpto.',
              'Sección': 'Sec.',
            };
            const color = colorMap[tipo] || ALCANCE_THEME.colors.info;
            const displayLabel = labelMap[tipo] || tipo;
            return (
              metrics.porTipo[tipo] > 0 && (
                <MetricCard
                  key={tipo}
                  icon={iconMap[tipo] || 'albums-outline'}
                  iconColor={color}
                  value={metrics.porTipo[tipo]}
                  label={displayLabel}
                  backgroundColor={`${color}08`}
                  borderColor={`${color}30`}
                  valueColor={color}
                  testID={`metric-${tipo}`}
                  accessibilityLabel={`${tipo}: ${metrics.porTipo[tipo]}`}
                  width={metricCardWidth}
                />
              )
            );
          })}
        </ScrollView>
      </View>

      {/* Búsqueda Mejorada */}
      <View style={styles.searchContainer}>
        <SearchBarEnhanced
          placeholder="Buscar unidades..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filtro de Tipo de Unidad con Picker */}
      <TipoUnidadPickerFilter
        tiposUnidad={TIPO_UNIDAD}
        selectedValue={selectedTipo}
        onValueChange={setSelectedTipo}
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
            testID="clear-all-filters"
            accessibilityLabel="Limpiar todos los filtros"
            accessibilityRole="button"
          >
            <Ionicons name="close-circle" size={18} color={ALCANCE_THEME.colors.error} />
            <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredUnidades}
        renderItem={renderUnidadCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={10}
        removeClippedSubviews={true}
        ListEmptyComponent={
          <View>
            <EmptyState
              icon="business-outline"
              title="No hay unidades"
              description={
                searchQuery || selectedTipo !== 'Todos' || selectedEstado !== 'Todos'
                  ? 'No se encontraron unidades con los filtros aplicados'
                  : 'Agrega la primera unidad organizativa al alcance'
              }
            />
            {unidades.length === 0 && (
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

      <TouchableOpacity style={styles.fab} onPress={handleAddUnidad}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* {unidades.length > 0 && (
        <TouchableOpacity style={styles.fabDelete} onPress={handleLimpiarTodo}>
          <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )} */}

      <Modal visible={modalVisible} onClose={() => setModalVisible(false)} title={editingUnidad ? 'Editar Unidad' : 'Nueva Unidad'}>
        <UnidadForm
          unidad={editingUnidad}
          onSave={handleSaveUnidad}
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
    minWidth: 70,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
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
    paddingVertical: ALCANCE_THEME.spacing.md,
  },
  filtersContent: {
    paddingHorizontal: ALCANCE_THEME.spacing.md,
    alignItems: 'center',
    gap: ALCANCE_THEME.spacing.xs,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: ALCANCE_THEME.typography.fontWeightMedium,
    color: ALCANCE_THEME.colors.textSecondary,
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
    gap: ALCANCE_THEME.spacing.xs,
    paddingVertical: ALCANCE_THEME.spacing.xs,
  },
  clearFiltersText: {
    fontSize: 13,
    color: ALCANCE_THEME.colors.error,
    fontWeight: ALCANCE_THEME.typography.fontWeightMedium,
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
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: {
    marginLeft: 10,
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: ALCANCE_THEME.typography.fontWeightBold,
    color: ALCANCE_THEME.colors.text,
    marginBottom: 3,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardSubtitle: {
    fontSize: 12,
    color: ALCANCE_THEME.colors.textSecondary,
  },
  divider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: ALCANCE_THEME.colors.textSecondary,
    opacity: 0.4,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    padding: 6,
  },
  cardDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  detailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    maxWidth: '48%',
  },
  detailText: {
    fontSize: 11,
    color: ALCANCE_THEME.colors.textSecondary,
    flex: 1,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderLeftWidth: 3,
    borderLeftColor: ALCANCE_THEME.colors.warning,
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    gap: 6,
  },
  warningText: {
    flex: 1,
    fontSize: 11,
    color: '#92400E',
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: ALCANCE_THEME.typography.fontWeightMedium,
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
  fabDelete: {
    position: 'absolute',
    right: ALCANCE_THEME.spacing.lg,
    bottom: 90,
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
  btnLimpiar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${ALCANCE_THEME.colors.error}15`,
    borderWidth: 1,
    borderColor: ALCANCE_THEME.colors.error,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 40,
    marginTop: 20,
    gap: 8,
  },
  btnLimpiarText: {
    fontSize: 14,
    fontWeight: '600',
    color: ALCANCE_THEME.colors.error,
  },
});

export default UnidadesScreen;
