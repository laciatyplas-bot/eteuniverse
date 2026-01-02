// js/render.js — Master Edition 2026 – Renderer ETERNIVERSE

document.addEventListener('datastore:ready', () => {
  console.log('Dane załadowane – start renderowania');
  renderWorldList();
  if (DataStore.getWorlds().length > 0) {
    openWorld(DataStore.getWorlds()[0]);
  }
});

function renderWorldList() {
  const container = document.getElementById('worldList');
  if (!container) return;

  container.innerHTML = '<h2>Światy Eteru</h2>';

  DataStore.getWorlds().forEach(world => {
    const btn = document.createElement('button');
    btn.className = 'world-btn';
    btn.textContent = world.name;
    btn.onclick = () => openWorld(world);
    container.appendChild(btn);
  });
}

function openWorld(world) {
  document.getElementById('worldTitle').textContent = world.name;
  document.getElementById('worldDescription').textContent = world.description || '';

  const container = document.getElementById('gatesContainer');
  container.innerHTML = '';

  world.gates.forEach(gate => {
    const gateEl = document.createElement('div');
    gateEl.className = 'gate';
    gateEl.style.borderLeft = `10px solid ${gate.color}`;

    let booksHTML = '<div class="books-grid">';
    if (gate.books && gate.books.length > 0) {
      gate.books.forEach(book => {
        let linksHTML = '';
        if (book.links) {
          linksHTML = Object.entries(book.links).map(([name, url]) => 
            `<a href="\( {url}" target="_blank"> \){name.toUpperCase()}</a>`
          ).join(' ');
        }

        booksHTML += `
          <div class="book-card">
            \( {book.cover ? `<img src=" \){book.cover}" alt="${book.title}" class="book-cover">` : ''}
            <h4>${book.title}</h4>
            \( {book.status ? `<span class="book-status"> \){book.status}</span>` : ''}
            ${book.format ? `<p>Formaty: ${book.format.join(', ')}</p>` : ''}
            <p>${book.content || ''}</p>
            <div class="links">${linksHTML}</div>
          </div>
        `;
      });
    } else {
      booksHTML += '<p>Pusta brama – nadchodzi...</p>';
    }
    booksHTML += '</div>';

    gateEl.innerHTML = `
      <h3 style="color:\( {gate.color}"> \){gate.name}</h3>
      <p>${gate.sub || ''}</p>
      <strong>${gate.tag || ''}</strong>
      ${booksHTML}
    `;

    container.appendChild(gateEl);
  });

  // Aktywny przycisk
  document.querySelectorAll('.world-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.world-btn:nth-child(${DataStore.getWorlds().indexOf(world) + 2})`)?.classList.add('active'); // +2 bo h2
}