# Changelog

All notable changes to this project will be documented in this file.

## [2.1.2] - 2025-11-19

### Added
- Sistema de logging detallado y centralizado (`utils/logger.js`)
- Logging con 5 niveles: DEBUG, INFO, WARN, ERROR, FATAL
- Timestamps automáticos en todos los logs
- Colores y emojis semánticos en consola para mejor legibilidad
- Logging especializado: database, network, auth, security, performance
- Métricas de rendimiento con `performanceStart/End/Measure`
- Logging de operaciones CRUD con contexto
- Historial de logs en memoria (últimos 100)
- Stack traces completos para errores
- Tracking del ciclo de vida de componentes React
- Banner de inicio con información de versión

### Changed
- Integrado logger en `alcanceService.js` (reemplaza console.log/error)
- Integrado logger en `alcanceCRUD.js` para todas las operaciones
- Integrado logger en `authService.js` con tracking de login/logout
- Integrado logger en `App.js` para ciclo de vida de la aplicación
- Integrado logger en `ProcesosScreen.js` con mount/unmount tracking
- Mejorada trazabilidad de errores con contexto completo

### Improved
- Mejor debugging con logs estructurados y coloreados
- Rastreo de rendimiento automático en operaciones críticas
- Auditoría de autenticación con logs de login/logout
- Visibilidad completa del flujo de datos en la aplicación

## [2.1.1] - 2025-11-19

### Fixed
- Corrección crítica de error al crear procesos en módulo de Alcance
- Fix en inicialización de tablas SQLite usando `database.execSync()` para sentencias DDL
- Corrección de uso incorrecto de `executeQuery()` (que usa `runSync()`) para CREATE TABLE
- Agregado llamado a `initAlcanceTables()` en componentes AlcanceDashboard y ProcesosScreen
- Mejora en manejo de errores con try-catch en carga de procesos

### Technical Details
- Cambio de 7 sentencias CREATE TABLE de `executeQuery()` a `database.execSync()`
- Cambio de verificación de metadata de `getFirstRow()` a `database.getFirstSync()`
- Cambio de INSERT inicial de `executeQuery()` a `database.runSync()`
- SQLite requiere `execSync()` para DDL (CREATE/DROP/ALTER) y `runSync()` para DML (INSERT/UPDATE/DELETE)

## [2.1.0] - 2025-11-19

### Added
- Módulo completo de Gestión del Alcance SGSI según ISO 27001 punto 4.3
- Dashboard de Alcance con 6 secciones y sistema de métricas
- Gestión de Procesos con macroprocesos, criticidad y estados
- Gestión de Unidades Organizacionales con niveles jerárquicos (1-5) y roles SGSI
- Gestión de Ubicaciones con coordenadas GPS (-90/90 lat, -180/180 lng)
- Gestión de Infraestructura TI con 9 tipos de activos y criticidad
- Gestión de Exclusiones con justificación mínima de 50 caracteres (ISO 27001)
- Sistema de cálculo automático de completitud (0-100%)
- 7 nuevas tablas SQLite para módulo de Alcance
- Validaciones en tiempo real para todos los formularios
- Componente reutilizable AlcanceCard para dashboard
- Búsqueda y filtros avanzados en todas las pantallas
- Pull-to-refresh en todas las listas
- Sistema de badges de estado con colores semánticos

### Technical Details
- 17 archivos nuevos: 2 servicios, 2 utilidades, 1 componente, 6 pantallas, 5 formularios
- Servicios: alcanceService.js (gestión de tablas), alcanceCRUD.js (operaciones CRUD)
- Validaciones: alcanceValidation.js con reglas ISO 27001
- Constantes: alcanceConstants.js con tema y enumeraciones
- Algoritmo de completitud basado en peso ponderado de entidades

## [2.0.0] - 2025-11-19

### 🔄 Changed - BREAKING CHANGES

#### Database Migration
- **Migrated from AsyncStorage to SQLite** for all modules
- Complete database schema with 7 tables (users, team_members, scope, assets, policies, risks, controls)
- Automatic initialization with ISO 27002:2013 catalog (114 controls)
- Foreign key relationships between tables
- Automatic timestamps (created_at, updated_at)

#### Dependencies
- **Updated to Expo SDK 51** (from SDK 49)
- Added expo-sqlite ~14.0.6
- Updated all React Native and Expo dependencies

### ✨ Added

#### Database Features
- SQLite database with optimized queries
- Helper functions (executeQuery, getAllRows, getFirstRow)
- Database initialization on app startup
- Default admin user (username: admin, password: admin123)
- Automatic control catalog initialization

#### Services
- New `database.js` service with SQLite operations
- SQL prepared statements for security
- Transaction support
- Error handling and logging

### 🐛 Fixed

#### Assets Module
- Fixed NOT NULL constraint error when adding assets
- Added automatic mapping between 'category' (UI) and 'type' (Database)
- Improved error messages
- Validation for required fields

### 📚 Documentation
- Added `SQLITE_MIGRATION.md` with complete migration guide
- Updated technical documentation
- Added database schema documentation

### ⚠️ Notes
- Existing data in AsyncStorage will NOT be migrated automatically
- Users will need to re-enter their data
- Authentication sessions are still stored in AsyncStorage for compatibility

---

## [1.0.0] - 2025-11-16

### ✨ Added

