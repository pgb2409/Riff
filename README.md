# Music Student MVP – Etapa 1 + 2 + 3

App para estudiantes de música, 100% offline, sin backend, lista para GitHub Pages.

## ✅ Etapa 1
- Subir audio (MP3/MP4)
- Subir partitura (PDF, JPG, PNG)
- Reproducción con controles básicos
- PDF.js integrado
- Botón “La primera nota entra aquí”
- Guardado de offset en localStorage

## ✅ Etapa 2
- BPM y cálculo de compás
- Indicador fijo de compás actual
- Resaltado visual con overlay
- Modo “seguir siempre”

## ✅ Etapa 3: Controles en vivo + loop
- Botones **+0.2s / –0.2s** para ajuste fino del offset en tiempo real
- Saltos rápidos: **◄◄ 2, ◄ 1, 1 ►, 2 ►►** (avanza/retrocede en compases)
- **Loop por rango de compases** (ej. 5–8)
- **Guardado automático de loops** por nombre de archivo en `localStorage`

## 🛠️ Cómo usar
1. Descarga PDF.js y coloca `pdf.min.js` y `pdf.worker.min.js` en `/pdfjs/`
2. Abre `index.html`
3. ¡Listo! Todo funciona sin conexión.

Hecho con ❤️ para estudiantes de música.
