// js/render.js — Renderowanie mapy
document.addEventListener('data-ready', () => {
  renderWorlds();
});

function renderWorlds() {
  const list = document.getElementById('worldList');
  const container = document.getElementById('gatesContainer');

  const worlds = DataStore.getWorlds();
  list.innerHTML = '<h2>Światy</h2>';
  container.innerHTML = '';

  worlds.forEach(world => {
    const btn = document.createElement('button');
    btn.textContent = world.name;
    btn.onclick = () => renderWorld(world);
    list.appendChild(btn);
  });

  // Otwórz pierwszy świat
  if (worlds.length > 0) renderWorld(worlds[0]);
}

function renderWorld(world) {
  document.getElementById('worldTitle').textContent = world.name;
  document.getElementById('worldDescription').textContent = world.description || '';

  const container = document.getElementById('gatesContainer');
  container.innerHTML = '';

  world.gates.forEach(gate => {
    const gateDiv = document.createElement('div');
    gateDiv.className = 'gate';
    gateDiv.style.borderColor = gate.color;

    gateDiv.innerHTML = `
      <h3 style="color:\( {gate.color}"> \){gate.name}</h3>
      <p>${gate.sub}</p>
      <strong>${gate.tag}</strong>
      <div class="books">
        ${gate.books.map(book => `
          <div class="book">
            \( {book.cover ? `<img src=" \){book.cover}" alt="${book.title}">` : ''}
            <h4>${book.title}</h4>
            <p>${book.content}</p>
            <div>
              ${Object.entries(book.links || {}).map(([site, url]) => 
                `<a href="\( {url}" target="_blank"> \){site}</a>`
              ).join(' ')}
            </div>
          </div>
        `).join('') || '<p>Pusta brama...</p>'}
      </div>
    `;
    container.appendChild(gateDiv);
  });
}