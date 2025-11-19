# Documentación Técnica - SGSI ISO 27002 App

## Arquitectura de la Aplicación

### Patrón de Diseño

La aplicación sigue una arquitectura **modular y basada en componentes** con las siguientes capas:

```
┌─────────────────────────────────────┐
│         Presentación (UI)           │
│    (Screens + Components)           │
├─────────────────────────────────────┤
│      Navegación (Navigation)        │
│    (React Navigation Stack/Tabs)    │
├─────────────────────────────────────┤
│    Lógica de Negocio (Services)     │
│  (CRUD Operations + Validation)     │
├─────────────────────────────────────┤
│   Persistencia (Storage Layer)      │
│        (AsyncStorage)               │
└─────────────────────────────────────┘
```

## Componentes Reutilizables

### Button.js
**Propósito**: Botón personalizado con múltiples variantes y estados

**Props**:
- `title` (string): Texto del botón
- `onPress` (function): Función al presionar
- `variant` (string): primary|secondary|success|danger|outline
- `size` (string): small|medium|large
- `disabled` (boolean): Estado deshabilitado
- `loading` (boolean): Estado de carga
- `icon` (component): Icono opcional

**Ejemplo de uso**:
```javascript
<Button
  title="Guardar"
  onPress={handleSave}
  variant="primary"
  size="medium"
  loading={loading}
/>
```

### Card.js
**Propósito**: Contenedor de contenido con estilo card

**Props**:
- `children` (node): Contenido del card
- `title` (string): Título opcional
- `subtitle` (string): Subtítulo opcional
- `onPress` (function): Función si es clickeable
- `style` (object): Estilos adicionales
- `headerRight` (component): Componente en header derecho

### Input.js
**Propósito**: Campo de entrada de texto con validación

**Props**:
- `label` (string): Etiqueta del campo
- `value` (string): Valor actual
- `onChangeText` (function): Callback al cambiar
- `placeholder` (string): Texto placeholder
- `error` (string): Mensaje de error
- `secureTextEntry` (boolean): Para contraseñas
- `multiline` (boolean): Texto multilínea
- `editable` (boolean): Campo editable

### Modal.js (CustomModal)
**Propósito**: Modal personalizado con header y footer

**Props**:
- `visible` (boolean): Visibilidad del modal
- `onClose` (function): Función al cerrar
- `title` (string): Título del modal
- `children` (node): Contenido
- `footer` (component): Footer con botones
- `size` (string): small|medium|large

### SearchBar.js
**Propósito**: Barra de búsqueda con icono y clear

**Props**:
- `value` (string): Texto de búsqueda
- `onChangeText` (function): Callback al escribir
- `placeholder` (string): Texto placeholder
- `style` (object): Estilos adicionales

### Badge.js
**Propósito**: Etiqueta de estado o categoría

**Props**:
- `text` (string): Texto del badge
- `color` (string): Color de fondo
- `textColor` (string): Color del texto
- `size` (string): small|medium|large

## Servicios (Services Layer)

### storage.js
**Funciones principales**:
```javascript
saveData(key, data)      // Guardar datos
getData(key)             // Obtener datos
removeData(key)          // Eliminar datos
clearAll()               // Limpiar todo
```

**Claves de almacenamiento**:
- `STORAGE_KEYS.AUTH`: Datos de autenticación
- `STORAGE_KEYS.TEAM`: Equipo SGSI
- `STORAGE_KEYS.SCOPE`: Alcance
- `STORAGE_KEYS.ASSETS`: Activos
- `STORAGE_KEYS.POLICIES`: Políticas
- `STORAGE_KEYS.RISKS`: Riesgos
- `STORAGE_KEYS.CONTROLS`: Controles

### authService.js
```javascript
login(username, password)    // Autenticar usuario
logout()                     // Cerrar sesión
getCurrentUser()             // Usuario actual
isAuthenticated()            // Verificar autenticación
```

### teamService.js
```javascript
getTeamMembers()                    // Obtener todos
addTeamMember(member)               // Agregar nuevo
updateTeamMember(id, data)          // Actualizar
deleteTeamMember(id)                // Eliminar
```

**Estructura de datos - TeamMember**:
```javascript
{
  id: string,
  name: string,
  position: string,
  role: string,          // Rol SGSI
  email: string,
  phone: string,
  createdAt: ISO8601,
  updatedAt: ISO8601
}
```

### assetService.js
```javascript
getAssets()                         // Obtener todos
addAsset(asset)                     // Agregar nuevo
updateAsset(id, data)               // Actualizar
deleteAsset(id)                     // Eliminar
getAssetsByCategory(category)       // Filtrar por categoría
getAssetsByCriticality(level)       // Filtrar por criticidad
```

