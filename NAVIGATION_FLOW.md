# Flujo de Navegación - Módulo de Alcance SGSI

## 📱 Estructura de Navegación

```
Dashboard Principal
    │
    ├─→ Gestión del Alcance (Click en card "Alcance")
         │
         └─→ AlcanceDashboard (Vista principal del módulo)
              │
              ├─→ Procesos y Servicios
              │    │
              │    ├─ Ver lista de procesos guardados
              │    ├─ Buscar y filtrar procesos
              │    ├─ Agregar nuevo proceso (FAB +)
              │    ├─ Editar proceso (swipe derecha)
              │    └─ Eliminar proceso (swipe izquierda)
              │
              ├─→ Unidades Organizativas
              │    │
              │    ├─ Ver lista de unidades guardadas
              │    ├─ Buscar y filtrar unidades
              │    └─ CRUD completo de unidades
              │
              ├─→ Ubicaciones Físicas
              │    │
              │    ├─ Ver lista de ubicaciones guardadas
              │    ├─ Buscar y filtrar ubicaciones
              │    └─ CRUD completo con coordenadas GPS
              │
              ├─→ Infraestructura TI
              │    │
              │    ├─ Ver lista de activos guardados
              │    ├─ Filtrar por tipo y criticidad
              │    └─ CRUD completo de activos
              │
              └─→ Exclusiones
                   │
                   ├─ Ver lista de exclusiones guardadas
                   ├─ Filtrar por categoría
                   └─ CRUD completo con justificaciones ISO 27001
```

---

## 🔄 Flujo de Guardado de Datos

### Ejemplo: Guardar un Proceso

```
Usuario en AlcanceDashboard
    │
    ├─ 1. Click en card "Procesos y Servicios"
    │      └─→ Navega a ProcesosScreen
    │
    ├─ 2. Usuario ve lista vacía o con procesos existentes
    │
    ├─ 3. Click en botón FAB (+ flotante)
    │      └─→ Abre Modal con ProcesoForm
    │
    ├─ 4. Usuario llena el formulario:
    │      ├─ Macroproceso: "Captaciones"
    │      ├─ Nombre: "Gestión de Ahorros"
    │      ├─ Responsable: "Gerencia de Operaciones"
    │      ├─ Descripción: "Proceso de..."
    │      ├─ Criticidad: "Alta"
    │      └─ Estado: "Incluido"
    │
    ├─ 5. Click en "Guardar"
    │      │
    │      ├─→ Validación de campos (validateProceso)
    │      │    ├─ ✅ Todos los campos válidos
    │      │    └─ ❌ Si hay errores → Mostrar mensajes
    │      │
    │      ├─→ Llamada a addProceso(datos)
    │      │    ├─ Genera ID único
    │      │    ├─ INSERT en tabla alcance_procesos
    │      │    └─ Logger registra la operación
    │      │
    │      ├─→ loadProcesos() - Recarga la lista desde SQLite
    │      │    └─ SELECT * FROM alcance_procesos
    │      │
    │      ├─→ updateCompletitud() - Recalcula %
    │      │
    │      └─→ Cierra modal y muestra Alert de éxito
    │           "Proceso 'Gestión de Ahorros' guardado correctamente.
    │            Ahora puedes verlo en la lista."
    │
    └─ 6. Usuario ve el proceso en la lista
           ├─ Card con toda la información
           ├─ Badge de estado (Incluido = verde)
           └─ Badge de criticidad (Alta = naranja)
```

---

## 💾 Dónde se Guardan los Datos

### Base de Datos: SQLite
**Ubicación:** `sgsi.db` (almacenamiento local del dispositivo)

### Tablas del Módulo de Alcance:

