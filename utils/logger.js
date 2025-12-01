/**
 * Sistema de Logging Detallado para SGSI ISO 27002:2013
 * 
 * Niveles de log:
 * - DEBUG: Información detallada para debugging
 * - INFO: Información general del flujo de la aplicación
 * - WARN: Advertencias que no detienen la ejecución
 * - ERROR: Errores que requieren atención
 * - FATAL: Errores críticos que detienen la aplicación
 * 
 * Features:
 * - Timestamps automáticos
 * - Categorización por módulo
 * - Stack traces para errores
 * - Colores en consola
 * - Métricas de rendimiento
 * - Filtrado por nivel
 */

// ═══════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4,
};

const LOG_COLORS = {
  DEBUG: '\x1b[36m', // Cyan
  INFO: '\x1b[32m',  // Green
  WARN: '\x1b[33m',  // Yellow
  ERROR: '\x1b[31m', // Red
  FATAL: '\x1b[35m', // Magenta
  RESET: '\x1b[0m',
};

const LOG_ICONS = {
  DEBUG: '🔍',
  INFO: '✅',
  WARN: '⚠️',
  ERROR: '❌',
  FATAL: '💀',
  DATABASE: '🗄️',
  NETWORK: '🌐',
  AUTH: '🔐',
  PERFORMANCE: '⚡',
  SECURITY: '🛡️',
};

// Nivel mínimo de log (solo se mostrarán logs >= este nivel)
let CURRENT_LOG_LEVEL = __DEV__ ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO;

// Habilitar/deshabilitar logs
let LOGGING_ENABLED = true;

// Almacenar logs en memoria (últimos N logs)
const LOG_HISTORY = [];
const MAX_LOG_HISTORY = 100;

// Métricas de rendimiento
const PERFORMANCE_MARKS = new Map();

// ═══════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════

export const setLogLevel = (level) => {
  if (typeof level === 'string') {
    CURRENT_LOG_LEVEL = LOG_LEVELS[level.toUpperCase()] || LOG_LEVELS.INFO;
  } else {
    CURRENT_LOG_LEVEL = level;
  }
};

export const enableLogging = () => {
  LOGGING_ENABLED = true;
};

export const disableLogging = () => {
  LOGGING_ENABLED = false;
};

export const getLogHistory = () => {
  return [...LOG_HISTORY];
};

export const clearLogHistory = () => {
  LOG_HISTORY.length = 0;
};

// ═══════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════

const formatTimestamp = () => {
  const now = new Date();
  return now.toISOString().replace('T', ' ').substring(0, 23);
};

const formatModule = (module) => {
  return module ? `[${module}]` : '';
};

const saveToHistory = (level, module, message, data) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    module,
    message,
    data,
  };
  
  LOG_HISTORY.push(logEntry);
  
  // Mantener solo los últimos MAX_LOG_HISTORY logs
  if (LOG_HISTORY.length > MAX_LOG_HISTORY) {
    LOG_HISTORY.shift();
  }
};

const shouldLog = (level) => {
  return LOGGING_ENABLED && LOG_LEVELS[level] >= CURRENT_LOG_LEVEL;
};

const formatMessage = (level, module, message, data) => {
  const timestamp = formatTimestamp();
  const color = LOG_COLORS[level];
  const icon = LOG_ICONS[level];
  const moduleStr = formatModule(module);
  const reset = LOG_COLORS.RESET;
  
  let output = `${color}${icon} [${level}] ${timestamp} ${moduleStr}${reset} ${message}`;
  
  if (data !== undefined) {
    if (typeof data === 'object') {
      output += `\n${color}📦 Data:${reset} ${JSON.stringify(data, null, 2)}`;
    } else {
      output += `\n${color}📦 Data:${reset} ${data}`;
    }
  }
  
  return output;
};

// ═══════════════════════════════════════════════════════════════
// FUNCIONES DE LOGGING PRINCIPALES
// ═══════════════════════════════════════════════════════════════

export const debug = (module, message, data) => {
  if (!shouldLog('DEBUG')) return;
  
  const output = formatMessage('DEBUG', module, message, data);
  console.log(output);
  saveToHistory('DEBUG', module, message, data);
};

export const info = (module, message, data) => {
  if (!shouldLog('INFO')) return;
  
  const output = formatMessage('INFO', module, message, data);
  console.log(output);
  saveToHistory('INFO', module, message, data);
};

export const warn = (module, message, data) => {
  if (!shouldLog('WARN')) return;
  
  const output = formatMessage('WARN', module, message, data);
  console.warn(output);
  saveToHistory('WARN', module, message, data);
};

