// Generatory ikon SVG kości oraz pomocnicze funkcje renderowania wyników słownych.

const fuMap = {
  6: { main: 'Tak, i...', sub: '6' }, 5: { main: 'Tak', sub: '5' }, 4: { main: 'Tak, ale...', sub: '4' },
  3: { main: 'Nie, ale...', sub: '3' }, 2: { main: 'Nie', sub: '2' }, 1: { main: 'Nie, i...', sub: '1' }
};

function generateK4Svg(text, baseColor, textColor) {
  return `<svg viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg"><polygon points="50,8 5,95 95,95" fill="${baseColor}" style="filter: drop-shadow(0 3px 1.5px rgba(0,0,0,0.4));"/><text x="50" y="66" fill="${textColor}" font-size="38" font-weight="900" font-family="'Segoe UI', sans-serif" text-anchor="middle" dominant-baseline="central">${text}</text></svg>`;
}

function generateK6Svg(text, baseColor, textColor) {
  return `<svg viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="15" width="80" height="80" fill="${baseColor}" style="filter: drop-shadow(0 3px 1.5px rgba(0,0,0,0.4));"/><text x="50" y="55" fill="${textColor}" font-size="42" font-weight="900" font-family="'Segoe UI', sans-serif" text-anchor="middle" dominant-baseline="central">${text}</text></svg>`;
}

function generateK6DotsSvg(num, baseColor, textColor) {
  const val = parseInt(num, 10);
  let dots = [];
  if (!isNaN(val)) {
    if (val === 1 || val === 3 || val === 5) dots.push([50, 55]);
    if (val >= 2) { dots.push([30, 35]); dots.push([70, 75]); }
    if (val >= 4) { dots.push([70, 35]); dots.push([30, 75]); }
    if (val === 6) { dots.push([30, 55]); dots.push([70, 55]); }
  } else {
    dots = [[30, 35], [70, 35], [30, 55], [70, 55], [30, 75], [70, 75]];
  }
  const dotsSvg = dots.map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="8" fill="${textColor}"/>`).join('');
  return `<svg viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="15" width="80" height="80" rx="8" fill="${baseColor}" style="filter: drop-shadow(0 3px 1.5px rgba(0,0,0,0.4));"/>${dotsSvg}</svg>`;
}

function generateFudgeSvg(text, baseColor, textColor) {
  let symbolSvg = '';
  if (text === '+') symbolSvg = `<path d="M 50 30 V 80 M 25 55 H 75" stroke="${textColor}" stroke-width="12" stroke-linecap="round"/>`;
  else if (text === '-' || text === '−') symbolSvg = `<path d="M 25 55 H 75" stroke="${textColor}" stroke-width="12" stroke-linecap="round"/>`;
  else if (text && text !== ' ' && text !== '0') symbolSvg = `<text x="50" y="53" fill="${textColor}" font-size="36" font-weight="900" font-family="'Segoe UI', sans-serif" text-anchor="middle" dominant-baseline="central">${text}</text>`;
  return `<svg viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="15" width="80" height="80" rx="8" fill="${baseColor}" style="filter: drop-shadow(0 3px 1.5px rgba(0,0,0,0.4));"/>${symbolSvg}</svg>`;
}

function generateFuSvg(num, baseColor, textColor) {
  const val = parseInt(num, 10);
  let contentSvg = `<text x="50" y="55" fill="${textColor}" font-size="34" font-weight="900" font-family="'Segoe UI', sans-serif" text-anchor="middle" dominant-baseline="central">FU</text>`;
  if (!isNaN(val) && fuMap[val]) {
    const parts = fuMap[val].main.split(', ');
    if (parts.length === 2) {
      contentSvg = `<text x="50" y="41" fill="${textColor}" font-size="22" font-weight="900" font-family="'Segoe UI', sans-serif" text-anchor="middle" dominant-baseline="central">${parts[0]},</text><text x="50" y="67" fill="${textColor}" font-size="22" font-weight="900" font-family="'Segoe UI', sans-serif" text-anchor="middle" dominant-baseline="central">${parts[1]}</text>`;
    } else {
      contentSvg = `<text x="50" y="55" fill="${textColor}" font-size="26" font-weight="900" font-family="'Segoe UI', sans-serif" text-anchor="middle" dominant-baseline="central">${fuMap[val].main}</text>`;
    }
  }
  return `<svg viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="15" width="80" height="80" rx="10" fill="${baseColor}" style="filter: drop-shadow(0 3px 1.5px rgba(0,0,0,0.4));"/>${contentSvg}</svg>`;
}

function generateEarthdawnSvg(text, baseColor, textColor) {
  let symbolSvg = '';
  if (text === '+') {
    symbolSvg = `<path d="M 50 30 V 80 M 25 55 H 75" stroke="${textColor}" stroke-width="12" stroke-linecap="round"/>`;
  } else if (text === '−' || text === '-') {
    symbolSvg = `<path d="M 25 55 H 75" stroke="${textColor}" stroke-width="12" stroke-linecap="round"/>`;
  } else if (text !== ' ' && text !== '') {
    symbolSvg = `<text x="50" y="55" fill="${textColor}" font-size="32" font-weight="900" font-family="'Segoe UI', sans-serif" text-anchor="middle" dominant-baseline="central">${text}</text>`;
  }
  return `<svg viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="15" width="80" height="80" rx="12" fill="${baseColor}" style="filter: drop-shadow(0 3px 1.5px rgba(0,0,0,0.4));"/>${symbolSvg}</svg>`;
}

function generateK8Svg(text, baseColor, textColor) {
  return `<svg viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 3px 1.5px rgba(0,0,0,0.4));"><polygon points="50,5 6,30 6,85 50,60" fill="${baseColor}" filter="brightness(0.65)"/><polygon points="50,5 94,30 94,85 50,60" fill="${baseColor}" filter="brightness(0.5)"/><polygon points="6,85 94,85 50,110" fill="${baseColor}" filter="brightness(0.35)"/><polygon points="50,5 6,85 94,85" fill="${baseColor}"/><text x="50" y="58" fill="${textColor}" font-size="38" font-weight="900" font-family="'Segoe UI', sans-serif" text-anchor="middle" dominant-baseline="central">${text}</text></svg>`;
}

