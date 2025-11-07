import { selection, clearSelection } from './selection.js';

let rectEl = null;
let rectStart = null;
let rectActive = false;

export function initRectangleSelection() {
  const output = document.getElementById('output');
  const charsContainer = document.getElementById('chars');

  output.addEventListener('mousedown', (ev) => {
    if (ev.button !== 0) return;
    if (ev.target === charsContainer || ev.target === output) {
      rectActive = true;
      rectStart = { x: ev.clientX, y: ev.clientY };
      rectEl = document.createElement('div');
      rectEl.className = 'selection-rect';
      rectEl.style.left = rectStart.x - output.getBoundingClientRect().left + 'px';
      rectEl.style.top = rectStart.y - output.getBoundingClientRect().top + 'px';
      rectEl.style.width = '0px';
      rectEl.style.height = '0px';
      output.appendChild(rectEl);
      ev.preventDefault();
    }
  });

  window.addEventListener('mousemove', (ev) => {
    if (!rectActive || !rectEl) return;
    const r = output.getBoundingClientRect();
    const x1 = Math.min(rectStart.x, ev.clientX);
    const y1 = Math.min(rectStart.y, ev.clientY);
    const x2 = Math.max(rectStart.x, ev.clientX);
    const y2 = Math.max(rectStart.y, ev.clientY);
    rectEl.style.left = (x1 - r.left) + 'px';
    rectEl.style.top = (y1 - r.top) + 'px';
    rectEl.style.width = (x2 - x1) + 'px';
    rectEl.style.height = (y2 - y1) + 'px';

    const rect = { left: x1, top: y1, right: x2, bottom: y2 };
    clearSelection();
    Array.from(charsContainer.children).forEach(span => {
      const b = span.getBoundingClientRect();
      if (intersectRects(rect, b)) {
        selection.add(span.dataset.id);
        span.classList.add('selected');
      }
    });
  });

  window.addEventListener('mouseup', (ev) => {
    if (rectActive) {
      rectActive = false;
      if (rectEl && rectEl.parentNode) rectEl.parentNode.removeChild(rectEl);
      rectEl = null;
    }
  });
}

function intersectRects(a, b) {
  return !(b.left > a.right || b.right < a.left || b.top > a.bottom || b.bottom < a.top);
}
