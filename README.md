# SGSI ISO 27002 - Sistema de Gestión de Seguridad de la Información

## 📱 Descripción

Aplicación móvil desarrollada en React Native con Expo para la gestión completa de un Sistema de Gestión de Seguridad de la Información (SGSI) basado en ISO 27002:2013. La aplicación permite gestionar todos los aspectos críticos de un SGSI de manera móvil y offline-first.

## ✨ Características Principales

### 🔐 Autenticación
- Login seguro con validación
- Gestión de sesiones
- Opción de recordar sesión

### 👥 Gestión de Equipo
- CRUD completo de miembros del equipo SGSI
- Asignación de roles según ISO 27002
- Información de contacto y responsabilidades
- Búsqueda y filtrado de miembros

### 📋 Gestión del Alcance
- Definición clara del alcance del SGSI
- Procesos incluidos y excluidos
- Áreas organizacionales
- Ubicaciones físicas
- Justificaciones documentadas

### 💼 Gestión de Activos
- Inventario completo de activos de información
- Clasificación por criticidad (Alto, Medio, Bajo)
- Categorización (Hardware, Software, Información, Servicios, Personal)
- Asignación de propietarios
- Búsqueda y filtros avanzados

### 📚 Gestión de Políticas
- Repositorio centralizado de políticas de seguridad
- Versionamiento automático
- Estados del ciclo de vida (Borrador, En revisión, Aprobado, Vigente, Obsoleto)
- Fechas de creación, aprobación y revisión
- Responsables asignados

### ⚠️ Gestión de Riesgos
- Identificación de amenazas y vulnerabilidades
- Análisis de riesgos (Impacto x Probabilidad)
- Cálculo automático del nivel de riesgo
- Matriz de riesgos visual
- Plan de tratamiento
- Seguimiento de estados

### 🛡️ Gestión de Controles ISO 27002:2013
- Catálogo completo de 114 controles
- 14 dominios de seguridad
- Estados de implementación
- Evidencias documentadas
- Dashboard de cumplimiento
- Filtros por dominio y estado
- Métricas de cumplimiento en tiempo real

## 🚀 Tecnologías Utilizadas

- **React Native**: Framework principal
- **Expo SDK 49**: Plataforma de desarrollo
- **React Navigation**: Navegación entre pantallas
- **AsyncStorage**: Persistencia de datos local
- **Expo Vector Icons**: Iconografía
- **React Native Safe Area Context**: Manejo de áreas seguras
- **React Native Gesture Handler**: Gestos y animaciones

## 📦 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm o yarn
- Expo CLI (opcional, pero recomendado)
- Expo Go app en tu dispositivo móvil

### Pasos de Instalación

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar el proyecto**
```bash
npm start
# o
expo start
```

4. **Ejecutar en dispositivo**
- Escanea el código QR con Expo Go (Android)
- Escanea el código QR con la cámara (iOS)

## 🌐 Compatibilidad con Snack.expo.dev

Esta aplicación es **100% compatible con Snack.expo.dev**. Para ejecutarla:

1. Visita https://snack.expo.dev
2. Crea un nuevo Snack
3. Copia todos los archivos del proyecto
4. Ejecuta el proyecto directamente en el navegador o en tu dispositivo

### Nota importante para Snack:
- Asegúrate de que todas las dependencias en `package.json` estén soportadas por Snack
- Los archivos de assets pueden tardar en cargar la primera vez

## 📂 Estructura del Proyecto

```
APP/
├── App.js                      # Punto de entrada principal
├── package.json                # Dependencias y configuración
├── app.json                    # Configuración de Expo
├── babel.config.js             # Configuración de Babel
│
├── components/                 # Componentes reutilizables
│   ├── Badge.js               # Etiquetas de estado
│   ├── Button.js              # Botones personalizados
│   ├── Card.js                # Tarjetas de contenido
│   ├── EmptyState.js          # Estado vacío
│   ├── Header.js              # Encabezado de pantallas
│   ├── Input.js               # Campos de entrada
│   ├── Loading.js             # Indicador de carga
│   ├── Modal.js               # Modales personalizados
│   ├── SearchBar.js           # Barra de búsqueda
│   ├── Select.js              # Selector personalizado
│   └── StatCard.js            # Tarjetas de estadísticas
│
├── navigation/                 # Configuración de navegación
│   └── AppNavigator.js        # Navegador principal
│
├── screens/                    # Pantallas de la aplicación
│   ├── LoginScreen.js         # Pantalla de login
│   ├── DashboardScreen.js     # Dashboard principal
│   ├── Team/
│   │   └── TeamScreen.js      # Gestión de equipo
│   ├── Scope/
│   │   └── ScopeScreen.js     # Gestión del alcance
│   ├── Assets/
│   │   └── AssetsScreen.js    # Gestión de activos
│   ├── Policies/
│   │   └── PoliciesScreen.js  # Gestión de políticas
│   ├── Risks/
│   │   └── RisksScreen.js     # Gestión de riesgos
│   └── Controls/
│       └── ControlsScreen.js  # Gestión de controles
│
├── services/                   # Lógica de negocio y datos
│   ├── storage.js             # Servicio de almacenamiento
│   ├── authService.js         # Autenticación
│   ├── teamService.js         # Servicio de equipo
│   ├── scopeService.js        # Servicio de alcance
│   ├── assetService.js        # Servicio de activos
│   ├── policyService.js       # Servicio de políticas
│   ├── riskService.js         # Servicio de riesgos
│   └── controlService.js      # Servicio de controles
│
└── utils/                      # Utilidades y constantes
    ├── constants.js           # Constantes de la aplicación
    └── helpers.js             # Funciones auxiliares
```

