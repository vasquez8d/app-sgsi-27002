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
import { ALCANCE_THEME, TIPO_UBICACION } from '../../utils/alcanceConstants';
import { getUbicaciones, addUbicacion, updateUbicacion, deleteUbicacion } from '../../services/alcance/alcanceCRUD';
import { updateCompletitud } from '../../services/alcance/alcanceService';
import UbicacionForm from './UbicacionForm';

const UbicacionesScreen = ({ navigation }) => {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [filteredUbicaciones, setFilteredUbicaciones] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('Todos');
  const [selectedEstado, setSelectedEstado] = useState('Todos');
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUbicacion, setEditingUbicacion] = useState(null);

  useEffect(() => {
    loadUbicaciones();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedTipo, selectedEstado, ubicaciones]);

  const loadUbicaciones = () => {
    const data = getUbicaciones();
    setUbicaciones(data);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    loadUbicaciones();
    await updateCompletitud();
    setRefreshing(false);
  };

  const applyFilters = () => {
    let filtered = [...ubicaciones];

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.nombreSitio.toLowerCase().includes(query) ||
          u.direccion?.toLowerCase().includes(query) ||
          u.tipo.toLowerCase().includes(query)
      );
    }

    if (selectedTipo !== 'Todos') {
      filtered = filtered.filter((u) => u.tipo === selectedTipo);
    }

    if (selectedEstado === 'Incluidas') {
      filtered = filtered.filter((u) => u.incluido);
    } else if (selectedEstado === 'Excluidas') {
      filtered = filtered.filter((u) => !u.incluido);
    }

    setFilteredUbicaciones(filtered);
  };

  const handleAddUbicacion = () => {
    setEditingUbicacion(null);
    setModalVisible(true);
  };

  const handleEditUbicacion = (ubicacion) => {
    setEditingUbicacion(ubicacion);
    setModalVisible(true);
  };

  const handleSaveUbicacion = async (ubicacionData) => {
    if (editingUbicacion) {
      const result = updateUbicacion(editingUbicacion.id, ubicacionData);
      if (result.success) {
        loadUbicaciones();
        await updateCompletitud();
        setModalVisible(false);
      } else {
        alert('Error al actualizar la ubicación: ' + result.error);
      }
    } else {
      const result = addUbicacion(ubicacionData);
      if (result.success) {
        loadUbicaciones();
        await updateCompletitud();
        setModalVisible(false);
      } else {
        alert('Error al agregar la ubicación: ' + result.error);
      }
    }
  };

  const handleDeleteUbicacion = (id, nombre) => {
    if (confirm(`¿Está seguro de eliminar la ubicación "${nombre}"?`)) {
      const result = deleteUbicacion(id);
      if (result.success) {
        loadUbicaciones();
        updateCompletitud();
      } else {
        alert('Error al eliminar la ubicación: ' + result.error);
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

  const renderUbicacionCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <MaterialCommunityIcons
            name="map-marker"
            size={24}
            color={ALCANCE_THEME.colors.primary}
          />
          <View style={styles.cardHeaderText}>
            <Text style={styles.cardTitle}>{item.nombreSitio}</Text>
            <Text style={styles.cardSubtitle}>{item.tipo}</Text>
          </View>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditUbicacion(item)}
          >
            <Ionicons name="pencil" size={20} color={ALCANCE_THEME.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteUbicacion(item.id, item.nombreSitio)}
          >
            <Ionicons name="trash-outline" size={20} color={ALCANCE_THEME.colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      {item.direccion && (
        <View style={styles.addressContainer}>
          <Ionicons name="location" size={14} color={ALCANCE_THEME.colors.textSecondary} />
          <Text style={styles.addressText}>{item.direccion}</Text>
        </View>
      )}

      <View style={styles.cardDetails}>
        {item.responsableSitio && (
          <View style={styles.detailRow}>
            <Ionicons name="person" size={14} color={ALCANCE_THEME.colors.textSecondary} />
            <Text style={styles.detailText}>{item.responsableSitio}</Text>
          </View>
        )}
        {item.activosPresentes && item.activosPresentes.length > 0 && (
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="server" size={14} color={ALCANCE_THEME.colors.textSecondary} />
            <Text style={styles.detailText}>{item.activosPresentes.length} activo(s)</Text>
          </View>
        )}
        {item.coordenadas && (
          <View style={styles.detailRow}>
            <Ionicons name="navigate" size={14} color={ALCANCE_THEME.colors.textSecondary} />
            <Text style={styles.detailText}>
              {item.coordenadas.lat.toFixed(4)}, {item.coordenadas.lng.toFixed(4)}
            </Text>
          </View>
        )}
      </View>

      {item.observaciones && (
        <Text style={styles.observaciones} numberOfLines={2}>
          {item.observaciones}
        </Text>
      )}

      <View style={styles.cardFooter}>
        <Badge
          text={item.incluido ? 'Incluida' : 'Excluida'}
          color={item.incluido ? ALCANCE_THEME.colors.success : ALCANCE_THEME.colors.error}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{ubicaciones.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: ALCANCE_THEME.colors.success }]}>
            {ubicaciones.filter((u) => u.incluido).length}
          </Text>
          <Text style={styles.statLabel}>Incluidas</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: ALCANCE_THEME.colors.primary }]}>
            {ubicaciones.filter((u) => u.tipo === 'Oficina Principal').length}
          </Text>
          <Text style={styles.statLabel}>Principales</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Buscar ubicaciones..."
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
        {Object.keys(TIPO_UBICACION).map((key) =>
          renderFilterChip(
            TIPO_UBICACION[key],
            selectedTipo === TIPO_UBICACION[key],
            () => setSelectedTipo(TIPO_UBICACION[key])
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
        data={filteredUbicaciones}
        renderItem={renderUbicacionCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <EmptyState
            icon="location-outline"
            title="No hay ubicaciones"
            description={
              searchQuery || selectedTipo !== 'Todos'
                ? 'No se encontraron ubicaciones con los filtros aplicados'
                : 'Agrega la primera ubicación física al alcance'
            }
          />
        }
      />

      <TouchableOpacity style={styles.fab} onPress={handleAddUbicacion}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal visible={modalVisible} onClose={() => setModalVisible(false)} title={editingUbicacion ? 'Editar Ubicación' : 'Nueva Ubicación'}>
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
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: ALCANCE_THEME.spacing.sm,
    paddingLeft: ALCANCE_THEME.spacing.xs,
  },
  addressText: {
    flex: 1,
    fontSize: 13,
    color: ALCANCE_THEME.colors.text,
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
  observaciones: {
    fontSize: 13,
    color: ALCANCE_THEME.colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: ALCANCE_THEME.spacing.sm,
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

export default UbicacionesScreen;