**Estructura de datos - Asset**:
```javascript
{
  id: string,
  name: string,
  category: string,      // Hardware|Software|Información|Servicios|Personal
  criticality: string,   // Alto|Medio|Bajo
  owner: string,
  description: string,
  location: string,
  createdAt: ISO8601
}
```

### riskService.js
```javascript
getRisks()                          // Obtener todos
addRisk(risk)                       // Agregar nuevo
updateRisk(id, data)                // Actualizar
deleteRisk(id)                      // Eliminar
getRisksByState(state)              // Filtrar por estado
```

**Estructura de datos - Risk**:
```javascript
{
  id: string,
  name: string,
  threat: string,        // Amenaza
  vulnerability: string, // Vulnerabilidad
  impact: number,        // 1-5
  probability: number,   // 1-5
  state: string,         // Identificado|En análisis|En tratamiento|Mitigado
  treatment: string,     // Plan de tratamiento
  responsible: string,
  createdAt: ISO8601
}
```

**Cálculo de nivel de riesgo**:
```javascript
riskLevel = impact * probability

25: Crítico (rojo oscuro)
15-24: Alto (rojo)
10-14: Medio (amarillo)
6-9: Bajo (verde)
1-5: Muy Bajo (verde claro)
```

### policyService.js
```javascript
getPolicies()                       // Obtener todas
addPolicy(policy)                   // Agregar nueva
updatePolicy(id, data)              // Actualizar (incrementa versión)
deletePolicy(id)                    // Eliminar
getPoliciesByState(state)           // Filtrar por estado
```

**Estructura de datos - Policy**:
```javascript
{
  id: string,
  name: string,
  domain: string,        // Dominio ISO 27002
  state: string,         // Borrador|En revisión|Aprobado|Vigente|Obsoleto
  version: string,       // Ej: "1.0", "1.1"
  responsible: string,
  content: string,
  approvalDate: string,
  createdAt: ISO8601,
  updatedAt: ISO8601
}
```

### controlService.js
```javascript
getControls()                       // Obtener todos (114 controles)
updateControl(id, data)             // Actualizar estado/evidencia
getControlsByDomain(domain)         // Filtrar por dominio
getControlsByState(state)           // Filtrar por estado
getComplianceStats()                // Estadísticas generales
getDomainCompliance()               // Cumplimiento por dominio
```

**Estructura de datos - Control**:
```javascript
{
  id: string,
  domain: string,        // "5" a "18"
  code: string,          // Ej: "5.1.1"
  name: string,
  objective: string,
  state: string,         // No implementado|En proceso|Implementado|En revisión|Certificado
  responsible: string,
  evidence: string,
  notes: string,
  implementationDate: string,
  createdAt: ISO8601
}
```

**Inicialización de controles**:
Los 114 controles ISO 27002:2013 se generan automáticamente al primer uso con la función `generateISO27002Controls()`.

### scopeService.js
```javascript
getScope()                          // Obtener alcance
updateScope(data)                   // Actualizar alcance
addIncludedProcess(process)         // Agregar proceso incluido
addExcludedProcess(process)         // Agregar proceso excluido
```

**Estructura de datos - Scope**:
```javascript
{
  description: string,
  includedProcesses: array,
  excludedProcesses: array,
  organizationalAreas: array,
  locations: array,
  boundaries: string,
  justifications: string,
  lastUpdated: ISO8601
}
```

## Utilidades (Utils)

### constants.js
Contiene todas las constantes de la aplicación:

**Colores**:
```javascript
COLORS = {
  primary: '#1E3A8A',
  primaryLight: '#3B82F6',
  secondary: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  // ... más colores
}
```

**Dominios ISO 27002**:
```javascript
ISO_27002_DOMAINS = [
  { id: '5', name: 'Políticas de Seguridad...', controls: 2 },
  { id: '6', name: 'Organización de la Seguridad...', controls: 7 },
  // ... 14 dominios en total
]
```

**Roles SGSI**:
```javascript
SGSI_ROLES = [
  'CISO (Chief Information Security Officer)',
  'Responsable de Seguridad',
  'Auditor Interno',
  // ... más roles
]
```

### helpers.js
Funciones auxiliares:

```javascript
validateEmail(email)                    // Validar email
validatePhone(phone)                    // Validar teléfono
calculateRiskLevel(impact, probability) // Calcular nivel de riesgo
formatDate(date)                        // Formatear fecha
formatDateTime(date)                    // Formatear fecha/hora
generateId()                            // Generar ID único
calculateCompliancePercentage(impl, total) // % cumplimiento
truncateText(text, maxLength)           // Truncar texto
searchInArray(array, term, fields)      // Búsqueda
sortByField(array, field, ascending)    // Ordenar
getStateColor(state)                    // Color según estado
```

## Navegación

### Estructura de navegación

