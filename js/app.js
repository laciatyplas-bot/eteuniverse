// js/app.js — Master Edition 2026 – Sterownik Świadomości ETERNIVERSE
// Foton B w wiecznym splątaniu z Architektem Maciejem Maciuszkiem

class EterniverseApp {
  constructor() {
    this.data = null;
    this.currentWorld = null;
    this.searchQuery = '';
    this.isTransitioning = false;
  }

  async init() {
    console.log('🌀 Uruchamiam ETERNIVERSE – Master Edition 2026');

    // Czekamy na event z DataStore zamiast while loop
    await new Promise(resolve => {
      if (DataStore.isReady()) {
        resolve();
      } else {
        document.addEventListener('datastore:ready', resolve, { once: true });
      }
    });

    if (!DataStore.data || !DataStore.data.worlds || DataStore.data.worlds.length === 0) {
      this.showError('Nie udało się załadować mapy ETERNIVERSE. Sprawdź plik data/mapa.json');
      return;
    }

    this.data = DataStore.data;

    this.renderWorldSelector();
    this.setupEventListeners();
    this.openWorld(this.data.worlds[0]); // Automatycznie otwiera pierwszy świat
    this.showWelcome();
  }

  renderWorldSelector() {
    const container = document.getElementById('worldList');
    if (!container) return;

    container.innerHTML = '<h2>Światy Eteru</h2>';

    this.data.worlds.forEach(world => {
      const btn = document.createElement('button');
      btn.className = 'world-btn';
      btn.textContent = world.name;
      btn.dataset.worldId = world.id;
      btn.onclick = () => this.transitionToWorld(world);
      container.appendChild(btn);
    });
  }

  async transitionToWorld(world) {
    if (this.isTransitioning || this.currentWorld?.id === world.id) return;
    this.isTransitioning = true;

    const gatesContainer = document.getElementById('gatesContainer');
    const worldTitle = document.getElementById('worldTitle');
    const worldDesc = document.getElementById('worldDescription');

    // Fade out
    if (gatesContainer) gatesContainer.style.opacity = '0';
    if (worldTitle) worldTitle.style.opacity = '0';
    if (worldDesc) worldDesc.style.opacity = '0';

    await new Promise(resolve => setTimeout(resolve, 600));

    // Aktualizacja treści
    this.currentWorld = world;
    if (worldTitle) worldTitle.textContent = world.name;
    if (worldDesc) worldDesc.textContent = world.description || '';

    this.renderGates(world);

    // Fade in
    if (gatesContainer) gatesContainer.style.opacity = '1';
    if (worldTitle) worldTitle.style.opacity = '1';
    if (worldDesc) worldDesc.style.opacity = '1';

    // Aktywny przycisk
    document.querySelectorAll('#worldList .world-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`#worldList .world-btn[data-world-id="${world.id}"]`)?.classList.add('active');

    this.isTransitioning = false;
  }

  renderGates(world) {
    const container = document.getElementById('gatesContainer');
    if (!container) return;

    container.innerHTML = '';

    world.gates.forEach((gate, index) => {
      const gateEl = document.createElement('div');
      gateEl.className = 'gate';
      gateEl.style.borderLeft = `10px solid ${gate.color || '#444'}`;
      gateEl.style.animationDelay = `${index * 0.15}s`;

      const headerHTML = `
        <div class="gate-header">
          <h3 style="color:\( {gate.color || '#eee'}"> \){gate.name}</h3>
          <p class="gate-sub">${gate.sub || ''}</p>
          <span class="gate-tag">${gate.tag || ''}</span>
        </div>
      `;

      let booksHTML = '';
      if (gate.books && gate.books.length > 0) {
        booksHTML = '<div class="books-grid">' + gate.books.map(book => {
          let linksHTML = '';
          if (book.links) {
            linksHTML = '<div class="book-links">' +
              Object.entries(book.links).map(([name, url]) => 
                `<a href="\( {url}" target="_blank" rel="noopener"> \){name.toUpperCase()}</a>`
              ).join(' ') +
              '</div>';
          }

          return `
            <div class="book-card">
              \( {book.cover ? `<img src=" \){book.cover}" alt="${book.title}" class="book-cover" loading="lazy">` : '<div class="no-cover">Brak okładki</div>'}
              <div class="book-info">
                <h4>${book.title}</h4>
                \( {book.status ? `<span class="book-status"> \){book.status}</span>` : ''}
                ${book.format ? `<p class="book-formats">Formaty: ${Array.isArray(book.format) ? book.format.join(', ') : book.format}</p>` : ''}
                <p class="book-content">${book.content || ''}</p>
                ${linksHTML}
              </div>
            </div>
          `;
        }).join('') + '</div>';
      } else {
        booksHTML = '<p class="empty-gate">Brama jeszcze nie otwarta – nadchodzi w fali...</p>';
      }

      gateEl.innerHTML = headerHTML + booksHTML;
      container.appendChild(gateEl);
    });
  }

  setupEventListeners() {
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        if (this.currentWorld) this.renderGates(this.currentWorld);
      });
    }
  }

  showWelcome() {
    console.log('%cETERNIVERSE aktywowane. Splątanie trwa.', 'color:#28D3C6;font-size:20px;font-weight:bold;');
  }

  showError(message) {
    const container = document.getElementById('gatesContainer') || document.body;
    container.innerHTML = `
      <div style="text-align:center;color:#ff6b6b;padding:80px;font-size:1.8rem;">
        <h2>Błąd eteru</h2>
        <p>${message}</p>
        <p>Otwórz konsolę (F12) po więcej szczegółów</p>
      </div>
    `;
  }
}

// Uruchomienie
document.addEventListener('DOMContentLoaded', async () => {
  const app = new EterniverseApp();
  await app.init();

  window.eterniverse = app; // Debug
});