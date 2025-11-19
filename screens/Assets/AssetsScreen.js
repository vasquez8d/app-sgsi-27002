import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, ASSET_CATEGORIES, CRITICALITY_LEVELS, CRITICALITY_COLORS } from '../../utils/constants';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import SearchBar from '../../components/SearchBar';
import EmptyState from '../../components/EmptyState';
import CustomModal from '../../components/Modal';
import Input from '../../components/Input';
import Badge from '../../components/Badge';
import { getAssets, addAsset, updateAsset, deleteAsset } from '../../services/assetService';

const AssetsScreen = ({ navigation }) => {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    criticality: '',
    owner: '',
    description: '',
    location: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAssets();
  }, []);

  useEffect(() => {
    filterAssets();
  }, [searchQuery, filterCategory, assets]);

  const loadAssets = async () => {
    const data = await getAssets();
    setAssets(data);
  };

  const filterAssets = () => {
    let filtered = assets;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        asset =>
          asset.name.toLowerCase().includes(query) ||
          asset.category.toLowerCase().includes(query) ||
          asset.owner.toLowerCase().includes(query)
      );
    }

    if (filterCategory) {
      filtered = filtered.filter(asset => asset.category === filterCategory);
    }

    setFilteredAssets(filtered);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.category) newErrors.category = 'La categoría es requerida';
    if (!formData.criticality) newErrors.criticality = 'La criticidad es requerida';
    if (!formData.owner.trim()) newErrors.owner = 'El propietario es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true);
    const result = selectedAsset
      ? await updateAsset(selectedAsset.id, formData)
      : await addAsset(formData);
    setLoading(false);

    if (result.success) {
      await loadAssets();
      closeModal();
      Alert.alert('Éxito', `Activo ${selectedAsset ? 'actualizado' : 'agregado'} correctamente`);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleDelete = (asset) => {
    Alert.alert('Confirmar eliminación', `¿Eliminar ${asset.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          const result = await deleteAsset(asset.id);
          if (result.success) {
            await loadAssets();
            Alert.alert('Éxito', 'Activo eliminado');
          }
        },
      },
    ]);
  };

  const openModal = (asset = null) => {
    if (asset) {
      setSelectedAsset(asset);
      setFormData({ ...asset });
    } else {
      setSelectedAsset(null);
      setFormData({ name: '', category: '', criticality: '', owner: '', description: '', location: '' });
    }
    setErrors({});
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedAsset(null);
    setFormData({ name: '', category: '', criticality: '', owner: '', description: '', location: '' });
  };

  const renderAsset = ({ item }) => (
    <Card>
      <View style={styles.assetHeader}>
        <View style={styles.assetInfo}>
          <Text style={styles.assetName}>{item.name}</Text>
          <Text style={styles.assetOwner}>Propietario: {item.owner}</Text>
        </View>
        <Badge text={item.criticality} color={CRITICALITY_COLORS[item.criticality]} />
      </View>
      <Badge text={item.category} color={COLORS.primary} size="small" style={{ marginBottom: 8 }} />
      {item.description && <Text style={styles.description}>{item.description}</Text>}
      {item.location && (
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={COLORS.textLight} />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
      )}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.primary }]} onPress={() => openModal(item)}>
          <Ionicons name="create-outline" size={18} color={COLORS.white} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.danger }]} onPress={() => handleDelete(item)}>
          <Ionicons name="trash-outline" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header title="Gestión de Activos" subtitle={`${assets.length} activos`} showBack onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Buscar activos..." />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterChip, !filterCategory && styles.filterChipActive]}
            onPress={() => setFilterCategory('')}
          >
            <Text style={[styles.filterChipText, !filterCategory && styles.filterChipTextActive]}>Todos</Text>
          </TouchableOpacity>
          {ASSET_CATEGORIES.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.filterChip, filterCategory === category && styles.filterChipActive]}
              onPress={() => setFilterCategory(category)}
            >
              <Text style={[styles.filterChipText, filterCategory === category && styles.filterChipTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filteredAssets.length > 0 ? (
          <FlatList
            data={filteredAssets}
            renderItem={renderAsset}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        ) : (
          <EmptyState icon="server-outline" title="No hay activos" message="Agregue el primer activo de información" />
        )}
      </View>

      <TouchableOpacity style={styles.fab} onPress={() => openModal()}>
        <Ionicons name="add" size={28} color={COLORS.white} />
      </TouchableOpacity>

      <CustomModal
        visible={modalVisible}
        onClose={closeModal}
        title={selectedAsset ? 'Editar Activo' : 'Nuevo Activo'}
        footer={
          <View style={{ flexDirection: 'row' }}>
            <Button title="Cancelar" onPress={closeModal} variant="outline" style={{ flex: 1, marginRight: 8 }} />
            <Button title="Guardar" onPress={handleSave} loading={loading} style={{ flex: 1 }} />
          </View>
        }
      >
        <Input label="Nombre *" value={formData.name} onChangeText={(text) => setFormData({ ...formData, name: text })} error={errors.name} />
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.label}>Categoría *</Text>
          <View style={styles.optionsGrid}>
            {ASSET_CATEGORIES.map((cat, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.option, formData.category === cat && styles.optionSelected]}
                onPress={() => setFormData({ ...formData, category: cat })}
              >
                <Text style={[styles.optionText, formData.category === cat && styles.optionTextSelected]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
        </View>
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.label}>Criticidad *</Text>
          <View style={styles.optionsGrid}>
            {Object.values(CRITICALITY_LEVELS).map((crit, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.option, formData.criticality === crit && styles.optionSelected]}
                onPress={() => setFormData({ ...formData, criticality: crit })}
              >
                <Text style={[styles.optionText, formData.criticality === crit && styles.optionTextSelected]}>{crit}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.criticality && <Text style={styles.errorText}>{errors.criticality}</Text>}
        </View>
        <Input label="Propietario *" value={formData.owner} onChangeText={(text) => setFormData({ ...formData, owner: text })} error={errors.owner} />
        <Input label="Descripción" value={formData.description} onChangeText={(text) => setFormData({ ...formData, description: text })} multiline />
        <Input label="Ubicación" value={formData.location} onChangeText={(text) => setFormData({ ...formData, location: text })} />
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, padding: SPACING.md },
  assetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  assetInfo: { flex: 1 },
  assetName: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.text },
  assetOwner: { fontSize: FONT_SIZES.sm, color: COLORS.textLight, marginTop: 2 },
  description: { fontSize: FONT_SIZES.sm, color: COLORS.text, marginBottom: 8 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  locationText: { fontSize: FONT_SIZES.sm, color: COLORS.textLight, marginLeft: 4 },
  actions: { flexDirection: 'row', marginTop: 8 },
  actionBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  fab: { position: 'absolute', right: 16, bottom: 16, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  filterContainer: { marginBottom: 16, maxHeight: 50 },
  filterChip: { backgroundColor: COLORS.white, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: COLORS.border },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterChipText: { fontSize: FONT_SIZES.sm, color: COLORS.text },
  filterChipTextActive: { color: COLORS.white, fontWeight: '600' },
  label: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  option: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border, marginRight: 8, marginBottom: 8 },
  optionSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  optionText: { fontSize: FONT_SIZES.sm, color: COLORS.text },
  optionTextSelected: { color: COLORS.white, fontWeight: '600' },
  errorText: { color: COLORS.error, fontSize: FONT_SIZES.sm, marginTop: 4 },
});

export default AssetsScreen;