```sql
-- Metadata general del proyecto
alcance_metadata
    ├─ id
    ├─ nombre_proyecto: "SGSI ISO 27002:2013"
    ├─ version: "1.0"
    ├─ estado: "Borrador"
    ├─ completitud: 0-100%
    └─ fecha_actualizacion

-- Procesos y servicios
alcance_procesos
    ├─ id
    ├─ macroproceso: "Captaciones" | "Colocaciones" | etc.
    ├─ nombre_proceso: "Gestión de Ahorros"
    ├─ responsable_area: "Gerencia de Operaciones"
    ├─ descripcion: "Descripción detallada..."
    ├─ estado: "Incluido" | "Excluido" | "En Evaluación"
    ├─ criticidad: "Crítica" | "Alta" | "Media" | "Baja"
    ├─ fecha_inclusion
    └─ created_at / updated_at

-- Unidades organizativas
alcance_unidades
    ├─ id
    ├─ nombre_unidad: "Gerencia General"
    ├─ tipo: "Estratégica" | "Operativa" | "Soporte"
    ├─ nivel_jerarquico: 1-5
    ├─ responsable
    ├─ rol_sgsi: "Líder" | "Copartícipe" | "Apoyo"
    ├─ incluida: true/false
    └─ justificacion (si no incluida)

-- Ubicaciones físicas
alcance_ubicaciones
    ├─ id
    ├─ nombre_sitio: "Sede Principal"
    ├─ direccion
    ├─ tipo: "Sede Principal" | "Agencia" | "Data Center" | etc.
    ├─ latitud: -90 a 90
    ├─ longitud: -180 a 180
    ├─ responsable_sitio
    └─ incluido: true/false

-- Infraestructura TI
alcance_infraestructura
    ├─ id
    ├─ tipo_activo: "Servidor" | "Estación" | "Red" | etc.
    ├─ identificador: "SRV-WEB-01"
    ├─ propietario_area
    ├─ sistema_operativo
    ├─ criticidad: "Crítica" | "Alta" | "Media" | "Baja"
    ├─ estado_activo: "Activo" | "Inactivo" | "Mantenimiento"
    └─ incluido_alcance: true/false

-- Exclusiones justificadas
alcance_exclusiones
    ├─ id
    ├─ elemento_excluido
    ├─ categoria: "Proceso" | "Unidad" | "Ubicación" | etc.
    ├─ justificacion (mínimo 50 caracteres ISO 27001)
    ├─ responsable_decision
    ├─ revision_pendiente: true/false
    └─ proxima_revision
```

---

## 🔍 Cómo Verificar que los Datos se Guardaron

### Método 1: Ver en la Lista (RECOMENDADO)

1. Desde **AlcanceDashboard**, click en "Procesos y Servicios"
2. Verás la lista de todos los procesos guardados
3. Cada card muestra:
   - ✅ Nombre del proceso
   - ✅ Macroproceso
   - ✅ Responsable
   - ✅ Estado (badge verde/amarillo/rojo)
   - ✅ Criticidad (badge coloreado)

### Método 2: Ver Logs en Consola

Después de guardar, verás en la consola:

```
✅ [INFO] 2025-11-19 14:30:15 [ProcesosScreen] 💾 Intentando guardar proceso
📦 Data: { nombre: "Gestión de Ahorros" }

✅ [INFO] 2025-11-19 14:30:15 [ProcesosScreen] ✓ Validation passed for Proceso

🗄️ [DB-INSERT] 2025-11-19 14:30:15 [AlcanceCRUD] Insertando proceso en DB
📊 Query/Data: { id: "abc123-..." }

✅ [INFO] 2025-11-19 14:30:15 [AlcanceCRUD] ➕ Created Proceso with ID: abc123
📦 Data: { nombreProceso: "Gestión de Ahorros", macroproceso: "Captaciones" }

⚡ [PERFORMANCE] 2025-11-19 14:30:15 addProceso: 12ms

✅ [INFO] 2025-11-19 14:30:15 [ProcesosScreen] ✅ Proceso guardado exitosamente con ID: abc123

⚡ [PERFORMANCE] 2025-11-19 14:30:16 loadProcesos: 8ms

✅ [INFO] 2025-11-19 14:30:16 [ProcesosScreen] 📊 Cargados 1 procesos
```

### Método 3: Verificar el Dashboard

1. Vuelve al **AlcanceDashboard** (botón atrás)
2. Verás las estadísticas actualizadas:
   - "1 de 1 incluidos" en Procesos
   - Barra de completitud aumentará
   - Badge con el número total de procesos

