# Assets Directory

Este directorio debe contener los recursos visuales de la aplicación.

## Archivos Requeridos (Opcional)

### icon.png
- **Tamaño:** 1024x1024 px
- **Formato:** PNG con transparencia
- **Descripción:** Icono de la aplicación que aparece en el launcher
- **Recomendación:** Logo del SGSI o escudo de seguridad

### splash.png
- **Tamaño:** 1242x2436 px (o similar)
- **Formato:** PNG
- **Descripción:** Pantalla de carga inicial
- **Recomendación:** Logo centrado sobre fondo #1E3A8A (azul)

### favicon.png
- **Tamaño:** 48x48 px
- **Formato:** PNG
- **Descripción:** Favicon para versión web

## Configuración Actual

La aplicación está configurada para funcionar **sin estos archivos**. 

- Si no tienes los assets, la app usará los valores por defecto de Expo
- El color de splash está configurado en azul (#1E3A8A)
- El icono y splash son opcionales para desarrollo

## Cómo Agregar Assets

1. Crea tus imágenes según las especificaciones arriba
2. Colócalas en esta carpeta `/assets`
3. Descomenta la línea en `app.json`:
   ```json
   "splash": {
     "image": "./assets/splash.png",  // <-- Descomentar
     "resizeMode": "contain",
     "backgroundColor": "#1E3A8A"
   }
   ```
4. Reinicia Expo: `npx expo start --clear`

## Herramientas para Crear Assets

- **Figma** (diseño): https://figma.com
- **Canva** (fácil): https://canva.com
- **GIMP** (gratis): https://gimp.org
- **Generadores online:**
  - https://www.appicon.co/ (genera todos los tamaños)
  - https://hotpot.ai/icon-resizer

## Ejemplo Rápido

Para testing, puedes usar colores sólidos:
```bash
# Crear imagen simple con ImageMagick (si lo tienes instalado)
convert -size 1024x1024 xc:#1E3A8A icon.png
convert -size 1242x2436 xc:#1E3A8A splash.png
```

---

**Nota:** La aplicación funciona perfectamente sin estos archivos durante el desarrollo.
