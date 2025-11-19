// Función para validar email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Función para validar teléfono
export const validatePhone = (phone) => {
  const re = /^[0-9]{9,15}$/;
  return re.test(String(phone).replace(/\s/g, ''));
};

// Función para calcular nivel de riesgo (Impacto x Probabilidad)
export const calculateRiskLevel = (impact, probability) => {
  const riskValue = impact * probability;
  if (riskValue >= 15) return { level: 'Crítico', color: '#DC2626' };
  if (riskValue >= 10) return { level: 'Alto', color: '#EF4444' };
  if (riskValue >= 6) return { level: 'Medio', color: '#F59E0B' };
  if (riskValue >= 3) return { level: 'Bajo', color: '#10B981' };
  return { level: 'Muy Bajo', color: '#22C55E' };
};

// Función para formatear fechas
export const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

// Función para formatear fecha con hora
export const formatDateTime = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Función para generar ID único
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Función para calcular porcentaje de cumplimiento
export const calculateCompliancePercentage = (implemented, total) => {
  if (total === 0) return 0;
  return Math.round((implemented / total) * 100);
};

// Función para truncar texto
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Función para búsqueda en array de objetos
export const searchInArray = (array, searchTerm, fields) => {
  if (!searchTerm) return array;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  return array.filter(item => {
    return fields.some(field => {
      const value = item[field];
      return value && value.toString().toLowerCase().includes(lowerSearchTerm);
    });
  });
};

// Función para ordenar array por campo
export const sortByField = (array, field, ascending = true) => {
  return [...array].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];
    
    if (aValue < bValue) return ascending ? -1 : 1;
    if (aValue > bValue) return ascending ? 1 : -1;
    return 0;
  });
};

// Función para obtener color según estado
export const getStateColor = (state) => {
  const stateColors = {
    // Estados de políticas
    'Borrador': '#6B7280',
    'En revisión': '#3B82F6',
    'Aprobado': '#10B981',
    'Vigente': '#059669',
    'Obsoleto': '#EF4444',
    
    // Estados de riesgos
    'Identificado': '#F59E0B',
    'En análisis': '#3B82F6',
    'En tratamiento': '#8B5CF6',
    'Mitigado': '#10B981',
    'Aceptado': '#6B7280',
    
    // Estados de controles
    'No implementado': '#EF4444',
    'En proceso': '#F59E0B',
    'Implementado': '#10B981',
    'En revisión': '#3B82F6',
    'Certificado': '#059669',
  };
  
  return stateColors[state] || '#6B7280';
};
