# Manual de Usuario - SGSI ISO 27002 App

## Introducción

Bienvenido al Sistema de Gestión de Seguridad de la Información (SGSI) basado en ISO 27002:2013. Esta aplicación le permitirá gestionar todos los aspectos de su SGSI desde su dispositivo móvil.

## Inicio de Sesión

### Acceso a la aplicación

1. Abra la aplicación
2. Ingrese sus credenciales:
   - **Usuario**: admin
   - **Contraseña**: admin123
3. Presione "Iniciar Sesión"

![Login Screen]

### Recordar sesión
- La sesión permanece activa hasta que cierre sesión manualmente
- Sus datos se guardan de forma local y segura

---

## Dashboard Principal

Al iniciar sesión, verá el **Dashboard** con:

### Métricas Principales
- **Cumplimiento ISO 27002**: Porcentaje de controles implementados
- **Activos**: Número total de activos registrados
- **Riesgos**: Cantidad de riesgos identificados
- **Equipo**: Miembros del equipo SGSI

### Módulos Disponibles
Puede acceder a los siguientes módulos:
- 👥 Equipo de Proyecto
- 📋 Alcance del SGSI
- 💼 Activos
- 📚 Políticas
- ⚠️ Riesgos
- 🛡️ Controles ISO 27002

### Navegación
- Use la **barra de navegación inferior** para acceso rápido
- Toque cualquier módulo para ingresar
- Use el botón **← Atrás** para regresar

---

## Módulo: Equipo de Proyecto

### Visualizar Miembros

1. Entre al módulo "Equipo de Proyecto"
2. Verá la lista de todos los miembros del equipo SGSI
3. Cada tarjeta muestra:
   - Nombre completo
   - Cargo
   - Rol SGSI
   - Email y teléfono de contacto

### Buscar Miembros

1. Use la **barra de búsqueda** en la parte superior
2. Escriba el nombre, cargo, rol o email
3. Los resultados se filtran en tiempo real

### Agregar Miembro

1. Presione el botón **+ (flotante)** en la esquina inferior derecha
2. Complete el formulario:
   - **Nombre completo** (requerido)
   - **Cargo** (requerido)
   - **Rol SGSI** (seleccione de la lista)
   - **Email** (requerido, formato válido)
   - **Teléfono** (opcional)
3. Presione "Guardar"

#### Roles SGSI Disponibles:
- CISO (Chief Information Security Officer)
- Responsable de Seguridad
- Auditor Interno
- Analista de Riesgos
- Administrador de Controles
- Gestor de Activos
- Responsable de Políticas
- Miembro del Comité
- Consultor Externo

### Editar Miembro

1. En la tarjeta del miembro, presione "Editar"
2. Modifique los campos necesarios
3. Presione "Actualizar"

### Eliminar Miembro

1. En la tarjeta del miembro, presione "Eliminar"
2. Confirme la eliminación
3. El miembro será removido permanentemente

---

## Módulo: Gestión del Alcance

### Información General

1. Entre al módulo "Alcance del SGSI"
2. Complete los campos principales:
   - **Descripción del Alcance**: Qué abarca el SGSI
   - **Límites del SGSI**: Fronteras del sistema
   - **Justificaciones**: Explicación de exclusiones

### Procesos Incluidos

1. En la sección "Procesos Incluidos"
2. Escriba el nombre del proceso
3. Presione "Agregar"
4. El proceso aparecerá en la lista con ✓
5. Para eliminar, presione la ✗ junto al proceso

### Procesos Excluidos

Similar a procesos incluidos, pero marcados con ✗ rojo

### Áreas Organizacionales

1. Ingrese el nombre del área (Ej: "Finanzas", "RRHH")
2. Presione "Agregar"
3. Gestione la lista según necesidad

### Ubicaciones Físicas

1. Ingrese la dirección o ubicación
2. Presione "Agregar"
3. Aparecerá con icono de ubicación 📍

### Guardar Cambios

1. Después de realizar modificaciones
2. Desplace hacia abajo
3. Presione "Guardar Cambios"
4. La fecha de última actualización se registrará

---

## Módulo: Gestión de Activos

### Ver Activos

1. Entre al módulo "Activos"
2. Visualice todos los activos en tarjetas
3. Cada tarjeta muestra:
   - Nombre del activo
   - Categoría
   - Criticidad (color codificado)
   - Propietario
   - Descripción
   - Ubicación

### Filtrar por Categoría

1. Use los chips horizontales en la parte superior
2. Toque una categoría:
   - Hardware
   - Software
   - Información
   - Servicios
   - Personal
   - Infraestructura
3. Toque "Todos" para ver todos los activos

### Buscar Activos

Use la barra de búsqueda para filtrar por nombre, categoría o propietario

### Agregar Activo

1. Presione el botón **+** flotante
2. Complete el formulario:
   - **Nombre** (requerido)
   - **Categoría** (seleccione una)
   - **Criticidad** (Alto/Medio/Bajo)
   - **Propietario** (requerido)
   - **Descripción** (opcional)
   - **Ubicación** (opcional)
3. Presione "Guardar"

