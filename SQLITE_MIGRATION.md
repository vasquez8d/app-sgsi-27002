# Migración a SQLite - Sistema SGSI ISO 27002

## ✅ Cambios Implementados

### 1. Base de Datos SQLite

Se ha implementado **SQLite** como sistema de almacenamiento persistente para todos los módulos de la aplicación, reemplazando AsyncStorage para datos estructurados.

### 2. Estructura de la Base de Datos

#### Tablas Creadas

| Tabla | Descripción | Campos Principales |
|-------|-------------|-------------------|
| `users` | Usuarios y autenticación | username, password, name, email, role |
| `team_members` | Miembros del equipo SGSI | name, role, email, phone, department, responsibilities |
| `scope` | Elementos del alcance | name, type, included, description, justification |
| `assets` | Activos de información | name, type, description, owner, location, criticality |
| `policies` | Políticas de seguridad | code, title, description, content, version, status |
| `risks` | Riesgos identificados | name, threat, vulnerability, probability, impact, risk_level |
| `controls` | Controles ISO 27002 | code, name, domain, description, objective, status |

### 3. Archivos Modificados

#### Nuevos Archivos
- ✅ `services/database.js` - Servicio principal de SQLite con funciones helper

#### Archivos Migrados a SQLite
- ✅ `services/authService.js` - Autenticación con SQLite
- ✅ `services/assetService.js` - Gestión de activos
- ✅ `services/teamService.js` - Gestión de equipo
- ✅ `services/scopeService.js` - Gestión de alcance
- ✅ `services/policyService.js` - Gestión de políticas
- ✅ `services/riskService.js` - Gestión de riesgos
- ✅ `services/controlService.js` - Gestión de controles ISO 27002

#### Archivos Actualizados
- ✅ `App.js` - Inicialización de la base de datos al arrancar
- ⚠️ `services/storage.js` - Mantenido para compatibilidad con sesiones

### 4. Características Implementadas

#### 🔒 Seguridad
- Autenticación con usuarios almacenados en BD
- Contraseñas en texto plano (⚠️ **Pendiente**: implementar hashing)
- Sesiones activas en AsyncStorage

#### 📊 Integridad de Datos
- Claves primarias únicas (ID generados)
- Constraints UNIQUE en códigos y usernames
- Foreign keys en tabla de riesgos → activos
- Timestamps automáticos (created_at, updated_at)

#### ⚡ Rendimiento
- Consultas SQL optimizadas
- Índices automáticos en primary keys
- Inicialización lazy de controles ISO 27002

#### 🔄 Compatibilidad
- Inicialización automática de tablas
- Usuario admin por defecto (username: `admin`, password: `admin123`)
- Catálogo de 114 controles ISO 27002:2013 pre-cargado

### 5. Funciones Helper Disponibles

```javascript
// En services/database.js

// Inicializar base de datos (crear tablas)
initDatabase()

// Ejecutar INSERT, UPDATE, DELETE
executeQuery(sql, params)

// Obtener múltiples resultados
getAllRows(sql, params)

// Obtener un solo resultado
getFirstRow(sql, params)

// Limpiar toda la BD (desarrollo)
clearDatabase()
```

### 6. Ejemplos de Uso

#### Obtener todos los activos
```javascript
import { getAllRows } from './services/database';

const assets = getAllRows('SELECT * FROM assets ORDER BY created_at DESC');
```

#### Agregar un nuevo riesgo
```javascript
import { executeQuery } from './services/database';
import { generateId } from './utils/helpers';

const id = generateId();
executeQuery(
  'INSERT INTO risks (id, name, description, probability, impact) VALUES (?, ?, ?, ?, ?)',
  [id, 'Nuevo Riesgo', 'Descripción', 'Alta', 'Alto']
);
```

#### Actualizar estado de un control
```javascript
import { executeQuery } from './services/database';

executeQuery(
  'UPDATE controls SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
  ['Implementado', controlId]
);
```

### 7. Migración de Datos Existentes

⚠️ **IMPORTANTE**: Si ya tienes datos en AsyncStorage, estos **NO se migran automáticamente**.

Para migrar datos existentes:
1. Los datos antiguos permanecen en AsyncStorage
2. La aplicación iniciará con BD vacía (excepto usuario admin y controles)
3. Los usuarios deben reingresar su información

### 8. Ventajas de SQLite

✅ **Queries complejas**: JOIN, GROUP BY, agregaciones
✅ **Relaciones**: Foreign keys entre tablas
✅ **Integridad**: Constraints y validaciones
✅ **Rendimiento**: Más rápido que AsyncStorage para datos estructurados
✅ **Escalabilidad**: Soporta miles de registros sin problemas
✅ **Búsquedas**: Índices y búsquedas optimizadas
✅ **Transacciones**: Operaciones atómicas

### 9. Próximos Pasos Recomendados

#### Alta Prioridad
- [ ] Implementar hashing de contraseñas (bcrypt)
- [ ] Agregar validaciones de datos en inserts/updates
- [ ] Implementar paginación para listas grandes
- [ ] Agregar índices en columnas frecuentemente consultadas

#### Media Prioridad
- [ ] Implementar búsqueda de texto completo (FTS)
- [ ] Agregar soft deletes (campo deleted_at)
- [ ] Implementar auditoría de cambios (log de modificaciones)
- [ ] Exportar/Importar base de datos (backup)

#### Baja Prioridad
- [ ] Migración automática desde AsyncStorage
- [ ] Sincronización con servidor remoto
- [ ] Encriptación de base de datos
- [ ] Compresión de datos históricos

### 10. Testing

Para probar la implementación:

```bash
# Iniciar la aplicación
npm start

# La BD se inicializa automáticamente al arrancar
# Usuario por defecto: admin / admin123
```

### 11. Troubleshooting

#### Error: "no such table"
- La BD no se inicializó correctamente
- Solución: Reiniciar la app (cerrar y volver a abrir)

#### Error: "UNIQUE constraint failed"
- Intentando insertar un código o username duplicado
- Solución: Verificar que el valor sea único antes de insertar

#### Datos no aparecen
- Verificar que initDatabase() se ejecutó correctamente
- Ver logs en consola con `console.log()`
- Verificar que las consultas SQL son correctas

### 12. Notas Técnicas

- **Motor**: SQLite 3 (incluido en Expo SDK 51)
- **Ubicación**: Carpeta de documentos de la app
- **Tamaño**: Crece dinámicamente según datos
- **Límites**: ~140TB máximo (más que suficiente)
- **Compatibilidad**: iOS, Android y Web (con limitaciones en web)

---

## 📝 Resumen

Se ha migrado exitosamente toda la aplicación de AsyncStorage a SQLite, proporcionando:
- ✅ Mayor rendimiento
- ✅ Mejor integridad de datos
- ✅ Consultas más poderosas
- ✅ Escalabilidad mejorada

La aplicación ahora utiliza una base de datos relacional completa con 7 tablas principales y más de 100 controles ISO 27002 pre-cargados.
