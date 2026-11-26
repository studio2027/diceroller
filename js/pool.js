// Pula kości: renderowanie kości, edytor/kreator, przeciąganie, kolorowanie.

let diceCounter = 0;
let activeDicePool = [];
const editorToggleBtn = document.getElementById('editorToggleBtn');
const diceEditorPanel = document.getElementById('diceEditorPanel');
const creatorDiceGrid = document.getElementById('creatorDiceGrid');
const editorPoolGrid = document.getElementById('editorPoolGrid');
const diceGrid = document.getElementById('diceGrid');

function triggerDiceAnimation(el) {
  if (!el) return;
  el.classList.remove('dice-animating');
  void el.offsetWidth;
  el.classList.add('dice-animating');
}

editorToggleBtn.addEventListener('click', function() {
  const isOpen = diceEditorPanel.classList.toggle('open');
  if (isOpen) {
    diceGrid.classList.add('hidden-by-editor');
  } else {
    diceGrid.classList.remove('hidden-by-editor');
  }
});

function getColor(el) { return el.dataset.diceColor || '#3d3d5c'; }

function setColor(el, color) {
  el.dataset.diceColor = color;
  const brightness = getBrightness(color);
  const textColor = brightness > 160 ? '#1a1a2a' : '#ffffff';
  const sidesAttr = el.getAttribute('data-dice');
  const config = diceRegistry[sidesAttr];
  const isChip = el.classList.contains('roll-chip');

  if (!config) return;

  if (config.type === 'svg') {
    const text = isChip ? el.getAttribute('data-value') : (config.defaultSvgText !== undefined ? config.defaultSvgText : config.label);
    el.innerHTML = config.renderSvg(text, color, textColor);
  } else if (config.type === 'word') {
    if (isChip) {
      const main = el.getAttribute('data-word-main') || '';
      const alt = el.getAttribute('data-word-alt') || '';
      const resolvedType = el.getAttribute('data-word-type') || sidesAttr;
      const typeLabel = diceRegistry[resolvedType]?.wordTypeLabel || '';
      el.style.backgroundColor = color;
      el.innerHTML = generateWordResultHtml(typeLabel, main, alt, textColor);
    } else {
      el.innerHTML = generateWordIconSvg(config.iconText, color, textColor);
    }
  } else {
    el.style.backgroundColor = color;
    el.style.color = textColor;
    const valueSpan = el.querySelector('.dice-value');
    const labelSpan = el.querySelector('.dice-label');
    if (valueSpan) valueSpan.style.color = textColor;
    if (labelSpan) labelSpan.style.color = textColor;
  }
}

function createDiceButtonDOM(item) {
  const btn = document.createElement('button');
  btn.className = 'dice-btn';
  btn.setAttribute('data-dice', item.sides);
  if (item.min !== undefined) btn.setAttribute('data-min', item.min);
  if (item.max !== undefined) btn.setAttribute('data-max', item.max);
  if (item.pad !== undefined) btn.setAttribute('data-pad', item.pad);

  const config = diceRegistry[item.sides];
  if (config && (config.type === 'svg' || config.type === 'word')) {
    btn.classList.add('dice-type-' + config.type);
  } else {
    btn.textContent = item.label || config?.label || '';
  }

  setColor(btn, item.color || config?.color || '#3d3d5c');
  return btn;
}

function addDiceToPool(template) {
  diceCounter++;
  const config = diceRegistry[template.sides];
  const finalColor = activePaintColor || template.color || config?.color || '#3d3d5c';
  activeDicePool.push({ ...template, id: `dice_${diceCounter}_${Date.now()}`, color: finalColor });
  renderPools();
}