#### Niveles de Criticidad:
- 🔴 **Alto**: Activos críticos para el negocio
- 🟡 **Medio**: Activos importantes
- 🟢 **Bajo**: Activos de baja importancia

### Editar/Eliminar Activo

- Use los botones ✏️ (editar) o 🗑️ (eliminar) en cada tarjeta
- Confirme la eliminación cuando sea necesario

---

## Módulo: Gestión de Políticas

### Ver Políticas

1. Entre al módulo "Políticas"
2. Vea todas las políticas de seguridad
3. Cada política muestra:
   - Nombre
   - Dominio ISO 27002
   - Estado actual
   - Versión
   - Responsable
   - Fecha de aprobación

### Agregar Política

1. Presione el botón **+**
2. Complete:
   - **Nombre** (requerido)
   - **Dominio ISO 27002** (ej: "Políticas de Seguridad")
   - **Estado** (seleccione del carrusel)
   - **Responsable** (requerido)
   - **Contenido** (descripción de la política)
   - **Fecha de Aprobación** (formato YYYY-MM-DD)
3. Presione "Guardar"

#### Estados de Políticas:
- **Borrador**: En creación
- **En revisión**: Siendo revisada
- **Aprobado**: Aprobada pero no vigente
- **Vigente**: Actualmente en vigor
- **Obsoleto**: Ya no aplica

### Versionamiento

- Al editar una política, la versión se incrementa automáticamente
- Ejemplo: 1.0 → 1.1 → 1.2

### Gestionar Política

Use los botones de editar/eliminar en cada tarjeta

---

## Módulo: Gestión de Riesgos

### Ver Riesgos

1. Entre al módulo "Riesgos"
2. Vea todos los riesgos identificados
3. Cada riesgo muestra:
   - Nombre
   - Amenaza
   - Nivel de riesgo (color codificado)
   - Estado
   - Métricas (Impacto, Probabilidad)
   - Responsable

### Agregar Riesgo

1. Presione el botón **+**
2. Complete:
   - **Nombre** (requerido)
   - **Amenaza** (requerido)
   - **Vulnerabilidad** (opcional)
   - **Impacto** (1-5, siendo 5 muy alto)
   - **Probabilidad** (1-5, siendo 5 muy probable)
   - **Estado** (Identificado, En análisis, etc.)
   - **Plan de Tratamiento** (acciones a tomar)
   - **Responsable** (quién gestiona el riesgo)
3. Presione "Guardar"

### Matriz de Riesgos

El nivel de riesgo se calcula automáticamente:

```
Nivel = Impacto × Probabilidad

25: Crítico (rojo oscuro)
15-24: Alto (rojo)
10-14: Medio (amarillo)
6-9: Bajo (verde)
1-5: Muy Bajo (verde claro)
```

### Estados de Riesgos:
- **Identificado**: Riesgo recién identificado
- **En análisis**: Analizando el riesgo
- **En tratamiento**: Aplicando controles
- **Mitigado**: Riesgo reducido a nivel aceptable
- **Aceptado**: Riesgo aceptado sin tratamiento

---

## Módulo: Controles ISO 27002

### Dashboard de Cumplimiento

1. Al entrar, verá:
   - **Total de controles**: 114
   - **Implementados**: Controles completos
   - **En proceso**: Controles en implementación
   - **Pendientes**: No implementados

### Dominios ISO 27002

Visualice los 14 dominios:
1. Políticas de Seguridad (2 controles)
2. Organización de la Seguridad (7 controles)
3. Seguridad de RRHH (6 controles)
4. Gestión de Activos (10 controles)
5. Control de Acceso (14 controles)
6. Criptografía (2 controles)
7. Seguridad Física (15 controles)
8. Seguridad de Operaciones (14 controles)
9. Seguridad de Comunicaciones (7 controles)
10. Desarrollo de Sistemas (13 controles)
11. Proveedores (5 controles)
12. Incidentes (7 controles)
13. Continuidad (4 controles)
14. Cumplimiento (8 controles)

### Filtrar Controles

**Por dominio**:
- Toque un dominio en el carrusel horizontal
- Se mostrarán solo los controles de ese dominio

**Por estado**:
- Use los chips: Todos, No implementado, En proceso, Implementado, En revisión, Certificado
- Los controles se filtran en tiempo real

### Buscar Controles

Use la barra de búsqueda para encontrar por código o nombre

### Gestionar Control

1. Presione "Gestionar" en un control
2. Se abrirá el detalle del control mostrando:
   - Código (ej: 5.1.1)
   - Nombre completo
   - Objetivo del control
3. Actualice:
   - **Estado de Implementación**
   - **Responsable**
   - **Evidencias de Implementación**
   - **Notas Adicionales**
   - **Fecha de Implementación**
4. Presione "Guardar"

### Estados de Controles:
- **No implementado**: Sin iniciar
- **En proceso**: En implementación
- **Implementado**: Completamente implementado
- **En revisión**: Siendo revisado
- **Certificado**: Certificado por auditor

### Interpretación del Dashboard

