# LINEAMIENTOS DE DESARROLLO Y VERSIONAMIENTO
## Sistema de Gestión de Seguridad de la Información (SGSI) - ISO/IEC 27002:2013

---

## 📋 TABLA DE CONTENIDOS
1. [Estrategia de Versionamiento](#estrategia-de-versionamiento)
2. [Proceso de Actualización Automática](#proceso-de-actualización-automática)
3. [Tipos de Cambios](#tipos-de-cambios)
4. [Archivos a Actualizar](#archivos-a-actualizar)
5. [Ejemplos Prácticos](#ejemplos-prácticos)
6. [Checklist por Tipo de Cambio](#checklist-por-tipo-de-cambio)

---

## 🔢 ESTRATEGIA DE VERSIONAMIENTO

### Formato: **MAJOR.MINOR.PATCH** (SemVer 2.0.0)

### Incremento de Versiones

#### **MAJOR** (X.0.0) - Cambios incompatibles
- Migración de base de datos (AsyncStorage → SQLite)
- Cambio de framework principal
- Eliminación de funcionalidades existentes
- Cambios que rompen compatibilidad con versiones anteriores
- Reestructuración completa del proyecto

**Ejemplo:** 1.0.0 → 2.0.0

#### **MINOR** (0.X.0) - Nueva funcionalidad compatible
- Nuevo módulo completo (ej: Módulo de Alcance)
- Nuevas pantallas con funcionalidades
- Nuevas características importantes
- Mejoras significativas de UI/UX
- Integración de nuevos servicios

**Ejemplo:** 2.0.0 → 2.1.0

#### **PATCH** (0.0.X) - Correcciones y mejoras menores
- Corrección de bugs
- Mejoras de rendimiento
- Actualizaciones de estilos
- Correcciones de validaciones
- Optimizaciones de código
- Actualizaciones de documentación

**Ejemplo:** 2.1.0 → 2.1.1

---

## ⚡ PROCESO DE ACTUALIZACIÓN AUTOMÁTICA

### REGLA DE ORO:
**TODO cambio en el código DEBE actualizar automáticamente la versión en 3 archivos:**

1. **`package.json`** - Versión del proyecto
2. **`screens/LoginScreen.js`** - Versión visible en UI
3. **`CHANGELOG.md`** - Registro de cambios

### Workflow Automático

```
┌─────────────────────────────────────────────────────────────┐
│  CAMBIO REALIZADO (Código, UI, Base de Datos, etc.)        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
         ┌─────────────────────────────┐
         │  Determinar Tipo de Cambio  │
         │  (MAJOR / MINOR / PATCH)    │
         └──────────────┬──────────────┘
                        │
                        ▼
         ┌──────────────────────────────────┐
         │  Actualizar 3 Archivos Siempre:  │
         │  1. package.json                 │
         │  2. LoginScreen.js               │
         │  3. CHANGELOG.md                 │
         └──────────────────────────────────┘
```

---

## 📝 TIPOS DE CAMBIOS

### 1. **BREAKING CHANGES** → MAJOR
```yaml
Categoría: Cambios Incompatibles
Incremento: X.0.0
Archivos: Los 3 (package.json, LoginScreen.js, CHANGELOG.md)
Etiqueta CHANGELOG: [BREAKING CHANGE]
```

**Ejemplos:**
- Migración de AsyncStorage a SQLite
- Cambio de Expo SDK 49 → 51
- Eliminación de módulos existentes
- Cambio de estructura de datos

### 2. **FEATURES** → MINOR
```yaml
Categoría: Nueva Funcionalidad
Incremento: 0.X.0
Archivos: Los 3 (package.json, LoginScreen.js, CHANGELOG.md)
Etiqueta CHANGELOG: [FEATURE]
```

**Ejemplos:**
- Nuevo módulo de Alcance completo
- Nueva pantalla de gestión
- Integración de nuevas librerías
- Sistema de filtros avanzados

### 3. **FIXES** → PATCH
```yaml
Categoría: Corrección de Errores
Incremento: 0.0.X
Archivos: Los 3 (package.json, LoginScreen.js, CHANGELOG.md)
Etiqueta CHANGELOG: [FIX]
```

**Ejemplos:**
- Corrección de bug en formularios
- Fix de validaciones
- Corrección de estilos rotos
- Solución de errores de base de datos

### 4. **IMPROVEMENTS** → PATCH
```yaml
Categoría: Mejoras sin nueva funcionalidad
Incremento: 0.0.X
Archivos: Los 3 (package.json, LoginScreen.js, CHANGELOG.md)
Etiqueta CHANGELOG: [IMPROVEMENT]
```

**Ejemplos:**
- Optimización de rendimiento
- Mejora de mensajes de error
- Refactorización de código
- Actualización de documentación

### 5. **STYLES** → PATCH
```yaml
Categoría: Cambios visuales
Incremento: 0.0.X
Archivos: Los 3 (package.json, LoginScreen.js, CHANGELOG.md)
Etiqueta CHANGELOG: [STYLE]
```

**Ejemplos:**
- Ajuste de colores
- Cambio de espaciado
- Mejora de iconos
- Centrado de elementos

---

## 📁 ARCHIVOS A ACTUALIZAR

### 1. **package.json**
```json
{
  "version": "2.1.0",  ← ACTUALIZAR AQUÍ
  "name": "app-sgsi-27002",
  ...
}
```

### 2. **screens/LoginScreen.js**
```javascript
<Text style={styles.version}>
  Versión 2.1.0  ← ACTUALIZAR AQUÍ
</Text>
```

**Ubicación:** Buscar la línea con `<Text style={styles.version}>`

### 3. **CHANGELOG.md**
```markdown
## [2.1.0] - 2025-11-19  ← AGREGAR NUEVA SECCIÓN AL INICIO

### Added
- Nueva funcionalidad X

### Fixed
- Corrección de bug Y

### Changed
- Mejora de Z
```

**Formato de entrada:**
```markdown
## [VERSION] - FECHA

### Added (Para FEATURES)
- Descripción del cambio

### Fixed (Para FIXES)
- Descripción de la corrección

### Changed (Para IMPROVEMENTS)
- Descripción de la mejora

### Breaking Changes (Para MAJOR)
- Descripción del cambio incompatible
```

---

## 💡 EJEMPLOS PRÁCTICOS

### Ejemplo 1: Corrección de Bug (PATCH)
**Cambio:** Fix en formulario de procesos que no guardaba datos

**Actualización:**
```
Versión actual: 2.1.0
Nueva versión: 2.1.1

1. package.json: "version": "2.1.1"
2. LoginScreen.js: <Text>Versión 2.1.1</Text>
3. CHANGELOG.md:
   ## [2.1.1] - 2025-11-19
   ### Fixed
   - Corrección de error al guardar procesos en módulo de Alcance
   - Fix en validación de campos requeridos en ProcesoForm
```

### Ejemplo 2: Nuevo Feature (MINOR)
**Cambio:** Implementación completa del módulo de Alcance

**Actualización:**
```
Versión actual: 2.0.0
Nueva versión: 2.1.0

1. package.json: "version": "2.1.0"
2. LoginScreen.js: <Text>Versión 2.1.0</Text>
3. CHANGELOG.md:
   ## [2.1.0] - 2025-11-19
   ### Added
   - Módulo completo de Gestión del Alcance SGSI (ISO 27001 punto 4.3)
   - Pantallas: Procesos, Unidades, Ubicaciones, Infraestructura, Exclusiones
   - 7 nuevas tablas SQLite para gestión de alcance
   - Sistema de cálculo automático de completitud
   - Validaciones según ISO 27001 para exclusiones (justificación mínima 50 caracteres)
```

### Ejemplo 3: Breaking Change (MAJOR)
**Cambio:** Migración completa de AsyncStorage a SQLite

**Actualización:**
```
Versión actual: 1.2.5
Nueva versión: 2.0.0

1. package.json: "version": "2.0.0"
2. LoginScreen.js: <Text>Versión 2.0.0</Text>
3. CHANGELOG.md:
   ## [2.0.0] - 2025-11-19
   ### Breaking Changes
   - Migración completa de AsyncStorage a SQLite
   - Base de datos persistente con 7 tablas
   - Los datos de AsyncStorage no se migrarán automáticamente
   
   ### Added
   - Servicio de base de datos SQLite (services/database.js)
   - Soporte para 114 controles ISO 27002:2013 pre-cargados
   
   ### Changed
   - Todos los servicios migrados a SQLite
   - Sesiones de usuario siguen en AsyncStorage para compatibilidad
```

---

## ✅ CHECKLIST POR TIPO DE CAMBIO

### 🔴 MAJOR (Breaking Change)
- [ ] Determinar si el cambio rompe compatibilidad
- [ ] Incrementar versión MAJOR (X.0.0)
- [ ] Actualizar `package.json`
- [ ] Actualizar `LoginScreen.js`
- [ ] Agregar sección en `CHANGELOG.md` con etiqueta `### Breaking Changes`
- [ ] Documentar proceso de migración si aplica
- [ ] Actualizar README.md si es necesario
- [ ] Probar en emulador/dispositivo físico
- [ ] Commit con mensaje: `[BREAKING] Descripción del cambio`

### 🟡 MINOR (Feature)
- [ ] Confirmar que es nueva funcionalidad compatible
- [ ] Incrementar versión MINOR (0.X.0)
- [ ] Actualizar `package.json`
- [ ] Actualizar `LoginScreen.js`
- [ ] Agregar sección en `CHANGELOG.md` con etiqueta `### Added`
- [ ] Documentar nueva funcionalidad en USER_MANUAL.md si aplica
- [ ] Probar funcionalidad completa
- [ ] Commit con mensaje: `[FEATURE] Descripción de la funcionalidad`

### 🟢 PATCH (Fix/Improvement)
- [ ] Confirmar que es corrección o mejora menor
- [ ] Incrementar versión PATCH (0.0.X)
- [ ] Actualizar `package.json`
- [ ] Actualizar `LoginScreen.js`
- [ ] Agregar entrada en `CHANGELOG.md` con etiqueta `### Fixed` o `### Changed`
- [ ] Probar que la corrección funciona
- [ ] Commit con mensaje: `[FIX]` o `[IMPROVEMENT] Descripción`

---

## 🎯 REGLAS DE COMMITS

### Formato de Mensajes de Commit
```
[TIPO] Descripción breve (máx 72 caracteres)

Descripción detallada opcional si es necesario.
Puede tener múltiples líneas.

- Cambio específico 1
- Cambio específico 2

Versión: X.Y.Z
```

### Tipos Válidos
- `[BREAKING]` - Cambio incompatible (MAJOR)
- `[FEATURE]` - Nueva funcionalidad (MINOR)
- `[FIX]` - Corrección de bug (PATCH)
- `[IMPROVEMENT]` - Mejora de código/rendimiento (PATCH)
- `[STYLE]` - Cambios visuales (PATCH)
- `[DOCS]` - Solo documentación (sin cambio de versión)
- `[REFACTOR]` - Refactorización sin cambio de funcionalidad (PATCH)

### Ejemplos de Commits
```bash
# MAJOR
git commit -m "[BREAKING] Migración de AsyncStorage a SQLite

- Todos los módulos ahora usan SQLite
- Base de datos persistente con 7 tablas
- Sesiones siguen en AsyncStorage

Versión: 2.0.0"

# MINOR
git commit -m "[FEATURE] Módulo de Gestión del Alcance SGSI

- 5 pantallas nuevas con CRUD completo
- Sistema de validaciones ISO 27001
- Cálculo automático de completitud

Versión: 2.1.0"

# PATCH
git commit -m "[FIX] Corrección de error al crear procesos

- Inicialización correcta de tablas SQLite
- Uso de execSync para CREATE TABLE
- Manejo de errores mejorado

Versión: 2.1.1"
```

---

## 🚀 PROCESO DE RELEASE

### 1. Pre-Release
```bash
# Verificar estado del proyecto
- Todos los tests pasan
- No hay errores en consola
- Funcionalidad probada en emulador/dispositivo
```

### 2. Actualización de Versión
```bash
# Determinar tipo de cambio → Actualizar versión
# Editar 3 archivos:
1. package.json
2. screens/LoginScreen.js
3. CHANGELOG.md
```

### 3. Commit y Push
```bash
git add .
git commit -m "[TIPO] Descripción - Versión X.Y.Z"
git push origin main
```

### 4. Tag (Opcional para releases importantes)
```bash
git tag -a v2.1.0 -m "Release 2.1.0 - Módulo de Alcance"
git push origin v2.1.0
```

---

## 📊 HISTORIAL DE VERSIONES (Referencia Rápida)

| Versión | Fecha | Tipo | Descripción |
|---------|-------|------|-------------|
| 2.1.1 | 2025-11-19 | PATCH | Fix inicialización tablas alcance |
| 2.1.0 | 2025-11-19 | MINOR | Módulo completo de Alcance SGSI |
| 2.0.0 | 2025-11-19 | MAJOR | Migración SQLite + Expo SDK 51 |
| 1.2.0 | 2025-11-18 | MINOR | Mejoras UI Login + ISO branding |
| 1.1.0 | 2025-11-18 | MINOR | Versionamiento SemVer |
| 1.0.0 | 2025-11-15 | MAJOR | Release inicial |

---

## 🔐 CONSIDERACIONES ISO 27002:2013

### Trazabilidad de Cambios
- Todos los cambios DEBEN estar documentados en CHANGELOG.md
- La versión DEBE ser visible en la interfaz de usuario
- Los cambios que afecten seguridad DEBEN marcarse como BREAKING

### Auditoría
- El CHANGELOG.md sirve como registro de auditoría
- Cada versión debe tener fecha y responsable (commit author)
- Los cambios de seguridad deben estar claramente identificados

---

## 📞 CONTACTO Y SOPORTE

Para dudas sobre versionamiento:
1. Revisar este documento primero
2. Consultar VERSIONING_STRATEGY.md
3. Revisar ejemplos en CHANGELOG.md

---

## 🎓 GUÍA RÁPIDA PARA IA/COPILOT

### Prompt Template para Cambios

Cuando un asistente de IA (como GitHub Copilot, ChatGPT, etc.) realice cambios en el proyecto, debe seguir este template:

```
INSTRUCCIÓN PARA IA:
Cada vez que hagas un cambio en el código, automáticamente:

1. Determina el tipo de cambio:
   - MAJOR (X.0.0) si rompe compatibilidad
   - MINOR (0.X.0) si agrega nueva funcionalidad
   - PATCH (0.0.X) si corrige bugs o mejora algo existente

2. Actualiza SIEMPRE estos 3 archivos en UNA SOLA operación:
   a) package.json → "version": "X.Y.Z"
   b) screens/LoginScreen.js → <Text>Versión X.Y.Z</Text>
   c) CHANGELOG.md → Agregar nueva sección al inicio con:
      ## [X.Y.Z] - FECHA
      ### Added/Fixed/Changed
      - Descripción del cambio

3. No preguntes si debo actualizar la versión, hazlo automáticamente.

4. Usa multi_replace_string_in_file para los 3 archivos juntos.

Referencia: Lee DEVELOPMENT_GUIDELINES.md para detalles.
```

### Checklist Automático

Antes de terminar cualquier cambio, verifica:
- [ ] ¿Actualicé `package.json`?
- [ ] ¿Actualicé `screens/LoginScreen.js`?
- [ ] ¿Actualicé `CHANGELOG.md`?
- [ ] ¿El tipo de versión es correcto (MAJOR/MINOR/PATCH)?
- [ ] ¿La descripción en CHANGELOG es clara?

---

**Última actualización:** 2025-11-19  
**Versión del documento:** 1.0  
**Mantenedor:** Equipo de Desarrollo SGSI
