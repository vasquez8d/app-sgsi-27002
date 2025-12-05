import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Modal,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import SearchBarEnhanced from '../../components/SearchBarEnhanced';
import Badge from '../../components/Badge';
import EmptyState from '../../components/EmptyState';
import MetricCard from '../../components/MetricCard';
import { ALCANCE_THEME } from '../../utils/alcanceConstants';
import { 
  getProcesos, 
  getUnidades, 
  getUbicaciones, 
  getInfraestructura 
} from '../../services/alcance/alcanceCRUD';

const MODULOS = {
  TODOS: 'Todos',
  PROCESOS: 'Procesos',
  UNIDADES: 'Unidades',
  UBICACIONES: 'Ubicaciones',
  INFRAESTRUCTURA: 'Infraestructura',
};

const ExclusionesScreen = ({ navigation }) => {
  const [exclusiones, setExclusiones] = useState({
    procesos: [],
    unidades: [],
    ubicaciones: [],
    infraestructura: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModulo, setSelectedModulo] = useState(MODULOS.TODOS);
  const [refreshing, setRefreshing] = useState(false);
  const [moduloPickerVisible, setModuloPickerVisible] = useState(false);

  useEffect(() => {
    loadExclusiones();
  }, []);

  const loadExclusiones = () => {
    // Obtener elementos excluidos de cada submódulo (incluido = false/0)
    const procesos = getProcesos().filter(p => p.estado !== 'Incluido');
    const unidades = getUnidades().filter(u => !u.incluida);
    const ubicaciones = getUbicaciones().filter(ub => !ub.incluido);
    const infraestructura = getInfraestructura().filter(i => !i.incluido);

    setExclusiones({
      procesos,
      unidades,
      ubicaciones,
      infraestructura,
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadExclusiones();
    setRefreshing(false);
  };

  // Calcular estadísticas
  const stats = useMemo(() => {
    return {
      total: exclusiones.procesos.length + exclusiones.unidades.length + 
             exclusiones.ubicaciones.length + exclusiones.infraestructura.length,
      procesos: exclusiones.procesos.length,
      unidades: exclusiones.unidades.length,
      ubicaciones: exclusiones.ubicaciones.length,
      infraestructura: exclusiones.infraestructura.length,
    };
  }, [exclusiones]);

  // Filtrar por búsqueda y módulo seleccionado
  const filteredData = useMemo(() => {
    let data = [];
    
    if (selectedModulo === MODULOS.TODOS || selectedModulo === MODULOS.PROCESOS) {
      data.push({
        modulo: MODULOS.PROCESOS,
        items: exclusiones.procesos.filter(p => 
          searchQuery ? p.nombreProceso.toLowerCase().includes(searchQuery.toLowerCase()) : true
        ),
      });
    }
    
    if (selectedModulo === MODULOS.TODOS || selectedModulo === MODULOS.UNIDADES) {
      data.push({
        modulo: MODULOS.UNIDADES,
        items: exclusiones.unidades.filter(u => 
          searchQuery ? u.nombreUnidad.toLowerCase().includes(searchQuery.toLowerCase()) : true
        ),
      });
    }
    
    if (selectedModulo === MODULOS.TODOS || selectedModulo === MODULOS.UBICACIONES) {
      data.push({
        modulo: MODULOS.UBICACIONES,
        items: exclusiones.ubicaciones.filter(ub => 
          searchQuery ? ub.nombreSitio.toLowerCase().includes(searchQuery.toLowerCase()) : true
        ),
      });
    }
    
    if (selectedModulo === MODULOS.TODOS || selectedModulo === MODULOS.INFRAESTRUCTURA) {
      data.push({
        modulo: MODULOS.INFRAESTRUCTURA,
        items: exclusiones.infraestructura.filter(i => 
          searchQuery ? i.identificador.toLowerCase().includes(searchQuery.toLowerCase()) : true
        ),
      });
    }
    
    return data.filter(section => section.items.length > 0);
  }, [exclusiones, selectedModulo, searchQuery]);

  // Obtener color e icono según el módulo
  const getModuleStyle = (modulo) => {
    switch (modulo) {
      case MODULOS.PROCESOS:
        return { 
          icon: 'git-network', 
          color: ALCANCE_THEME.colors.primary,
          label: 'Procesos y Servicios'
        };
      case MODULOS.UNIDADES:
        return { 
          icon: 'briefcase', 
          color: ALCANCE_THEME.colors.success,
          label: 'Unidades Organizacionales'
        };
      case MODULOS.UBICACIONES:
        return { 
          icon: 'location', 
          color: ALCANCE_THEME.colors.info,
          label: 'Ubicaciones Físicas'
        };
      case MODULOS.INFRAESTRUCTURA:
        return { 
          icon: 'server', 
          color: ALCANCE_THEME.colors.warning,
          label: 'Infraestructura Tecnológica'
        };
      default:
        return { icon: 'close-circle', color: ALCANCE_THEME.colors.error, label: '' };
    }
  };

  const renderSectionHeader = (modulo, count) => {
    const style = getModuleStyle(modulo);
    return (
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderLeft}>
          <Ionicons name={style.icon} size={20} color={style.color} />
          <Text style={styles.sectionHeaderTitle}>{style.label}</Text>
        </View>
        <View style={[styles.countBadge, { backgroundColor: style.color }]}>
          <Text style={styles.countBadgeText}>{count}</Text>
        </View>
      </View>
    );
  };

  const renderExclusionCard = (item, modulo) => {
    const style = getModuleStyle(modulo);
    
    // Renderizar según el tipo de módulo
    if (modulo === MODULOS.PROCESOS) {
      return (
        <View key={`proceso-${item.id}`} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <MaterialCommunityIcons
                name="office-building"
                size={24}
                color={ALCANCE_THEME.colors.primary}
              />
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.nombreProceso}
                </Text>
                <Text style={styles.cardSubtitle}>{item.macroproceso}</Text>
              </View>
            </View>
          </View>

          {item.descripcion && (
            <Text style={styles.cardDescription} numberOfLines={2}>
              {item.descripcion}
            </Text>
          )}

          <View style={styles.cardDetails}>
            {item.responsableArea && (
              <View style={styles.detailRow}>
                <Ionicons name="person" size={14} color={ALCANCE_THEME.colors.textSecondary} />
                <Text style={styles.detailText}>{item.responsableArea}</Text>
              </View>
            )}
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={14} color={ALCANCE_THEME.colors.textSecondary} />
              <Text style={styles.detailText}>
                {new Date(item.fechaInclusion).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Badge text={item.estado} color={ALCANCE_THEME.colors.error} />
            <Badge text={item.criticidad} color={ALCANCE_THEME.colors.warning} />
          </View>
        </View>
      );
    }
    
    if (modulo === MODULOS.UNIDADES) {
      const getTipoIcon = (tipo) => {
        switch (tipo) {
          case 'Gerencia': return 'briefcase';
          case 'Dirección': return 'business';
          case 'Departamento': return 'grid';
          case 'Área': return 'apps';
          case 'Equipo': return 'people';
          default: return 'briefcase';
        }
      };

      const getTipoColor = (tipo) => {
        switch (tipo) {
          case 'Gerencia': return '#8B5CF6';
          case 'Dirección': return '#3B82F6';
          case 'Departamento': return '#10B981';
          case 'Área': return '#F59E0B';
          case 'Equipo': return '#EF4444';
          default: return ALCANCE_THEME.colors.primary;
        }
      };

      const tipoColor = getTipoColor(item.tipo);

      return (
        <View key={`unidad-${item.id}`} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${tipoColor}15` }]}>
                <MaterialCommunityIcons
                  name={getTipoIcon(item.tipo)}
                  size={20}
                  color={tipoColor}
                />
              </View>
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.nombreUnidad}
                </Text>
                <View style={styles.subtitleRow}>
                  <Text style={styles.cardSubtitle}>{item.tipo}</Text>
                  <View style={styles.divider} />
                  <Text style={styles.cardSubtitle}>Nivel {item.nivelJerarquico}</Text>
                </View>
              </View>
            </View>
          </View>

          {(item.responsable || item.rolSGSI) && (
            <View style={styles.cardDetails}>
              {item.responsable && (
                <View style={styles.detailChip}>
                  <Ionicons name="person-outline" size={12} color={ALCANCE_THEME.colors.textSecondary} />
                  <Text style={styles.detailText} numberOfLines={1}>{item.responsable}</Text>
                </View>
              )}
              {item.rolSGSI && (
                <View style={styles.detailChip}>
                  <MaterialCommunityIcons name="shield-account-outline" size={12} color={ALCANCE_THEME.colors.textSecondary} />
                  <Text style={styles.detailText} numberOfLines={1}>{item.rolSGSI}</Text>
                </View>
              )}
            </View>
          )}

          {item.justificacion && (
            <View style={styles.warningBox}>
              <Ionicons name="alert-circle" size={14} color={ALCANCE_THEME.colors.warning} />
              <Text style={styles.warningText} numberOfLines={2}>
                {item.justificacion}
              </Text>
            </View>
          )}

          <View style={styles.cardFooter}>
            <View style={[styles.statusBadgeInline, { backgroundColor: `${ALCANCE_THEME.colors.error}15` }]}>
              <Ionicons name="close-circle" size={12} color={ALCANCE_THEME.colors.error} />
              <Text style={[styles.statusBadgeText, { color: ALCANCE_THEME.colors.error }]}>
                Excluida
              </Text>
            </View>
            {item.procesosAsociados && item.procesosAsociados.length > 0 && (
              <View style={[styles.statusBadgeInline, { backgroundColor: `${ALCANCE_THEME.colors.primary}15` }]}>
                <Ionicons name="git-network-outline" size={12} color={ALCANCE_THEME.colors.primary} />
                <Text style={[styles.statusBadgeText, { color: ALCANCE_THEME.colors.primary }]}>
                  {item.procesosAsociados.length} proceso{item.procesosAsociados.length !== 1 ? 's' : ''}
                </Text>
              </View>
            )}
          </View>
        </View>
      );
    }
    
    if (modulo === MODULOS.UBICACIONES) {
      const getTipoIcon = (tipo) => {
        switch (tipo) {
          case 'Oficina Principal': return 'business-outline';
          case 'Sucursal': return 'storefront-outline';
          case 'Remoto': return 'laptop-outline';
          case 'Data Center': return 'server-outline';
          case 'Cliente': return 'people-outline';
          default: return 'location-outline';
        }
      };

      const getTipoColor = (tipo) => {
        switch (tipo) {
          case 'Oficina Principal': return '#8B5CF6';
          case 'Sucursal': return '#3B82F6';
          case 'Remoto': return '#10B981';
          case 'Data Center': return '#EF4444';
          case 'Cliente': return '#F59E0B';
          default: return ALCANCE_THEME.colors.primary;
        }
      };

      const tipoColor = getTipoColor(item.tipo);

      return (
        <View key={`ubicacion-${item.id}`} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${tipoColor}15` }]}>
                <Ionicons
                  name={getTipoIcon(item.tipo)}
                  size={20}
                  color={tipoColor}
                />
              </View>
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.nombreSitio}
                </Text>
                <Text style={[styles.cardSubtitle, { color: tipoColor }]}>
                  {item.tipo}
                </Text>
              </View>
            </View>
          </View>

          {item.direccion && (
            <View style={styles.addressContainer}>
              <Ionicons name="location" size={14} color={ALCANCE_THEME.colors.textSecondary} />
              <Text style={styles.addressText} numberOfLines={2}>
                {item.direccion}
              </Text>
            </View>
          )}

          {item.tiposActivo && item.tiposActivo.length > 0 && (
            <View style={styles.tiposActivoContainer}>
              <Text style={styles.tiposActivoLabel}>Tipos de Activo:</Text>
              <View style={styles.badgesRow}>
                {item.tiposActivo.map((tipo, index) => (
                  <Badge
                    key={index}
                    text={tipo}
                    color={ALCANCE_THEME.colors.primary}
                  />
                ))}
              </View>
            </View>
          )}

          <View style={styles.cardDetails}>
            {item.responsableSitio && (
              <View style={styles.detailChip}>
                <Ionicons name="person" size={12} color={ALCANCE_THEME.colors.textSecondary} />
                <Text style={styles.detailText} numberOfLines={1}>
                  {item.responsableSitio}
                </Text>
              </View>
            )}
            {item.activosPresentes && item.activosPresentes.length > 0 && (
              <View style={styles.detailChip}>
                <MaterialCommunityIcons name="server" size={12} color={ALCANCE_THEME.colors.textSecondary} />
                <Text style={styles.detailText}>
                  {item.activosPresentes.length} activo{item.activosPresentes.length !== 1 ? 's' : ''}
                </Text>
              </View>
            )}
            {item.coordenadas && item.coordenadas.lat && item.coordenadas.lng && (
              <View style={styles.detailChip}>
                <Ionicons name="navigate" size={12} color={ALCANCE_THEME.colors.textSecondary} />
                <Text style={styles.detailText} numberOfLines={1}>
                  {item.coordenadas.lat.toFixed(4)}, {item.coordenadas.lng.toFixed(4)}
                </Text>
              </View>
            )}
          </View>

          {item.observaciones && (
            <View style={styles.observacionesContainer}>
              <Text style={styles.observaciones} numberOfLines={2}>
                {item.observaciones}
              </Text>
            </View>
          )}

          <View style={styles.cardFooter}>
            <Badge
              text="Excluida"
              color={ALCANCE_THEME.colors.error}
            />
          </View>
        </View>
      );
    }
    
    if (modulo === MODULOS.INFRAESTRUCTURA) {
      const getCriticidadColor = (criticidad) => {
        switch (criticidad) {
          case 'Alta': return ALCANCE_THEME.colors.error;
          case 'Media': return ALCANCE_THEME.colors.warning;
          case 'Baja': return ALCANCE_THEME.colors.success;
          default: return ALCANCE_THEME.colors.textSecondary;
        }
      };

      const getEstadoColor = (estado) => {
        switch (estado) {
          case 'Activo': return ALCANCE_THEME.colors.success;
          case 'Inactivo': return ALCANCE_THEME.colors.textSecondary;
          case 'Mantenimiento': return ALCANCE_THEME.colors.warning;
          case 'Retirado': return ALCANCE_THEME.colors.error;
          default: return ALCANCE_THEME.colors.textSecondary;
        }
      };

      const criticidadColor = getCriticidadColor(item.criticidad);

      return (
        <View key={`infra-${item.id}`} style={styles.card}>
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
                  {item.identificador}
                </Text>
                <Text style={[styles.cardSubtitle, { color: criticidadColor }]}>
                  {item.tipoActivo}
                </Text>
              </View>
            </View>
          </View>

          {item.sitio && (
            <View style={styles.infoRow}>
              <Ionicons name="business-outline" size={14} color={ALCANCE_THEME.colors.textSecondary} />
              <Text style={styles.infoText} numberOfLines={1}>
                {item.sitio}
              </Text>
            </View>
          )}

          <View style={styles.detailsRow}>
            {item.propietario && (
              <View style={styles.detailChip}>
                <Ionicons name="person-outline" size={12} color={ALCANCE_THEME.colors.textSecondary} />
                <Text style={styles.detailChipText} numberOfLines={1}>
                  {item.propietario}
                </Text>
              </View>
            )}
            {item.unidadNegocio && (
              <View style={styles.detailChip}>
                <MaterialCommunityIcons name="office-building" size={12} color={ALCANCE_THEME.colors.textSecondary} />
                <Text style={styles.detailChipText} numberOfLines={1}>
                  {item.unidadNegocio}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.statusBadges}>
            <Badge text={item.criticidad} color={criticidadColor} />
            <Badge text={item.estadoActivo} color={getEstadoColor(item.estadoActivo)} />
            <Badge text="Excluido" color={ALCANCE_THEME.colors.error} />
          </View>
        </View>
      );
    }
    
    return null;
  };

  return (
    <View style={styles.container}>
      {/* Métricas resumen - Todas en una fila horizontal */}
      <View style={styles.dashboardContent}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.metricsRow}
        >
          <MetricCard
            icon="close-circle"
            iconColor={ALCANCE_THEME.colors.error}
            value={stats.total}
            label="Total"
            backgroundColor="#FFFFFF"
            borderColor={ALCANCE_THEME.colors.error}
            valueColor={ALCANCE_THEME.colors.error}
          />
          
          <MetricCard
            icon="git-network"
            iconColor={ALCANCE_THEME.colors.primary}
            value={stats.procesos}
            label="Procesos"
            backgroundColor="#FFFFFF"
            borderColor={ALCANCE_THEME.colors.primary}
            valueColor={ALCANCE_THEME.colors.text}
          />
          
          <MetricCard
            icon="briefcase"
            iconColor={ALCANCE_THEME.colors.success}
            value={stats.unidades}
            label="Unidades"
            backgroundColor="#FFFFFF"
            borderColor={ALCANCE_THEME.colors.success}
            valueColor={ALCANCE_THEME.colors.text}
          />
          
          <MetricCard
            icon="location"
            iconColor={ALCANCE_THEME.colors.info}
            value={stats.ubicaciones}
            label="Ubi."
            backgroundColor="#FFFFFF"
            borderColor={ALCANCE_THEME.colors.info}
            valueColor={ALCANCE_THEME.colors.text}
          />
          
          <MetricCard
            icon="server"
            iconColor={ALCANCE_THEME.colors.warning}
            value={stats.infraestructura}
            label="Infra."
            backgroundColor="#FFFFFF"
            borderColor={ALCANCE_THEME.colors.warning}
            valueColor={ALCANCE_THEME.colors.text}
          />
        </ScrollView>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <SearchBarEnhanced
          placeholder="Buscar exclusiones..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filtro por módulo - Combobox */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Sub Módulo:</Text>
        <TouchableOpacity 
          style={styles.pickerButton}
          onPress={() => setModuloPickerVisible(true)}
        >
          <Ionicons name="filter" size={20} color={ALCANCE_THEME.colors.primary} />
          <Text style={styles.pickerButtonText}>{selectedModulo}</Text>
          <Ionicons name="chevron-down" size={20} color={ALCANCE_THEME.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Lista de exclusiones agrupadas por módulo */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredData.length === 0 ? (
          <EmptyState
            icon="checkmark-done-circle-outline"
            title="No hay exclusiones"
            description={
              searchQuery || selectedModulo !== MODULOS.TODOS
                ? 'No se encontraron exclusiones con los filtros aplicados'
                : 'No hay elementos excluidos del alcance. Esto es positivo para la cobertura del SGSI.'
            }
          />
        ) : (
          <>
            {filteredData.map(section => (
              <View key={section.modulo}>
                {renderSectionHeader(section.modulo, section.items.length)}
                {section.items.map(item => renderExclusionCard(item, section.modulo))}
              </View>
            ))}
            
            {/* Nota informativa al final */}
            {stats.total > 0 && (
              <View style={styles.alertBox}>
                <Ionicons name="information-circle" size={20} color={ALCANCE_THEME.colors.primary} />
                <Text style={styles.alertText}>
                  Las exclusiones deben estar debidamente justificadas según ISO 27001 cláusula 4.3
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Modal Picker para selección de módulo */}
      <Modal
        visible={moduloPickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModuloPickerVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModuloPickerVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrar por Sub Módulo</Text>
              <TouchableOpacity onPress={() => setModuloPickerVisible(false)}>
                <Ionicons name="close" size={24} color={ALCANCE_THEME.colors.text} />
              </TouchableOpacity>
            </View>

            {Object.values(MODULOS).map((modulo) => (
              <TouchableOpacity
                key={modulo}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedModulo(modulo);
                  setModuloPickerVisible(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText,
                  selectedModulo === modulo && styles.modalOptionTextSelected
                ]}>
                  {modulo}
                </Text>
                {selectedModulo === modulo && (
                  <Ionicons 
                    name="checkmark" 
                    size={20} 
                    color={ALCANCE_THEME.colors.primary} 
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ALCANCE_THEME.colors.background,
  },
  dashboardContent: {
    backgroundColor: '#FFFFFF',
    padding: ALCANCE_THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: ALCANCE_THEME.spacing.sm,
    paddingRight: ALCANCE_THEME.spacing.sm,
  },
  searchContainer: {
    paddingHorizontal: ALCANCE_THEME.spacing.md,
    paddingVertical: ALCANCE_THEME.spacing.sm,
    backgroundColor: '#FFFFFF',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ALCANCE_THEME.spacing.md,
    paddingVertical: ALCANCE_THEME.spacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: ALCANCE_THEME.typography.fontWeightMedium,
    color: ALCANCE_THEME.colors.text,
    marginRight: ALCANCE_THEME.spacing.sm,
  },
  pickerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: ALCANCE_THEME.borderRadius.md,
    paddingHorizontal: ALCANCE_THEME.spacing.md,
    paddingVertical: ALCANCE_THEME.spacing.sm,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: ALCANCE_THEME.spacing.sm,
  },
  pickerButtonText: {
    flex: 1,
    fontSize: 14,
    color: ALCANCE_THEME.colors.text,
  },
  alertBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: ALCANCE_THEME.spacing.md,
    marginTop: ALCANCE_THEME.spacing.lg,
    marginBottom: ALCANCE_THEME.spacing.md,
    borderRadius: ALCANCE_THEME.borderRadius.sm,
    gap: ALCANCE_THEME.spacing.sm,
  },
  alertText: {
    flex: 1,
    fontSize: 13,
    color: ALCANCE_THEME.colors.primary,
    lineHeight: 18,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: ALCANCE_THEME.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: ALCANCE_THEME.spacing.md,
    paddingVertical: ALCANCE_THEME.spacing.sm,
    marginTop: ALCANCE_THEME.spacing.md,
    marginBottom: ALCANCE_THEME.spacing.sm,
    borderRadius: ALCANCE_THEME.borderRadius.sm,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ALCANCE_THEME.spacing.sm,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: ALCANCE_THEME.typography.fontWeightBold,
    color: ALCANCE_THEME.colors.text,
  },
  countBadge: {
    paddingHorizontal: ALCANCE_THEME.spacing.sm,
    paddingVertical: 2,
    borderRadius: ALCANCE_THEME.borderRadius.full,
    minWidth: 24,
    alignItems: 'center',
  },
  countBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: ALCANCE_THEME.typography.fontWeightBold,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: {
    marginLeft: ALCANCE_THEME.spacing.sm,
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: ALCANCE_THEME.typography.fontWeightBold,
    color: ALCANCE_THEME.colors.text,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: ALCANCE_THEME.colors.textSecondary,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 10,
    backgroundColor: ALCANCE_THEME.colors.textSecondary,
    marginHorizontal: 6,
  },
  cardDescription: {
    fontSize: 13,
    color: ALCANCE_THEME.colors.textSecondary,
    lineHeight: 18,
    marginBottom: ALCANCE_THEME.spacing.sm,
  },
  cardDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: ALCANCE_THEME.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: ALCANCE_THEME.colors.textSecondary,
  },
  detailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  detailChipText: {
    fontSize: 11,
    color: ALCANCE_THEME.colors.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: ALCANCE_THEME.spacing.xs,
  },
  statusBadgeInline: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: ALCANCE_THEME.typography.fontWeightMedium,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF9C4',
    borderRadius: ALCANCE_THEME.borderRadius.sm,
    padding: ALCANCE_THEME.spacing.sm,
    marginBottom: ALCANCE_THEME.spacing.sm,
    gap: 6,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: '#F57F17',
    lineHeight: 16,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: ALCANCE_THEME.spacing.sm,
    gap: 6,
  },
  addressText: {
    flex: 1,
    fontSize: 12,
    color: ALCANCE_THEME.colors.textSecondary,
    lineHeight: 16,
  },
  tiposActivoContainer: {
    marginBottom: ALCANCE_THEME.spacing.sm,
  },
  tiposActivoLabel: {
    fontSize: 11,
    color: ALCANCE_THEME.colors.textSecondary,
    marginBottom: 4,
    fontWeight: ALCANCE_THEME.typography.fontWeightMedium,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  observacionesContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: ALCANCE_THEME.borderRadius.sm,
    padding: ALCANCE_THEME.spacing.sm,
    marginBottom: ALCANCE_THEME.spacing.sm,
  },
  observaciones: {
    fontSize: 12,
    color: ALCANCE_THEME.colors.textSecondary,
    lineHeight: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ALCANCE_THEME.spacing.sm,
    gap: 6,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: ALCANCE_THEME.colors.textSecondary,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: ALCANCE_THEME.spacing.sm,
  },
  statusBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: ALCANCE_THEME.borderRadius.lg,
    borderTopRightRadius: ALCANCE_THEME.borderRadius.lg,
    paddingBottom: ALCANCE_THEME.spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: ALCANCE_THEME.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: ALCANCE_THEME.typography.fontWeightBold,
    color: ALCANCE_THEME.colors.text,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: ALCANCE_THEME.spacing.md,
    paddingHorizontal: ALCANCE_THEME.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  modalOptionText: {
    fontSize: 16,
    color: ALCANCE_THEME.colors.text,
  },
  modalOptionTextSelected: {
    fontWeight: ALCANCE_THEME.typography.fontWeightBold,
    color: ALCANCE_THEME.colors.primary,
  },
});

export default ExclusionesScreen;
