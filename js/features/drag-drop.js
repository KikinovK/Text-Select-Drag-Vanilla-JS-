import { clearSelection } from './selection.js';
import { createCharSpan, updateDataIds } from './renderer.js';

let dragging = null;

export function startDragFromSpan(ev, span) {
  const startX = ev.clientX, startY = ev.clientY;
  let moved = false;

  function onMove(e) {
    const dx = Math.abs(e.clientX - startX);
    const dy = Math.abs(e.clientY - startY);
    if (!moved && (dx > 5 || dy > 5)) {
      moved = true;
      beginDrag(e);
    }
  }

  function onUp(e) {
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
    if (!moved && dragging) {
      endDrag();
    }
  }

  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);

  function beginDrag(e) {
    const charsContainer = document.getElementById('chars');
    const selectedSpans = Array.from(charsContainer.querySelectorAll('.char.selected'));
    if (selectedSpans.length === 0) return;

    const ghost = document.createElement('div');
    ghost.className = 'ghost';
    ghost.style.left = (e.clientX + 8) + 'px';
    ghost.style.top = (e.clientY + 8) + 'px';
    ghost.textContent = selectedSpans.map(s => s.textContent).join('');
    document.body.appendChild(ghost);

    const originIndices = selectedSpans.map(s => Number(s.dataset.id));
    dragging = { items: selectedSpans, ghost, originIndices, charsContainer };
    selectedSpans.forEach(s => s.classList.add('dragging'));

    window.addEventListener('mousemove', dragMove);
    window.addEventListener('mouseup', drop);
  }
}

function dragMove(e) {
  if (!dragging) return;
  const ghost = dragging.ghost;
  ghost.style.left = (e.clientX + 8) + 'px';
  ghost.style.top = (e.clientY + 8) + 'px';
}

function drop(e) {
  if (!dragging) return;
  const charsContainer = dragging.charsContainer;
  const elUnder = document.elementFromPoint(e.clientX, e.clientY);
  let targetIndex = null;

  if (charsContainer.contains(elUnder)) {
    let charEl = elUnder.closest('.char');
    if (charEl) {
      targetIndex = Number(charEl.dataset.id);
    }
  }

  if (targetIndex !== null) {
    moveSelectedTo(targetIndex);
  }

  endDrag();
}

function endDrag() {
  if (!dragging) return;
  dragging.items.forEach(s => s.classList.remove('dragging'));
  if (dragging.ghost && dragging.ghost.parentNode) dragging.ghost.parentNode.removeChild(dragging.ghost);
  dragging = null;
  updateDataIds();
}

function moveSelectedTo(targetIndex) {
  const charsContainer = document.getElementById('chars');
  const spans = Array.from(charsContainer.children);
  const selSpans = Array.from(charsContainer.querySelectorAll('.char.selected'));
  if (selSpans.length === 0) return;

  const selIndices = selSpans.map(s => Number(s.dataset.id)).sort((a, b) => a - b);
  const selectedTexts = [];

  for (let k = selIndices.length - 1; k >= 0; k--) {
    const idx = selIndices[k];
    selectedTexts.unshift(spans[idx].textContent);
    charsContainer.removeChild(spans[idx]);
  }

  let removedBefore = selIndices.filter(i => i < targetIndex).length;
  let insertIndex = Math.max(0, targetIndex - removedBefore);

  for (let i = 0; i < selectedTexts.length; i++) {
    const s = createCharSpan(selectedTexts[i]);

    if (insertIndex >= charsContainer.children.length) {
      charsContainer.appendChild(s);
    } else {
      charsContainer.insertBefore(s, charsContainer.children[insertIndex]);
    }
    insertIndex++;
  }

  clearSelection();
  updateDataIds();
}