#### Core Features
- Complete ISMS (Information Security Management System) mobile application
- ISO 27002:2013 compliance management
- Offline-first architecture with AsyncStorage
- Full CRUD operations for all modules

#### Authentication
- Login screen with validation
- Session management
- Secure credential handling
- Remember session option

#### Dashboard
- Overview of ISMS metrics
- ISO 27002 compliance percentage
- Quick access to all modules
- Pull-to-refresh functionality
- Visual statistics cards

#### Team Management Module
- Create, read, update, delete team members
- 9 predefined SGSI roles
- Contact information (email, phone)
- Search and filter capabilities
- Email and phone validation

#### Scope Management Module
- Define ISMS scope
- Included/excluded processes
- Organizational areas
- Physical locations
- Boundaries documentation
- Justifications for exclusions

#### Asset Management Module
- Complete asset inventory
- 6 asset categories (Hardware, Software, Information, Services, Personnel, Infrastructure)
- 3 criticality levels (High, Medium, Low) with color coding
- Asset owner assignment
- Location tracking
- Category filtering
- Advanced search

#### Policy Management Module
- Policy repository
- 5 lifecycle states (Draft, Under Review, Approved, Current, Obsolete)
- Automatic versioning
- Approval dates tracking
- Responsible assignment
- Domain organization per ISO 27002

#### Risk Management Module
- Threat and vulnerability identification
- Risk analysis (Impact × Probability)
- 5×5 risk matrix
- Automatic risk level calculation
- 5 treatment states
- Visual risk indicators
- Treatment plan documentation
- Responsible assignment

#### Controls Management Module (ISO 27002:2013)
- Pre-loaded catalog of 114 controls
- 14 security domains
- Implementation status tracking
- Evidence documentation
- Compliance dashboard
- Domain-level compliance metrics
- State filtering
- Domain filtering
- Responsible assignment
- Implementation dates

#### UI/UX Components
- Reusable Button component (5 variants, 3 sizes)
- Card component for content display
- Input component with validation
- Custom Modal component
- SearchBar with real-time filtering
- Badge component for states
- StatCard for metrics
- Header component
- Loading states
- Empty states
- Select component (Expo-compatible)

#### Navigation
- Stack Navigator for main flow
- Bottom Tab Navigator for quick access
- Drawer Navigator capability
- Deep linking support
- Smooth transitions

#### Services Layer
- Storage service (AsyncStorage wrapper)
- Authentication service
- Team service with CRUD operations
- Scope service
- Asset service with filtering
- Policy service with versioning
- Risk service with calculations
- Control service with 114 controls auto-generation
- Compliance statistics service

#### Utilities
- Constants management
- Helper functions (validation, formatting, calculations)
- Color theming
- Spacing and typography constants
- ISO 27002 domains catalog
- SGSI roles catalog

#### Documentation
- Complete README.md with installation guide
- Technical documentation (DOCUMENTATION.md)
- User manual (USER_MANUAL.md)
- Code comments and JSDoc

### 🎨 Design
- Professional blue corporate color palette
- Intuitive and accessible UI
- Consistent design system
- Responsive layouts
- Material-inspired components
- Visual feedback for all actions
- Color-coded criticality and risk levels

### 🔧 Technical
- React Native 0.72.6
- Expo SDK 49
- React Navigation 6
- AsyncStorage for persistence
- Expo Vector Icons
- Modular architecture
- Clean code structure
- TypeScript-ready structure

### 📱 Platform Support
- iOS compatibility
- Android compatibility
- Web compatibility (Expo)
- Snack.expo.dev 100% compatible

### 🚀 Performance
- Optimized FlatList rendering
- Efficient state management
- Minimal re-renders
- Fast search and filtering
- Smooth animations

### 🔒 Security
- Local data storage
- Session management
- Input validation
- Secure credential handling

### 📊 Analytics & Metrics
- Compliance percentage calculation
- Domain-level statistics
- Risk level calculations
- Asset distribution
- Policy lifecycle tracking

### 🎯 Features Highlights
- 6 main modules fully functional
- Search in all modules
- Filters in relevant modules
- Form validation
- Delete confirmations
- Auto-save functionality
- Real-time calculations
- Visual progress indicators

---

## Future Roadmap

### [1.1.0] - Planned
- [ ] Backend integration (REST API)
- [ ] JWT authentication
- [ ] Multi-user support
- [ ] Role-based permissions

### [1.2.0] - Planned
- [ ] PDF report generation
- [ ] Excel export
- [ ] Advanced charts with react-native-chart-kit
- [ ] File attachments

### [1.3.0] - Planned
- [ ] Push notifications
- [ ] Dark mode
- [ ] Internationalization (i18n)
- [ ] Multi-device sync

### [2.0.0] - Future
- [ ] Audit trail
- [ ] Digital signature for policies
- [ ] Risk matrix visualization
- [ ] Gantt chart for implementation
- [ ] Dashboard customization
- [ ] Advanced filtering
- [ ] Bulk operations
- [ ] Import/export data

---

## Known Issues

### Current Limitations
- Single-user authentication (hardcoded credentials)
- No backend synchronization
- No file attachment support
- No push notifications
- Basic reporting only

### Notes
- All data stored locally only
- No cloud backup in current version
- Performance may degrade with 1000+ items per module

---

## Contributors

- Development Team - MGTI8 Module 4

## License

MIT License - Open Source

---

**Version**: 1.0.0  
**Release Date**: November 16, 2025  
**Build**: Initial Release
