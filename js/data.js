/* =========================
   DATA.JS — ETERNIVERSE CORE
   Autor: Maciej
   Wersja: 1.0.0
   ========================= */

const DATA = {
  meta: null,
  worlds: []
};

const STORAGE_KEY = 'ETERNIVERSE_DATA_V1';

/* =========================
   LOAD DATA
   ========================= */

async function loadData() {
  const local = localStorage.getItem(STORAGE_KEY);

  if (local) {
    try {
      const parsed = JSON.parse(local);
      DATA.meta = parsed.meta;
      DATA.worlds = parsed.worlds;
      console.log('[ETERNIVERSE] Loaded from localStorage');
      return;
    } catch (e) {
      console.error('[ETERNIVERSE] localStorage corrupted, loading mapa.json');
    }
  }

  // fallback: mapa.json
  const res = await fetch('./data/mapa.json');
  const json = await res.json();

  DATA.meta = json.meta;
  DATA.worlds = json.worlds;

  saveData();
  console.log('[ETERNIVERSE] Loaded from mapa.json');
}

/* =========================
   SAVE DATA
   ========================= */

function saveData() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      {
        meta: DATA.meta,
        worlds: DATA.worlds
      },
      null,
      2
    )
  );
}

/* =========================
   HELPERS
   ========================= */

function getWorld(worldId) {
  return DATA.worlds.find(w => w.id === worldId);
}

function getGate(worldId, gateId) {
  const world = getWorld(worldId);
  if (!world) return null;
  return world.gates.find(g => g.id === gateId);
}

/* =========================
   ADD BOOK
   ========================= */

function addBook({ worldId, gateId, book }) {
  const gate = getGate(worldId, gateId);
  if (!gate) {
    console.error('Gate not found:', worldId, gateId);
    return;
  }

  const newBook = {
    id: crypto.randomUUID(),
    title: book.title || 'Nowa książka',
    description: book.description || '',
    status: book.status || 'draft',
    audiobook: book.audiobook || '',
    chapters: book.chapters || [],
    created: new Date().toISOString()
  };

  gate.books.push(newBook);
  saveData();

  return newBook;
}

/* =========================
   UPDATE BOOK
   ========================= */

function updateBook({ worldId, gateId, bookId, data }) {
  const gate = getGate(worldId, gateId);
  if (!gate) return;

  const book = gate.books.find(b => b.id === bookId);
  if (!book) return;

  Object.assign(book, data);
  saveData();
}

/* =========================
   REMOVE BOOK (opcjonalnie)
   ========================= */

function removeBook({ worldId, gateId, bookId }) {
  const gate = getGate(worldId, gateId);
  if (!gate) return;

  gate.books = gate.books.filter(b => b.id !== bookId);
  saveData();
}

/* =========================
   EXPORT
   ========================= */

function exportJSON() {
  const blob = new Blob(
    [JSON.stringify({ meta: DATA.meta, worlds: DATA.worlds }, null, 2)],
    { type: 'application/json' }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'eterniverse_export.json';
  a.click();
  URL.revokeObjectURL(url);
}

/* =========================
   INIT
   ========================= */

window.EterniverseData = {
  DATA,
  loadData,
  saveData,
  addBook,
  updateBook,
  removeBook,
  exportJSON
};