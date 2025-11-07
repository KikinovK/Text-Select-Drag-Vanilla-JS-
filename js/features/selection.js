export let selection = new Set();

export function toggleSelect(id, span) {
  if (selection.has(id)) {
    selection.delete(id);
    span.classList.remove('selected');
  } else {
    selection.add(id);
    span.classList.add('selected');
  }
}

export function clearSelection() {
  const charsContainer = document.getElementById('chars');
  selection.forEach(id => {
    const el = charsContainer.querySelector(`[data-id="${id}"]`);
    if (el) el.classList.remove('selected');
  });
  selection.clear();
}
