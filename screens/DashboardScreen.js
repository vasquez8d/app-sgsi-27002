import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import Button from '../components/Button';
import { getCurrentUser, logout } from '../services/authService';
import { getComplianceStats } from '../services/controlService';
import { getAssets } from '../services/assetService';
import { getRisks } from '../services/riskService';
import { getTeamMembers } from '../services/teamService';

const DashboardScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    compliance: 0,
    assets: 0,
    risks: 0,
    team: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);

    const compliance = await getComplianceStats();
    const assets = await getAssets();
    const risks = await getRisks();
    const team = await getTeamMembers();

    setStats({
      compliance: compliance.percentage,
      assets: assets.length,
      risks: risks.length,
      team: team.length,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  const modules = [
    {
      title: 'Equipo de Proyecto',
      icon: 'people',
      color: COLORS.primary,
      screen: 'Team',
      description: 'Gestión del equipo SGSI',
    },
    {
      title: 'Alcance del SGSI',
      icon: 'document-text',
      color: COLORS.info,
      screen: 'Scope',
      description: 'Definición y límites',
    },
    {
      title: 'Activos',
      icon: 'server',
      color: COLORS.warning,
      screen: 'Assets',
      description: 'Inventario de activos',
    },
    {
      title: 'Políticas',
      icon: 'book',
      color: COLORS.secondary,
      screen: 'Policies',
      description: 'Repositorio de políticas',
    },
    {
      title: 'Riesgos',
      icon: 'warning',
      color: COLORS.danger,
      screen: 'Risks',
      description: 'Gestión de riesgos',
    },
    {
      title: 'Controles ISO 27002:2013',
      icon: 'shield-checkmark',
      color: '#8B5CF6',
      screen: 'Controls',
      description: '114 controles de seguridad',
    },
  ];

  return (
    <View style={styles.container}>
      <Header
        title="Dashboard"
        subtitle={user ? `Bienvenido, ${user.name}` : 'SGSI'}
        rightComponent={
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.statsContainer}>
          <StatCard
            title="Cumplimiento ISO 27002"
            value={`${stats.compliance}%`}
            icon={<Ionicons name="trending-up" size={32} color={COLORS.success} />}
            color={COLORS.success}
            subtitle="Controles implementados"
          />

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <StatCard
                title="Activos"
                value={stats.assets}
                icon={<Ionicons name="server" size={24} color={COLORS.warning} />}
                color={COLORS.warning}
              />
            </View>
            <View style={styles.statItem}>
              <StatCard
                title="Riesgos"
                value={stats.risks}
                icon={<Ionicons name="warning" size={24} color={COLORS.danger} />}
                color={COLORS.danger}
              />
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <StatCard
                title="Equipo"
                value={stats.team}
                icon={<Ionicons name="people" size={24} color={COLORS.primary} />}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.statItem}>
              <StatCard
                title="Módulos"
                value="6"
                icon={<Ionicons name="apps" size={24} color={COLORS.info} />}
                color={COLORS.info}
              />
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Módulos del Sistema</Text>

        <View style={styles.modulesGrid}>
          {modules.map((module, index) => (
            <TouchableOpacity
              key={index}
              style={styles.moduleCard}
              onPress={() => navigation.navigate(module.screen)}
              activeOpacity={0.7}
            >
              <View style={[styles.moduleIcon, { backgroundColor: module.color }]}>
                <Ionicons name={module.icon} size={28} color={COLORS.white} />
              </View>
              <Text style={styles.moduleTitle}>{module.title}</Text>
              <Text style={styles.moduleDescription}>{module.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    padding: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: -SPACING.xs / 2,
  },
  statItem: {
    flex: 1,
    marginHorizontal: SPACING.xs / 2,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  moduleCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    marginRight: '2%',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moduleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  moduleTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  moduleDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
  },
});

export default DashboardScreen;
