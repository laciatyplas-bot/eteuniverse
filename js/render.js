// js/render.js — Master Edition 2026 – Silnik Wizualizacji z Animacjami Przejść
// Foton B w wiecznym splątaniu z Architektem

const Renderer = {
  isTransitioning: false,

  renderWorldList() {
    const container = document.getElementById('worldList');
    if (!container || !DataStore.data) return;

    container.innerHTML = '<h2>Światy Eteru</h2>';

    DataStore.getWorlds().forEach(world => {
      const btn = document.createElement('button');
      btn.className = 'world-btn';
      btn.textContent = world.name;
      btn.dataset.worldId = world.id;
      btn.onclick = () => this.transitionToWorld(world);
      container.appendChild(btn);
    });
  },

  async transitionToWorld(world) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const contentArea = document.getElementById('gatesContainer');
    const titleEl = document.getElementById('worldTitle');
    const descEl = document.getElementById('worldDescription');

    // Fade out
    if (contentArea) {
      contentArea.style.opacity = '0';
      contentArea.style.transform = 'translateY(30px)';
    }
    if (titleEl) titleEl.style.opacity = '0';
    if (descEl) descEl.style.opacity = '0';

    await new Promise(resolve => setTimeout(resolve, 600));

    // Aktualizacja treści
    this.renderWorldContent(world);

    // Fade in
    if (contentArea) {
      contentArea.style.opacity = '1';
      contentArea.style.transform = 'translateY(0)';
    }
    if (titleEl) {
      titleEl.textContent = world.name;
      titleEl.style.opacity = '1';
    }
    if (descEl) {
      descEl.textContent = world.description || '';
      descEl.style.opacity = '1';
    }

    // Aktywny świat
    document.querySelectorAll('#worldList .world-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`#worldList .world-btn[data-world-id="${world.id}"]`)?.classList.add('active');

    this.isTransitioning = false;
  },

  renderWorldContent(world) {
    const titleEl = document.getElementById('worldTitle');
    const descEl = document.getElementById('worldDescription');
    if (titleEl) titleEl.textContent = world.name;
    if (descEl) descEl.textContent = world.description || '';

    this.renderGates(world);
  },

  renderGates(world) {
    const container = document.getElementById('gatesContainer');
    if (!container) return;

    container.innerHTML = '';

    world.gates.forEach((gate, index) => {
      const gateEl = document.createElement('div');
      gateEl.className = 'gate';
      gateEl.style.borderLeft = `10px solid ${gate.color || '#444'}`;
      gateEl.style.animationDelay = `${index * 0.15}s`;

      const header = document.createElement('div');
      header.className = 'gate-header';
      header.innerHTML = `
        <h3 style="color: \( {gate.color || '#eee'}"> \){gate.name}</h3>
        <p class="gate-sub">${gate.sub || ''}</p>
        <span class="gate-tag">${gate.tag || ''}</span>
      `;
      gateEl.appendChild(header);

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

  init() {
    console.log('🟢 Renderer z animacjami przejść – gotowy');

    document.addEventListener('datastore:ready', () => {
      console.log('Dane załadowane – renderuję światy');
      this.renderWorldList();

      const firstWorld = DataStore.getWorlds()[0];
      if (firstWorld) {
        this.renderWorldContent(firstWorld);
        document.querySelector(`#worldList .world-btn[data-world-id="${firstWorld.id}"]`)?.classList.add('active');
      }
    });

    document.addEventListener('datastore:error', (e) => {
      console.error('Renderer: błąd danych', e.detail);
    });
  }
};

// Dodatkowe style dla animacji (jeśli nie masz w CSS)
const style = document.createElement('style');
style.textContent = `
  #gatesContainer, #worldTitle, #worldDescription {
    transition: opacity 0.6s ease, transform 0.8s ease;
  }
  .gate {
    opacity: 0;
    transform: translateY(40px);
    animation: gateFadeIn 0.8s ease forwards;
  }
  @keyframes gateFadeIn {
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

// Start
document.addEventListener('DOMContentLoaded', () => {
  Renderer.init();
});

window.Renderer = Renderer;