// ========================================
// ETERNIVERSE MASTER 2026 — app.js
// Orkiestrator UI oparty o DataAPI (ŹRÓDŁO PRAWDY)
// ========================================

'use strict';

class EterniverseApp {
  constructor() {
    this.state = {
      currentTab: 'map',
      currentWorldId: null,
      currentBookId: null,
    };

    this.init();
  }

  // =========================
  // INIT
  // =========================
  init() {
    console.log('🌌 ETERNIVERSE APP START');

    this.cacheDOM();
    this.bindTabs();
    this.bindSearch();

    this.renderWorldMap();
    this.switchTab('map');

    console.log('✅ App gotowa');
  }

  // =========================
  // DOM CACHE
  // =========================
  cacheDOM() {
    this.dom = {
      tabs: document.querySelectorAll('.tab-btn'),
      tabContents: document.querySelectorAll('.tab-content'),
      worldList: document.getElementById('worldList'),
      gatesContainer: document.getElementById('gatesContainer'),
      globalSearch: document.getElementById('globalSearch'),
      statsTotalBooks: document.getElementById('totalBooks'),
      statsPublishedBooks: document.getElementById('publishedBooks'),
    };
  }

  // =========================
  // TABS
  // =========================
  bindTabs() {
    this.dom.tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchTab(btn.dataset.tab);
      });
    });
  }

  switchTab(tabId) {
    this.dom.tabContents.forEach(t => t.classList.remove('active'));
    this.dom.tabs.forEach(b => b.classList.remove('active'));

    document.getElementById(`${tabId}Tab`)?.classList.add('active');
    document.querySelector(`[data-tab="${tabId}"]`)?.classList.add('active');

    this.state.currentTab = tabId;

    if (tabId === 'analytics') this.renderAnalytics();
  }

  // =========================
  // MAPA ŚWIATÓW
  // =========================
  renderWorldMap() {
    if (!this.dom.worldList) return;

    const worlds = DataAPI.getWorlds();
    this.dom.worldList.innerHTML = '';

    worlds.forEach(world => {
      const card = document.createElement('div');
      card.className = 'world-card';
      card.style.borderLeft = `6px solid ${world.color}`;
      card.innerHTML = `
        <h3>${world.name}</h3>
        <p>${world.description}</p>
        <span>Status: ${world.status}</span>
      `;

      card.addEventListener('click', () => {
        this.openWorld(world.id);
      });

      this.dom.worldList.appendChild(card);
    });
  }

  openWorld(worldId) {
    this.state.currentWorldId = worldId;
    this.renderBooks(worldId);
  }

  // =========================
  // KSIĄŻKI
  // =========================
  renderBooks(worldId) {
    if (!this.dom.gatesContainer) return;

    const books = DataAPI.getBooks(worldId);
    this.dom.gatesContainer.innerHTML = '';

    if (books.length === 0) {
      this.dom.gatesContainer.innerHTML =
        '<p class="empty-gate">Brak książek w tym świecie</p>';
      return;
    }

    books.forEach(book => {
      const bookEl = document.createElement('div');
      bookEl.className = 'book-card';

      bookEl.innerHTML = `
        <div class="book-cover">
          ${book.cover ? `<img src="${book.cover}" alt="${book.title}">` : 'Brak okładki'}
        </div>
        <div class="book-info">
          <h4>${book.title}</h4>
          <p>${book.contentPreview || ''}</p>
          <small>Status: ${book.status}</small>
        </div>
      `;

      bookEl.addEventListener('click', () => {
        this.openBook(book.id);
      });

      this.dom.gatesContainer.appendChild(bookEl);
    });
  }

  openBook(bookId) {
    this.state.currentBookId = bookId;
    this.switchTab('editor');
    this.fillEditor(bookId);
  }

  // =========================
  // EDYTOR
  // =========================
  fillEditor(bookId) {
    const book = DataAPI.getBook(bookId);
    if (!book) return;

    const titleInput = document.getElementById('editor-title');
    const contentEditor = document.getElementById('editor-content');
    const wordCount = document.getElementById('wordCount');

    if (titleInput) titleInput.value = book.title || '';
    if (contentEditor) contentEditor.innerText = book.contentPreview || '';

    if (wordCount) {
      const count = (book.contentPreview || '').split(/\s+/).filter(Boolean).length;
      wordCount.textContent = `${count} słów`;
    }
  }

  // =========================
  // SEARCH
  // =========================
  bindSearch() {
    if (!this.dom.globalSearch) return;

    this.dom.globalSearch.addEventListener('input', e => {
      const q = e.target.value.trim();
      if (!q) {
        this.renderWorldMap();
        this.dom.gatesContainer.innerHTML = '';
        return;
      }

      const result = DataAPI.search(q);
      this.renderSearchResults(result);
    });
  }

  renderSearchResults({ worlds, books }) {
    this.dom.worldList.innerHTML = '<h3>Światy</h3>';
    this.dom.gatesContainer.innerHTML = '<h3>Książki</h3>';

    worlds.forEach(w => {
      const el = document.createElement('div');
      el.textContent = w.name;
      el.onclick = () => this.openWorld(w.id);
      this.dom.worldList.appendChild(el);
    });

    books.forEach(b => {
      const el = document.createElement('div');
      el.textContent = b.title;
      el.onclick = () => this.openBook(b.id);
      this.dom.gatesContainer.appendChild(el);
    });
  }

  // =========================
  // ANALITYKA
  // =========================
  renderAnalytics() {
    const stats = DataAPI.getStats();
    if (this.dom.statsTotalBooks)
      this.dom.statsTotalBooks.textContent = stats.totalBooks;
    if (this.dom.statsPublishedBooks)
      this.dom.statsPublishedBooks.textContent = stats.publishedBooks;
  }
}

// =========================
// START
// =========================
document.addEventListener('DOMContentLoaded', () => {
  window.app = new EterniverseApp();
});