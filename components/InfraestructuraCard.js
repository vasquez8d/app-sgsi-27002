import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Badge from './Badge';
import { ALCANCE_THEME } from '../utils/alcanceConstants';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * Componente de tarjeta para mostrar infraestructura
 * Incluye animaciones, badges para tipos de activo y detalles expandibles
 */
const InfraestructuraCard = ({ infraestructura, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      tension: 100,
      friction: 3,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 3,
    }).start();
  };

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const getCriticidadColor = (criticidad) => {
    switch (criticidad) {
      case 'Alta':
        return ALCANCE_THEME.colors.criticalHigh;
      case 'Media':
        return ALCANCE_THEME.colors.criticalMed;
      case 'Baja':
        return ALCANCE_THEME.colors.criticalLow;
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
        return ALCANCE_THEME.colors.danger;
      default:
        return ALCANCE_THEME.colors.textSecondary;
    }
  };

  const criticidadColor = getCriticidadColor(infraestructura.criticidad);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={[styles.iconContainer, { backgroundColor: `${criticidadColor}15` }]}>
            <MaterialCommunityIcons
              name="server"
              size={20}
              color={criticidadColor}
            />
          </View>
          <View style={styles.cardHeaderText}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {infraestructura.identificador}
            </Text>
            <Text style={[styles.cardSubtitle, { color: criticidadColor }]}>
              {infraestructura.tipoActivo}
            </Text>
          </View>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEdit(infraestructura)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="pencil" size={18} color={ALCANCE_THEME.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onDelete(infraestructura.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={18} color={ALCANCE_THEME.colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sitio */}
      {infraestructura.sitio && (
        <View style={styles.infoRow}>
          <Ionicons name="business-outline" size={14} color={ALCANCE_THEME.colors.textSecondary} />
          <Text style={styles.infoText} numberOfLines={1}>
            {infraestructura.sitio}
          </Text>
        </View>
      )}

      {/* Detalles chips */}
      <View style={styles.detailsRow}>
        {infraestructura.propietario && (
          <View style={styles.detailChip}>
            <Ionicons name="person-outline" size={12} color={ALCANCE_THEME.colors.textSecondary} />
            <Text style={styles.detailChipText} numberOfLines={1}>
              {infraestructura.propietario}
            </Text>
          </View>
        )}
        {infraestructura.unidadNegocio && (
          <View style={styles.detailChip}>
            <MaterialCommunityIcons name="office-building" size={12} color={ALCANCE_THEME.colors.textSecondary} />
            <Text style={styles.detailChipText} numberOfLines={1}>
              {infraestructura.unidadNegocio}
            </Text>
          </View>
        )}
      </View>

      {/* Status badges */}
      <View style={styles.statusBadges}>
        <Badge
          text={infraestructura.criticidad}
          color={criticidadColor}
          size="small"
        />
        <Badge
          text={infraestructura.estadoActivo}
          color={getEstadoColor(infraestructura.estadoActivo)}
          size="small"
        />
        <Badge
          text={infraestructura.incluido ? 'En Alcance' : 'Excluido'}
          color={infraestructura.incluido ? ALCANCE_THEME.colors.success : ALCANCE_THEME.colors.textSecondary}
          size="small"
        />
      </View>

      {/* Expandible section */}
      <TouchableOpacity 
        style={styles.expandButton}
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <Text style={styles.expandButtonText}>
          {expanded ? 'Ver menos' : 'Ver más detalles'}
        </Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={ALCANCE_THEME.colors.primary}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expandedContent}>
          {infraestructura.ubicacionFisica && (
            <View style={styles.expandedItem}>
              <Text style={styles.expandedLabel}>Ubicación Física:</Text>
              <Text style={styles.expandedValue}>{infraestructura.ubicacionFisica}</Text>
            </View>
          )}
          {infraestructura.sistemaOperativo && (
            <View style={styles.expandedItem}>
              <Text style={styles.expandedLabel}>Sistema Operativo:</Text>
              <Text style={styles.expandedValue}>{infraestructura.sistemaOperativo}</Text>
            </View>
          )}
          {infraestructura.funcion && (
            <View style={styles.expandedItem}>
              <Text style={styles.expandedLabel}>Función:</Text>
              <Text style={styles.expandedValue}>{infraestructura.funcion}</Text>
            </View>
          )}
          {infraestructura.observaciones && (
            <View style={styles.expandedItem}>
              <Text style={styles.expandedLabel}>Observaciones:</Text>
              <Text style={styles.expandedValue}>{infraestructura.observaciones}</Text>
            </View>
          )}
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: ALCANCE_THEME.borderRadius.md,
    padding: ALCANCE_THEME.spacing.md,
    marginBottom: ALCANCE_THEME.spacing.md,
    marginHorizontal: ALCANCE_THEME.spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
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
    marginRight: ALCANCE_THEME.spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: ALCANCE_THEME.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ALCANCE_THEME.spacing.sm,
  },
  cardHeaderText: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: ALCANCE_THEME.colors.text,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    gap: ALCANCE_THEME.spacing.xs,
  },
  actionButton: {
    padding: 6,
    borderRadius: ALCANCE_THEME.borderRadius.sm,
    backgroundColor: `${ALCANCE_THEME.colors.background}80`,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: ALCANCE_THEME.spacing.xs,
  },
  infoText: {
    fontSize: 13,
    color: ALCANCE_THEME.colors.text,
    flex: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ALCANCE_THEME.spacing.xs,
    marginBottom: ALCANCE_THEME.spacing.sm,
  },
  detailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ALCANCE_THEME.colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  detailChipText: {
    fontSize: 11,
    color: ALCANCE_THEME.colors.textSecondary,
  },
  statusBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ALCANCE_THEME.spacing.xs,
    marginBottom: ALCANCE_THEME.spacing.sm,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: ALCANCE_THEME.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: ALCANCE_THEME.colors.border,
  },
  expandButtonText: {
    fontSize: 13,
    color: ALCANCE_THEME.colors.primary,
    fontWeight: '500',
  },
  expandedContent: {
    paddingTop: ALCANCE_THEME.spacing.sm,
    gap: ALCANCE_THEME.spacing.xs,
  },
  expandedItem: {
    marginBottom: ALCANCE_THEME.spacing.xs,
  },
  expandedLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: ALCANCE_THEME.colors.textSecondary,
    marginBottom: 2,
  },
  expandedValue: {
    fontSize: 13,
    color: ALCANCE_THEME.colors.text,
    lineHeight: 18,
  },
});

export default InfraestructuraCard;
