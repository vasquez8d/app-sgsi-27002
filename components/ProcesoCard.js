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
 * Card de proceso optimizado con microinteracciones y descripción expandible
 */
const ProcesoCard = React.memo(({
  proceso,
  onEdit,
  onDelete,
  getEstadoColor,
  getCriticidadColor,
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
    ]).start(() => onEdit(proceso));
  }, [proceso, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(proceso.id, proceso.nombreProceso);
  }, [proceso, onDelete]);

  const descripcionLarga = proceso.descripcion && proceso.descripcion.length > 80;

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <MaterialCommunityIcons
            name="office-building"
            size={24}
            color={ALCANCE_THEME.colors.primary}
            accessibilityLabel="Icono de proceso"
          />
          <View style={styles.cardHeaderText}>
            <Text 
              style={styles.cardTitle}
              numberOfLines={2}
              accessibilityRole="header"
            >
              {proceso.nombreProceso}
            </Text>
            <Text style={styles.cardSubtitle}>{proceso.macroproceso}</Text>
          </View>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleEdit}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            testID={`edit-proceso-${proceso.id}`}
            accessibilityLabel={`Editar proceso ${proceso.nombreProceso}`}
            accessibilityRole="button"
            accessibilityHint="Abre el formulario para editar este proceso"
          >
            <Ionicons name="pencil" size={20} color={ALCANCE_THEME.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDelete}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            testID={`delete-proceso-${proceso.id}`}
            accessibilityLabel={`Eliminar proceso ${proceso.nombreProceso}`}
            accessibilityRole="button"
            accessibilityHint="Elimina permanentemente este proceso"
          >
            <Ionicons name="trash-outline" size={20} color={ALCANCE_THEME.colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      {proceso.descripcion && (
        <TouchableOpacity
          onPress={descripcionLarga ? toggleExpanded : undefined}
          activeOpacity={descripcionLarga ? 0.7 : 1}
          accessibilityRole={descripcionLarga ? "button" : "text"}
          accessibilityLabel={`Descripción: ${proceso.descripcion}`}
          accessibilityHint={descripcionLarga ? (isExpanded ? "Toca para colapsar" : "Toca para expandir") : undefined}
        >
          <Text
            style={styles.cardDescription}
            numberOfLines={isExpanded ? undefined : 2}
          >
            {proceso.descripcion}
          </Text>
          {descripcionLarga && (
            <Text style={styles.expandText}>
              {isExpanded ? 'Ver menos' : 'Ver más'}
            </Text>
          )}
        </TouchableOpacity>
      )}

      <View style={styles.cardDetails}>
        {proceso.responsableArea && (
          <View style={styles.detailRow}>
            <Ionicons
              name="person"
              size={14}
              color={ALCANCE_THEME.colors.textSecondary}
            />
            <Text style={styles.detailText}>{proceso.responsableArea}</Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Ionicons
            name="calendar"
            size={14}
            color={ALCANCE_THEME.colors.textSecondary}
          />
          <Text style={styles.detailText}>
            {new Date(proceso.fechaInclusion).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Badge
          text={proceso.estado}
          color={getEstadoColor(proceso.estado)}
          accessibilityLabel={`Estado: ${proceso.estado}`}
        />
        <Badge
          text={proceso.criticidad}
          color={getCriticidadColor(proceso.criticidad)}
          accessibilityLabel={`Criticidad: ${proceso.criticidad}`}
        />
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  cardHeaderText: {
    marginLeft: 10,
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ALCANCE_THEME.colors.text,
    marginBottom: 2,
    lineHeight: 22,
  },
  cardSubtitle: {
    fontSize: 13,
    color: ALCANCE_THEME.colors.textSecondary,
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 8,
  },
  actionButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
  },
  cardDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 4,
  },
  expandText: {
    fontSize: 13,
    color: ALCANCE_THEME.colors.primary,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 8,
  },
  cardDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 10,
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailText: {
    fontSize: 13,
    color: ALCANCE_THEME.colors.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
});

export default ProcesoCard;
