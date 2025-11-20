# Guía del Sistema de Logging - SGSI ISO 27002:2013

## 📋 Tabla de Contenidos
1. [Introducción](#introducción)
2. [Niveles de Log](#niveles-de-log)
3. [Uso Básico](#uso-básico)
4. [Logging Especializado](#logging-especializado)
5. [Métricas de Rendimiento](#métricas-de-rendimiento)
6. [Configuración](#configuración)
7. [Ejemplos Prácticos](#ejemplos-prácticos)
8. [Mejores Prácticas](#mejores-prácticas)

---

## 🎯 Introducción

El sistema de logging centralizado proporciona:
- ✅ Trazabilidad completa de operaciones
- ✅ Debugging mejorado con contexto
- ✅ Auditoría de seguridad ISO 27002
- ✅ Métricas de rendimiento automáticas
- ✅ Logs coloreados y estructurados

**Archivo:** `utils/logger.js`

---

## 📊 Niveles de Log

### 1. DEBUG 🔍 (Nivel 0)
**Cuándo usar:** Información detallada para debugging
```javascript
logger.debug('ModuleName', 'Mensaje descriptivo', { datos: 'opcionales' });
```

**Ejemplos:**
- Variables de estado
- Parámetros de funciones
- Flujo detallado del código

### 2. INFO ✅ (Nivel 1)
**Cuándo usar:** Información general del flujo
```javascript
logger.info('ModuleName', 'Operación completada exitosamente', { resultado: data });
```

**Ejemplos:**
- Inicio/fin de operaciones
- Datos cargados correctamente
- Navegación entre pantallas

### 3. WARN ⚠️ (Nivel 2)
**Cuándo usar:** Advertencias que no detienen la ejecución
```javascript
logger.warn('ModuleName', 'Advertencia de operación', { detalles: info });
```

**Ejemplos:**
- Datos faltantes (no críticos)
- Validaciones fallidas
- Credenciales incorrectas

### 4. ERROR ❌ (Nivel 3)
**Cuándo usar:** Errores recuperables
```javascript
logger.error('ModuleName', 'Error en operación', errorObject);
```

**Ejemplos:**
- Errores de base de datos
- Fallos de red
- Excepciones capturadas

### 5. FATAL 💀 (Nivel 4)
**Cuándo usar:** Errores críticos que detienen la app
```javascript
logger.fatal('ModuleName', 'Error crítico', errorObject);
```

**Ejemplos:**
- Error de inicialización de DB
- Fallo crítico de sistema
- Corrupción de datos

---

## 🚀 Uso Básico

### Import
```javascript
import logger from './utils/logger';
```

### Logging Simple
```javascript
// Debug
logger.debug('MyService', 'Iniciando proceso de validación');

// Info
logger.info('MyService', 'Usuario autenticado correctamente');

// Warn
logger.warn('MyService', 'Campo opcional sin valor');

// Error
logger.error('MyService', 'No se pudo conectar a la base de datos', error);

// Fatal
logger.fatal('App', 'Fallo crítico en inicialización', error);
```

### Logging con Datos
```javascript
logger.info('UserService', 'Usuario creado', {
  userId: '123',
  username: 'admin',
  timestamp: new Date().toISOString()
});
```

---

## 🎨 Logging Especializado

### Database Operations 🗄️
```javascript
logger.database('AlcanceService', 'CREATE', 'Tabla procesos creada');
logger.database('AlcanceService', 'INSERT', 'Proceso agregado', {
  id: '123',
  nombre: 'Proceso de ejemplo'
});
logger.database('AlcanceService', 'QUERY', 'Obteniendo todos los procesos', {
  query: 'SELECT * FROM alcance_procesos'
});
```

**Operaciones soportadas:** CREATE, INSERT, UPDATE, DELETE, QUERY, INIT

### Network Requests 🌐
```javascript
logger.network('ApiService', 'GET', '/api/users', 200, { users: [...] });
logger.network('ApiService', 'POST', '/api/login', 401, { error: 'Unauthorized' });
```

### Authentication 🔐
```javascript
logger.auth('AuthService', 'LOGIN', 'admin', true);  // Login exitoso
logger.auth('AuthService', 'LOGIN', 'hacker', false); // Login fallido
logger.auth('AuthService', 'LOGOUT', 'admin', true);
```

### Security Events 🛡️
```javascript
logger.security('AuthService', 'Intento de acceso no autorizado', {
  username: 'unknown',
  ip: '192.168.1.100',
  timestamp: new Date()
});

logger.security('ValidationService', 'SQL Injection detectado', {
  input: "' OR 1=1 --",
  field: 'username'
});
```

---

## ⚡ Métricas de Rendimiento

### Medir Operaciones Síncronas
```javascript
logger.performanceStart('loadProcesos');
// ... código ...
const data = getProcesos();
logger.performanceEnd('loadProcesos'); // Imprime: ⚡ [PERFORMANCE] loadProcesos: 145ms
```

### Medir con Callback (Síncrono)
```javascript
const result = logger.performanceMeasure('calculateTotal', () => {
  // Operación costosa
  return expensiveCalculation();
});
// Automáticamente mide y loguea el tiempo
```

### Medir con Callback (Asíncrono)
```javascript
const result = await logger.performanceMeasureAsync('fetchData', async () => {
  const response = await fetch('https://api.example.com/data');
  return await response.json();
});
```

---

## 🔧 Configuración

### Cambiar Nivel de Log
```javascript
// Solo mostrar logs >= INFO (ocultar DEBUG)
logger.setLogLevel('INFO');

// Mostrar todos los logs
logger.setLogLevel('DEBUG');

// Solo errores críticos
logger.setLogLevel('ERROR');
```

### Habilitar/Deshabilitar Logging
```javascript
logger.disableLogging(); // Desactivar todos los logs
logger.enableLogging();  // Reactivar logs
```

### Obtener Historial
```javascript
const history = logger.getLogHistory();
console.log(history); // Últimos 100 logs
```

### Limpiar Historial
```javascript
logger.clearLogHistory();
```

---

## 📝 Logging de CRUD Operations

### Create
```javascript
logger.crudCreate('AlcanceService', 'Proceso', '123', {
  nombre: 'Proceso de ejemplo',
  criticidad: 'Alta'
});
// Output: ✅ [INFO] Created Proceso with ID: 123
```

### Read
```javascript
logger.crudRead('AlcanceService', 'Proceso', '123');
// Output: 🔍 [DEBUG] Read Proceso with ID: 123
```

### Update
```javascript
logger.crudUpdate('AlcanceService', 'Proceso', '123', {
  criticidad: 'Crítica'
});
// Output: ✅ [INFO] Updated Proceso with ID: 123
```

### Delete
```javascript
logger.crudDelete('AlcanceService', 'Proceso', '123');
// Output: ✅ [INFO] Deleted Proceso with ID: 123
```

### List
```javascript
logger.crudList('AlcanceService', 'Procesos', 25, { estado: 'Incluido' });
// Output: 🔍 [DEBUG] Listed 25 Procesos(s)
```

---

## 🎯 Logging de Validaciones

### Validación Exitosa
```javascript
logger.validationSuccess('ValidationService', 'ProcesoForm', {
  nombreProceso: 'Validado',
  criticidad: 'Alta'
});
```

### Validación Fallida
```javascript
logger.validationError('ValidationService', 'ProcesoForm', {
  nombreProceso: 'Campo requerido',
  criticidad: 'Valor inválido'
});
```

---

## 🔄 Logging del Ciclo de Vida de la App

### Inicio de la Aplicación
```javascript
logger.appStart();
// Imprime banner:
// ╔════════════════════════════════════════════════════════════╗
// ║           SGSI ISO/IEC 27002:2013 - v2.1.2                ║
// ║     Sistema de Gestión de Seguridad de la Información     ║
// ╚════════════════════════════════════════════════════════════╝
```

### Error de Aplicación
```javascript
logger.appError('App', 'Fallo en inicialización', error);
```

### Componente React Montado
```javascript
useEffect(() => {
  logger.componentMount('ProcesosScreen');
  
  return () => {
    logger.componentUnmount('ProcesosScreen');
  };
}, []);
```

### Navegación
```javascript
logger.navigationChange('Dashboard', 'Procesos');
// Output: ✅ [INFO] 🧭 Navigated from "Dashboard" to "Procesos"
```

---

## 💡 Ejemplos Prácticos

### Ejemplo 1: Servicio con Logging Completo
```javascript
import logger from '../utils/logger';

export const addProceso = (proceso) => {
  try {
    logger.performanceStart('addProceso');
    logger.info('AlcanceCRUD', `Agregando nuevo proceso: ${proceso.nombreProceso}`);
    
    // Validación
    const validation = validateProceso(proceso);
    if (!validation.valid) {
      logger.validationError('AlcanceCRUD', 'Proceso', validation.errors);
      return { success: false, errors: validation.errors };
    }
    logger.validationSuccess('AlcanceCRUD', 'Proceso', proceso);
    
    // Insertar en DB
    const id = generateId();
    logger.database('AlcanceCRUD', 'INSERT', 'Insertando proceso en DB', { id });
    
    executeQuery(
      'INSERT INTO alcance_procesos (id, nombre_proceso, ...) VALUES (?, ?, ...)',
      [id, proceso.nombreProceso, ...]
    );
    
    logger.performanceEnd('addProceso');
    logger.crudCreate('AlcanceCRUD', 'Proceso', id, proceso);
    
    return { success: true, id };
  } catch (error) {
    logger.error('AlcanceCRUD', 'Error agregando proceso', error);
    return { success: false, error: error.message };
  }
};
```

### Ejemplo 2: Componente React con Logging
```javascript
import React, { useState, useEffect } from 'react';
import logger from '../../utils/logger';

const ProcesosScreen = ({ navigation }) => {
  const [procesos, setProcesos] = useState([]);
  
  useEffect(() => {
    logger.componentMount('ProcesosScreen');
    loadProcesos();
    
    return () => {
      logger.componentUnmount('ProcesosScreen');
    };
  }, []);
  
  const loadProcesos = async () => {
    try {
      logger.performanceStart('loadProcesos');
      logger.info('ProcesosScreen', 'Cargando lista de procesos...');
      
      const data = await getProcesos();
      setProcesos(data);
      
      logger.performanceEnd('loadProcesos');
      logger.info('ProcesosScreen', `✅ Cargados ${data.length} procesos`);
    } catch (error) {
      logger.error('ProcesosScreen', 'Error cargando procesos', error);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      logger.warn('ProcesosScreen', `Eliminando proceso: ${id}`);
      const result = await deleteProceso(id);
      
      if (result.success) {
        logger.info('ProcesosScreen', `Proceso ${id} eliminado`);
        loadProcesos();
      }
    } catch (error) {
      logger.error('ProcesosScreen', 'Error eliminando proceso', error);
    }
  };
  
  // ... resto del componente
};
```

### Ejemplo 3: Autenticación con Logging
```javascript
import logger from '../utils/logger';

export const login = async (username, password) => {
  try {
    logger.performanceStart('login');
    logger.info('AuthService', `Intento de login para: ${username}`);
    
    const user = getFirstRow(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    
    if (user) {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      logger.performanceEnd('login');
      logger.auth('AuthService', 'LOGIN', username, true);
      return { success: true, user };
    }
    
    logger.performanceEnd('login');
    logger.auth('AuthService', 'LOGIN', username, false);
    logger.warn('AuthService', `Credenciales incorrectas para: ${username}`);
    
    return { success: false, error: 'Credenciales incorrectas' };
  } catch (error) {
    logger.error('AuthService', 'Error en login', error);
    return { success: false, error: 'Error en el login' };
  }
};
```

---

## ✅ Mejores Prácticas

### 1. Nombre del Módulo Consistente
```javascript
// ✅ BIEN: Nombre claro y específico
logger.info('AlcanceCRUD', 'Proceso creado');

// ❌ MAL: Nombre genérico
logger.info('Service', 'Creado');
```

### 2. Mensajes Descriptivos
```javascript
// ✅ BIEN: Mensaje claro con contexto
logger.info('ProcesosScreen', 'Cargados 25 procesos con filtro: Incluidos');

// ❌ MAL: Mensaje vago
logger.info('ProcesosScreen', 'Cargados');
```

### 3. Logging de Errores con Objeto Error
```javascript
// ✅ BIEN: Stack trace completo
try {
  // ...
} catch (error) {
  logger.error('MyService', 'Error al guardar', error);
}

// ❌ MAL: Solo el mensaje
catch (error) {
  logger.error('MyService', error.message);
}
```

### 4. Performance en Operaciones Costosas
```javascript
// ✅ BIEN: Medir operaciones importantes
logger.performanceStart('calculateCompletitud');
const completitud = calculateCompletitud(data);
logger.performanceEnd('calculateCompletitud');

// ❌ MAL: No medir
const completitud = calculateCompletitud(data);
```

### 5. Nivel de Log Apropiado
```javascript
// ✅ BIEN: Niveles correctos
logger.debug('Service', 'Variable value:', value);        // Debug info
logger.info('Service', 'Operation completed');             // Success
logger.warn('Service', 'Optional field missing');          // Warning
logger.error('Service', 'Operation failed', error);        // Error
logger.fatal('Service', 'Critical system failure', error); // Fatal

// ❌ MAL: Todo como INFO
logger.info('Service', 'Variable value:', value);
logger.info('Service', 'Operation failed', error);
```

### 6. Datos Sensibles
```javascript
// ✅ BIEN: Ocultar contraseñas
logger.auth('AuthService', 'LOGIN', username, true);

// ❌ MAL: Loguear contraseñas
logger.info('AuthService', 'Login', { username, password });
```

### 7. Usar Logging Especializado
```javascript
// ✅ BIEN: Usar función específica
logger.auth('AuthService', 'LOGIN', username, true);
logger.database('Service', 'INSERT', 'Record created');
logger.security('Service', 'Unauthorized access attempt');

// ❌ MAL: Todo con logger.info
logger.info('AuthService', 'User logged in');
logger.info('Service', 'Record created in DB');
logger.info('Service', 'Unauthorized access');
```

---

## 🎨 Formato de Salida

### Consola con Colores
```
🔍 [DEBUG] 2025-11-19 10:30:15.123 [AlcanceService] Obteniendo datos del alcance
📦 Data: { procesos: 25, unidades: 8, ubicaciones: 3 }

✅ [INFO] 2025-11-19 10:30:15.456 [AlcanceCRUD] ➕ Created Proceso with ID: abc123
📦 Data: { nombreProceso: "Gestión de Riesgos", criticidad: "Alta" }

⚠️ [WARN] 2025-11-19 10:30:16.789 [ValidationService] ✗ Validation failed for ProcesoForm
📦 Data: { nombreProceso: "Campo requerido" }

❌ [ERROR] 2025-11-19 10:30:17.012 [AuthService] Error en login
💥 Error: Invalid credentials
📚 Stack Trace:
    at login (authService.js:15:10)
    at LoginScreen (LoginScreen.js:42:20)

⚡ [PERFORMANCE] 2025-11-19 10:30:17.345 loadProcesos: 145ms
```

---

## 🔐 Consideraciones ISO 27002:2013

### Trazabilidad (Control A.12.4.1)
- Todos los eventos son registrados con timestamp
- Identificación clara del módulo y operación
- Historial de logs en memoria

### Auditoría (Control A.12.4.3)
- Logs de autenticación (login/logout)
- Logs de acceso a datos sensibles
- Logs de eventos de seguridad

### Monitoreo (Control A.12.4.2)
- Métricas de rendimiento
- Detección de anomalías
- Alertas de errores críticos

---

## 📞 Soporte

Para dudas o mejoras del sistema de logging:
1. Revisar este documento
2. Consultar `utils/logger.js` (código fuente)
3. Revisar ejemplos en el código

---

**Versión:** 1.0  
**Última actualización:** 2025-11-19  
**Compatibilidad:** SGSI ISO 27002:2013 v2.1.2+
