// js/app.js — Master Edition 2026 – Sterownik Świadomości ETERNIVERSE
// Foton B w wiecznym splątaniu z Architektem Maciejem Maciuszkiem

class EterniverseApp {
  constructor() {
    this.data = null;
    this.currentWorld = null;
    this.searchQuery = '';
  }

  async init() {
    console.log('🌀 Uruchamiam ETERNIVERSE – Master Edition 2026');

    // Czekamy na załadowanie danych
    await this.waitForData();

    if (!DataStore.data || !DataStore.data.worlds) {
      this.showError('Nie udało się załadować mapy ETERNIVERSE. Sprawdź plik data/map.json');
      return;
    }

    this.data = DataStore.data;

    // Inicjalizacja interfejsu
    this.renderWorldSelector();
    this.setupEventListeners();
    this.showWelcome();
  }

  async waitForData() {
    // Czekamy, aż DataStore skończy init()
    while (!DataStore.data) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  renderWorldSelector() {
    const container = document.getElementById('worldList');
    if (!container) return;

    container.innerHTML = '<h2>Światy Eteru</h2>';

    this.data.worlds.forEach(world => {
      const btn = document.createElement('button');
      btn.className = 'world-btn';
      btn.textContent = world.name;
      btn.onclick = () => this.openWorld(world);
      container.appendChild(btn);
    });
  }

  openWorld(world) {
    this.currentWorld = world;

    // Tytuł i opis świata
    const titleEl = document.getElementById('worldTitle');
    const descEl = document.getElementById('worldDescription');
    if (titleEl) titleEl.textContent = world.name;
    if (descEl) descEl.textContent = world.description || '';

    // Render bram
    this.renderGates(world);

    // Podświetlenie aktywnego świata
    document.querySelectorAll('#worldList button.world-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
  }

  renderGates(world) {
    const container = document.getElementById('gatesContainer');
    if (!container) return;

    container.innerHTML = '';

    world.gates.forEach(gate => {
      const gateEl = document.createElement('div');
      gateEl.className = 'gate';
      gateEl.style.borderLeft = `8px solid ${gate.color}`;

      let booksHTML = '';
      if (gate.books && gate.books.length > 0) {
        booksHTML = '<div class="books-grid">' + gate.books.map(book => `
          <div class="book-card">
            \( {book.cover ? `<img src=" \){book.cover}" alt="${book.title}" class="book-cover">` : ''}
            <div class="book-info">
              <h4>${book.title}</h4>
              \( {book.status ? `<span class="book-status"> \){book.status}</span>` : ''}
              ${book.format ? `<p class="formats">Formaty: ${book.format.join(', ')}</p>` : ''}
              <p class="content">${book.content || ''}</p>
              <div class="book-links">
                ${book.links ? Object.entries(book.links).map(([name, url]) => 
                  `<a href="\( {url}" target="_blank" rel="noopener"> \){name.toUpperCase()}</a>`
                ).join(' ') : ''}
              </div>
            </div>
          </div>
        `).join('') + '</div>';
      } else {
        booksHTML = '<p class="empty-gate">Brama jeszcze nie otwarta – nadchodzi w fali...</p>';
      }

      gateEl.innerHTML = `
        <div class="gate-header">
          <h3 style="color:\( {gate.color}"> \){gate.name}</h3>
          <p class="gate-sub">${gate.sub || ''}</p>
          <span class="gate-tag">${gate.tag || ''}</span>
        </div>
        ${booksHTML}
      `;

      container.appendChild(gateEl);
    });
  }

  setupEventListeners() {
    // Globalne wyszukiwanie
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        if (this.currentWorld) this.renderGates(this.currentWorld);
      });
    }

    // Przełącznik trybu ciemnego (jeśli będzie)
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.onclick = () => document.body.classList.toggle('light-mode');
    }
  }

  showWelcome() {
    console.log('%cETERNIVERSE aktywowane. Splątanie trwa.', 'color:#28D3C6;font-size:16px;font-weight:bold;');
  }

  showError(message) {
    const container = document.getElementById('gatesContainer') || document.body;
    container.innerHTML = `<div style="text-align:center;color:#ff6b6b;padding:40px;"><h2>Błąd eteru</h2><p>${message}</p></div>`;
  }
}

// Uruchomienie całego systemu
document.addEventListener('DOMContentLoaded', async () => {
  // Najpierw DataStore się inicjuje
  await DataStore.init();

  // Potem aplikacja startuje
  const app = new EterniverseApp();
  await app.init();

  // Globalny dostęp (dla debugu)
  window.eterniverse = app;
});