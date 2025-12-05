import { Dimensions, Platform } from 'react-native';

/**
 * Sistema de diseño responsivo para toda la aplicación
 * Proporciona dimensiones y escalas basadas en el tamaño de pantalla
 */

// Obtener dimensiones de pantalla
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Dimensiones base para diseño (iPhone 11 Pro Max como referencia)
const BASE_WIDTH = 414;
const BASE_HEIGHT = 896;

/**
 * Escala horizontal basada en el ancho de la pantalla
 * @param {number} size - Tamaño en pixels del diseño base
 * @returns {number} - Tamaño escalado
 */
export const scaleWidth = (size) => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * Escala vertical basada en la altura de la pantalla
 * @param {number} size - Tamaño en pixels del diseño base
 * @returns {number} - Tamaño escalado
 */
export const scaleHeight = (size) => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

/**
 * Escala moderada - usa la menor de las dos escalas para mantener proporciones
 * Ideal para fuentes y elementos que no deben escalar demasiado
 * @param {number} size - Tamaño en pixels del diseño base
 * @param {number} factor - Factor de escala (0-1), por defecto 0.5
 * @returns {number} - Tamaño escalado moderado
 */
export const scaleModerate = (size, factor = 0.5) => {
  const scale = Math.min(SCREEN_WIDTH / BASE_WIDTH, SCREEN_HEIGHT / BASE_HEIGHT);
  return size + (scale - 1) * size * factor;
};

/**
 * Obtener ancho de pantalla
 * @returns {number}
 */
export const getScreenWidth = () => SCREEN_WIDTH;

/**
 * Obtener altura de pantalla
 * @returns {number}
 */
export const getScreenHeight = () => SCREEN_HEIGHT;

/**
 * Verificar si es una pantalla pequeña (< 375px de ancho)
 * @returns {boolean}
 */
export const isSmallScreen = () => SCREEN_WIDTH < 375;

/**
 * Verificar si es una pantalla mediana (375-414px de ancho)
 * @returns {boolean}
 */
export const isMediumScreen = () => SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;

/**
 * Verificar si es una pantalla grande (>= 414px de ancho)
 * @returns {boolean}
 */
export const isLargeScreen = () => SCREEN_WIDTH >= 414;

/**
 * Verificar si es una tablet (>= 768px de ancho)
 * @returns {boolean}
 */
export const isTablet = () => SCREEN_WIDTH >= 768;

/**
 * Obtener tamaño de fuente escalado
 * @param {number} size - Tamaño base de fuente
 * @returns {number}
 */
export const scaleFontSize = (size) => {
  return scaleModerate(size, 0.3);
};

/**
 * Calcular ancho de card para métricas
 * Ajusta el ancho según el número de items y el ancho de pantalla
 * @param {number} itemCount - Número de items a mostrar
 * @param {number} minWidth - Ancho mínimo del card
 * @param {number} spacing - Espaciado entre cards
 * @returns {number}
 */
export const calculateMetricCardWidth = (itemCount, minWidth = 70, spacing = 6) => {
  const availableWidth = SCREEN_WIDTH - 32; // Padding horizontal total (16px cada lado)
  const totalSpacing = spacing * (itemCount - 1);
  const calculatedWidth = (availableWidth - totalSpacing) / itemCount;
  
  // Si el ancho calculado es menor que el mínimo, usar scroll horizontal
  return Math.max(calculatedWidth, minWidth);
};

/**
 * Calcular número máximo de cards que caben en pantalla
 * @param {number} cardWidth - Ancho del card
 * @param {number} spacing - Espaciado entre cards
 * @returns {number}
 */
export const getMaxCardsPerRow = (cardWidth, spacing = 6) => {
  const availableWidth = SCREEN_WIDTH - 32;
  return Math.floor((availableWidth + spacing) / (cardWidth + spacing));
};

/**
 * Obtener padding horizontal responsivo
 * @returns {number}
 */
export const getResponsivePadding = () => {
  if (isSmallScreen()) return 12;
  if (isMediumScreen()) return 16;
  if (isTablet()) return 24;
  return 16;
};

/**
 * Configuración de dimensiones responsivas para componentes
 */
export const responsiveConfig = {
  // MetricCard
  metricCard: {
    minWidth: isSmallScreen() ? 62 : isMediumScreen() ? 68 : 75,
    iconSize: isSmallScreen() ? 14 : 16,
    fontSize: scaleFontSize(14),
    labelSize: scaleFontSize(11),
    padding: isSmallScreen() ? 6 : 8,
    borderRadius: 8,
  },
  
  // FilterChip
  filterChip: {
    height: isSmallScreen() ? 32 : 36,
    paddingHorizontal: isSmallScreen() ? 10 : 12,
    fontSize: scaleFontSize(13),
    iconSize: isSmallScreen() ? 16 : 18,
  },
  
  // Card
  card: {
    padding: isSmallScreen() ? 10 : 12,
    borderRadius: isSmallScreen() ? 8 : 12,
    iconSize: isSmallScreen() ? 18 : 20,
  },
  
  // FAB
  fab: {
    size: isSmallScreen() ? 52 : 56,
    iconSize: isSmallScreen() ? 24 : 28,
  },
  
  // Spacing
  spacing: {
    xs: isSmallScreen() ? 4 : 6,
    sm: isSmallScreen() ? 6 : 8,
    md: isSmallScreen() ? 12 : 16,
    lg: isSmallScreen() ? 16 : 20,
    xl: isSmallScreen() ? 24 : 32,
  },
};

/**
 * Listener para cambios de orientación o tamaño de pantalla
 * @param {function} callback - Función a ejecutar cuando cambia el tamaño
 * @returns {function} - Función para remover el listener
 */
export const addDimensionsListener = (callback) => {
  const subscription = Dimensions.addEventListener('change', callback);
  return () => subscription?.remove();
};

export default {
  scaleWidth,
  scaleHeight,
  scaleModerate,
  scaleFontSize,
  getScreenWidth,
  getScreenHeight,
  isSmallScreen,
  isMediumScreen,
  isLargeScreen,
  isTablet,
  calculateMetricCardWidth,
  getMaxCardsPerRow,
  getResponsivePadding,
  responsiveConfig,
  addDimensionsListener,
};
