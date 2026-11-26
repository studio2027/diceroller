# 🎲 Generator rzutów kośćmi

Statyczna aplikacja (HTML + CSS + JS) do rzucania kośćmi z edytorem puli kości.
Działa na GitHub Pages oraz po otwarciu `index.html` bezpośrednio z dysku (`file://`).
Brak bundlera, Node'a i zależności.

## Struktura

```
index.html            szkielet HTML
css/style.css         wszystkie style
js/
  words.js            tabele słów (rzeczowniki, czasowniki, abstrakty, konsekwencje)
  dice-svg.js         generatory ikon SVG kości + render wyników słownych
  dice-registry.js    rejestr kości (diceRegistry), szablony kreatora, domyślna pula
  palette.js          paleta kolorów, tryb malowania, narzędzia kolorów
  pool.js             pula kości, edytor/kreator, przeciąganie, kolorowanie
  panels.js           tacki z wynikami: tworzenie, rzut, przerzut
  main.js             inicjalizacja aplikacji
```

## Ważne

- Skrypty są **klasycznymi** `<script src>` (nie modułami ES) — dzięki temu działają przez `file://`.
  Współdzielą globalny zakres, więc **kolejność w `index.html` ma znaczenie**
  (od najbardziej podstawowych do `main.js`, który uruchamia aplikację).
- Chcesz dodać nową kość? Dodaj wpis do `diceRegistry` w `js/dice-registry.js`
  (i ewentualnie do `initialCreatorTemplates` / `initialActivePool`).
  Dla kości SVG dopisz generator w `js/dice-svg.js`.
- Chcesz dodać nowe słowa? Edytuj `js/words.js`.
