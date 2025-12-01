import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ALCANCE_THEME } from '../utils/alcanceConstants';

const AlcanceCard = ({ icon, title, metrics, status, lastUpdate, onPress, badge }) => {
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* Icono */}
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={32} color={ALCANCE_THEME.colors.primary} />
        </View>

        {/* Contenido */}
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{title}</Text>
            {badge && (
              <View style={[styles.badge, { backgroundColor: badge.color }]}>
                <Text style={styles.badgeText}>{badge.count}</Text>
              </View>
            )}
          </View>
          
          {metrics && (
            <Text style={styles.metrics}>{metrics}</Text>
          )}
          
          {status && (
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
              <Text style={styles.statusText}>{status}</Text>
            </View>
          )}
          
          {lastUpdate && (
            <Text style={styles.lastUpdate}>Actualizado: {lastUpdate}</Text>
          )}
        </View>

        {/* Flecha */}
        <Ionicons name="chevron-forward" size={24} color={ALCANCE_THEME.colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Aprobado':
    case 'Vigente':
      return ALCANCE_THEME.colors.success + '20';
    case 'En Revisión':
      return ALCANCE_THEME.colors.warning + '20';
    case 'Borrador':
      return ALCANCE_THEME.colors.textSecondary + '20';
    default:
      return ALCANCE_THEME.colors.border;
  }
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ALCANCE_THEME.colors.surface,
    borderRadius: ALCANCE_THEME.borderRadius.md,
    marginBottom: ALCANCE_THEME.spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ALCANCE_THEME.spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: ALCANCE_THEME.borderRadius.md,
    backgroundColor: ALCANCE_THEME.colors.primaryLight + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: ALCANCE_THEME.spacing.md,
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ALCANCE_THEME.spacing.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: ALCANCE_THEME.colors.text,
    flex: 1,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ALCANCE_THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  metrics: {
    fontSize: 14,
    color: ALCANCE_THEME.colors.textSecondary,
    marginBottom: ALCANCE_THEME.spacing.xs,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: ALCANCE_THEME.spacing.xs,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: ALCANCE_THEME.colors.text,
  },
  lastUpdate: {
    fontSize: 12,
    color: ALCANCE_THEME.colors.textSecondary,
  },
});

export default AlcanceCard;
