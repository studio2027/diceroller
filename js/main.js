// Punkt wejścia: podpięcie przycisku tacki i inicjalizacja aplikacji.

document.getElementById('addPanelBtn').addEventListener('click', function(e) {
  e.stopPropagation(); setPaintColor(null); createPanel();
});

injectDiceStyles();
initPalette();
renderCreator();

initialActivePool.forEach(tpl => addDiceToPool({ ...diceRegistry[tpl.sides], ...tpl }));

createPanel();
