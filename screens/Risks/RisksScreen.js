import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, RISK_STATES, RISK_LEVELS } from '../../utils/constants';
import { calculateRiskLevel, getStateColor } from '../../utils/helpers';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import SearchBar from '../../components/SearchBar';
import EmptyState from '../../components/EmptyState';
import CustomModal from '../../components/Modal';
import Input from '../../components/Input';
import Badge from '../../components/Badge';
import { getRisks, addRisk, updateRisk, deleteRisk } from '../../services/riskService';

const RisksScreen = ({ navigation }) => {
  const [risks, setRisks] = useState([]);
  const [filteredRisks, setFilteredRisks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    threat: '',
    vulnerability: '',
    impact: 3,
    probability: 3,
    state: 'Identificado',
    treatment: '',
    responsible: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRisks();
  }, []);

  useEffect(() => {
    filterRisks();
  }, [searchQuery, risks]);

  const loadRisks = async () => {
    const data = await getRisks();
    setRisks(data);
  };

  const filterRisks = () => {
    if (!searchQuery) {
      setFilteredRisks(risks);
      return;
    }
    const query = searchQuery.toLowerCase();
    setFilteredRisks(risks.filter(r => 
      r.name.toLowerCase().includes(query) || 
      r.threat.toLowerCase().includes(query)
    ));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.threat.trim()) newErrors.threat = 'La amenaza es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true);
    const result = selectedRisk
      ? await updateRisk(selectedRisk.id, formData)
      : await addRisk(formData);
    setLoading(false);

    if (result.success) {
      await loadRisks();
      closeModal();
      Alert.alert('Éxito', 'Riesgo guardado correctamente');
    }
  };

  const handleDelete = (risk) => {
    Alert.alert('Confirmar', `¿Eliminar ${risk.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        await deleteRisk(risk.id);
        await loadRisks();
      }},
    ]);
  };

  const openModal = (risk = null) => {
    if (risk) {
      setSelectedRisk(risk);
      setFormData({ ...risk });
    } else {
      setSelectedRisk(null);
      setFormData({ name: '', threat: '', vulnerability: '', impact: 3, probability: 3, state: 'Identificado', treatment: '', responsible: '' });
    }
    setErrors({});
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRisk(null);
  };

  const renderRisk = ({ item }) => {
    const riskLevel = calculateRiskLevel(item.impact, item.probability);
    return (
      <Card>
        <View style={styles.riskHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.riskName}>{item.name}</Text>
            <Text style={styles.riskThreat}>Amenaza: {item.threat}</Text>
          </View>
          <View>
            <Badge text={riskLevel.level} color={riskLevel.color} size="small" />
            <Badge text={item.state} color={getStateColor(item.state)} size="small" style={{ marginTop: 4 }} />
          </View>
        </View>
        <View style={styles.riskMetrics}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Impacto</Text>
            <Text style={styles.metricValue}>{item.impact}/5</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Probabilidad</Text>
            <Text style={styles.metricValue}>{item.probability}/5</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Nivel</Text>
            <Text style={[styles.metricValue, { color: riskLevel.color }]}>{item.impact * item.probability}</Text>
          </View>
        </View>
        {item.responsible && <Text style={styles.responsible}>Responsable: {item.responsible}</Text>}
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
  };

  return (
    <View style={styles.container}>
      <Header title="Gestión de Riesgos" subtitle={`${risks.length} riesgos`} showBack onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        {filteredRisks.length > 0 ? (
          <FlatList data={filteredRisks} renderItem={renderRisk} keyExtractor={(item) => item.id} contentContainerStyle={{ paddingBottom: 80 }} />
        ) : (
          <EmptyState icon="warning-outline" title="No hay riesgos" />
        )}
      </View>
      <TouchableOpacity style={styles.fab} onPress={() => openModal()}>
        <Ionicons name="add" size={28} color={COLORS.white} />
      </TouchableOpacity>
      <CustomModal visible={modalVisible} onClose={closeModal} title={selectedRisk ? 'Editar Riesgo' : 'Nuevo Riesgo'}
        footer={
          <View style={{ flexDirection: 'row' }}>
            <Button title="Cancelar" onPress={closeModal} variant="outline" style={{ flex: 1, marginRight: 8 }} />
            <Button title="Guardar" onPress={handleSave} loading={loading} style={{ flex: 1 }} />
          </View>
        }>
        <Input label="Nombre *" value={formData.name} onChangeText={(text) => setFormData({ ...formData, name: text })} error={errors.name} />
        <Input label="Amenaza *" value={formData.threat} onChangeText={(text) => setFormData({ ...formData, threat: text })} error={errors.threat} />
        <Input label="Vulnerabilidad" value={formData.vulnerability} onChangeText={(text) => setFormData({ ...formData, vulnerability: text })} />
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.label}>Impacto (1-5): {formData.impact}</Text>
          <View style={styles.levelButtons}>
            {RISK_LEVELS.map(level => (
              <TouchableOpacity key={level} style={[styles.levelBtn, formData.impact === level && styles.levelBtnActive]}
                onPress={() => setFormData({ ...formData, impact: level })}>
                <Text style={[styles.levelBtnText, formData.impact === level && styles.levelBtnTextActive]}>{level}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.label}>Probabilidad (1-5): {formData.probability}</Text>
          <View style={styles.levelButtons}>
            {RISK_LEVELS.map(level => (
              <TouchableOpacity key={level} style={[styles.levelBtn, formData.probability === level && styles.levelBtnActive]}
                onPress={() => setFormData({ ...formData, probability: level })}>
                <Text style={[styles.levelBtnText, formData.probability === level && styles.levelBtnTextActive]}>{level}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.label}>Estado</Text>
          <ScrollView horizontal>
            {RISK_STATES.map((state, i) => (
              <TouchableOpacity key={i} style={[styles.chip, formData.state === state && { backgroundColor: getStateColor(state) }]}
                onPress={() => setFormData({ ...formData, state })}>
                <Text style={[styles.chipText, formData.state === state && { color: COLORS.white }]}>{state}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <Input label="Plan de Tratamiento" value={formData.treatment} onChangeText={(text) => setFormData({ ...formData, treatment: text })} multiline />
        <Input label="Responsable" value={formData.responsible} onChangeText={(text) => setFormData({ ...formData, responsible: text })} />
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, padding: SPACING.md },
  riskHeader: { flexDirection: 'row', marginBottom: 8 },
  riskName: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.text },
  riskThreat: { fontSize: FONT_SIZES.sm, color: COLORS.textLight, marginTop: 2 },
  riskMetrics: { flexDirection: 'row', marginVertical: 8, backgroundColor: COLORS.background, padding: 8, borderRadius: 8 },
  metric: { flex: 1, alignItems: 'center' },
  metricLabel: { fontSize: FONT_SIZES.xs, color: COLORS.textLight },
  metricValue: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.text, marginTop: 2 },
  responsible: { fontSize: FONT_SIZES.sm, color: COLORS.text, marginBottom: 8 },
  actions: { flexDirection: 'row', marginTop: 8 },
  btn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  fab: { position: 'absolute', right: 16, bottom: 16, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  label: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  levelButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  levelBtn: { flex: 1, padding: 12, marginHorizontal: 4, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  levelBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  levelBtnText: { fontSize: FONT_SIZES.md, color: COLORS.text },
  levelBtnTextActive: { color: COLORS.white, fontWeight: '700' },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border },
  chipText: { fontSize: FONT_SIZES.sm, color: COLORS.text },
});

export default RisksScreen;
