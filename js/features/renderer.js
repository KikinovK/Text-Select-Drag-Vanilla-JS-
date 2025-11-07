import { selection, toggleSelect, clearSelection } from './selection.js';
import { startDragFromSpan } from './drag-drop.js';

export function renderString(str) {
  const charsContainer = document.getElementById('chars');
  charsContainer.innerHTML = '';

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    const span = createCharSpan(ch, i);

    charsContainer.appendChild(span);
  }
  updateDataIds();
}

export function createCharSpan(ch, id) {
  const span = document.createElement('span');
  span.className = 'char' + (ch === ' ' ? ' space' : '');
  span.textContent = ch;
  if (id !== undefined) span.dataset.id = String(id);
  span.draggable = false;

  span.addEventListener('click', (ev) => {
    ev.preventDefault();
    const id = span.dataset.id;
    if (!(ev.ctrlKey || ev.metaKey)) clearSelection();

    toggleSelect(id, span);
  });

  span.addEventListener('mousedown', (ev) => {
    if (ev.button !== 0) return;
    if (!(ev.ctrlKey || ev.metaKey) && !selection.has(span.dataset.id)) {
      clearSelection();
      toggleSelect(span.dataset.id, span);
    }
    startDragFromSpan(ev, span);
  });

  return span;
}

export function updateDataIds() {
  const charsContainer = document.getElementById('chars');
  const spans = Array.from(charsContainer.children);
  spans.forEach((span, i) => {
    span.dataset.id = String(i);
  });
}
