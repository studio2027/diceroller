// Rejestr kości: definicje, szablony kreatora, domyślna pula i style kształtów.

function rollInt(max) { return String(Math.floor(Math.random() * max) + 1); }
function rollWord(table, explicitType = null) {
  const picked = table[Math.floor(Math.random() * table.length)];
  return { main: picked.main, alternative: picked.alternative, type: explicitType };
}

// --- CENTRAL REGISTRY ---
const diceRegistry = {
  '3': {
    label: 'k3', color: '#8844aa', type: 'standard', roll: () => rollInt(3), styleBtn: 'border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; padding: 17px 22px; transform: rotate(-5deg);', styleChip: 'border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; padding: 10px 16px; transform: rotate(-5deg);'
  },
  '4': {
    label: 'k4', color: '#33aa55', type: 'svg', defaultSvgText: 'k4', roll: () => rollInt(4), renderSvg: generateK4Svg },
  '5': {
    label: 'k5', color: '#dd7733', type: 'standard', roll: () => rollInt(5), styleBtn: 'border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%; padding: 17px 22px; transform: rotate(5deg);', styleChip: 'border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%; padding: 10px 16px; transform: rotate(5deg);'
  },
  '6': {
    label: 'k6', color: '#3366cc', type: 'svg', defaultSvgText: 'k6', roll: () => rollInt(6), renderSvg: generateK6Svg
  },
  '6dots': {
    label: '', color: '#ffffff', type: 'svg', defaultSvgText: '', roll: () => rollInt(6), renderSvg: generateK6DotsSvg
  },
  'fudge': {
    label: '', color: '#ffffff', type: 'svg', defaultSvgText: 'F±', roll: () => ['-', ' ', '+'][Math.floor(Math.random() * 3)], renderSvg: generateFudgeSvg
  },
  'fudge-weak': {
    label: '', color: '#aaaaaa', type: 'svg', defaultSvgText: '1/6±', roll: () => ['-', ' ', ' ', ' ', ' ', '+'][Math.floor(Math.random() * 6)], renderSvg: generateFudgeSvg
  },
  'ed_bonus_1_6':   {
    label: '', color: '#057669', type: 'svg', defaultSvgText: '1/6+', roll: () => rollInt(6) <= 1 ? '+' : ' ', renderSvg: generateEarthdawnSvg
  },
  'ed_penalty_1_6': {
    label: '', color: '#c11d48', type: 'svg', defaultSvgText: '1/6-', roll: () => rollInt(6) <= 1 ? '−' : ' ', renderSvg: generateEarthdawnSvg
  },

  'fu': {
    label: '', color: '#1d4ed8', type: 'svg', defaultSvgText: 'FU', roll: () => rollInt(6), renderSvg: generateFuSvg
  },
  'ed_bonus': {
    label: '', color: '#2e8b57', type: 'svg', defaultSvgText: '1/3+', roll: () => rollInt(6) <= 2 ? '+' : ' ', renderSvg: generateEarthdawnSvg
  },
  'ed_penalty': {
    label: '', color: '#b22222', type: 'svg', defaultSvgText: '1/3-', roll: () => rollInt(6) <= 2 ? '−' : ' ', renderSvg: generateEarthdawnSvg
  },
  'ed_bonus_half': {
    label: '', color: '#10b981', type: 'svg', defaultSvgText: '1/2+', roll: () => rollInt(6) <= 3 ? '+' : ' ', renderSvg: generateEarthdawnSvg
  },
  'ed_penalty_half': {
    label: '', color: '#f43f5e', type: 'svg', defaultSvgText: '1/2-', roll: () => rollInt(6) <= 3 ? '−' : ' ', renderSvg: generateEarthdawnSvg
  },
  'ed_bonus_2_3': {
    label: '', color: '#059669', type: 'svg', defaultSvgText: '2/3+', roll: () => rollInt(6) <= 4 ? '+' : ' ', renderSvg: generateEarthdawnSvg
  },
  'ed_penalty_2_3': {
    label: '', color: '#e11d48', type: 'svg', defaultSvgText: '2/3-', roll: () => rollInt(6) <= 4 ? '−' : ' ', renderSvg: generateEarthdawnSvg
  },
  '7': { label: 'k7', color: '#8b6b4a', type: 'standard', roll: () => rollInt(7), styleBtn: 'border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%; padding: 17px 22px; transform: rotate(-3deg);', styleChip: 'border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%; padding: 10px 16px; transform: rotate(-3deg);' },
  '8': { label: 'k8', color: '#8844aa', type: 'svg', defaultSvgText: 'k8', roll: () => rollInt(8), renderSvg: generateK8Svg },
  '10': { label: 'k10', color: '#dd7733', type: 'svg', defaultSvgText: 'k10', roll: () => rollInt(10), renderSvg: generateK10Svg },
  '12': { label: 'k12', color: '#8844aa', type: 'standard', roll: () => rollInt(12), styleBtn: 'clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%); border-radius: 0; padding: 17px 14px;', styleChip: 'clip-path:       polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%); border-radius: 0; padding: 8px 6px; min-width: 48px; min-height: 48px;' },
  '16': { label: 'k16', color: '#33aa55', type: 'standard', roll: () => rollInt(16), styleBtn: 'border-radius: 50% 50% 50% 50% / 70% 70% 30% 30%; padding: 17px 22px; transform: rotate(3deg);', styleChip: 'border-radius: 50% 50% 50% 50% / 70% 70% 30% 30%; padding: 8px 14px; transform: rotate(3deg);' },
  '20': { label: 'k20', color: '#cc3333', type: 'standard', roll: () => rollInt(20), styleBtn: 'clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%); border-radius: 0; padding: 17px 14px;', styleChip: 'clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%); border-radius: 0; padding: 8px 6px; min-width: 48px; min-height: 48px;' },
  '100': { label: 'k100', color: '#3366cc', type: 'standard', roll: () => rollInt(100), styleBtn: 'border-radius: 50% 50% 50% 50% / 60% 40% 60% 40%; padding: 17px 22px;', styleChip: 'border-radius: 50% 50% 50% 50% / 60% 40% 60% 40%; padding: 8px 14px;' },
  '1000': { label: 'k1000', color: '#8b6b4a', type: 'standard', roll: () => rollInt(1000), styleBtn: 'border-radius: 50% 50% 50% 50% / 40% 60% 40% 60%; padding: 17px 22px;', styleChip: 'border-radius: 50% 50% 50% 50% / 40% 60% 40% 60%; padding: 8px 14px;' },
  'range': { label: '0-9', color: '#dd7733', type: 'range', styleBtn: 'border-radius: 16px; padding: 15px 20px;', styleChip: 'border-radius: 12px; padding: 6px 10px;', roll: (item) => { const min = item.min ?? 0; const max = item.max ?? 9; const val = Math.floor(Math.random() * (max - min + 1)) + min; return (item.pad && item.pad > 1) ? String(val).padStart(item.pad, '0') : String(val); } },
  'noun': { label: '', color: '#3d8b6b', type: 'word', iconText: 'RZ', wordTypeLabel: 'Rzeczownik', roll: () => rollWord(nouns, 'noun') },
  'verb': { label: '', color: '#c2632f', type: 'word', iconText: 'CZ', wordTypeLabel: 'Czasownik', roll: () => rollWord(verbs, 'verb') },
  'abstract': { label: '', color: '#7a4fae', type: 'word', iconText: 'AB', wordTypeLabel: 'Abstrakt', roll: () => rollWord(abstracts, 'abstract') },
  'consequence': { label: '', color: '#b91c1c', type: 'word', iconText: 'KN', wordTypeLabel: 'Konsekwencja', roll: () => rollWord(consequences, 'consequence') },
  'anyword': { label: '', color: '#4a4a70', type: 'word', iconText: 'MIX', wordTypeLabel: '', roll: () => {
  const types = ['noun', 'verb', 'abstract',];
  const type = types[Math.floor(Math.random() * types.length)];
  return diceRegistry[type].roll();
  }}
};