function getDragAfterElement(container, itemSelector, x, y) {
  const items = [...container.querySelectorAll(itemSelector + ':not(.dragging)')];
  let closestEl = null, closestDist = Infinity;
  items.forEach(child => {
    const box = child.getBoundingClientRect();
    const dist = Math.hypot(x - (box.left + box.width / 2), y - (box.top + box.height / 2));
    if (dist < closestDist) { closestDist = dist; closestEl = { el: child, cx: box.left + box.width / 2 }; }
  });
  return closestEl ? (x < closestEl.cx ? closestEl.el : closestEl.el.nextElementSibling) : null;
}

function enableDragReorder(container, itemSelector, onReorder) {
  let draggedEl = null;
  container.addEventListener('dragstart', function(e) {
    const item = e.target.closest(itemSelector);
    if (!item || !container.contains(item)) return;
    draggedEl = item;
    item.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', ''); } catch (err) {}
  });
  container.addEventListener('dragover', function(e) {
    if (!draggedEl) return;
    e.preventDefault();
    const afterElement = getDragAfterElement(container, itemSelector, e.clientX, e.clientY);
    if (afterElement == null) container.appendChild(draggedEl);
    else if (afterElement !== draggedEl) container.insertBefore(draggedEl, afterElement);
  });
  container.addEventListener('drop', function(e) { if (draggedEl) e.preventDefault(); });
  container.addEventListener('dragend', function() {
    if (draggedEl) draggedEl.classList.remove('dragging');
    draggedEl = null;
    if (typeof onReorder === 'function') onReorder();
  });
}

function renderPools() {
  diceGrid.innerHTML = '';
  editorPoolGrid.innerHTML = '';
  activeDicePool.forEach(item => {
    const mainBtn = createDiceButtonDOM(item);
    mainBtn.dataset.itemId = item.id;
    mainBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      triggerDiceAnimation(mainBtn);
      if (activePaintColor) { item.color = activePaintColor; setColor(mainBtn, activePaintColor); renderPools(); return; }
      rollToActive(item, mainBtn);
    });
    diceGrid.appendChild(mainBtn);

    const poolBtn = createDiceButtonDOM(item);
    poolBtn.dataset.itemId = item.id;
    poolBtn.draggable = true;
    poolBtn.classList.add('drag-reorder');
    poolBtn.title = 'Kliknij, aby usunąć z podręcznej puli • przeciągnij, aby zmienić kolejność';
    poolBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (activePaintColor) { item.color = activePaintColor; renderPools(); return; }
      activeDicePool = activeDicePool.filter(d => d.id !== item.id);
      renderPools();
    });
    editorPoolGrid.appendChild(poolBtn);
  });
}

enableDragReorder(editorPoolGrid, '.dice-btn', () => {
  const newOrder = [...editorPoolGrid.querySelectorAll('.dice-btn')].map(el => el.dataset.itemId);
  activeDicePool.sort((a, b) => newOrder.indexOf(a.id) - newOrder.indexOf(b.id));
  renderPools();
});

function renderCreator() {
  creatorDiceGrid.innerHTML = '';
  initialCreatorTemplates.forEach(tpl => {
    const config = diceRegistry[tpl.sides];
    if (!config) return;
    const fullTemplate = { ...config, ...tpl };
    const btn = createDiceButtonDOM(fullTemplate);
    btn.title = 'Kliknij, aby dodać do podręcznej puli';
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      addDiceToPool(fullTemplate);
    });
    creatorDiceGrid.appendChild(btn);
  });
}

document.getElementById('addRangeDiceBtn').addEventListener('click', function(e) {
  e.stopPropagation();
  let min = parseInt(document.getElementById('rangeMin').value.trim(), 10);
  let max = parseInt(document.getElementById('rangeMax').value.trim(), 10);
  if (isNaN(min)) min = 0;
  if (isNaN(max)) max = 10;
  if (min > max) { const tmp = min; min = max; max = tmp; }
  addDiceToPool({ sides: 'range', min: min, max: max, pad: (min === 0 && max === 99) ? 2 : 0, label: `${min}-${max}` });
});