---

## 🎯 Acciones Disponibles en Cada Pantalla

### ProcesosScreen

| Acción | Cómo hacerlo | Resultado |
|--------|--------------|-----------|
| **Ver todos** | Entrar a la pantalla | Lista completa |
| **Buscar** | Escribir en barra superior | Filtro por nombre/macroproceso/responsable |
| **Filtrar por Macroproceso** | Click en chips "Captaciones", "Colocaciones", etc. | Solo procesos de ese tipo |
| **Filtrar por Estado** | Click en chips "Incluido", "En Evaluación", "Excluido" | Solo procesos con ese estado |
| **Filtrar por Criticidad** | Click en chips "Crítica", "Alta", "Media", "Baja" | Solo procesos con esa criticidad |
| **Agregar nuevo** | Click en botón FAB (+) | Abre formulario vacío |
| **Editar** | Swipe derecha en card | Abre formulario con datos |
| **Eliminar** | Swipe izquierda en card | Confirmación + elimina |
| **Actualizar** | Pull to refresh (arrastrar hacia abajo) | Recarga datos de BD |

### UnidadesScreen, UbicacionesScreen, InfraestructuraScreen, ExclusionesScreen

Mismas acciones disponibles con sus respectivos filtros y campos específicos.

---

## 🐛 Solución de Problemas

### "No veo los datos después de guardar"

**Causa:** Navegación no configurada correctamente
**Solución:** ✅ CORREGIDO en v2.1.3

### "El formulario se queda vacío después de guardar"

**Comportamiento esperado:** El modal se cierra y debes ver el item en la lista.
Si no lo ves:
1. Verifica los logs en consola
2. Pull to refresh en la lista
3. Vuelve al dashboard y entra de nuevo

### "No encuentro el botón de agregar"

**Ubicación:** Botón flotante circular (+) en la esquina inferior derecha de cada pantalla de listado.

### "Los filtros no funcionan"

**Solución:** 
1. Limpia los filtros (click en "Todos")
2. Verifica que hay datos en la BD
3. Pull to refresh

---

## 📊 Ejemplo Completo: Primer Uso

```
1. Login → Dashboard
2. Click en card "Gestión del Alcance"
   └─→ Ves AlcanceDashboard con 6 secciones

3. Click en "Procesos y Servicios"
   └─→ Ves ProcesosScreen con lista vacía

4. Click en botón FAB (+)
   └─→ Se abre modal con formulario

5. Llenar formulario:
   - Macroproceso: Captaciones
   - Nombre: Gestión de Ahorros
   - Responsable: Gerencia
   - Descripción: Proceso de apertura y gestión de cuentas de ahorro
   - Criticidad: Alta (click en chip naranja)
   - Estado: Incluido (automático)

6. Click en "Guardar"
   └─→ Alert: "Proceso 'Gestión de Ahorros' guardado correctamente"
   └─→ Modal se cierra
   └─→ VES EL PROCESO EN LA LISTA ✅

7. Puedes:
   - Agregar más procesos
   - Editarlo (swipe →)
   - Eliminarlo (swipe ←)
   - Buscarlo (barra superior)
   - Filtrarlo (chips)

8. Volver a Dashboard
   └─→ Estadísticas actualizadas
   └─→ "1 de 1 incluidos"
   └─→ Completitud aumentada
```

---

## 🎉 Resumen

### ¿Dónde se guardan los datos?
✅ **Base de datos SQLite local** (`sgsi.db`)

### ¿Cómo veo los datos guardados?
✅ **En las pantallas de listado** (Procesos, Unidades, etc.)

### ¿Por qué el formulario se muestra vacío?
✅ **Es correcto**. Después de guardar, el modal se cierra y debes ver el registro en la **lista**, no en el formulario.

### ¿Cómo sé que se guardó?
✅ **3 formas:**
1. Alert de confirmación
2. Aparece en la lista
3. Logs en consola

---

**Versión:** 1.0  
**Última actualización:** 2025-11-19  
**Compatibilidad:** v2.1.3+
