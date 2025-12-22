// Elementos
const audioFileInput = document.getElementById('audioFile');
const audioPlayer = document.getElementById('audioPlayer');
const scoreFileInput = document.getElementById('scoreFile');
const scoreContainer = document.getElementById('scoreContainer');
const offsetInput = document.getElementById('offsetInput');
const applyOffsetBtn = document.getElementById('applyOffset');
const offsetStatus = document.getElementById('offsetStatus');

let currentOffset = 0; // en segundos

// Manejo de audio
audioFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    audioPlayer.src = url;
  }
});

// Manejo de partitura
scoreFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  scoreContainer.innerHTML = ''; // limpiar anterior

  const url = URL.createObjectURL(file);

  if (file.type === 'application/pdf') {
    // Soporte básico para PDF usando iframe (solo si el navegador lo permite)
    const embed = document.createElement('embed');
    embed.src = url;
    embed.type = 'application/pdf';
    embed.width = '100%';
    embed.height = '600px';
    scoreContainer.appendChild(embed);
  } else if (file.type.startsWith('image/')) {
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Partitura';
    scoreContainer.appendChild(img);
  } else {
    scoreContainer.innerHTML = '<p>Formato no soportado. Usa PDF, JPG o PNG.</p>';
  }
});

// Offset: solo informacional en MVP (no altera reproducción real)
applyOffsetBtn.addEventListener('click', () => {
  const value = parseFloat(offsetInput.value);
  if (!isNaN(value)) {
    currentOffset = value;
    offsetStatus.textContent = `Desfase actual: ${currentOffset}s`;
    alert(`Offset de ${currentOffset}s aplicado. (Nota: sincronización visual solo en futuras versiones)`);
  }
});