const initialCreatorTemplates = [
  { sides: '3' }, { sides: '4' }, { sides: '5' }, { sides: '6' }, { sides: '6dots' },
  { sides: 'fudge' }, { sides: 'fu' },
  
  { sides: 'fudge-weak' },
  { sides: 'ed_bonus_1_6' }, { sides: 'ed_penalty_1_6' },
  { sides: 'ed_bonus' }, { sides: 'ed_penalty' },
  { sides: 'ed_bonus_half' }, { sides: 'ed_penalty_half' },
  { sides: 'ed_bonus_2_3' }, { sides: 'ed_penalty_2_3' },
  { sides: '7' }, { sides: '8' }, { sides: '10' }, { sides: '12' }, { sides: '16' }, { sides: '20' }, { sides: '100' }, { sides: '1000' },
  { sides: 'range', min: 0, max: 9, label: '0-9' },
  { sides: 'range', min: 0, max: 99, label: '00-99', pad: 2, color: '#3366cc' },
  { sides: 'noun' }, { sides: 'verb' }, { sides: 'abstract' }, { sides: 'consequence' }, { sides: 'anyword' }
];

const initialActivePool = [
  { sides: '3' }, { sides: '4' }, { sides: '5' }, { sides: '6' }, { sides: '6dots' },
  { sides: '8' }, { sides: '10' }, { sides: '12' }, { sides: '20' }, { sides: '100' },
  { sides: 'noun' }, { sides: 'verb' }, { sides: 'abstract' }, { sides: 'consequence' }, { sides: 'anyword' },
  { sides: 'fudge' }, { sides: 'fu' }, { sides: 'ed_bonus' }, { sides: 'ed_penalty' },
  { sides: 'ed_bonus_half' }, { sides: 'ed_penalty_half' }, { sides: 'ed_bonus_2_3' }, { sides: 'ed_penalty_2_3' }
];

function injectDiceStyles() {
  let css = '';
  for (const [id, config] of Object.entries(diceRegistry)) {
     if (config.styleBtn) css += `.dice-btn[data-dice="${id}"] { ${config.styleBtn} }\n`;
     if (config.styleChip) css += `.panel-output .roll-chip[data-dice="${id}"] { ${config.styleChip} }\n`;
  }
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
}