export const error = (module, message, errorObj) => {
  if (!shouldLog('ERROR')) return;
  
  const timestamp = formatTimestamp();
  const color = LOG_COLORS.ERROR;
  const icon = LOG_ICONS.ERROR;
  const moduleStr = formatModule(module);
  const reset = LOG_COLORS.RESET;
  
  let output = `${color}${icon} [ERROR] ${timestamp} ${moduleStr}${reset} ${message}`;
  
  if (errorObj) {
    if (errorObj instanceof Error) {
      output += `\n${color}💥 Error:${reset} ${errorObj.message}`;
      if (errorObj.stack) {
        output += `\n${color}📚 Stack Trace:${reset}\n${errorObj.stack}`;
      }
    } else {
      output += `\n${color}📦 Error Data:${reset} ${JSON.stringify(errorObj, null, 2)}`;
    }
  }
  
  console.error(output);
  saveToHistory('ERROR', module, message, errorObj);
};

export const fatal = (module, message, errorObj) => {
  if (!shouldLog('FATAL')) return;
  
  const timestamp = formatTimestamp();
  const color = LOG_COLORS.FATAL;
  const icon = LOG_ICONS.FATAL;
  const moduleStr = formatModule(module);
  const reset = LOG_COLORS.RESET;
  
  let output = `${color}${icon} [FATAL] ${timestamp} ${moduleStr}${reset} ${message}`;
  
  if (errorObj) {
    if (errorObj instanceof Error) {
      output += `\n${color}💥 Error:${reset} ${errorObj.message}`;
      if (errorObj.stack) {
        output += `\n${color}📚 Stack Trace:${reset}\n${errorObj.stack}`;
      }
    } else {
      output += `\n${color}📦 Error Data:${reset} ${JSON.stringify(errorObj, null, 2)}`;
    }
  }
  
  console.error(output);
  saveToHistory('FATAL', module, message, errorObj);
};

// ═══════════════════════════════════════════════════════════════
// LOGGING ESPECIALIZADO
// ═══════════════════════════════════════════════════════════════

export const database = (module, operation, message, data) => {
  if (!shouldLog('DEBUG')) return;
  
  const timestamp = formatTimestamp();
  const icon = LOG_ICONS.DATABASE;
  const moduleStr = formatModule(module);
  
  const output = `${LOG_COLORS.DEBUG}${icon} [DB-${operation.toUpperCase()}] ${timestamp} ${moduleStr}${LOG_COLORS.RESET} ${message}`;
  console.log(output);
  
  if (data) {
    console.log(`${LOG_COLORS.DEBUG}📊 Query/Data:${LOG_COLORS.RESET}`, data);
  }
  
  saveToHistory('DEBUG', module, `[DB-${operation}] ${message}`, data);
};

export const network = (module, method, url, status, data) => {
  if (!shouldLog('DEBUG')) return;
  
  const timestamp = formatTimestamp();
  const icon = LOG_ICONS.NETWORK;
  const moduleStr = formatModule(module);
  const statusIcon = status >= 200 && status < 300 ? '✓' : '✗';
  
  const output = `${LOG_COLORS.DEBUG}${icon} [NETWORK] ${timestamp} ${moduleStr}${LOG_COLORS.RESET} ${method} ${url} ${statusIcon} ${status}`;
  console.log(output);
  
  if (data) {
    console.log(`${LOG_COLORS.DEBUG}📦 Response:${LOG_COLORS.RESET}`, data);
  }
  
  saveToHistory('DEBUG', module, `[NETWORK] ${method} ${url} - ${status}`, data);
};

export const auth = (module, action, user, success = true) => {
  const level = success ? 'INFO' : 'WARN';
  if (!shouldLog(level)) return;
  
  const timestamp = formatTimestamp();
  const icon = LOG_ICONS.AUTH;
  const moduleStr = formatModule(module);
  const color = success ? LOG_COLORS.INFO : LOG_COLORS.WARN;
  const statusIcon = success ? '✓' : '✗';
  
  const output = `${color}${icon} [AUTH] ${timestamp} ${moduleStr}${LOG_COLORS.RESET} ${action} ${statusIcon} User: ${user}`;
  console.log(output);
  
  saveToHistory(level, module, `[AUTH] ${action} - User: ${user}`, { success });
};

export const security = (module, event, details) => {
  if (!shouldLog('WARN')) return;
  
  const timestamp = formatTimestamp();
  const icon = LOG_ICONS.SECURITY;
  const moduleStr = formatModule(module);
  
  const output = `${LOG_COLORS.WARN}${icon} [SECURITY] ${timestamp} ${moduleStr}${LOG_COLORS.RESET} ${event}`;
  console.warn(output);
  
  if (details) {
    console.warn(`${LOG_COLORS.WARN}🔍 Details:${LOG_COLORS.RESET}`, details);
  }
  
  saveToHistory('WARN', module, `[SECURITY] ${event}`, details);
};

