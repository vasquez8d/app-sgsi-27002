// Colores del tema
export const COLORS = {
  primary: '#1E3A8A',      // Azul corporativo oscuro
  primaryLight: '#3B82F6', // Azul corporativo claro
  secondary: '#10B981',    // Verde para success
  danger: '#EF4444',       // Rojo para danger
  warning: '#F59E0B',      // Amarillo para warning
  info: '#3B82F6',         // Azul para info
  background: '#F3F4F6',   // Gris claro para fondo
  white: '#FFFFFF',
  black: '#000000',
  text: '#1F2937',         // Gris oscuro para texto
  textLight: '#6B7280',    // Gris medio para texto secundario
  border: '#E5E7EB',       // Gris claro para bordes
  success: '#10B981',
  error: '#EF4444',
};

// Niveles de criticidad
export const CRITICALITY_LEVELS = {
  HIGH: 'Alto',
  MEDIUM: 'Medio',
  LOW: 'Bajo',
};

export const CRITICALITY_COLORS = {
  Alto: '#EF4444',
  Medio: '#F59E0B',
  Bajo: '#10B981',
};

// Categorías de activos
export const ASSET_CATEGORIES = [
  'Hardware',
  'Software',
  'Información',
  'Servicios',
  'Personal',
  'Infraestructura',
];

// Estados de políticas
export const POLICY_STATES = [
  'Borrador',
  'En revisión',
  'Aprobado',
  'Vigente',
  'Obsoleto',
];

// Estados de riesgos
export const RISK_STATES = [
  'Identificado',
  'En análisis',
  'En tratamiento',
  'Mitigado',
  'Aceptado',
];

// Estados de implementación de controles
export const CONTROL_STATES = [
  'No implementado',
  'En proceso',
  'Implementado',
  'En revisión',
  'Certificado',
];

// Niveles de impacto y probabilidad (1-5)
export const RISK_LEVELS = [1, 2, 3, 4, 5];

// Dominios ISO 27002:2013
export const ISO_27002_DOMAINS = [
  { id: '5', name: 'Políticas de Seguridad de la Información', controls: 2 },
  { id: '6', name: 'Organización de la Seguridad de la Información', controls: 7 },
  { id: '7', name: 'Seguridad de los Recursos Humanos', controls: 6 },
  { id: '8', name: 'Gestión de Activos', controls: 10 },
  { id: '9', name: 'Control de Acceso', controls: 14 },
  { id: '10', name: 'Criptografía', controls: 2 },
  { id: '11', name: 'Seguridad Física y del Entorno', controls: 15 },
  { id: '12', name: 'Seguridad de las Operaciones', controls: 14 },
  { id: '13', name: 'Seguridad de las Comunicaciones', controls: 7 },
  { id: '14', name: 'Adquisición, Desarrollo y Mantenimiento de Sistemas', controls: 13 },
  { id: '15', name: 'Relaciones con los Proveedores', controls: 5 },
  { id: '16', name: 'Gestión de Incidentes de Seguridad', controls: 7 },
  { id: '17', name: 'Aspectos de Seguridad en la Gestión de Continuidad', controls: 4 },
  { id: '18', name: 'Cumplimiento', controls: 8 },
];

// Roles SGSI
export const SGSI_ROLES = [
  'CISO (Chief Information Security Officer)',
  'Responsable de Seguridad',
  'Auditor Interno',
  'Analista de Riesgos',
  'Administrador de Controles',
  'Gestor de Activos',
  'Responsable de Políticas',
  'Miembro del Comité',
  'Consultor Externo',
];

// Tamaños y espaciados
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
};
