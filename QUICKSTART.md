# 🚀 Inicio Rápido - SGSI ISO 27002 App

## Para usuarios de Snack.expo.dev (Recomendado)

### Opción 1: Importar proyecto completo

1. Ve a https://snack.expo.dev
2. Crea una nueva cuenta o inicia sesión
3. Haz clic en "Import git repository" o sube los archivos
4. Espera a que se instalen las dependencias
5. Escanea el código QR con Expo Go en tu teléfono
6. ¡Listo! La app está funcionando

### Opción 2: Copiar archivos manualmente

1. Ve a https://snack.expo.dev
2. Crea un nuevo Snack
3. Copia el contenido de `package.json` en el archivo package.json de Snack
4. Crea la estructura de carpetas:
   - `components/`
   - `navigation/`
   - `screens/` (con subcarpetas Team, Scope, Assets, Policies, Risks, Controls)
   - `services/`
   - `utils/`
5. Copia cada archivo en su ubicación correspondiente
6. Asegúrate de que `App.js` esté en la raíz
7. Presiona "Save" y espera a que compile
8. Escanea el código QR

---

## Para desarrollo local

### Prerrequisitos
- Node.js 14+ instalado
- npm o yarn
- Expo Go app en tu móvil

### Pasos

```bash
# 1. Navegar a la carpeta del proyecto
cd "d:\MGTI8\MODULO_4\GSI\APP"

# 2. Instalar dependencias
npm install

# 3. Iniciar Expo
npm start
# o
npx expo start

# 4. Opciones:
# - Presiona 'a' para Android emulator
# - Presiona 'i' para iOS simulator
# - Escanea QR con Expo Go para dispositivo real
```

---

## Credenciales de acceso

```
Usuario: admin
Contraseña: admin123
```

---

## Estructura mínima para Snack

Si tienes problemas, asegúrate de tener al menos estos archivos:

```
/
├── App.js
├── package.json
├── app.json
├── babel.config.js
│
├── components/
│   ├── Button.js
│   ├── Card.js
│   ├── Input.js
│   ├── Header.js
│   ├── Badge.js
│   ├── StatCard.js
│   ├── Modal.js
│   ├── SearchBar.js
│   ├── Select.js
│   ├── Loading.js
│   └── EmptyState.js
│
├── navigation/
│   └── AppNavigator.js
│
├── screens/
│   ├── LoginScreen.js
│   ├── DashboardScreen.js
│   ├── Team/TeamScreen.js
│   ├── Scope/ScopeScreen.js
│   ├── Assets/AssetsScreen.js
│   ├── Policies/PoliciesScreen.js
│   ├── Risks/RisksScreen.js
│   └── Controls/ControlsScreen.js
│
├── services/
│   ├── storage.js
│   ├── authService.js
│   ├── teamService.js
│   ├── scopeService.js
│   ├── assetService.js
│   ├── policyService.js
│   ├── riskService.js
│   └── controlService.js
│
└── utils/
    ├── constants.js
    └── helpers.js
```

---

## Verificar que funciona

1. **Login**: Deberías ver la pantalla de login con el logo de escudo
2. **Ingresar**: Usa admin/admin123
3. **Dashboard**: Deberías ver 4 tarjetas de estadísticas y 6 módulos
4. **Navegación**: Los tabs inferiores deben funcionar
5. **Módulos**: Cada módulo debe abrir correctamente

---

## Solución de problemas comunes

### "Cannot find module..."
- Verifica que todos los archivos estén en las carpetas correctas
- Revisa que los imports usen rutas relativas correctas
- Ejemplo: `import Button from '../components/Button';`

### "undefined is not an object"
- Revisa que todos los servicios estén importados
- Verifica que las constantes estén definidas en `utils/constants.js`

### La app no compila en Snack
- Verifica que `package.json` tenga las versiones correctas
- Asegúrate de que no hay archivos faltantes
- Revisa la consola de errores de Snack

### Los datos no se guardan
- AsyncStorage puede tardar un poco en cargar
- Verifica que no hay errores en la consola
- Prueba cerrar y reabrir la app

---

## Primeros pasos después de iniciar

1. **Explorar el Dashboard**
   - Observa las métricas (estarán en 0 inicialmente)
   - Familiarízate con los 6 módulos

2. **Agregar tu primer miembro del equipo**
   - Ve a "Equipo de Proyecto"
   - Presiona el botón + flotante
   - Completa el formulario
   - Guarda

3. **Definir el alcance**
   - Ve a "Alcance del SGSI"
   - Describe tu alcance
   - Agrega procesos incluidos/excluidos

4. **Registrar activos**
   - Ve a "Activos"
   - Agrega tus primeros activos
   - Clasifícalos por criticidad

5. **Explorar controles ISO 27002**
   - Ve a "Controles ISO 27002"
   - Observa los 114 controles precargados
   - Actualiza el estado de algunos controles
   - Observa cómo cambia el % de cumplimiento

---

## Características destacadas para probar

✅ **Búsqueda en tiempo real** en todos los módulos
✅ **Filtros** por categoría, dominio, estado
✅ **Validación de formularios** (intenta guardar sin llenar campos)
✅ **Cálculo automático** de nivel de riesgo (Impacto × Probabilidad)
✅ **Dashboard de cumplimiento** ISO 27002
✅ **Versionamiento automático** de políticas
✅ **Confirmaciones** antes de eliminar
✅ **Pull-to-refresh** en el Dashboard

---

## Siguientes pasos

Una vez que la app funcione:

1. Lee el **USER_MANUAL.md** para entender todas las funcionalidades
2. Revisa **DOCUMENTATION.md** si quieres entender el código
3. Consulta **README.md** para información general
4. Revisa **CHANGELOG.md** para ver todas las características

---

## Recursos útiles

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [ISO 27002 Standard](https://www.iso.org/standard/54533.html)

---

## ¿Necesitas ayuda?

1. Revisa la documentación incluida
2. Verifica la consola de errores
3. Asegúrate de tener todas las dependencias instaladas
4. Prueba en un dispositivo real con Expo Go

---

## Demo rápida (1 minuto)

```
1. Login → admin/admin123
2. Dashboard → Ver métricas
3. Controles ISO 27002 → Ver 114 controles
4. Gestionar un control → Cambiar estado a "Implementado"
5. Volver al Dashboard → Ver que el % de cumplimiento aumentó
6. Activos → Agregar un activo
7. Riesgos → Crear un riesgo con Impacto=5, Probabilidad=5 (riesgo crítico)
8. ¡Listo! Ya conoces la app 🎉
```

---

**¡Disfruta usando SGSI ISO 27002 App!** 🛡️

Si encuentras algún problema o tienes sugerencias, consulta la documentación o contacta al equipo de desarrollo.
