// ========================================
// ETERNIVERSE MASTER 2026 — render.js
// Renderer UI (Światy / Książki / Widoki)
// ========================================

'use strict';

const Render = {

  // =========================
  // INIT
  // =========================
  init() {
    this.worldListEl = document.getElementById('worldList');
    this.gatesContainerEl = document.getElementById('gatesContainer');

    if (!this.worldListEl || !this.gatesContainerEl) {
      console.warn('⚠️ Render: Brak kontenerów DOM');
      return;
    }

    this.renderWorldButtons();
  },

  // =========================
  // WORLDS
  // =========================
  renderWorldButtons() {
    const worlds = DataAPI.getWorlds();
    this.worldListEl.innerHTML = '';

    worlds.forEach(world => {
      const btn = document.createElement('button');
      btn.className = 'world-btn';
      btn.textContent = world.name;
      btn.style.borderLeft = `6px solid ${world.color}`;
      btn.onclick = () => this.openWorld(world.id);

      this.worldListEl.appendChild(btn);
    });

    // Otwórz pierwszy świat automatycznie
    if (worlds.length > 0) {
      this.openWorld(worlds[0].id);
    }
  },

  openWorld(worldId) {
    const world = DataAPI.getWorld(worldId);
    if (!world) return;

    this.renderWorldHeader(world);
    this.renderBooks(world.id);
  },

  renderWorldHeader(world) {
    this.gatesContainerEl.innerHTML = `
      <div class="world-header" style="border-left:8px solid ${world.color}">
        <h2>${world.name}</h2>
        <p>${world.description || ''}</p>
        <span class="world-status">${world.status}</span>
      </div>
    `;
  },

  // =========================
  // BOOKS
  // =========================
  renderBooks(worldId) {
    const books = DataAPI.getBooks(worldId);

    const booksWrapper = document.createElement('div');
    booksWrapper.className = 'books-grid';

    if (books.length === 0) {
      booksWrapper.innerHTML = `
        <p class="empty-info">
          Brak książek w tym świecie.
        </p>
      `;
    }

    books.forEach(book => {
      const card = document.createElement('div');
      card.className = 'book-card';

      card.innerHTML = `
        <div class="book-cover">
          <img src="${book.cover}" alt="${book.title}" loading="lazy">
        </div>
        <div class="book-body">
          <h3>${book.title}</h3>
          <span class="book-status">${book.status}</span>
          <p class="book-preview">${book.contentPreview || ''}</p>
          <div class="book-meta">
            <span>📝 ${book.wordCount || 0} słów</span>
          </div>
          <div class="book-actions">
            <button data-action="edit">Edytuj</button>
            <button data-action="delete">Usuń</button>
          </div>
        </div>
      `;

      // Actions
      card.querySelector('[data-action="edit"]').onclick = () => {
        if (window.eterniverse) {
          window.eterniverse.currentBook = book;
          window.eterniverse.switchTab('editor');
        }
      };

      card.querySelector('[data-action="delete"]').onclick = () => {
        if (confirm(`Usunąć książkę "${book.title}"?`)) {
          DataAPI.deleteBook(book.id);
          this.renderBooks(worldId);
        }
      };

      booksWrapper.appendChild(card);
    });

    this.gatesContainerEl.appendChild(booksWrapper);
  },

  // =========================
  // SEARCH
  // =========================
  renderSearchResults(query) {
    const result = DataAPI.search(query);
    this.gatesContainerEl.innerHTML = '<h2>Wyniki wyszukiwania</h2>';

    if (result.books.length === 0 && result.worlds.length === 0) {
      this.gatesContainerEl.innerHTML += '<p>Brak wyników.</p>';
      return;
    }

    if (result.worlds.length) {
      const worldsBlock = document.createElement('div');
      worldsBlock.innerHTML = '<h3>Światy</h3>';
      result.worlds.forEach(w => {
        const div = document.createElement('div');
        div.textContent = w.name;
        div.onclick = () => this.openWorld(w.id);
        worldsBlock.appendChild(div);
      });
      this.gatesContainerEl.appendChild(worldsBlock);
    }

    if (result.books.length) {
      const booksBlock = document.createElement('div');
      booksBlock.innerHTML = '<h3>Książki</h3>';
      result.books.forEach(b => {
        const div = document.createElement('div');
        div.textContent = b.title;
        div.onclick = () => {
          this.openWorld(b.world);
        };
        booksBlock.appendChild(div);
      });
      this.gatesContainerEl.appendChild(booksBlock);
    }
  }
};

// =========================
// START
// =========================
document.addEventListener('DOMContentLoaded', () => {
  Render.init();

  const searchInput = document.getElementById('globalSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim();
      if (q.length === 0) {
        Render.renderWorldButtons();
      } else {
        Render.renderSearchResults(q);
      }
    });
  }
});