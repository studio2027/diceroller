// Paleta kolorów i tryb malowania (kursor, wybór koloru) + narzędzia kolorów.

const defaultColors = ['#ffffff', '#1a1a1a', '#cc3333', '#3366cc', '#33aa55', '#ccbb33', '#8844aa', '#dd7733', '#8b6b4a', '#888899', '#ff6699', '#2e8b57', '#b22222', '#1d4ed8'];

let activePaintColor = null;
const paintCursorIndicator = document.getElementById('paintCursorIndicator');

document.addEventListener('mousemove', function(e) {
  if (activePaintColor) {
    paintCursorIndicator.style.left = e.clientX + 'px';
    paintCursorIndicator.style.top = e.clientY + 'px';
  }
});

function setPaintColor(color) {
  activePaintColor = color;
  if (color) {
    document.body.classList.add('paint-mode');
    paintCursorIndicator.style.backgroundColor = color;
  } else {
    document.body.classList.remove('paint-mode');
  }
}

function initPalette() {
  const colorGrid = document.getElementById('colorGrid');
  const palettePopover = document.getElementById('palettePopover');
  colorGrid.innerHTML = '';
  
  defaultColors.forEach(color => {
    const swatch = document.createElement('div');
    swatch.className = 'color-swatch';
    swatch.style.backgroundColor = color;
    swatch.addEventListener('click', function(e) {
      e.stopPropagation();
      setPaintColor(color);
      palettePopover.classList.remove('open');
    });
    colorGrid.appendChild(swatch);
  });

  const customSwatch = document.createElement('div');
  customSwatch.className = 'color-swatch custom-color-swatch';
  customSwatch.title = 'Wybierz własny kolor';
  const colorInput = document.createElement('input');
  colorInput.type = 'color';
  colorInput.value = '#ff0055';
  colorInput.addEventListener('input', e => setPaintColor(e.target.value));
  colorInput.addEventListener('change', e => {
    setPaintColor(e.target.value);
    palettePopover.classList.remove('open');
  });
  customSwatch.appendChild(colorInput);
  colorGrid.appendChild(customSwatch);

  document.getElementById('paletteBtn').addEventListener('click', function(e) {
    e.stopPropagation();
    palettePopover.classList.toggle('open');
  });

  document.addEventListener('click', function() {
    palettePopover.classList.remove('open');
    if (activePaintColor) setPaintColor(null);
  });
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)] : null;
}

function getBrightness(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 128;
  return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
}
