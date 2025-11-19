import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, ISO_27002_DOMAINS, CONTROL_STATES } from '../../utils/constants';
import { getStateColor, calculateCompliancePercentage } from '../../utils/helpers';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import SearchBar from '../../components/SearchBar';
import Badge from '../../components/Badge';
import CustomModal from '../../components/Modal';
import Input from '../../components/Input';
import { getControls, updateControl, getComplianceStats, getDomainCompliance } from '../../services/controlService';

const ControlsScreen = ({ navigation }) => {
  const [controls, setControls] = useState([]);
  const [filteredControls, setFilteredControls] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDomain, setFilterDomain] = useState('');
  const [filterState, setFilterState] = useState('');
  const [stats, setStats] = useState(null);
  const [domainStats, setDomainStats] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedControl, setSelectedControl] = useState(null);
  const [formData, setFormData] = useState({
    state: '',
    responsible: '',
    evidence: '',
    notes: '',
    implementationDate: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadControls();
  }, []);

  useEffect(() => {
    filterControls();
  }, [searchQuery, filterDomain, filterState, controls]);

  const loadControls = async () => {
    const data = await getControls();
    setControls(data);
    
    const statsData = await getComplianceStats();
    setStats(statsData);
    
    const domainStatsData = await getDomainCompliance();
    setDomainStats(domainStatsData);
  };

  const filterControls = () => {
    let filtered = controls;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.code.toLowerCase().includes(query)
      );
    }

    if (filterDomain) {
      filtered = filtered.filter(c => c.domain === filterDomain);
    }

    if (filterState) {
      filtered = filtered.filter(c => c.state === filterState);
    }

    setFilteredControls(filtered);
  };

  const handleSave = async () => {
    setLoading(true);
    const result = await updateControl(selectedControl.id, formData);
    setLoading(false);

    if (result.success) {
      await loadControls();
      closeModal();
    }
  };

  const openModal = (control) => {
    setSelectedControl(control);
    setFormData({
      state: control.state,
      responsible: control.responsible || '',
      evidence: control.evidence || '',
      notes: control.notes || '',
      implementationDate: control.implementationDate || '',
    });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedControl(null);
  };

  const renderControl = ({ item }) => (
    <Card>
      <View style={styles.controlHeader}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Badge text={item.code} color={COLORS.primary} size="small" />
            <Badge text={item.state} color={getStateColor(item.state)} size="small" style={{ marginLeft: 8 }} />
          </View>
          <Text style={styles.controlName}>{item.name}</Text>
          <Text style={styles.controlObjective}>{item.objective}</Text>
        </View>
      </View>
      {item.responsible && (
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={16} color={COLORS.textLight} />
          <Text style={styles.infoText}>Responsable: {item.responsible}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.editBtn} onPress={() => openModal(item)}>
        <Ionicons name="create-outline" size={18} color={COLORS.white} />
        <Text style={styles.editBtnText}>Gestionar</Text>
      </TouchableOpacity>
    </Card>
  );

  const renderDomainCard = ({ item }) => {
    const domainStat = domainStats[item.id] || { implemented: 0, total: 0, percentage: 0 };
    return (
      <TouchableOpacity 
        style={styles.domainCard} 
        onPress={() => setFilterDomain(filterDomain === item.id ? '' : item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.domainHeader}>
          <Text style={styles.domainName}>{item.name}</Text>
          <Badge 
            text={`${domainStat.percentage}%`} 
            color={domainStat.percentage >= 70 ? COLORS.success : domainStat.percentage >= 40 ? COLORS.warning : COLORS.danger}
            size="small"
          />
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${domainStat.percentage}%`, backgroundColor: domainStat.percentage >= 70 ? COLORS.success : COLORS.warning }]} />
        </View>
        <Text style={styles.domainStats}>{domainStat.implemented} de {domainStat.total} controles implementados</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Controles ISO 27002" 
        subtitle={stats ? `${stats.percentage}% cumplimiento` : ''} 
        showBack 
        onBack={() => navigation.goBack()} 
      />

      <View style={styles.content}>
        {stats && (
          <Card style={styles.statsCard}>
            <Text style={styles.statsTitle}>Resumen de Cumplimiento</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: COLORS.primary }]}>{stats.total}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: COLORS.success }]}>{stats.implemented}</Text>
                <Text style={styles.statLabel}>Implementados</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: COLORS.warning }]}>{stats.inProgress}</Text>
                <Text style={styles.statLabel}>En Proceso</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: COLORS.danger }]}>{stats.notImplemented}</Text>
                <Text style={styles.statLabel}>Pendientes</Text>
              </View>
            </View>
          </Card>
        )}

        <Text style={styles.sectionTitle}>Dominios ISO 27002:2013</Text>
        <FlatList
          data={ISO_27002_DOMAINS}
          renderItem={renderDomainCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.domainList}
        />

        <View style={styles.filters}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Buscar controles..." />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
            <TouchableOpacity
              style={[styles.filterChip, !filterState && styles.filterChipActive]}
              onPress={() => setFilterState('')}
            >
              <Text style={[styles.filterChipText, !filterState && styles.filterChipTextActive]}>Todos</Text>
            </TouchableOpacity>
            {CONTROL_STATES.map((state, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.filterChip, filterState === state && styles.filterChipActive]}
                onPress={() => setFilterState(state)}
              >
                <Text style={[styles.filterChipText, filterState === state && styles.filterChipTextActive]}>{state}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={filteredControls}
          renderItem={renderControl}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No se encontraron controles</Text>
          }
        />
      </View>

      <CustomModal
        visible={modalVisible}
        onClose={closeModal}
        title={selectedControl ? `${selectedControl.code} - ${selectedControl.name}` : 'Control'}
        size="large"
        footer={
          <View style={{ flexDirection: 'row' }}>
            <Button title="Cancelar" onPress={closeModal} variant="outline" style={{ flex: 1, marginRight: 8 }} />
            <Button title="Guardar" onPress={handleSave} loading={loading} style={{ flex: 1 }} />
          </View>
        }
      >
        {selectedControl && (
          <>
            <Text style={styles.modalObjective}>{selectedControl.objective}</Text>
            
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.label}>Estado de Implementación</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {CONTROL_STATES.map((state, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.chip, formData.state === state && { backgroundColor: getStateColor(state) }]}
                    onPress={() => setFormData({ ...formData, state })}
                  >
                    <Text style={[styles.chipText, formData.state === state && { color: COLORS.white }]}>{state}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <Input
              label="Responsable"
              value={formData.responsible}
              onChangeText={(text) => setFormData({ ...formData, responsible: text })}
              placeholder="Nombre del responsable..."
            />

            <Input
              label="Evidencias de Implementación"
              value={formData.evidence}
              onChangeText={(text) => setFormData({ ...formData, evidence: text })}
              placeholder="Describir evidencias..."
              multiline
              numberOfLines={3}
            />

            <Input
              label="Notas Adicionales"
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              placeholder="Notas o comentarios..."
              multiline
              numberOfLines={3}
            />

            <Input
              label="Fecha de Implementación"
              value={formData.implementationDate}
              onChangeText={(text) => setFormData({ ...formData, implementationDate: text })}
              placeholder="YYYY-MM-DD"
            />
          </>
        )}
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, padding: SPACING.md },
  statsCard: { marginBottom: 16 },
  statsTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { alignItems: 'center' },
  statValue: { fontSize: FONT_SIZES.xxl, fontWeight: '700' },
  statLabel: { fontSize: FONT_SIZES.xs, color: COLORS.textLight, marginTop: 4 },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  domainList: { marginBottom: 16, maxHeight: 140 },
  domainCard: { width: 240, backgroundColor: COLORS.white, borderRadius: 12, padding: 12, marginRight: 12, elevation: 2 },
  domainHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  domainName: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.text, flex: 1, marginRight: 8 },
  progressBar: { height: 6, backgroundColor: COLORS.background, borderRadius: 3, marginBottom: 8, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  domainStats: { fontSize: FONT_SIZES.xs, color: COLORS.textLight },
  filters: { marginBottom: 12 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterChipText: { fontSize: FONT_SIZES.sm, color: COLORS.text },
  filterChipTextActive: { color: COLORS.white, fontWeight: '600' },
  controlHeader: { flexDirection: 'row', marginBottom: 8 },
  controlName: { fontSize: FONT_SIZES.md, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  controlObjective: { fontSize: FONT_SIZES.sm, color: COLORS.textLight },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoText: { fontSize: FONT_SIZES.sm, color: COLORS.text, marginLeft: 6 },
  editBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, padding: 10, borderRadius: 8, marginTop: 8 },
  editBtnText: { color: COLORS.white, fontSize: FONT_SIZES.sm, fontWeight: '600', marginLeft: 6 },
  emptyText: { textAlign: 'center', color: COLORS.textLight, fontSize: FONT_SIZES.md, marginTop: 32 },
  modalObjective: { fontSize: FONT_SIZES.sm, color: COLORS.textLight, marginBottom: 16, fontStyle: 'italic' },
  label: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border },
  chipText: { fontSize: FONT_SIZES.sm, color: COLORS.text },
});

export default ControlsScreen;
