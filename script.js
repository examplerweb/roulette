// script.js – Ruleta con opciones y segmentos (simplificado)

// Cuando se pulsa el botón "Girar" se construye la ruleta a partir del textarea y se anima el giro.
function spinAndBuild() {
  const optionsText = document.getElementById('options').value.trim();
  const options = optionsText.split('\n').filter(line => line.trim() !== '');
  if (options.length === 0) {
    alert('Enter at least one option in the text box.');
    return;
  }

  const wheel = document.getElementById('wheel');
  const colors = ['#0ff', '#f0f', '#ff0']; // cyan, magenta, yellow
  const segmentSize = 360 / options.length;

  // Gradiente neon por segmento
  const gradientParts = options.map((_, i) => {
    const start = i * segmentSize;
    const end = start + segmentSize;
    const color = colors[i % colors.length];
    return `${color} ${start}deg ${end}deg`;
  });
  wheel.style.background = `conic-gradient(${gradientParts.join(', ')})`;

  // Crear etiquetas de segmento
  wheel.innerHTML = '';
  options.forEach((opt, i) => {
    const angle = i * segmentSize + segmentSize / 2; // centro del segmento
    const span = document.createElement('span');
    span.className = 'segment-label';
    span.textContent = opt;
    span.style.position = 'absolute';
    // Posicionar la etiqueta en la periferia y contrarrotar para lectura
    span.style.transform = `rotate(${angle}deg) translate(0, -150px) rotate(-${angle}deg)`;
    wheel.appendChild(span);
  });

  // Guardar datos necesarios para determinar el ganador después del giro
  wheel.dataset.segmentSize = segmentSize;
  wheel.dataset.options = JSON.stringify(options);

  // Animar el giro acumulativo
  const extraSpins = 5; // vueltas completas
  const randomDeg = Math.floor(Math.random() * 360);
  const currentDeg = parseFloat(wheel.dataset.currentDeg || '0');
  const totalDeg = currentDeg + (extraSpins * 360) + randomDeg;
  wheel.dataset.currentDeg = totalDeg;
  wheel.style.transform = `rotate(${totalDeg}deg)`;

  // reset result display
  const resultDiv = document.getElementById('result');
  resultDiv.textContent = '';
  resultDiv.classList.remove('show');

  // Mostrar ganador tras la animación (4 s)
  setTimeout(() => {
    const pointerAngle = (360 - (randomDeg % 360)) % 360;
    const winningIndex = Math.floor(pointerAngle / segmentSize) % options.length;
    // Quitar resaltado anterior
    const allLabels = wheel.querySelectorAll('.segment-label');
    allLabels.forEach(l => l.classList.remove('winner'));
    // Resaltar ganador
    const winningLabel = allLabels[winningIndex];
    if (winningLabel) winningLabel.classList.add('winner');
    resultDiv.textContent = `The winner is: ${options[winningIndex]}!`;
    resultDiv.classList.add('show');
  }, 4000);
}

document.getElementById('spinBtn').addEventListener('click', spinAndBuild);
