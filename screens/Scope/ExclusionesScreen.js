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
import { ALCANCE_THEME, CATEGORIA_EXCLUSION } from '../../utils/alcanceConstants';
import { getExclusiones, addExclusion, updateExclusion, deleteExclusion } from '../../services/alcance/alcanceCRUD';
import { updateCompletitud } from '../../services/alcance/alcanceService';
import ExclusionForm from './ExclusionForm';

const ExclusionesScreen = ({ navigation }) => {
  const [exclusiones, setExclusiones] = useState([]);
  const [filteredExclusiones, setFilteredExclusiones] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('Todos');
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExclusion, setEditingExclusion] = useState(null);

  useEffect(() => {
    loadExclusiones();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedCategoria, exclusiones]);

  const loadExclusiones = () => {
    const data = getExclusiones();
    setExclusiones(data);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    loadExclusiones();
    await updateCompletitud();
    setRefreshing(false);
  };

  const applyFilters = () => {
    let filtered = [...exclusiones];

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.elementoExcluido.toLowerCase().includes(query) ||
          e.justificacion.toLowerCase().includes(query) ||
          e.responsableDecision?.toLowerCase().includes(query)
      );
    }

    if (selectedCategoria !== 'Todos') {
      filtered = filtered.filter((e) => e.categoria === selectedCategoria);
    }

    setFilteredExclusiones(filtered);
  };

  const handleAddExclusion = () => {
    setEditingExclusion(null);
    setModalVisible(true);
  };

  const handleEditExclusion = (exclusion) => {
    setEditingExclusion(exclusion);
    setModalVisible(true);
  };

  const handleSaveExclusion = async (exclusionData) => {
    if (editingExclusion) {
      const result = updateExclusion(editingExclusion.id, exclusionData);
      if (result.success) {
        loadExclusiones();
        await updateCompletitud();
        setModalVisible(false);
      } else {
        alert('Error al actualizar la exclusión: ' + result.error);
      }
    } else {
      const result = addExclusion(exclusionData);
      if (result.success) {
        loadExclusiones();
        await updateCompletitud();
        setModalVisible(false);
      } else {
        alert('Error al agregar la exclusión: ' + result.error);
      }
    }
  };

  const handleDeleteExclusion = (id, elemento) => {
    if (confirm(`¿Está seguro de eliminar la exclusión "${elemento}"?`)) {
      const result = deleteExclusion(id);
      if (result.success) {
        loadExclusiones();
        updateCompletitud();
      } else {
        alert('Error al eliminar la exclusión: ' + result.error);
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

  const renderExclusionCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <MaterialCommunityIcons
            name="close-circle"
            size={24}
            color={ALCANCE_THEME.colors.error}
          />
          <View style={styles.cardHeaderText}>
            <Text style={styles.cardTitle}>{item.elementoExcluido}</Text>
            <Text style={styles.cardSubtitle}>{item.categoria}</Text>
          </View>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditExclusion(item)}
          >
            <Ionicons name="pencil" size={20} color={ALCANCE_THEME.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteExclusion(item.id, item.elementoExcluido)}
          >
            <Ionicons name="trash-outline" size={20} color={ALCANCE_THEME.colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.justificacionContainer}>
        <Text style={styles.justificacionLabel}>Justificación:</Text>
        <Text style={styles.justificacionText} numberOfLines={3}>
          {item.justificacion}
        </Text>
      </View>

      <View style={styles.cardDetails}>
        {item.responsableDecision && (
          <View style={styles.detailRow}>
            <Ionicons name="person" size={14} color={ALCANCE_THEME.colors.textSecondary} />
            <Text style={styles.detailText}>{item.responsableDecision}</Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={14} color={ALCANCE_THEME.colors.textSecondary} />
          <Text style={styles.detailText}>
            {new Date(item.fechaExclusion).toLocaleDateString('es-ES')}
          </Text>
        </View>
        {item.proximaRevision && (
          <View style={styles.detailRow}>
            <Ionicons name="time" size={14} color={ALCANCE_THEME.colors.textSecondary} />
            <Text style={styles.detailText}>
              Próxima revisión: {new Date(item.proximaRevision).toLocaleDateString('es-ES')}
            </Text>
          </View>
        )}
      </View>

      {item.revisionPendiente && (
        <View style={styles.warningBox}>
          <Ionicons name="alert-circle" size={16} color={ALCANCE_THEME.colors.warning} />
          <Text style={styles.warningText}>Revisión pendiente</Text>
        </View>
      )}

      <View style={styles.cardFooter}>
        <Badge
          text={item.revisionPendiente ? 'Revisión Pendiente' : 'Revisada'}
          color={item.revisionPendiente ? ALCANCE_THEME.colors.warning : ALCANCE_THEME.colors.success}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{exclusiones.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: ALCANCE_THEME.colors.warning }]}>
            {exclusiones.filter((e) => e.revisionPendiente).length}
          </Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: ALCANCE_THEME.colors.success }]}>
            {exclusiones.filter((e) => !e.revisionPendiente).length}
          </Text>
          <Text style={styles.statLabel}>Revisadas</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Buscar exclusiones..."
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
        <Text style={styles.filterLabel}>Categoría:</Text>
        {renderFilterChip('Todos', selectedCategoria === 'Todos', () => setSelectedCategoria('Todos'))}
        {Object.keys(CATEGORIA_EXCLUSION).map((key) =>
          renderFilterChip(
            CATEGORIA_EXCLUSION[key],
            selectedCategoria === CATEGORIA_EXCLUSION[key],
            () => setSelectedCategoria(CATEGORIA_EXCLUSION[key])
          )
        )}
      </ScrollView>

      {exclusiones.length > 0 && (
        <View style={styles.alertBox}>
          <Ionicons name="information-circle" size={20} color={ALCANCE_THEME.colors.primary} />
          <Text style={styles.alertText}>
            Las exclusiones deben estar debidamente justificadas según ISO 27001 cláusula 4.3
          </Text>
        </View>
      )}

      <FlatList
        data={filteredExclusiones}
        renderItem={renderExclusionCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <EmptyState
            icon="checkmark-done-circle-outline"
            title="No hay exclusiones"
            description={
              searchQuery || selectedCategoria !== 'Todos'
                ? 'No se encontraron exclusiones con los filtros aplicados'
                : 'No hay elementos excluidos del alcance. Esto es positivo para la cobertura del SGSI.'
            }
          />
        }
      />

      <TouchableOpacity style={styles.fab} onPress={handleAddExclusion}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal visible={modalVisible} onClose={() => setModalVisible(false)} title={editingExclusion ? 'Editar Exclusión' : 'Nueva Exclusión'}>
        <ExclusionForm
          exclusion={editingExclusion}
          onSave={handleSaveExclusion}
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
  alertBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: ALCANCE_THEME.spacing.md,
    marginHorizontal: ALCANCE_THEME.spacing.md,
    marginTop: ALCANCE_THEME.spacing.sm,
    borderRadius: ALCANCE_THEME.borderRadius.sm,
    gap: ALCANCE_THEME.spacing.sm,
  },
  alertText: {
    flex: 1,
    fontSize: 13,
    color: ALCANCE_THEME.colors.primary,
    lineHeight: 18,
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
    borderLeftWidth: 4,
    borderLeftColor: ALCANCE_THEME.colors.error,
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
  justificacionContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: ALCANCE_THEME.borderRadius.sm,
    padding: ALCANCE_THEME.spacing.sm,
    marginBottom: ALCANCE_THEME.spacing.sm,
  },
  justificacionLabel: {
    fontSize: 12,
    fontWeight: ALCANCE_THEME.typography.fontWeightMedium,
    color: '#E65100',
    marginBottom: 4,
  },
  justificacionText: {
    fontSize: 13,
    color: '#E65100',
    lineHeight: 18,
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
    alignItems: 'center',
    backgroundColor: '#FFF9C4',
    borderRadius: ALCANCE_THEME.borderRadius.sm,
    padding: ALCANCE_THEME.spacing.sm,
    marginBottom: ALCANCE_THEME.spacing.sm,
    gap: ALCANCE_THEME.spacing.xs,
  },
  warningText: {
    fontSize: 13,
    color: '#F57F17',
    fontWeight: ALCANCE_THEME.typography.fontWeightMedium,
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

export default ExclusionesScreen;
