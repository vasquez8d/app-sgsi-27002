# Estrategia de Versionamiento

## 📌 Formato: Semantic Versioning (SemVer)

```
MAJOR.MINOR.PATCH
```

### Cuándo incrementar cada número:

#### 🔴 MAJOR (X.0.0)
Incrementar cuando hay cambios **incompatibles** o **breaking changes**:
- Migraciones de base de datos
- Cambios en arquitectura
- Eliminación de funcionalidades
- Cambios en APIs que rompen compatibilidad
- Rediseños completos

**Ejemplos:**
- ✅ Migración de AsyncStorage a SQLite → `2.0.0`
- ✅ Cambio de React Native CLI a Expo → `3.0.0`
- ✅ Nueva arquitectura de autenticación → `4.0.0`

#### 🟡 MINOR (0.X.0)
Incrementar cuando se agregan **nuevas funcionalidades** de forma compatible:
- Nuevos módulos
- Nuevas pantallas
- Nuevas características
- Mejoras significativas
- Integraciones con servicios externos

**Ejemplos:**
- ✅ Nuevo módulo de reportes → `2.1.0`
- ✅ Integración con Firebase → `2.2.0`
- ✅ Exportación a PDF → `2.3.0`
- ✅ Dashboard con gráficos avanzados → `2.4.0`

#### 🟢 PATCH (0.0.X)
Incrementar cuando se corrigen **bugs** o se hacen ajustes menores:
- Corrección de errores
- Optimizaciones de rendimiento
- Ajustes de UI menores
- Corrección de typos
- Mejoras en validaciones
- Refactoring sin cambios funcionales

**Ejemplos:**
- ✅ Fix en validación de formularios → `2.0.1`
- ✅ Corrección de error en filtros → `2.0.2`
- ✅ Optimización de queries SQL → `2.0.3`
- ✅ Fix en mapeo de campos → `2.0.4`

---

## 🔄 Proceso de Actualización

### 1. Identificar el tipo de cambio
- ¿Rompe compatibilidad? → **MAJOR**
- ¿Agrega funcionalidad? → **MINOR**
- ¿Solo corrige bugs? → **PATCH**

### 2. Actualizar archivos
```bash
# Archivos a actualizar en cada cambio de versión:
1. package.json → "version": "X.Y.Z"
2. screens/LoginScreen.js → "Versión X.Y.Z"
3. CHANGELOG.md → Agregar nueva sección [X.Y.Z]
```

### 3. Documentar cambios en CHANGELOG.md
Usar categorías:
- `### 🔄 Changed - BREAKING CHANGES` (solo para MAJOR)
- `### ✨ Added` (nuevas funcionalidades)
- `### 🐛 Fixed` (correcciones de bugs)
- `### 🗑️ Removed` (funcionalidades eliminadas)
- `### 📚 Documentation` (cambios en docs)
- `### ⚡ Performance` (mejoras de rendimiento)
- `### 🔒 Security` (mejoras de seguridad)

### 4. Commit con mensaje descriptivo
```bash
git add .
git commit -m "chore: bump version to X.Y.Z"
git tag -a vX.Y.Z -m "Version X.Y.Z"
git push origin main --tags
```

---

## 📊 Historial de Versiones

| Versión | Fecha | Tipo | Descripción |
|---------|-------|------|-------------|
| 2.0.0 | 2025-11-19 | MAJOR | Migración a SQLite + Expo SDK 51 |
| 1.0.0 | 2025-11-16 | MAJOR | Release inicial con AsyncStorage |

---

## 🎯 Próximas Versiones Planificadas

### v2.1.0 (MINOR)
- [ ] Módulo de reportes en PDF
- [ ] Gráficos de cumplimiento por dominio
- [ ] Exportación de datos

### v2.2.0 (MINOR)
- [ ] Sincronización con backend
- [ ] Multi-usuario con roles
- [ ] Notificaciones push

### v2.0.x (PATCH)
- [ ] Mejoras en validaciones
- [ ] Optimización de queries
- [ ] Correcciones de bugs reportados

---

## 💡 Reglas Adicionales

1. **Pre-releases**: Usar sufijos para versiones de prueba
   - `2.1.0-alpha.1` (primera alpha)
   - `2.1.0-beta.1` (primera beta)
   - `2.1.0-rc.1` (release candidate)

2. **Build metadata**: Agregar información de build si es necesario
   - `2.0.0+20251119` (con timestamp)
   - `2.0.0+build.123` (con número de build)

3. **Versión 0.x.x**: Para desarrollo inicial (pre-producción)
   - `0.1.0` - Primera versión funcional
   - `0.9.0` - Casi lista para producción
   - `1.0.0` - Primera versión de producción

4. **Nunca decrementar**: Las versiones siempre van hacia adelante

---

## 📝 Plantilla de Commit

```
<tipo>(<scope>): <descripción corta>

<descripción detallada>

BREAKING CHANGE: <descripción si aplica>

Versión: X.Y.Z
```

**Tipos de commit:**
- `feat`: Nueva funcionalidad (MINOR)
- `fix`: Corrección de bug (PATCH)
- `breaking`: Cambio incompatible (MAJOR)
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan código)
- `refactor`: Refactorización sin cambios funcionales
- `perf`: Mejoras de rendimiento
- `test`: Agregar o corregir tests
- `chore`: Tareas de mantenimiento
