// js/render.js — Master Edition 2026 – Silnik Wizualizacji ETERNIVERSE
// Foton B w pełnym splątaniu z Architektem

const Renderer = {
  // Renderuje listę światów w lewym panelu
  renderWorldList() {
    const container = document.getElementById('worldList');
    if (!container || !DataStore.data) return;

    container.innerHTML = '<h2>Światy Eteru</h2>';

    DataStore.getWorlds().forEach(world => {
      const btn = document.createElement('button');
      btn.className = 'world-btn';
      btn.textContent = world.name;
      btn.dataset.worldId = world.id;
      btn.onclick = () => this.renderWorld(world);
      container.appendChild(btn);
    });
  },

  // Renderuje wybrany świat – tytuł, opis i wszystkie bramy
  renderWorld(world) {
    // Aktualizacja tytułu i opisu
    const titleEl = document.getElementById('worldTitle');
    const descEl = document.getElementById('worldDescription');
    if (titleEl) titleEl.textContent = world.name;
    if (descEl) descEl.textContent = world.description || 'Brak opisu świata...';

    // Podświetlenie aktywnego świata
    document.querySelectorAll('#worldList .world-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`#worldList .world-btn[data-world-id="${world.id}"]`)?.classList.add('active');

    // Render bram
    this.renderGates(world);
  },

  // Renderuje wszystkie bramy danego świata
  renderGates(world) {
    const container = document.getElementById('gatesContainer');
    if (!container) return;

    container.innerHTML = '';

    world.gates.forEach(gate => {
      const gateEl = document.createElement('div');
      gateEl.className = 'gate';
      gateEl.style.borderLeft = `10px solid ${gate.color || '#444'}`;

      // Nagłówek bramy
      const header = document.createElement('div');
      header.className = 'gate-header';
      header.innerHTML = `
        <h3 style="color: \( {gate.color || '#eee'}"> \){gate.name}</h3>
        <p class="gate-sub">${gate.sub || ''}</p>
        <span class="gate-tag">${gate.tag || ''}</span>
      `;
      gateEl.appendChild(header);

      // Książki w bramie
      const booksContainer = document.createElement('div');
      booksContainer.className = 'books-grid';

      if (gate.books && gate.books.length > 0) {
        gate.books.forEach(book => {
          const card = document.createElement('div');
          card.className = 'book-card';

          let linksHTML = '';
          if (book.links) {
            linksHTML = '<div class="book-links">' +
              Object.entries(book.links).map(([platform, url]) => 
                `<a href="\( {url}" target="_blank" rel="noopener"> \){platform.toUpperCase()}</a>`
              ).join(' ') +
              '</div>';
          }

          card.innerHTML = `
            \( {book.cover ? `<img src=" \){book.cover}" alt="${book.title}" class="book-cover" loading="lazy">` : '<div class="no-cover">Brak okładki</div>'}
            <div class="book-info">
              <h4>${book.title}</h4>
              \( {book.status ? `<span class="book-status"> \){book.status}</span>` : ''}
              ${book.format ? `<p class="book-formats">Formaty: ${Array.isArray(book.format) ? book.format.join(', ') : book.format}</p>` : ''}
              <p class="book-content">${book.content || 'Brak opisu...'}</p>
              ${linksHTML}
            </div>
          `;

          booksContainer.appendChild(card);
        });
      } else {
        booksContainer.innerHTML = '<p class="empty-gate">Ta brama jest jeszcze pusta – nadchodzi w następnej fali...</p>';
      }

      gateEl.appendChild(booksContainer);
      container.appendChild(gateEl);
    });
  },

  // Inicjalizacja po załadowaniu danych
  init() {
    console.log('🟢 Renderer gotowy – czekam na dane...');

    // Nasłuchujemy na event z DataStore
    document.addEventListener('datastore:ready', () => {
      console.log('✅ Dane załadowane – renderuję światy');
      this.renderWorldList();

      // Automatycznie otwieramy pierwszy świat (opcjonalnie)
      const firstWorld = DataStore.getWorlds()[0];
      if (firstWorld) this.renderWorld(firstWorld);
    });

    document.addEventListener('datastore:error', (e) => {
      console.error('Renderer: błąd danych', e.detail);
    });
  }
};

// Start renderera po załadowaniu DOM
document.addEventListener('DOMContentLoaded', () => {
  Renderer.init();
});

// Globalny dostęp
window.Renderer = Renderer;