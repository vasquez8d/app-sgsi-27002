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
import { ALCANCE_THEME, TIPO_UNIDAD, ROL_SGSI } from '../../utils/alcanceConstants';
import { getUnidades, addUnidad, updateUnidad, deleteUnidad } from '../../services/alcance/alcanceCRUD';
import { updateCompletitud } from '../../services/alcance/alcanceService';
import UnidadForm from './UnidadForm';

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
          u.tipo.toLowerCase().includes(query) ||
          u.responsable?.toLowerCase().includes(query)
      );
    }

    if (selectedTipo !== 'Todos') {
      filtered = filtered.filter((u) => u.tipo === selectedTipo);
    }

    if (selectedEstado === 'Incluidas') {
      filtered = filtered.filter((u) => u.incluida);
    } else if (selectedEstado === 'Excluidas') {
      filtered = filtered.filter((u) => !u.incluida);
    }

    setFilteredUnidades(filtered);
  };

  const handleAddUnidad = () => {
    setEditingUnidad(null);
    setModalVisible(true);
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
      } else {
        alert('Error al actualizar la unidad: ' + result.error);
      }
    } else {
      const result = addUnidad(unidadData);
      if (result.success) {
        loadUnidades();
        await updateCompletitud();
        setModalVisible(false);
      } else {
        alert('Error al agregar la unidad: ' + result.error);
      }
    }
  };

  const handleDeleteUnidad = (id, nombre) => {
    if (confirm(`¿Está seguro de eliminar la unidad "${nombre}"?`)) {
      const result = deleteUnidad(id);
      if (result.success) {
        loadUnidades();
        updateCompletitud();
      } else {
        alert('Error al eliminar la unidad: ' + result.error);
      }
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

  const renderUnidadCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <MaterialCommunityIcons
            name="domain"
            size={24}
            color={ALCANCE_THEME.colors.primary}
          />
          <View style={styles.cardHeaderText}>
            <Text style={styles.cardTitle}>{item.nombreUnidad}</Text>
            <Text style={styles.cardSubtitle}>{item.tipo}</Text>
          </View>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditUnidad(item)}
          >
            <Ionicons name="pencil" size={20} color={ALCANCE_THEME.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteUnidad(item.id, item.nombreUnidad)}
          >
            <Ionicons name="trash-outline" size={20} color={ALCANCE_THEME.colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardDetails}>
        {item.responsable && (
          <View style={styles.detailRow}>
            <Ionicons name="person" size={14} color={ALCANCE_THEME.colors.textSecondary} />
            <Text style={styles.detailText}>{item.responsable}</Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Ionicons name="layers" size={14} color={ALCANCE_THEME.colors.textSecondary} />
          <Text style={styles.detailText}>Nivel {item.nivelJerarquico}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="shield-account" size={14} color={ALCANCE_THEME.colors.textSecondary} />
          <Text style={styles.detailText}>{item.rolSGSI}</Text>
        </View>
      </View>

      {!item.incluida && item.justificacion && (
        <View style={styles.warningBox}>
          <Ionicons name="alert-circle" size={16} color={ALCANCE_THEME.colors.warning} />
          <Text style={styles.warningText} numberOfLines={2}>
            {item.justificacion}
          </Text>
        </View>
      )}

      <View style={styles.cardFooter}>
        <Badge
          text={item.incluida ? 'Incluida' : 'Excluida'}
          color={item.incluida ? ALCANCE_THEME.colors.success : ALCANCE_THEME.colors.error}
        />
        {item.procesosAsociados && item.procesosAsociados.length > 0 && (
          <Badge
            text={`${item.procesosAsociados.length} proceso(s)`}
            color={ALCANCE_THEME.colors.primary}
          />
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{unidades.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: ALCANCE_THEME.colors.success }]}>
            {unidades.filter((u) => u.incluida).length}
          </Text>
          <Text style={styles.statLabel}>Incluidas</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: ALCANCE_THEME.colors.error }]}>
            {unidades.filter((u) => !u.incluida).length}
          </Text>
          <Text style={styles.statLabel}>Excluidas</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Buscar unidades..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        <Text style={styles.filterLabel}>Tipo:</Text>
        {renderFilterChip('Todos', selectedTipo === 'Todos', () => setSelectedTipo('Todos'))}
        {Object.keys(TIPO_UNIDAD).map((key) =>
          renderFilterChip(
            TIPO_UNIDAD[key],
            selectedTipo === TIPO_UNIDAD[key],
            () => setSelectedTipo(TIPO_UNIDAD[key])
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
        {['Todos', 'Incluidas', 'Excluidas'].map((estado) =>
          renderFilterChip(estado, selectedEstado === estado, () => setSelectedEstado(estado))
        )}
      </ScrollView>

      <FlatList
        data={filteredUnidades}
        renderItem={renderUnidadCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <EmptyState
            icon="business-outline"
            title="No hay unidades"
            description={
              searchQuery || selectedTipo !== 'Todos'
                ? 'No se encontraron unidades con los filtros aplicados'
                : 'Agrega la primera unidad organizativa al alcance'
            }
          />
        }
      />

      <TouchableOpacity style={styles.fab} onPress={handleAddUnidad}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

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
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderRadius: ALCANCE_THEME.borderRadius.sm,
    padding: ALCANCE_THEME.spacing.sm,
    marginBottom: ALCANCE_THEME.spacing.sm,
    gap: ALCANCE_THEME.spacing.xs,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: '#E65100',
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

export default UnidadesScreen;
