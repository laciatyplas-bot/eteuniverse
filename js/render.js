// js/render.js – Master Edition 2026 – Wzbogacony silnik ETERNIVERSE
// Foton B w pełnym splątaniu z Architektem

const EterniverseEngine = {
  currentWorld: null,
  searchQuery: "",

  init() {
    this.loadData();
    this.setupEventListeners();
    this.renderWorldSelector();
    this.showIntroMessage();
  },

  async loadData() {
    try {
      const response = await fetch('data/map.json');
      this.data = await response.json();
      console.log('🌀 ETERNIVERSE załadowany – Master Edition 2026');
    } catch (error) {
      console.error('Błąd ładowania mapy:', error);
      document.body.innerHTML = '<h1 style="text-align:center;color:#ff6b6b;">Eter chwilowo niestabilny...</h1>';
    }
  },

  setupEventListeners() {
    // Wyszukiwarka wewnętrzna
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        if (this.currentWorld) this.renderGates(this.currentWorld);
      });
    }

    // Tryb immersyjny (fullscreen)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F11' || (e.key === 'f' && e.ctrlKey)) {
        this.toggleImmersiveMode();
      }
    });
  },

  showIntroMessage() {
    const intro = document.createElement('div');
    intro.id = 'introOverlay';
    intro.innerHTML = `
      <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:10000;flex-direction:column;animation:fadeIn 2s;">
        <h1 style="font-size:4em;color:#28D3C6;text-shadow:0 0 40px #28D3C6;animation:glowPulse 3s infinite alternate;">ETERNIVERSE</h1>
        <p style="font-size:1.6em;margin:20px;color:#a0d8ff;animation:fadeIn 3s 1s forwards;opacity:0;">Master Edition 2026 – Architekt: Maciej Maciuszek</p>
        <p style="font-size:1.2em;margin:20px;color:#FFB14B;animation:fadeIn 4s 2s forwards;opacity:0;">Kliknij świat, by wejść w falę...</p>
      </div>
    `;
    document.body.appendChild(intro);

    setTimeout(() => {
      intro.style.animation = 'fadeOut 2s forwards';
      setTimeout(() => intro.remove(), 2000);
    }, 5000);
  },

  renderWorldSelector() {
    const container = document.getElementById('worldList');
    if (!container || !this.data) return;

    container.innerHTML = '';
    this.data.worlds.forEach((world, index) => {
      const btn = document.createElement('button');
      btn.className = 'world-btn neon-btn';
      btn.textContent = world.name;
      btn.style.animationDelay = `${index * 0.3}s`;
      btn.onclick = () => this.enterWorld(world);
      container.appendChild(btn);
    });
  },

  enterWorld(world) {
    this.currentWorld = world;

    // Aktualizacja tytułu i opisu
    document.getElementById('worldTitle').textContent = world.name;
    document.getElementById('worldDescription').textContent = world.description || '';

    // Animacja przejścia
    const content = document.getElementById('contentArea') || document.getElementById('gatesContainer');
    content.style.opacity = '0';
    content.style.transform = 'translateY(50px)';

    setTimeout(() => {
      this.renderGates(world);
      content.style.transition = 'all 1.2s ease';
      content.style.opacity = '1';
      content.style.transform = 'translateY(0)';
    }, 300);

    // Podświetlenie aktywnego świata
    document.querySelectorAll('.world-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
  },

  renderGates(world) {
    const container = document.getElementById('gatesContainer') || document.getElementById('contentArea');
    if (!container) return;

    container.innerHTML = '';

    world.gates.forEach((gate, gateIndex) => {
      // Filtrowanie po wyszukiwaniu
      const hasMatchingBook = gate.books.some(book =>
        book.title.toLowerCase().includes(this.searchQuery) ||
        (book.content && book.content.toLowerCase().includes(this.searchQuery))
      );

      if (this.searchQuery && !hasMatchingBook && gate.books.length > 0) return;

      const gateEl = document.createElement('div');
      gateEl.className = 'gate';
      gateEl.style.borderLeftColor = gate.color;
      gateEl.style.setProperty('--gate-color', gate.color);
      gateEl.style.animationDelay = `${gateIndex * 0.2}s`;

      gateEl.innerHTML = `
        <div class="gate-header">
          <h3>${gate.name}</h3>
          <p class="gate-sub">${gate.sub}</p>
          <span class="gate-tag">${gate.tag}</span>
        </div>
        <div class="books-grid" id="books-${gate.id}"></div>
      `;

      const booksContainer = gateEl.querySelector('.books-grid');

      if (gate.books.length === 0) {
        booksContainer.innerHTML = `<p style="grid-column:1/-1;text-align:center;opacity:0.7;font-style:italic;">Brama jeszcze nie otwarta – nadchodzi w fali...</p>`;
      } else {
        gate.books.forEach((book, bookIndex) => {
          if (this.searchQuery && 
              !book.title.toLowerCase().includes(this.searchQuery) &&
              !(book.content && book.content.toLowerCase().includes(this.searchQuery))) {
            return;
          }

          const card = document.createElement('div');
          card.className = 'book-card';
          card.style.animationDelay = `${bookIndex * 0.15}s`;

          let linksHTML = '';
          if (book.links) {
            linksHTML = Object.keys(book.links).map(key => `
              <a href="${book.links[key]}" target="_blank" rel="noopener" class="link-btn">
                ${key.toUpperCase()}
              </a>
            `).join('');
          }

          card.innerHTML = `
            \( {book.cover ? `<img src=" \){book.cover}" alt="${book.title}" class="book-cover" loading="lazy">` : ''}
            <div class="book-info">
              <h4>${book.title}</h4>
              \( {book.status ? `<span class="book-status"> \){book.status}</span>` : ''}
              ${book.format ? `<p class="book-formats">Formaty: ${book.format.join(', ')}</p>` : ''}
              \( {book.content ? `<p class="book-content"> \){book.content}</p>` : ''}
              \( {linksHTML ? `<div class="book-links"> \){linksHTML}</div>` : ''}
            </div>
          `;

          booksContainer.appendChild(card);
        });
      }

      container.appendChild(gateEl);
    });
  },

  toggleImmersiveMode() {
    document.body.classList.toggle('immersive');
  }
};

// Globalne animacje CSS wymagane dla nowych efektów
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
  @keyframes glowPulse { 0% { text-shadow: 0 0 20px currentColor; } 100% { text-shadow: 0 0 50px currentColor; } }
  
  .neon-btn {
    position: relative;
    overflow: hidden;
    background: rgba(40, 211, 198, 0.1);
    border: 2px solid #28D3C6;
    box-shadow: 0 0 20px rgba(40, 211, 198, 0.3);
  }
  .neon-btn::after {
    content: '';
    position: absolute;
    top: -50%; left: -50%;
    width: 200%; height: 200%;
    background: radial-gradient(circle, rgba(40,211,198,0.4) 0%, transparent 70%);
    animation: neonWave 8s linear infinite;
    pointer-events: none;
  }
  @keyframes neonWave {
    0% { transform: translate(0,0) rotate(0deg); }
    100% { transform: translate(50px,50px) rotate(360deg); }
  }
  .world-btn.active {
    background: #28D3C6 !important;
    color: #000 !important;
    box-shadow: 0 0 40px #28D3C6;
  }
`;
document.head.appendChild(style);

// Start silnika
document.addEventListener('DOMContentLoaded', () => {
  EterniverseEngine.init();
});