- **Porcentaje de cumplimiento**: (Implementados + Certificados) / Total × 100
- **Cumplimiento por dominio**: Cada dominio muestra su % individual
- **Barra de progreso**: Verde (>70%), Amarillo (40-70%), Rojo (<40%)

---

## Características Comunes

### Barra de Búsqueda
- Disponible en todos los módulos con listas
- Búsqueda en tiempo real
- Busca en múltiples campos (nombre, categoría, etc.)
- Para limpiar, presione la ✗

### Botón Flotante (+)
- Presente en módulos con funcionalidad CRUD
- Ubicado en esquina inferior derecha
- Presione para agregar nuevo elemento

### Confirmaciones
- Al eliminar cualquier elemento, se solicita confirmación
- Opciones: "Cancelar" o "Eliminar"
- La eliminación es permanente

### Actualizar Datos
- En el Dashboard, deslice hacia abajo para actualizar
- Los datos se actualizan automáticamente

### Validaciones
- Los campos requeridos están marcados con *
- Los errores se muestran en rojo debajo del campo
- No se puede guardar hasta corregir errores

---

## Consejos y Mejores Prácticas

### Gestión de Equipo
✅ Mantenga actualizados los datos de contacto
✅ Asigne roles apropiados según ISO 27002
✅ Incluya personal clave del SGSI

### Gestión de Alcance
✅ Sea específico en la descripción
✅ Documente claramente las exclusiones
✅ Revise periódicamente los procesos incluidos

### Gestión de Activos
✅ Clasifique correctamente la criticidad
✅ Asigne propietarios claros
✅ Actualice ubicaciones cuando cambien

### Gestión de Políticas
✅ Revise y actualice políticas regularmente
✅ Mantenga evidencia de aprobaciones
✅ Archive políticas obsoletas (no elimine)

### Gestión de Riesgos
✅ Revise riesgos periódicamente
✅ Actualice estados según evolución
✅ Documente planes de tratamiento
✅ Sea realista con impacto y probabilidad

### Gestión de Controles
✅ Implemente controles por prioridad
✅ Documente evidencias claramente
✅ Asigne responsables específicos
✅ Mantenga fechas de implementación

---

## Solución de Problemas

### No puedo iniciar sesión
- Verifique las credenciales: admin / admin123
- Asegúrese de escribir correctamente (case-sensitive)

### Los datos no se guardan
- Verifique que completó todos los campos requeridos (*)
- Asegúrese de presionar "Guardar"
- Revise mensajes de error en rojo

### No encuentro un elemento
- Use la barra de búsqueda
- Verifique los filtros aplicados
- Presione "Todos" para resetear filtros

### La aplicación está lenta
- Cierre y vuelva a abrir la app
- Los datos se guardan automáticamente

### Eliminé algo por error
- Los datos eliminados no se pueden recuperar
- Siempre confirme antes de eliminar

---

## Seguridad y Privacidad

### Almacenamiento de Datos
- Los datos se guardan **localmente** en su dispositivo
- No se envían a servidores externos
- Los datos persisten entre sesiones

### Cierre de Sesión
1. En el Dashboard, presione el icono de salida (↗️)
2. Confirme el cierre de sesión
3. Será redirigido al login

### Respaldo de Datos
- **Importante**: Los datos solo existen en el dispositivo
- Considere documentar información crítica externamente
- En producción, implemente respaldo en la nube

---

## Preguntas Frecuentes (FAQ)

**P: ¿Puedo usar la app sin internet?**  
R: Sí, la app funciona 100% offline.

**P: ¿Cuántos usuarios pueden acceder?**  
R: Versión actual: un usuario (admin). En producción, multi-usuario.

**P: ¿Puedo exportar reportes?**  
R: Actualmente no. Próximamente exportación a PDF.

**P: ¿Los controles ISO 27002 vienen precargados?**  
R: Sí, los 114 controles se cargan automáticamente.

**P: ¿Puedo modificar los controles ISO 27002?**  
R: Puede actualizar estado, evidencias y responsables, pero no el contenido base.

**P: ¿Hay límite de elementos que puedo crear?**  
R: No hay límite técnico, pero el rendimiento puede verse afectado con miles de elementos.

**P: ¿Puedo adjuntar archivos como evidencias?**  
R: Actualmente solo texto. Archivos en versión futura.

---

## Glosario

**SGSI**: Sistema de Gestión de Seguridad de la Información

**ISO 27002**: Estándar internacional de controles de seguridad

**CISO**: Chief Information Security Officer

**Activo**: Cualquier recurso de valor para la organización

**Amenaza**: Causa potencial de incidente no deseado

**Vulnerabilidad**: Debilidad que puede ser explotada

**Riesgo**: Efecto de la incertidumbre sobre los objetivos

**Control**: Medida que modifica el riesgo

**Cumplimiento**: Grado de implementación de controles

---

## Soporte

Para obtener ayuda adicional:
- Revise la documentación técnica (DOCUMENTATION.md)
- Consulte el README.md del proyecto
- Contacte al administrador del sistema

---

**Versión del Manual**: 1.0.0  
**Última actualización**: Noviembre 2025

¡Gracias por usar SGSI ISO 27002 App!