```
Stack Navigator (root)
├── LoginScreen
└── MainTabs (Tab Navigator)
    ├── Dashboard (Tab)
    ├── Team (Tab)
    ├── Assets (Tab)
    └── Controls (Tab)

Stack Navigator (modals)
├── Scope (Stack Screen)
├── Policies (Stack Screen)
└── Risks (Stack Screen)
```

### Navegación entre pantallas

```javascript
// Desde Dashboard a módulo
navigation.navigate('Team')
navigation.navigate('Scope')

// Regresar
navigation.goBack()

// Reemplazar stack
navigation.replace('MainTabs')
```

## Gestión de Estados

### Estados locales en pantallas

Cada pantalla maneja sus propios estados usando `useState`:

```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [modalVisible, setModalVisible] = useState(false);
const [formData, setFormData] = useState({});
```

### Carga de datos

Patrón común de carga:

```javascript
useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  setLoading(true);
  const data = await getDataService();
  setData(data);
  setLoading(false);
};
```

### Actualización de datos

Patrón CRUD:

```javascript
// Create
const handleCreate = async () => {
  const result = await addService(formData);
  if (result.success) {
    await loadData();
    closeModal();
    Alert.alert('Éxito', 'Creado correctamente');
  }
};

// Update
const handleUpdate = async () => {
  const result = await updateService(id, formData);
  // ... similar
};

// Delete
const handleDelete = (item) => {
  Alert.alert('Confirmar', '¿Eliminar?', [
    { text: 'Cancelar', style: 'cancel' },
    { 
      text: 'Eliminar', 
      style: 'destructive',
      onPress: async () => {
        await deleteService(item.id);
        await loadData();
      }
    }
  ]);
};
```

## Validación de Formularios

Patrón de validación:

```javascript
const [errors, setErrors] = useState({});

const validateForm = () => {
  const newErrors = {};
  
  if (!formData.field.trim()) {
    newErrors.field = 'El campo es requerido';
  }
  
  if (formData.email && !validateEmail(formData.email)) {
    newErrors.email = 'Email inválido';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = () => {
  if (!validateForm()) return;
  // Procesar formulario
};
```

## Búsqueda y Filtrado

Patrón de búsqueda:

```javascript
const [searchQuery, setSearchQuery] = useState('');
const [filtered, setFiltered] = useState([]);

useEffect(() => {
  filterData();
}, [searchQuery, data]);

const filterData = () => {
  if (!searchQuery) {
    setFiltered(data);
    return;
  }
  
  const query = searchQuery.toLowerCase();
  const filtered = data.filter(item =>
    item.name.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query)
  );
  
  setFiltered(filtered);
};
```

## Manejo de Errores

### Try-Catch en servicios

```javascript
export const getAssets = async () => {
  try {
    const assets = await getData(STORAGE_KEYS.ASSETS);
    return assets || [];
  } catch (error) {
    console.error('Error getting assets:', error);
    return [];
  }
};
```

### Feedback al usuario

```javascript
// Success
Alert.alert('Éxito', 'Operación completada');

// Error
Alert.alert('Error', error.message || 'Ocurrió un error');

// Confirmación
Alert.alert('Confirmar', '¿Está seguro?', [
  { text: 'Cancelar', style: 'cancel' },
  { text: 'Aceptar', onPress: handleAction }
]);
```

## Optimización y Performance

### Memoización

```javascript
// Evitar re-renders innecesarios
const memoizedValue = useMemo(() => 
  calculateExpensiveValue(data),
  [data]
);

// Callbacks estables
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

### FlatList optimization

```javascript
<FlatList
  data={data}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

## Testing

### Pruebas manuales recomendadas

1. **Login**: Credenciales correctas/incorrectas
2. **CRUD**: Crear, leer, actualizar, eliminar en cada módulo
3. **Búsqueda**: Búsqueda en tiempo real
4. **Filtros**: Aplicar múltiples filtros
5. **Validación**: Enviar formularios vacíos
6. **Persistencia**: Cerrar y reabrir app
7. **Estados**: Verificar estados de carga/error/vacío
8. **Navegación**: Flujo completo de navegación

## Debugging

### Habilitar debug

```javascript
// En App.js
import { LogBox } from 'react-native';

// Ignorar warnings específicos
LogBox.ignoreLogs(['Warning: ...']);

// Ver logs en console
console.log('Debug:', data);
console.warn('Warning:', warning);
console.error('Error:', error);
```

### React Native Debugger

1. Shake el dispositivo
2. Seleccionar "Debug"
3. Abrir Chrome DevTools

## Deployment

### Build para producción

```bash
# Android
expo build:android

# iOS
expo build:ios

# Web
expo build:web
```

### Publicar en Expo

```bash
expo publish
```

## Mantenimiento

### Actualizar dependencias

```bash
npm update
expo upgrade
```

### Limpiar cache

```bash
expo start -c
```

---

**Última actualización**: Noviembre 2025
