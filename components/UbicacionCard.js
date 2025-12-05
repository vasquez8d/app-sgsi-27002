import React, { useState, useCallback } from 'react';
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

// Habilitar LayoutAnimation en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * Card de ubicación optimizado con microinteracciones y observaciones expandibles
 */
const UbicacionCard = React.memo(({
  ubicacion,
  onEdit,
  onDelete,
  getTipoIcon,
  getTipoColor,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const toggleExpanded = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleEdit = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => onEdit(ubicacion));
  }, [ubicacion, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(ubicacion.id, ubicacion.nombreSitio);
  }, [ubicacion, onDelete]);

  const observacionesLargas = ubicacion.observaciones && ubicacion.observaciones.length > 80;
  const tipoColor = getTipoColor(ubicacion.tipo);

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={[styles.iconContainer, { backgroundColor: `${tipoColor}15` }]}>
            <Ionicons
              name={getTipoIcon(ubicacion.tipo)}
              size={20}
              color={tipoColor}
              accessibilityLabel="Icono de ubicación"
            />
          </View>
          <View style={styles.cardHeaderText}>
            <Text 
              style={styles.cardTitle}
              numberOfLines={2}
              accessibilityRole="header"
            >
              {ubicacion.nombreSitio}
            </Text>
            <Text style={[styles.cardSubtitle, { color: tipoColor }]}>
              {ubicacion.tipo}
            </Text>
          </View>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleEdit}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Editar ubicación"
            accessibilityRole="button"
          >
            <Ionicons name="pencil" size={18} color={ALCANCE_THEME.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDelete}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Eliminar ubicación"
            accessibilityRole="button"
          >
            <Ionicons name="trash-outline" size={18} color={ALCANCE_THEME.colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dirección */}
      {ubicacion.direccion && (
        <View style={styles.addressContainer}>
          <Ionicons name="location" size={14} color={ALCANCE_THEME.colors.textSecondary} />
          <Text style={styles.addressText} numberOfLines={2}>
            {ubicacion.direccion}
          </Text>
        </View>
      )}

      {/* Tipos de Activo con badges */}
      {ubicacion.tiposActivo && ubicacion.tiposActivo.length > 0 && (
        <View style={styles.tiposActivoContainer}>
          <Text style={styles.tiposActivoLabel}>Tipos de Activo:</Text>
          <View style={styles.badgesRow}>
            {ubicacion.tiposActivo.map((tipo, index) => (
              <Badge
                key={index}
                text={tipo}
                color={ALCANCE_THEME.colors.primary}
                size="small"
              />
            ))}
          </View>
        </View>
      )}

      {/* Detalles compactos */}
      <View style={styles.cardDetails}>
        {ubicacion.responsableSitio && (
          <View style={styles.detailChip}>
            <Ionicons name="person" size={12} color={ALCANCE_THEME.colors.textSecondary} />
            <Text style={styles.detailText} numberOfLines={1}>
              {ubicacion.responsableSitio}
            </Text>
          </View>
        )}
        {ubicacion.activosPresentes && ubicacion.activosPresentes.length > 0 && (
          <View style={styles.detailChip}>
            <MaterialCommunityIcons name="server" size={12} color={ALCANCE_THEME.colors.textSecondary} />
            <Text style={styles.detailText}>
              {ubicacion.activosPresentes.length} activo{ubicacion.activosPresentes.length !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
        {ubicacion.coordenadas && ubicacion.coordenadas.lat && ubicacion.coordenadas.lng && (
          <View style={styles.detailChip}>
            <Ionicons name="navigate" size={12} color={ALCANCE_THEME.colors.textSecondary} />
            <Text style={styles.detailText} numberOfLines={1}>
              {ubicacion.coordenadas.lat.toFixed(4)}, {ubicacion.coordenadas.lng.toFixed(4)}
            </Text>
          </View>
        )}
      </View>

      {/* Observaciones expandibles */}
      {ubicacion.observaciones && (
        <TouchableOpacity 
          onPress={toggleExpanded}
          activeOpacity={0.7}
          style={styles.observacionesContainer}
        >
          <Text 
            style={styles.observaciones}
            numberOfLines={isExpanded ? undefined : 2}
          >
            {ubicacion.observaciones}
          </Text>
          {observacionesLargas && (
            <View style={styles.expandButton}>
              <Text style={styles.expandText}>
                {isExpanded ? 'Ver menos' : 'Ver más'}
              </Text>
              <Ionicons 
                name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                size={14} 
                color={ALCANCE_THEME.colors.primary} 
              />
            </View>
          )}
        </TouchableOpacity>
      )}

      {/* Footer con badge */}
      <View style={styles.cardFooter}>
        <Badge
          text={ubicacion.incluido ? 'Incluida' : 'Excluida'}
          color={ubicacion.incluido ? ALCANCE_THEME.colors.success : ALCANCE_THEME.colors.error}
        />
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardHeaderText: {
    flex: 1,
    marginTop: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ALCANCE_THEME.colors.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: ALCANCE_THEME.colors.textSecondary,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 4,
    marginLeft: 8,
  },
  actionButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 12,
    paddingLeft: 2,
  },
  addressText: {
    flex: 1,
    fontSize: 13,
    color: ALCANCE_THEME.colors.text,
    lineHeight: 18,
  },
  tiposActivoContainer: {
    marginBottom: 12,
  },
  tiposActivoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: ALCANCE_THEME.colors.textSecondary,
    marginBottom: 6,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  cardDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  detailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    maxWidth: '48%',
  },
  detailText: {
    fontSize: 12,
    color: ALCANCE_THEME.colors.textSecondary,
    flex: 1,
  },
  observacionesContainer: {
    marginTop: 4,
    marginBottom: 8,
  },
  observaciones: {
    fontSize: 13,
    color: ALCANCE_THEME.colors.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  expandText: {
    fontSize: 12,
    color: ALCANCE_THEME.colors.primary,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
});

UbicacionCard.displayName = 'UbicacionCard';

export default UbicacionCard;
