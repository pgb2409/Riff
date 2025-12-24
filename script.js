let audioPlayer = new Audio();
let currentMeasure = 1;
let offset = 0;
let bpm = 120;

// === Cargar PDF ===
document.getElementById('scoreFile').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file || file.type !== 'application/pdf') return;

  const url = URL.createObjectURL(file);
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';

  const container = document.getElementById('scoreContainer');
  container.innerHTML = '';
  container.appendChild(iframe);

  // Ajustar overlay
  const overlay = document.getElementById('measureHighlightOverlay');
  const rect = container.getBoundingClientRect();
  overlay.style.width = rect.width + 'px';
  overlay.style.height = rect.height + 'px';
  overlay.style.left = rect.left + 'px';
  overlay.style.top = rect.top + 'px';
});

// === Cargar audio ===
document.getElementById('audioFile').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  audioPlayer.src = URL.createObjectURL(file);
  document.getElementById('audioControls').style.display = 'block';
});

// === Reproducción ===
document.getElementById('playPause').addEventListener('click', () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    document.getElementById('playPause').textContent = '❚❚ Pausa';
  } else {
    audioPlayer.pause();
    document.getElementById('playPause').textContent = '▶ Reproducir';
  }
});

// === Sincronización en tiempo real ===
audioPlayer.addEventListener('timeupdate', () => {
  const time = audioPlayer.currentTime - offset;
  currentMeasure = time < 0 ? 1 : Math.floor((time * bpm) / 60 / 4) + 1;
  document.getElementById('currentMeasure').textContent = `Compás: ${currentMeasure}`;
  highlightMeasure(currentMeasure);
});

// === Resaltado por compás (asume 4x3 compases) ===
function highlightMeasure(measureIndex) {
  const overlay = document.getElementById('measureHighlightOverlay');
  overlay.innerHTML = '';

  if (measureIndex < 1 || measureIndex > 12) return;

  const cols = 4;
  const rows = 3;
  const col = (measureIndex - 1) % cols;
  const row = Math.floor((measureIndex - 1) / cols);

  const w = overlay.offsetWidth / cols;
  const h = overlay.offsetHeight / rows;

  const div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.left = col * w + 'px';
  div.style.top = row * h + 'px';
  div.style.width = w + 'px';
  div.style.height = h + 'px';
  div.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
  div.style.border = '2px solid gold';
  div.style.boxSizing = 'border-box';

  overlay.appendChild(div);
}

// === Ajuste fino de sincronización ===
document.getElementById('adjustPlus').addEventListener('click', () => {
  offset += 0.2;
  document.getElementById('offsetInput').value = offset.toFixed(1);
});
document.getElementById('adjustMinus').addEventListener('click', () => {
  offset -= 0.2;
  document.getElementById('offsetInput').value = offset.toFixed(1);
});

// === Saltos en compases ===
document.getElementById('prev2').addEventListener('click', () => jumpMeasures(-2));
document.getElementById('prev1').addEventListener('click', () => jumpMeasures(-1));
document.getElementById('next1').addEventListener('click', () => jumpMeasures(1));
document.getElementById('next2').addEventListener('click', () => jumpMeasures(2));

function jumpMeasures(delta) {
  const newMeasure = Math.max(1, currentMeasure + delta);
  const newTime = ((newMeasure - 1) * 4 * 60) / bpm + offset;
  audioPlayer.currentTime = Math.max(0, newTime);
}
