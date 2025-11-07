import { renderString } from './features/renderer.js';
import { clearSelection } from './features/selection.js';
import { initRectangleSelection } from './features/rectangle-selection.js';

const input = document.getElementById('txt');
const renderBtn = document.getElementById('render');
const clearBtn = document.getElementById('clear');

if (!input || !renderBtn || !clearBtn) {
  throw new Error('Required DOM elements not found');
}

renderBtn.addEventListener('click', () => renderString(input.value));
clearBtn.addEventListener('click', () => clearSelection());

initRectangleSelection();