function generateK10Svg(text, baseColor, textColor) {
  return `<svg viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 3px 1.5px rgba(0,0,0,0.4));"><polygon points="50,0 100,40 100,70 75,70" fill="${baseColor}" filter="brightness(0.70)"/><polygon points="50,0 25,70 0,70 0,40" fill="${baseColor}" filter="brightness(0.65)"/><polygon points="50,75 75,70 100,70 50,110" fill="${baseColor}" filter="brightness(0.25)"/><polygon points="50,110 0,70 25,70 50,75" fill="${baseColor}" filter="brightness(0.35)"/><polygon points="50,0 80,70 50,85 20,70" fill="${baseColor}"/><text x="50" y="50" fill="${textColor}" font-size="34" font-weight="900" font-family="'Segoe UI', sans-serif" text-anchor="middle" dominant-baseline="central">${text}</text></svg>`;
}

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function generateWordIconSvg(text, baseColor, textColor) {
  const fontSize = text.length > 2 ? 20 : 26;
  return `<svg viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="15" width="80" height="80" rx="14" fill="${baseColor}" style="filter: drop-shadow(0 3px 1.5px rgba(0,0,0,0.4));"/><text x="50" y="58" fill="${textColor}" font-size="${fontSize}" font-weight="900" font-family="'Segoe UI', sans-serif" text-anchor="middle" dominant-baseline="central">${text}</text></svg>`;
}

function generateWordResultHtml(typeLabel, main, alt, textColor) {
  const altColor = (textColor === '#ffffff') ? 'rgba(255,255,255,0.72)' : 'rgba(26,26,42,0.68)';
  const typeColor = (textColor === '#ffffff') ? 'rgba(255,255,255,0.65)' : 'rgba(26,26,42,0.6)';
  return `<span class="word-die-type" style="color:${typeColor};">${escapeHtml(typeLabel)}</span><span class="word-die-main" style="color:${textColor};">${escapeHtml(main)}</span><span class="word-die-alt" style="color:${altColor};">— ${escapeHtml(alt)}</span>`;
}
