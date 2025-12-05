// Tema y constantes para el módulo de Alcance
export const ALCANCE_THEME = {
  colors: {
    primary: '#1E3A8A',
    primaryLight: '#3B82F6',
    primaryDark: '#1E293B',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
    criticalHigh: '#DC2626',
    criticalMed: '#F59E0B',
    criticalLow: '#6B7280',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    border: '#E5E7EB',
    text: '#1F2937',
    textSecondary: '#6B7280',
    disabled: '#D1D5DB',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999,
  },
  typography: {
    h1: { fontSize: 24, fontWeight: 'bold' },
    h2: { fontSize: 20, fontWeight: 'bold' },
    h3: { fontSize: 18, fontWeight: '600' },
    body: { fontSize: 16, fontWeight: 'normal' },
    caption: { fontSize: 12, fontWeight: 'normal' },
  },
};

export const ALCANCE_ICONS = {
  procesos: 'git-network-outline',
  unidades: 'business-outline',
  ubicaciones: 'location-outline',
  infraestructura: 'server-outline',
  exclusiones: 'close-circle-outline',
  validacion: 'checkmark-done-circle-outline',
  agregar: 'add-circle',
  editar: 'create-outline',
  eliminar: 'trash-outline',
  guardar: 'checkmark-circle',
  aprobar: 'shield-checkmark',
  revision: 'time-outline',
  ayuda: 'help-circle-outline',
  filtro: 'filter-outline',
  buscar: 'search-outline',
  dashboard: 'grid-outline',
  info: 'information-circle-outline',
};

export const MACROPROCESOS = {
  CAPTACIONES: 'Captaciones',
  COLOCACIONES: 'Colocaciones',
  GESTION_CANALES: 'Gestión de Canales',
  OPERACIONES: 'Operaciones',
  TECNOLOGIA: 'Tecnología',
  SOPORTE: 'Soporte',
};

export const CRITICIDAD_LEVELS = {
  CRITICA: 'Crítica',
  ALTA: 'Alta',
  MEDIA: 'Media',
  BAJA: 'Baja',
};

export const ESTADO_PROCESO = {
  INCLUIDO: 'Incluido',
  EXCLUIDO: 'Excluido',
  EN_EVALUACION: 'En Evaluación',
};

export const TIPO_UNIDAD = {
  DIRECCION: 'Dirección',
  GERENCIA: 'Gerencia',
  DEPARTAMENTO: 'Departamento',
  AREA: 'Área',
  SECCION: 'Sección',
};

export const TIPO_UBICACION = {
  SEDE_PRINCIPAL: 'Oficina Principal',
  AGENCIA: 'Sucursal',
  OFICINA_REMOTA: 'Remoto',
  DATA_CENTER: 'Data Center',
  CLIENTE: 'Cliente',
};

export const TIPO_ACTIVO_UBICACION = {
  PERSONAS: 'Personas',
  APLICACIONES: 'Aplicaciones',
  INFORMACION: 'Información',
  HARDWARE: 'Hardware',
  INFRAESTRUCTURA: 'Infraestructura',
  SERVICIOS_TERCERIZADOS: 'Servicios tercerizados',
};

export const ESTADO_ALCANCE = {
  BORRADOR: 'Borrador',
  EN_REVISION: 'En Revisión',
  APROBADO: 'Aprobado',
  VIGENTE: 'Vigente',
};

export const ROL_SGSI = {
  LIDER: 'Líder',
  COPARTICIPE: 'Coparticipe',
  APOYO: 'Apoyo',
};

export const ESTADO_ACTIVO = {
  ACTIVO: 'Activo',
  INACTIVO: 'Inactivo',
  MANTENIMIENTO: 'Mantenimiento',
  RETIRADO: 'Retirado',
};

export const TIPO_ACTIVO_INFRA = {
  PERSONAS: 'Personas',
  APLICACIONES: 'Aplicaciones',
  INFORMACION: 'Información',
  HARDWARE: 'Hardware',
  INFRAESTRUCTURA: 'Infraestructura',
  SERVICIOS_TERCERIZADOS: 'Servicios tercerizados',
};

export const CATEGORIA_EXCLUSION = {
  PROCESO: 'Proceso',
  UNIDAD: 'Unidad Organizativa',
  UBICACION: 'Ubicación',
  ACTIVO: 'Activo TI',
  CONTROL: 'Control',
  OTRO: 'Otro',
};
