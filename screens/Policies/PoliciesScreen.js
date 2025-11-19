import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, POLICY_STATES } from '../../utils/constants';
import { formatDate, getStateColor } from '../../utils/helpers';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import SearchBar from '../../components/SearchBar';
import EmptyState from '../../components/EmptyState';
import CustomModal from '../../components/Modal';
import Input from '../../components/Input';
import Badge from '../../components/Badge';
import { getPolicies, addPolicy, updatePolicy, deletePolicy } from '../../services/policyService';

const PoliciesScreen = ({ navigation }) => {
  const [policies, setPolicies] = useState([]);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    state: 'Borrador',
    responsible: '',
    content: '',
    approvalDate: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPolicies();
  }, []);

  useEffect(() => {
    filterPolicies();
  }, [searchQuery, policies]);

  const loadPolicies = async () => {
    const data = await getPolicies();
    setPolicies(data);
  };

  const filterPolicies = () => {
    if (!searchQuery) {
      setFilteredPolicies(policies);
      return;
    }
    const query = searchQuery.toLowerCase();
    setFilteredPolicies(policies.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.domain.toLowerCase().includes(query) ||
      p.responsible.toLowerCase().includes(query)
    ));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.domain.trim()) newErrors.domain = 'El dominio es requerido';
    if (!formData.responsible.trim()) newErrors.responsible = 'El responsable es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true);
    const result = selectedPolicy
      ? await updatePolicy(selectedPolicy.id, formData)
      : await addPolicy(formData);
    setLoading(false);

    if (result.success) {
      await loadPolicies();
      closeModal();
      Alert.alert('Éxito', `Política ${selectedPolicy ? 'actualizada' : 'creada'} correctamente`);
    }
  };

  const handleDelete = (policy) => {
    Alert.alert('Confirmar', `¿Eliminar ${policy.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        await deletePolicy(policy.id);
        await loadPolicies();
      }},
    ]);
  };

  const openModal = (policy = null) => {
    if (policy) {
      setSelectedPolicy(policy);
      setFormData({ ...policy });
    } else {
      setSelectedPolicy(null);
      setFormData({ name: '', domain: '', state: 'Borrador', responsible: '', content: '', approvalDate: '' });
    }
    setErrors({});
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPolicy(null);
  };

  const renderPolicy = ({ item }) => (
    <Card>
      <View style={styles.policyHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.policyName}>{item.name}</Text>
          <Text style={styles.policyDomain}>{item.domain}</Text>
          <Text style={styles.policyResponsible}>Responsable: {item.responsible}</Text>
        </View>
        <View>
          <Badge text={item.state} color={getStateColor(item.state)} size="small" />
          <Text style={styles.version}>v{item.version}</Text>
        </View>
      </View>
      {item.approvalDate && (
        <Text style={styles.date}>Aprobación: {formatDate(item.approvalDate)}</Text>
      )}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.btn, { backgroundColor: COLORS.primary }]} onPress={() => openModal(item)}>
          <Ionicons name="create-outline" size={18} color={COLORS.white} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, { backgroundColor: COLORS.danger }]} onPress={() => handleDelete(item)}>
          <Ionicons name="trash-outline" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header title="Gestión de Políticas" subtitle={`${policies.length} políticas`} showBack onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        {filteredPolicies.length > 0 ? (
          <FlatList data={filteredPolicies} renderItem={renderPolicy} keyExtractor={(item) => item.id} contentContainerStyle={{ paddingBottom: 80 }} />
        ) : (
          <EmptyState icon="book-outline" title="No hay políticas" />
        )}
      </View>
      <TouchableOpacity style={styles.fab} onPress={() => openModal()}>
        <Ionicons name="add" size={28} color={COLORS.white} />
      </TouchableOpacity>
      <CustomModal visible={modalVisible} onClose={closeModal} title={selectedPolicy ? 'Editar Política' : 'Nueva Política'}
        footer={
          <View style={{ flexDirection: 'row' }}>
            <Button title="Cancelar" onPress={closeModal} variant="outline" style={{ flex: 1, marginRight: 8 }} />
            <Button title="Guardar" onPress={handleSave} loading={loading} style={{ flex: 1 }} />
          </View>
        }>
        <Input label="Nombre *" value={formData.name} onChangeText={(text) => setFormData({ ...formData, name: text })} error={errors.name} />
        <Input label="Dominio ISO 27002 *" value={formData.domain} onChangeText={(text) => setFormData({ ...formData, domain: text })} error={errors.domain} />
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.label}>Estado *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {POLICY_STATES.map((state, i) => (
              <TouchableOpacity key={i} style={[styles.chip, formData.state === state && { backgroundColor: getStateColor(state) }]}
                onPress={() => setFormData({ ...formData, state })}>
                <Text style={[styles.chipText, formData.state === state && { color: COLORS.white }]}>{state}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <Input label="Responsable *" value={formData.responsible} onChangeText={(text) => setFormData({ ...formData, responsible: text })} error={errors.responsible} />
        <Input label="Contenido" value={formData.content} onChangeText={(text) => setFormData({ ...formData, content: text })} multiline numberOfLines={4} />
        <Input label="Fecha de Aprobación" value={formData.approvalDate} onChangeText={(text) => setFormData({ ...formData, approvalDate: text })} placeholder="YYYY-MM-DD" />
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, padding: SPACING.md },
  policyHeader: { flexDirection: 'row', marginBottom: 8 },
  policyName: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.text },
  policyDomain: { fontSize: FONT_SIZES.sm, color: COLORS.textLight, marginTop: 2 },
  policyResponsible: { fontSize: FONT_SIZES.sm, color: COLORS.text, marginTop: 4 },
  version: { fontSize: FONT_SIZES.xs, color: COLORS.textLight, marginTop: 4, textAlign: 'right' },
  date: { fontSize: FONT_SIZES.sm, color: COLORS.textLight, marginBottom: 8 },
  actions: { flexDirection: 'row', marginTop: 8 },
  btn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  fab: { position: 'absolute', right: 16, bottom: 16, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  label: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border },
  chipText: { fontSize: FONT_SIZES.sm, color: COLORS.text },
});

export default PoliciesScreen;
