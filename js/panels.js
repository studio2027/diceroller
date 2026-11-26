// Tacki z wynikami rzutów: tworzenie, rzut, przerzut, aktywna tacka.

let activePanelId = null;
let panelCounter = 0;
const panelsContainer = document.getElementById('panelsContainer');

function createPanel() {
  panelCounter++;
  const id = panelCounter;
  const panelEl = document.createElement('div');
  panelEl.className = 'panel';
  panelEl.id = `panel-${id}`;
  panelEl.innerHTML = `
    <div class="panel-header">
      <span class="panel-label">📋 <span class="panel-title-text" id="panelTitle-${id}">tacka ${id}</span> <span class="badge">nieaktywny</span></span>
      <div class="panel-actions">
        <button class="reroll-panel" data-panel="${id}">🔄 przerzuć</button>
        <button class="clear-panel" data-panel="${id}">🧹 czyść</button>
        <button class="remove-panel" data-panel="${id}">✕</button>
      </div>
    </div>
    <div class="panel-output" id="panelOutput-${id}"><span class="panel-placeholder">⚡ wyniki rzutów</span></div>
  `;
  panelsContainer.appendChild(panelEl);
  enableDragReorder(panelEl.querySelector('.panel-output'), '.roll-chip', null);

  const titleSpan = panelEl.querySelector(`#panelTitle-${id}`);
  titleSpan.addEventListener('click', function(e) {
    e.stopPropagation();
    const currentText = titleSpan.textContent;
    const input = document.createElement('input');
    input.type = 'text'; input.className = 'panel-title-input'; input.value = currentText;
    titleSpan.replaceWith(input);
    input.focus(); input.select();
    const saveTitle = () => { titleSpan.textContent = input.value.trim() || currentText; input.replaceWith(titleSpan); };
    input.addEventListener('blur', saveTitle);
    input.addEventListener('keydown', evt => { if (evt.key === 'Enter') saveTitle(); });
  });

  panelEl.addEventListener('click', () => setActive(id));
  panelEl.querySelector('.clear-panel').addEventListener('click', e => {
    e.stopPropagation(); setPaintColor(null); setActive(id);
    panelEl.querySelector('.panel-output').innerHTML = `<span class="panel-placeholder">⚡ wyniki rzutów</span>`;
  });
  panelEl.querySelector('.reroll-panel').addEventListener('click', e => {
    e.stopPropagation(); setPaintColor(null); setActive(id);
    const output = panelEl.querySelector('.panel-output');
    const chips = output.querySelectorAll('.roll-chip');
    if (chips.length === 0) return;
    const diceData = [...chips].map(chip => ({
      sides: chip.getAttribute('data-dice'),
      min: chip.hasAttribute('data-min') ? Number(chip.getAttribute('data-min')) : undefined,
      max: chip.hasAttribute('data-max') ? Number(chip.getAttribute('data-max')) : undefined,
      pad: chip.hasAttribute('data-pad') ? Number(chip.getAttribute('data-pad')) : undefined,
      color: getColor(chip)
    }));
    output.innerHTML = '';
    diceData.forEach(item => addRollResult(output, item, diceRegistry[item.sides]?.roll(item) || rollInt(6), item.color, id));
  });
  panelEl.querySelector('.remove-panel').addEventListener('click', e => {
    e.stopPropagation(); setPaintColor(null);
    panelEl.remove();
    const remainingPanels = panelsContainer.querySelectorAll('.panel');
    remainingPanels.forEach(p => p.querySelector('.remove-panel').style.display = remainingPanels.length > 1 ? 'inline-block' : 'none');
    if (activePanelId === id) setActive(remainingPanels.length > 0 ? parseInt(remainingPanels[0].id.replace('panel-', ''), 10) : null);
  });

  const allPanels = panelsContainer.querySelectorAll('.panel');
  allPanels.forEach(p => p.querySelector('.remove-panel').style.display = allPanels.length > 1 ? 'inline-block' : 'none');
  setActive(id);
}

function addRollResult(panelOutputEl, item, roll, color, panelId) {
  const placeholder = panelOutputEl.querySelector('.panel-placeholder');
  if (placeholder) placeholder.remove();

  const config = diceRegistry[item.sides];
  const isWordDie = config && config.type === 'word';

  const chip = document.createElement('div');
  chip.className = 'roll-chip drag-reorder';
  chip.draggable = true;
  chip.setAttribute('data-dice', item.sides);
  
  if (config && (config.type === 'svg' || config.type === 'word')) {
    chip.classList.add('dice-type-' + config.type);
  }

  if (isWordDie) {
    chip.setAttribute('data-word-main', roll.main);
    chip.setAttribute('data-word-alt', roll.alternative);
    chip.setAttribute('data-word-type', roll.type);
  } else {
    chip.setAttribute('data-value', roll);
  }

  if (item.min !== undefined) chip.setAttribute('data-min', item.min);
  if (item.max !== undefined) chip.setAttribute('data-max', item.max);
  if (item.pad !== undefined) chip.setAttribute('data-pad', item.pad);

  if (config && (config.type === 'standard' || config.type === 'range')) {
    const label = document.createElement('span');
    label.className = 'dice-label';
    label.textContent = item.label || config.label || (item.sides === 'range' ? `${item.min}-${item.max}` : `k${item.sides}`);
    const value = document.createElement('span');
    value.className = 'dice-value';
    value.textContent = roll;
    chip.appendChild(label);
    chip.appendChild(value);
  }

  panelOutputEl.appendChild(chip);
  setColor(chip, color || config?.color || '#3d3d5c');
  triggerDiceAnimation(chip);

  chip.addEventListener('click', function(e) {
    e.stopPropagation();
    if (activePaintColor) { setColor(this, activePaintColor); }
    else {
      setActive(panelId); this.remove();
      if (panelOutputEl.children.length === 0) panelOutputEl.innerHTML = `<span class="panel-placeholder">⚡ wyniki rzutów</span>`;
    }
  });
}

function rollToActive(item, sourceBtn) {
  if (!activePanelId) return;
  const targetPanel = document.getElementById(`panel-${activePanelId}`);
  if (!targetPanel) return;
  const config = diceRegistry[item.sides];
  const roll = config?.roll ? config.roll(item) : rollInt(6);
  addRollResult(targetPanel.querySelector('.panel-output'), item, roll, sourceBtn ? getColor(sourceBtn) : (config?.color || '#3d3d5c'), activePanelId);
}

function setActive(panelId) {
  activePanelId = panelId;
  panelsContainer.querySelectorAll('.panel').forEach(p => {
    const isActive = parseInt(p.id.replace('panel-', ''), 10) === panelId;
    p.classList.toggle('active-panel', isActive);
    const badge = p.querySelector('.panel-header .badge');
    if (badge) { badge.textContent = isActive ? 'aktywny' : 'nieaktywny'; badge.style.color = isActive ? '#d0d0f0' : '#6a6a8a'; }
  });
}
