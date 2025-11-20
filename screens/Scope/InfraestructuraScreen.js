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
import { ALCANCE_THEME, TIPO_ACTIVO_INFRA, CRITICIDAD_LEVELS, ESTADO_ACTIVO } from '../../utils/alcanceConstants';
import { getInfraestructura, addInfraestructura, updateInfraestructura, deleteInfraestructura } from '../../services/alcance/alcanceCRUD';
import { updateCompletitud } from '../../services/alcance/alcanceService';
import InfraestructuraForm from './InfraestructuraForm';

const InfraestructuraScreen = ({ navigation }) => {
  const [infraestructura, setInfraestructura] = useState([]);
  const [filteredInfra, setFilteredInfra] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('Todos');
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
  }, [searchQuery, selectedTipo, selectedCriticidad, selectedEstado, infraestructura]);

  const loadInfraestructura = () => {
    const data = getInfraestructura();
    setInfraestructura(data);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    loadInfraestructura();
    await updateCompletitud();
    setRefreshing(false);
  };

  const applyFilters = () => {
    let filtered = [...infraestructura];

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.identificador.toLowerCase().includes(query) ||
          i.tipoActivo.toLowerCase().includes(query) ||
          i.propietarioArea?.toLowerCase().includes(query)
      );
    }

    if (selectedTipo !== 'Todos') {
      filtered = filtered.filter((i) => i.tipoActivo === selectedTipo);
    }

    if (selectedCriticidad !== 'Todas') {
      filtered = filtered.filter((i) => i.criticidad === selectedCriticidad);
    }

    if (selectedEstado !== 'Todos') {
      filtered = filtered.filter((i) => i.estadoActivo === selectedEstado);
    }

    setFilteredInfra(filtered);
  };

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

  const handleDeleteInfra = (id, identificador) => {
    if (confirm(`¿Está seguro de eliminar "${identificador}"?`)) {
      const result = deleteInfraestructura(id);
      if (result.success) {
        loadInfraestructura();
        updateCompletitud();
      } else {
        alert('Error al eliminar infraestructura: ' + result.error);
      }
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

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Activo':
        return ALCANCE_THEME.colors.success;
      case 'Inactivo':
        return ALCANCE_THEME.colors.textSecondary;
      case 'Mantenimiento':
        return ALCANCE_THEME.colors.warning;
      case 'Retirado':
        return ALCANCE_THEME.colors.error;
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

  const renderInfraCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <MaterialCommunityIcons
            name="server"
            size={24}
            color={ALCANCE_THEME.colors.primary}
          />
          <View style={styles.cardHeaderText}>
            <Text style={styles.cardTitle}>{item.identificador}</Text>
            <Text style={styles.cardSubtitle}>{item.tipoActivo}</Text>
          </View>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditInfra(item)}
          >
            <Ionicons name="pencil" size={20} color={ALCANCE_THEME.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteInfra(item.id, item.identificador)}
          >
            <Ionicons name="trash-outline" size={20} color={ALCANCE_THEME.colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardDetails}>
        {item.propietarioArea && (
          <View style={styles.detailRow}>
            <Ionicons name="person" size={14} color={ALCANCE_THEME.colors.textSecondary} />
            <Text style={styles.detailText}>{item.propietarioArea}</Text>
          </View>
        )}
        {item.sistemaOperativo && (
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="chip" size={14} color={ALCANCE_THEME.colors.textSecondary} />
            <Text style={styles.detailText}>{item.sistemaOperativo}</Text>
          </View>
        )}
        {item.funcion && (
          <View style={styles.detailRow}>
            <Ionicons name="settings" size={14} color={ALCANCE_THEME.colors.textSecondary} />
            <Text style={styles.detailText}>{item.funcion}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <Badge
          text={item.criticidad}
          color={getCriticidadColor(item.criticidad)}
        />
        <Badge
          text={item.estadoActivo}
          color={getEstadoColor(item.estadoActivo)}
        />
        <Badge
          text={item.incluidoAlcance ? 'En Alcance' : 'Fuera'}
          color={item.incluidoAlcance ? ALCANCE_THEME.colors.success : ALCANCE_THEME.colors.error}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{infraestructura.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: ALCANCE_THEME.colors.success }]}>
            {infraestructura.filter((i) => i.estadoActivo === 'Activo').length}
          </Text>
          <Text style={styles.statLabel}>Activos</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: ALCANCE_THEME.colors.error }]}>
            {infraestructura.filter((i) => i.criticidad === 'Crítica').length}
          </Text>
          <Text style={styles.statLabel}>Críticos</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: ALCANCE_THEME.colors.primary }]}>
            {infraestructura.filter((i) => i.incluidoAlcance).length}
          </Text>
          <Text style={styles.statLabel}>En Alcance</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Buscar infraestructura..."
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
        {Object.keys(TIPO_ACTIVO_INFRA).map((key) =>
          renderFilterChip(
            TIPO_ACTIVO_INFRA[key],
            selectedTipo === TIPO_ACTIVO_INFRA[key],
            () => setSelectedTipo(TIPO_ACTIVO_INFRA[key])
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
        {renderFilterChip('Todas', selectedCriticidad === 'Todas', () => setSelectedCriticidad('Todas'))}
        {Object.keys(CRITICIDAD_LEVELS).map((key) =>
          renderFilterChip(
            CRITICIDAD_LEVELS[key],
            selectedCriticidad === CRITICIDAD_LEVELS[key],
            () => setSelectedCriticidad(CRITICIDAD_LEVELS[key])
          )
        )}
      </ScrollView>

      <FlatList
        data={filteredInfra}
        renderItem={renderInfraCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <EmptyState
            icon="hardware-chip-outline"
            title="No hay infraestructura"
            description={
              searchQuery || selectedTipo !== 'Todos'
                ? 'No se encontró infraestructura con los filtros aplicados'
                : 'Agrega los primeros activos de infraestructura TI'
            }
          />
        }
      />

      <TouchableOpacity style={styles.fab} onPress={handleAddInfra}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal visible={modalVisible} onClose={() => setModalVisible(false)} title={editingInfra ? 'Editar Infraestructura' : 'Nueva Infraestructura'}>
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

export default InfraestructuraScreen;
