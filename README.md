# Music Student MVP – Etapa 1 + Etapa 2

App para estudiantes de música, 100% offline, sin backend, lista para GitHub Pages.

## ✅ Etapa 1
- Subir audio (MP3/MP4)
- Subir partitura (PDF, JPG, PNG)
- Reproducción con controles básicos
- Visualización de PDF con **PDF.js** (confiable, offline)
- Botón **“La primera nota entra aquí”** → ajusta offset automáticamente
- Guardado automático del offset por nombre de archivo en `localStorage`

## ✅ Etapa 2: Sincronización rítmica básica
- Campo para ingresar **BPM**
- Cálculo automático de duración de compás: `60 / BPM`
- Indicador fijo de **compás actual** en la esquina superior derecha
- **Resaltado visual del compás actual** usando una capa transparente sobre la partitura
  - Asume partitura con compases alineados en renglones fijos (ej. fotocopias)
  - Layout predeterminado: 4 compases por renglón, 3 renglones visibles
- Modo **“seguir siempre”**: la sincronización continúa incluso si el alumno no interactúa

## 🛠️ Cómo usar
1. Descarga la última versión de [PDF.js](https://github.com/mozilla/pdf.js/releases)
2. Extrae `pdf.min.js` y `pdf.worker.min.js` → colócalos en la carpeta `pdfjs/`
3. Abre `index.html` en tu navegador
4. ¡Listo! Funciona sin conexión.

> ✨ Totalmente gratuito, sin frameworks, sin cuenta, sin internet.

Hecho con ❤️ para estudiantes de música.
