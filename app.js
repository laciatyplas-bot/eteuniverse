import { loadMap } from './data.js';
import { renderWorlds } from './render.js';

async function init() {
  await loadMap();
  renderWorlds();
}

init();