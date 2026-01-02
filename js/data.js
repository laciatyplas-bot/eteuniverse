// ========================================
// ETERNIVERSE MASTER 2026 — data.js
// JEDYNE ŹRÓDŁO DANYCH + API
// ========================================

'use strict';

// =========================
// CORE DATA
// =========================
const ETERNIVERSE_DATA = {
  meta: {
    universe: 'ETERNIVERSE',
    version: '2.0.0',
    author: 'Maciej',
    updated: new Date().toISOString()
  },

  worlds: [
    {
      id: 'eter-1',
      name: 'Eter-1: Początek Świadomości',
      description: 'Narodziny świadomości i pierwszy kontakt z Eterem.',
      color: '#00ff88',
      status: 'opublikowana'
    },
    {
      id: 'kwant',
      name: 'Kwantowe Splątanie',
      description: 'Równoległe rzeczywistości i linie losu.',
      color: '#ff6b6b',
      status: 'w produkcji'
    },
    {
      id: 'cyber',
      name: 'Cyber-Eter 2086',
      description: 'Przyszłość, w której umysły są połączone z siecią.',
      color: '#8b5cf6',
      status: 'planowana'
    }
  ],

  books: [
    {
      id: 'book-001',
      world: 'eter-1',
      title: 'Eter: Pierwsze Splątanie',
      status: 'opublikowana',
      cover: 'https://via.placeholder.com/400x600/00ff88/000000?text=ETER+1',
      contentPreview:
        'W otchłani Eteru, gdzie świadomość splata się z falą kwantową, narodziła się pierwsza myśl.',
      tags: ['eter', 'świadomość', 'filozofia'],
      wordCount: 85600
    },
    {
      id: 'book-002',
      world: 'kwant',
      title: 'Dwoje w Jednym',
      status: 'w produkcji',
      cover: 'https://via.placeholder.com/400x600/ff6b6b/000000?text=KWANT',
      contentPreview:
        'Ich spojrzenia spotkały się przez zasłonę rzeczywistości. Jeden uśmiech — dwa wszechświaty.',
      tags: ['kwant', 'splątanie', 'relacja'],
      wordCount: 42300
    },
    {
      id: 'book-003',
      world: 'cyber',
      title: 'Sieć Zapomnianych Umysłów',
      status: 'planowana',
      cover: 'https://via.placeholder.com/400x600/8b5cf6/000000?text=CYBER',
      contentPreview:
        'W 2086 roku każdy umysł był plikiem. Ale co, jeśli ktoś usunie Twój?',
      tags: ['cyberpunk', 'tożsamość', 'AI'],
      wordCount: 12000
    }
  ]
};

// =========================
// PERSISTENCE
// =========================
const STORAGE_KEY = 'eterniverse_master_data';

(function loadFromStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);
    if (parsed?.worlds && parsed?.books) {
      ETERNIVERSE_DATA.worlds = parsed.worlds;
      ETERNIVERSE_DATA.books = parsed.books;
      console.log('🔄 Dane załadowane z localStorage');
    }
  } catch (e) {
    console.warn('⚠️ Błąd wczytywania danych', e);
  }
})();

function persist() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      worlds: ETERNIVERSE_DATA.worlds,
      books: ETERNIVERSE_DATA.books,
      updated: new Date().toISOString()
    })
  );
}

// =========================
// DATA API
// =========================
const DataAPI = {
  // WORLDS
  getWorlds() {
    return [...ETERNIVERSE_DATA.worlds];
  },

  getWorld(id) {
    return ETERNIVERSE_DATA.worlds.find(w => w.id === id);
  },

  saveWorld(world) {
    const index = ETERNIVERSE_DATA.worlds.findIndex(w => w.id === world.id);
    if (index >= 0) {
      ETERNIVERSE_DATA.worlds[index] = { ...ETERNIVERSE_DATA.worlds[index], ...world };
    } else {
      ETERNIVERSE_DATA.worlds.push(world);
    }
    persist();
  },

  // BOOKS
  getBooks(worldId = null) {
    return worldId
      ? ETERNIVERSE_DATA.books.filter(b => b.world === worldId)
      : [...ETERNIVERSE_DATA.books];
  },

  getBook(id) {
    return ETERNIVERSE_DATA.books.find(b => b.id === id);
  },

  saveBook(book) {
    const index = ETERNIVERSE_DATA.books.findIndex(b => b.id === book.id);
    if (index >= 0) {
      ETERNIVERSE_DATA.books[index] = { ...ETERNIVERSE_DATA.books[index], ...book };
    } else {
      book.id = `book-${Date.now()}`;
      ETERNIVERSE_DATA.books.push(book);
    }
    persist();
  },

  deleteBook(id) {
    const index = ETERNIVERSE_DATA.books.findIndex(b => b.id === id);
    if (index >= 0) {
      ETERNIVERSE_DATA.books.splice(index, 1);
      persist();
    }
  },

  // SEARCH
  search(query) {
    const q = query.toLowerCase();
    return {
      worlds: ETERNIVERSE_DATA.worlds.filter(w =>
        w.name.toLowerCase().includes(q)
      ),
      books: ETERNIVERSE_DATA.books.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.tags?.some(t => t.toLowerCase().includes(q))
      )
    };
  },

  // STATS
  getStats() {
    return {
      totalWorlds: ETERNIVERSE_DATA.worlds.length,
      totalBooks: ETERNIVERSE_DATA.books.length,
      publishedBooks: ETERNIVERSE_DATA.books.filter(
        b => b.status === 'opublikowana'
      ).length
    };
  },

  // EXPORT
  exportJSON() {
    const blob = new Blob(
      [JSON.stringify(ETERNIVERSE_DATA, null, 2)],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'eterniverse-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  }
};

// =========================
// GLOBAL EXPORT
// =========================
window.EterniverseData = ETERNIVERSE_DATA;
window.DataAPI = DataAPI;

console.log('📦 ETERNIVERSE DATA READY');