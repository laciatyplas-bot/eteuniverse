import { MAP } from './data.js';

export function renderWorlds() {
  const root = document.getElementById('app');
  root.innerHTML = '';

  MAP.worlds.forEach(world => {
    const el = document.createElement('section');
    el.innerHTML = `<h2>${world.name}</h2>`;
    root.appendChild(el);
  });
}