// ═══════════════════════════════════════════════════════════════
// MÉTRICAS DE RENDIMIENTO
// ═══════════════════════════════════════════════════════════════

export const performanceStart = (label) => {
  PERFORMANCE_MARKS.set(label, Date.now());
  debug('Performance', `⏱️ Started: ${label}`);
};

export const performanceEnd = (label) => {
  const startTime = PERFORMANCE_MARKS.get(label);
  if (!startTime) {
    warn('Performance', `No start mark found for: ${label}`);
    return null;
  }
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  PERFORMANCE_MARKS.delete(label);
  
  const icon = LOG_ICONS.PERFORMANCE;
  const timestamp = formatTimestamp();
  
  // Colorear según duración
  let color = LOG_COLORS.INFO;
  if (duration > 1000) color = LOG_COLORS.ERROR;
  else if (duration > 500) color = LOG_COLORS.WARN;
  
  const output = `${color}${icon} [PERFORMANCE] ${timestamp}${LOG_COLORS.RESET} ${label}: ${duration}ms`;
  console.log(output);
  
  saveToHistory('INFO', 'Performance', `${label}: ${duration}ms`, { duration });
  
  return duration;
};

export const performanceMeasure = (label, callback) => {
  performanceStart(label);
  try {
    const result = callback();
    performanceEnd(label);
    return result;
  } catch (error) {
    performanceEnd(label);
    throw error;
  }
};

export const performanceMeasureAsync = async (label, callback) => {
  performanceStart(label);
  try {
    const result = await callback();
    performanceEnd(label);
    return result;
  } catch (error) {
    performanceEnd(label);
    throw error;
  }
};

// ═══════════════════════════════════════════════════════════════
// LOGGING DE OPERACIONES CRUD
// ═══════════════════════════════════════════════════════════════

export const crudCreate = (module, entity, id, data) => {
  info(module, `➕ Created ${entity} with ID: ${id}`, data);
};

export const crudRead = (module, entity, id) => {
  debug(module, `📖 Read ${entity} with ID: ${id}`);
};

export const crudUpdate = (module, entity, id, changes) => {
  info(module, `✏️ Updated ${entity} with ID: ${id}`, changes);
};

export const crudDelete = (module, entity, id) => {
  info(module, `🗑️ Deleted ${entity} with ID: ${id}`);
};

export const crudList = (module, entity, count, filters) => {
  debug(module, `📋 Listed ${count} ${entity}(s)`, filters);
};

// ═══════════════════════════════════════════════════════════════
// LOGGING DE VALIDACIONES
// ═══════════════════════════════════════════════════════════════

export const validationSuccess = (module, entity, data) => {
  debug(module, `✓ Validation passed for ${entity}`, data);
};

export const validationError = (module, entity, errors) => {
  warn(module, `✗ Validation failed for ${entity}`, errors);
};

// ═══════════════════════════════════════════════════════════════
// LOGGING DE ESTADO DE LA APLICACIÓN
// ═══════════════════════════════════════════════════════════════

export const appStart = () => {
  const banner = `
╔════════════════════════════════════════════════════════════╗
║           SGSI ISO/IEC 27002:2013 - v2.4.0                ║
║     Sistema de Gestión de Seguridad de la Información     ║
╚════════════════════════════════════════════════════════════╝
  `;
  console.log(LOG_COLORS.INFO + banner + LOG_COLORS.RESET);
  info('App', '🚀 Application started');
};

export const appError = (module, message, error) => {
  fatal(module, `💥 Application error: ${message}`, error);
};

export const componentMount = (componentName) => {
  debug('React', `🔧 Component mounted: ${componentName}`);
};

export const componentUnmount = (componentName) => {
  debug('React', `🔌 Component unmounted: ${componentName}`);
};

export const navigationChange = (from, to) => {
  info('Navigation', `🧭 Navigated from "${from}" to "${to}"`);
};

// ═══════════════════════════════════════════════════════════════
// EXPORTAR TODO COMO DEFAULT TAMBIÉN
// ═══════════════════════════════════════════════════════════════

export default {
  // Configuración
  setLogLevel,
  enableLogging,
  disableLogging,
  getLogHistory,
  clearLogHistory,
  
  // Niveles básicos
  debug,
  info,
  warn,
  error,
  fatal,
  
  // Logging especializado
  database,
  network,
  auth,
  security,
  
  // Performance
  performanceStart,
  performanceEnd,
  performanceMeasure,
  performanceMeasureAsync,
  
  // CRUD
  crudCreate,
  crudRead,
  crudUpdate,
  crudDelete,
  crudList,
  
  // Validaciones
  validationSuccess,
  validationError,
  
  // App lifecycle
  appStart,
  appError,
  componentMount,
  componentUnmount,
  navigationChange,
};
