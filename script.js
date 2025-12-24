// === Configuración inicial ===
let audioPlayer = new Audio();
let currentMeasure = 0;
let bpm = 120;
let offset = 0;
let loopStart = 0;
let loopEnd = 0;
let overlayCanvas = null;
let tempoMap = [120]; // soporte básico para cambios de tempo

// === Guardar/recuperar desde localStorage ===
function saveState(filename) {
  if (!filename) return;
  localStorage.setItem(`${filename}_offset`, offset);
  localStorage.setItem(`${filename}_loop`, JSON.stringify({ start: loopStart, end: loopEnd }));
}
function loadState(filename) {
  const savedOffset = localStorage.getItem(`${filename}_offset`);
  if (savedOffset !== null) offset = parseFloat(savedOffset);
  const savedLoop = localStorage.getItem(`${filename}_loop`);
  if (savedLoop) {
    const loop = JSON.parse(savedLoop);
    loopStart = loop.start;
    loopEnd = loop.end;
    document.getElementById('loopStart').value = loopStart;
    document.getElementById('loopEnd').value = loopEnd;
  }
}

// === Cálculo de compás actual ===
function calculateCurrentMeasure(time) {
  const adjustedTime = time - offset;
  if (adjustedTime < 0) return -1;
  const beats = (adjustedTime * tempoMap[0]) / 60;
  return Math.floor(beats / 4); // 4/4
}

// === Overlay anclado al contenido real (PDF o imagen) ===
function createOverlay() {
  const container = document.getElementById('scoreContainer');
  if (!container || container.children.length === 0) return null;

  if (overlayCanvas) overlayCanvas.remove();

  const contentEl = container.firstElementChild;
  const rect = contentEl.getBoundingClientRect();

  overlayCanvas = document.createElement('canvas');
  overlayCanvas.id = 'measureHighlightOverlay';
  overlayCanvas.width = rect.width;
  overlayCanvas.height = rect.height;
  overlayCanvas.style.position = 'fixed';
  overlayCanvas.style.left = rect.left + 'px';
  overlayCanvas.style.top = rect.top + 'px';
  overlayCanvas.style.pointerEvents = 'none';
  overlayCanvas.style.zIndex = '1000';

  document.body.appendChild(overlayCanvas);
  return rect;
}

function clearOverlay() {
  if (!overlayCanvas) return;
  const ctx = overlayCanvas.getContext('2d');
  ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
}

function highlightMeasure(measureIndex) {
  if (measureIndex < 0) {
    if (overlayCanvas) overlayCanvas.style.display = 'none';
    return;
  }

  const rect = createOverlay();
  if (!overlayCanvas || !rect) return;

  overlayCanvas.style.display = 'block';
  clearOverlay();

  const ctx = overlayCanvas.getContext('2d');

  // Ajuste visual: asume 4 compases por fila, 3 filas
  const cols = 4;
  const rows = 3;
  const totalMeasures = cols * rows;

  if (measureIndex >= totalMeasures) return;

  const col = measureIndex % cols;
  const row = Math.floor(measureIndex / cols);

  const w = rect.width / cols;
  const h = rect.height / rows;

  ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
  ctx.fillRect(col * w, row * h, w, h);

  ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
  ctx.lineWidth = 2;
  ctx.strokeRect(col * w, row * h, w, h);
}

// === Carga de partitura ===
document.getElementById('scoreFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const container = document.getElementById('scoreContainer');
  container.innerHTML = '';

  if (file.type === 'application/pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);
    const scale = 1.5;
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({ canvasContext: context, viewport }).promise;
    container.appendChild(canvas);
  } else {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    container.appendChild(img);
  }

  // Reiniciar overlay
  if (overlayCanvas) overlayCanvas.remove();
  overlayCanvas = null;
});

// === Carga de audio ===
document.getElementById('audioFile').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  audioPlayer.src = url;
  document.getElementById('audioControls').style.display = 'block';
  document.getElementById('liveControls').style.display = 'block';

  loadState(file.name);
  document.getElementById('offsetInput').value = offset;
});

// === Controles de audio ===
document.getElementById('playPause').addEventListener('click', () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    document.getElementById('playPause').textContent = '❚❚ Pausa';
  } else {
    audioPlayer.pause();
    document.getElementById('playPause').textContent = '▶ Reproducir';
  }
});

audioPlayer.addEventListener('timeupdate', () => {
  const currentTime = audioPlayer.currentTime;
  const duration = isNaN(audioPlayer.duration) ? 0 : audioPlayer.duration;
  document.getElementById('timeDisplay').textContent = 
    `${Math.floor(currentTime / 60)}:${String(Math.floor(currentTime % 60)).padStart(2, '0')} / 
     ${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, '0')}`;

  currentMeasure = calculateCurrentMeasure(currentTime);
  document.getElementById('currentMeasure').textContent = `Compás: ${Math.max(0, currentMeasure)}`;
  highlightMeasure(currentMeasure);

  // Loop
  if (loopEnd > 0 && currentMeasure >= loopEnd) {
    const loopTime = (loopStart * 4 * 60) / tempoMap[0] + offset;
    audioPlayer.currentTime = Math.max(0, loopTime);
  }
});

audioPlayer.addEventListener('ended', () => {
  document.getElementById('playPause').textContent = '▶ Reproducir';
});

// === Ajuste fino de offset ===
document.getElementById('adjustPlus').addEventListener('click', () => {
  offset += 0.2;
  document.getElementById('offsetInput').value = offset;
  saveState(audioPlayer.src ? 'current' : null);
});
document.getElementById('adjustMinus').addEventListener('click', () => {
  offset -= 0.2;
  document.getElementById('offsetInput').value = offset;
  saveState(audioPlayer.src ? 'current' : null);
});

// === Saltos en compases ===
document.getElementById('prev2').addEventListener('click', () => jumpMeasures(-2));
document.getElementById('prev1').addEventListener('click', () => jumpMeasures(-1));
document.getElementById('next1').addEventListener('click', () => jumpMeasures(1));
document.getElementById('next2').addEventListener('click', () => jumpMeasures(2));

function jumpMeasures(delta) {
  const newMeasure = Math.max(0, currentMeasure + delta);
  const newTime = (newMeasure * 4 * 60) / tempoMap[0] + offset;
  audioPlayer.currentTime = Math.max(0, newTime);
}

// === Loop ===
document.getElementById('saveLoop').addEventListener('click', () => {
  loopStart = parseInt(document.getElementById('loopStart').value) || 0;
  loopEnd = parseInt(document.getElementById('loopEnd').value) || 0;
  saveState(audioPlayer.src ? 'current' : null);
});

// === Limpiar overlay al hacer scroll o redimensionar ===
window.addEventListener('resize', () => {
  if (overlayCanvas) overlayCanvas.remove();
  overlayCanvas = null;
  highlightMeasure(currentMeasure);
});