## 👤 Credenciales de Acceso

**Usuario:** `admin`  
**Contraseña:** `admin123`

> ⚠️ En un entorno de producción, estas credenciales deberían ser reemplazadas por un sistema de autenticación robusto con backend.

## 🎨 Diseño y UX/UI

### Paleta de Colores
- **Primary**: #1E3A8A (Azul corporativo oscuro)
- **Primary Light**: #3B82F6 (Azul corporativo claro)
- **Success**: #10B981 (Verde)
- **Danger**: #EF4444 (Rojo)
- **Warning**: #F59E0B (Amarillo)
- **Background**: #F3F4F6 (Gris claro)

### Características de UX
- Navegación intuitiva por tabs
- Búsqueda en tiempo real
- Filtros avanzados
- Feedback visual para todas las acciones
- Confirmaciones antes de eliminar
- Estados de carga
- Estados vacíos informativos
- Formularios validados

## 📊 Funcionalidades por Módulo

### Dashboard
- Resumen de cumplimiento ISO 27002
- Estadísticas de activos
- Conteo de riesgos
- Acceso rápido a módulos
- Actualización pull-to-refresh

### Equipo de Proyecto
- Agregar, editar y eliminar miembros
- 9 roles SGSI predefinidos
- Validación de email y teléfono
- Avatar visual por miembro

### Gestión del Alcance
- Descripción del alcance
- Lista de procesos incluidos/excluidos
- Áreas organizacionales
- Ubicaciones físicas
- Justificaciones documentadas

### Gestión de Activos
- 6 categorías predefinidas
- 3 niveles de criticidad con colores
- Filtros por categoría
- Búsqueda por nombre, categoría, propietario

### Gestión de Políticas
- 5 estados del ciclo de vida
- Versionamiento automático
- Fechas de aprobación
- Organización por dominios

### Gestión de Riesgos
- Matriz 5x5 (Impacto x Probabilidad)
- Cálculo automático del nivel de riesgo
- 5 estados de tratamiento
- Colores visuales según nivel

### Gestión de Controles ISO 27002
- 114 controles precargados
- 14 dominios de seguridad
- Dashboard de cumplimiento
- Porcentaje por dominio
- Evidencias de implementación
- 5 estados de implementación

## 💾 Persistencia de Datos

Los datos se almacenan localmente usando **AsyncStorage**, lo que permite:
- Funcionamiento offline
- Persistencia entre sesiones
- No requiere conexión a internet
- Datos seguros en el dispositivo

### Claves de Almacenamiento
- `@sgsi_auth`: Datos de autenticación
- `@sgsi_team`: Miembros del equipo
- `@sgsi_scope`: Alcance del SGSI
- `@sgsi_assets`: Activos
- `@sgsi_policies`: Políticas
- `@sgsi_risks`: Riesgos
- `@sgsi_controls`: Controles ISO 27002

## 🔧 Funciones Auxiliares

### Validaciones
- `validateEmail()`: Validación de correos electrónicos
- `validatePhone()`: Validación de números telefónicos

### Cálculos
- `calculateRiskLevel()`: Cálculo del nivel de riesgo
- `calculateCompliancePercentage()`: Porcentaje de cumplimiento

### Formateadores
- `formatDate()`: Formato de fechas
- `formatDateTime()`: Formato de fecha y hora
- `truncateText()`: Truncar texto largo

### Utilidades
- `generateId()`: Generación de IDs únicos
- `searchInArray()`: Búsqueda en arrays
- `sortByField()`: Ordenamiento
- `getStateColor()`: Colores según estado

## 🚧 Limitaciones Actuales

1. **Autenticación**: Credenciales hardcodeadas (en producción usar backend)
2. **Sincronización**: No hay sincronización con servidor
3. **Exportación**: Reportes básicos (no PDF/Excel)
4. **Multimedia**: No soporta adjuntar archivos
5. **Notificaciones**: Push notifications no implementadas

## 🔮 Mejoras Futuras

- [ ] Integración con backend REST API
- [ ] Autenticación con JWT
- [ ] Exportación de reportes en PDF
- [ ] Gráficos avanzados con chart-kit
- [ ] Adjuntar archivos y evidencias
- [ ] Notificaciones push
- [ ] Modo oscuro
- [ ] Internacionalización (i18n)
- [ ] Sincronización multi-dispositivo
- [ ] Firma digital de políticas

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

Desarrollado como parte del Módulo 4 - Gestión de Seguridad de la Información

## 📞 Soporte

Para reportar problemas o sugerencias, por favor crea un issue en el repositorio del proyecto.

---

**Versión:** 1.0.0  
**Fecha:** Noviembre 2025  
**Compatible con:** iOS, Android, Web (Expo)
