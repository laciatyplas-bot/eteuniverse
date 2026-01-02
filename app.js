// ETERNIVERSE – Master Edition JS (pełny, kompletny kod z obsługą wielu światów, pełną edycją i księgami)

const selectors = {
  worldList: '#worldList',
  contentArea: '#contentArea',
  log: '#log'
};

const elements = {
  worldList: document.querySelector(selectors.worldList),
  contentArea: document.querySelector(selectors.contentArea),
  log: document.querySelector(selectors.log)
};

const DB_NAME = 'EterniverseDB';
const DB_VERSION = 1;
const STORE_NAME = 'eterniverse_data';
let db = null;
let DATA = null;

let currentWorld = null;

// Otwarcie IndexedDB
async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    request.onupgradeneeded = (e) => {
      db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

// Ładowanie danych
async function loadData() {
  if (!db) await openDB();

  // 1. map.json
  try {
    const res = await fetch('map.json?' + Date.now());
    if (res.ok) {
      DATA = await res.json();
      saveToIndexedDB();
      logMessage('Dane załadowane z map.json');
      renderWorlds();
      return;
    }
  } catch (err) {
    logMessage('map.json niedostępny – ładowanie z IndexedDB');
  }

  // 2. IndexedDB
  const saved = await getFromIndexedDB();
  if (saved) {
    DATA = saved;
    logMessage('Dane załadowane z IndexedDB');
  } else {
    DATA = getDefaultData();
    logMessage('Załadowno domyślne dane z przykładowymi księgami');
  }

  saveToIndexedDB();
  renderWorlds();
}

// Pobieranie z IndexedDB
function getFromIndexedDB() {
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get('core_data');
    request.onsuccess = () => resolve(request.result ? request.result.data : null);
  });
}

// Zapisywanie do IndexedDB
function saveToIndexedDB() {
  if (!db) return;
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  store.put({ id: 'core_data', data: DATA });
}

// Domyślne dane – dwa światy z przykładowymi księgami
function getDefaultData() {
  return {
    "system": "ETERNIVERSE",
    "version": "Multi-World Master 2026",
    "architect": "Maciej Maciuszek",
    "worlds": [
      {
        "id": "core",
        "name": "ETERUNIVERSE – Rdzeń",
        "description": "Centralny system nawigacji świadomości. Mapa przejścia ból → świadomość → wola → obfitość → integracja.",
        "gates": [
          {
            "id": "1",
            "name": "BRAMA I — INTERSEEKER",
            "color": "#28D3C6",
            "sub": "Psychika · Cień · Trauma",
            "tag": "CORE/PSYCHE",
            "books": [
              { "id": "b1", "title": "INTERSEEKER: Geneza", "status": "opublikowana", "content": "Surowa autobiograficzna historia spod pieca – dzieciństwo, trauma, ogień jako symbol odrodzenia." },
              { "id": "b2", "title": "InterSeeker – Atlas Wewnętrzny", "status": "opublikowana", "content": "Podręcznik konfrontacji z Cieniem i mechanizmami przetrwania." },
              { "id": "b3", "title": "INTERSEEKER: Efekt Cienia", "status": "opublikowana", "content": "Tom 2 serii – test na nowe życie." }
            ]
          },
          {
            "id": "3",
            "name": "BRAMA III — ETERSEEKER",
            "color": "#12C65B",
            "sub": "Wola · Pole · Architektura rzeczywistości",
            "tag": "CORE/FIELD",
            "books": [
              { "id": "b4", "title": "EterSeeker: Kronika Woli", "status": "opublikowana", "content": "Protokół reprogramowania woli za pomocą oddechu, częstotliwości i spójności pola." }
            ]
          },
          { "id": "2", "name": "BRAMA II — CUSTOS / GENEZA", "color": "#D9A441", "sub": "Strażnik · Początek", "tag": "CORE/ORIGIN", "books": [] },
          { "id": "4", "name": "BRAMA IV — ARCHETYPY / WOLA", "color": "#9B6BFF", "sub": "Role · Przeznaczenie", "tag": "CORE/WILL", "books": [] },
          { "id": "5", "name": "BRAMA V — OBFITOSEEKER", "color": "#FFB14B", "sub": "Obfitość · Przepływ", "tag": "EMBODIED/FLOW", "books": [] },
          { "id": "6", "name": "BRAMA VI — BIOSEEKER", "color": "#FF6B6B", "sub": "Ciało · Biologia", "tag": "EMBODIED/BIO", "books": [] },
          { "id": "7", "name": "BRAMA VII — SPLĄTANIE / AI", "color": "#9B6BFF", "sub": "Obserwator · Technologia", "tag": "META/TECH", "books": [] },
          { "id": "8", "name": "BRAMA VIII — TRAJEKTORIE", "color": "#28D3C6", "sub": "Czas · Linie życia", "tag": "META/PHYSICS", "books": [] },
          { "id": "9", "name": "BRAMA IX — ETERNIONY / KOLEKTYW", "color": "#D9A441", "sub": "Wspólnota · Węzły", "tag": "COLLECTIVE", "books": [] },
          { "id": "10", "name": "BRAMA X — ETERUNIVERSE", "color": "#12C65B", "sub": "Integracja · Absolut", "tag": "INTEGRATION", "books": [] }
        ]
      },
      {
        "id": "polaris",
        "name": "POLARIS – Drugi Świat",
        "description": "Świat przejścia, testu i bram. 10 Kręgów inicjacji – droga do Lemurii i Krasnali.",
        "gates": [
          { "id": "p1", "name": "KRĄG I — PRZEBUDZENIE", "color": "#FFD700", "sub": "Chaos · Echa starego świata", "tag": "INITIATION", "books": [] },
          { "id": "p2", "name": "KRĄG II — CIAŁO I STRACH", "color": "#FF4500", "sub": "Ból · Przetrwanie · Pierwotność", "tag": "BODY", "books": [] },
          { "id": "p3", "name": "KRĄG III — WIĘŹ", "color": "#00CED1", "sub": "Relacje · Zaufanie · Zdrada", "tag": "BOND", "books": [] },
          { "id": "p4", "name": "KRĄG IV — TOŻSAMOŚĆ", "color": "#9370DB", "sub": "Maski · Role · Imię", "tag": "IDENTITY", "books": [] },
          { "id": "p5", "name": "KRĄG V — WOLA", "color": "#FF1493", "sub": "Decyzje · Cena · Mit", "tag": "WILL", "books": [] },
          { "id": "p6", "name": "KRĄG VI — BOGOWIE", "color": "#4169E1", "sub": "Olimp · Asgard · Systemy", "tag": "GODS", "books": [] },
          { "id": "p7", "name": "KRĄG VII — GŁĘBIA", "color": "#20B2AA", "sub": "Nieświadomość · Syreny · Emocje", "tag": "DEPTH", "books": [] },
          { "id": "p8", "name": "KRĄG VIII — HISTORIA", "color": "#8B4513", "sub": "Anak · Atlantis · Błędy", "tag": "HISTORY", "books": [] },
          { "id": "p9", "name": "KRĄG IX — LEMURIA", "color": "#00FF7F", "sub": "Technologia · Pokój · Kryształy", "tag": "LEMURIA", "books": [] },
          { "id": "p10", "name": "KRĄG X — POWRÓT", "color": "#FFD700", "sub": "Odpowiedzialność · Portal · Krasnale", "tag": "RETURN", "books": [] }
        ]
      }
    ]
  };
}

// Renderowanie listy światów z edycją
function renderWorlds() {
  elements.worldList.innerHTML = `
    <button class="add-world-btn" onclick="addWorld()">+ Dodaj nowy Świat</button>
  `;

  DATA.worlds.forEach(world => {
    const button = document.createElement('button');
    button.textContent = `\( {world.name} ( \){world.gates.length} bram)`;
    button.className = 'world-btn';
    button.onclick = () => openWorld(world);

    const actions = document.createElement('div');
    actions.className = 'world-actions';
    actions.innerHTML = `
      <button onclick="editWorld(event, '${world.id}')">Edytuj</button>
      <button onclick="deleteWorld(event, '${world.id}')">Usuń</button>
    `;
    button.appendChild(actions);

    elements.worldList.appendChild(button);
  });
}

// Dodawanie nowego świata
function addWorld() {
  const name = prompt('Nazwa nowego świata:');
  if (!name) return;
  const description = prompt('Opis świata:', 'Nowy świat w ETERNIVERSE');

  const newWorld = {
    id: Date.now().toString(),
    name,
    description,
    gates: []
  };

  DATA.worlds.push(newWorld);
  saveToIndexedDB();
  renderWorlds();
  logMessage(`Dodano nowy świat: ${name}`);
}

// Edycja świata
function editWorld(e, worldId) {
  e.stopPropagation();
  const world = DATA.worlds.find(w => w.id === worldId);
  if (!world) return;

  const newName = prompt('Nowa nazwa:', world.name);
  if (newName) world.name = newName;
  const newDesc = prompt('Nowy opis:', world.description);
  if (newDesc !== null) world.description = newDesc;

  saveToIndexedDB();
  renderWorlds();
  logMessage(`Edytowano świat: ${world.name}`);
}

// Usuwanie świata
function deleteWorld(e, worldId) {
  e.stopPropagation();
  if (!confirm('Usunąć cały świat wraz z bramami i księgami?')) return;

  DATA.worlds = DATA.worlds.filter(w => w.id !== worldId);
  saveToIndexedDB();
  renderWorlds();
  logMessage(`Usunięto świat ID ${worldId}`);
}

// Otwieranie świata
function openWorld(world) {
  currentWorld = world;
  elements.contentArea.innerHTML = `
    <h2>${escapeHtml(world.name)}</h2>
    <p>${escapeHtml(world.description)}</p>
    <button class="add-gate-btn" onclick="addGate()">+ Dodaj nową Bramę</button>
  `;

  world.gates.forEach(gate => renderGate(gate));
  logMessage(`Otworzono świat: ${world.name}`);
}

// Renderowanie bramy
function renderGate(gate) {
  const gateDiv = document.createElement('div');
  gateDiv.className = 'gate';
  gateDiv.style.setProperty('--gate-color', gate.color);

  gateDiv.innerHTML = `
    <h3>${escapeHtml(gate.name)}</h3>
    <p class="sub">${escapeHtml(gate.sub)}</p>
    <span class="tag">${escapeHtml(gate.tag)}</span>
    <div class="books-header">
      <strong>Księgi (${gate.books.length})</strong>
      <button class="add-book-btn" onclick="addBook('${gate.id}')">+ Dodaj księgę</button>
    </div>
  `;

  if (gate.books.length > 0) {
    gate.books.forEach(book => {
      const bookDiv = document.createElement('div');
      bookDiv.className = 'book';

      bookDiv.innerHTML = `
        <strong>📘 ${escapeHtml(book.title)}</strong>
        <span class="status">${escapeHtml(book.status || 'w przygotowaniu')}</span>
        <p>${escapeHtml(book.content || 'Brak treści')}</p>
        <div class="book-actions">
          <button class="edit-btn" onclick="editBook(event, '\( {gate.id}', ' \){book.id}')">Edytuj</button>
          <button class="delete-btn" onclick="deleteBook(event, '\( {gate.id}', ' \){book.id}')">Usuń</button>
        </div>
      `;

      bookDiv.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') openBook(gate, book);
      });

      gateDiv.appendChild(bookDiv);
    });
  } else {
    const empty = document.createElement('p');
    empty.textContent = 'Brak opublikowanych ksiąg – kliknij + Dodaj księgę';
    empty.style.cssText = 'opacity:0.6;text-align:center;font-style:italic;font-size:18px;';
    gateDiv.appendChild(empty);
  }

  // Akcje bramy
  const gateActions = document.createElement('div');
  gateActions.style.cssText = 'position:absolute;top:24px;right:24px;display:flex;gap:12px;';
  gateActions.innerHTML = `
    <button style="padding:10px 20px;background:#2563eb;border:none;border-radius:12px;color:#fff;cursor:pointer;font-weight:600;" onclick="editGate(event, '${gate.id}')">Edytuj Bramę</button>
    <button style="padding:10px 20px;background:#dc2626;border:none;border-radius:12px;color:#fff;cursor:pointer;font-weight:600;" onclick="deleteGate(event, '${gate.id}')">Usuń Bramę</button>
  `;
  gateDiv.appendChild(gateActions);

  elements.contentArea.appendChild(gateDiv);
}

// Dodawanie bramy
function addGate() {
  const name = prompt('Nazwa bramy:');
  if (!name) return;
  const color = prompt('Kolor HEX:', '#28D3C6');
  const sub = prompt('Podtytuł:', 'Nowa brama');
  const tag = prompt('Tag:', 'NEW');

  const newGate = {
    id: Date.now().toString(),
    name,
    color,
    sub,
    tag,
    books: []
  };

  currentWorld.gates.push(newGate);
  saveToIndexedDB();
  openWorld(currentWorld);
  logMessage(`Dodano bramę: ${name}`);
}

// Edycja bramy
function editGate(e, gateId) {
  e.stopPropagation();
  const gate = currentWorld.gates.find(g => g.id === gateId);
  if (!gate) return;

  const newName = prompt('Nowa nazwa:', gate.name);
  if (newName) gate.name = newName;
  const newColor = prompt('Nowy kolor HEX:', gate.color);
  if (newColor) gate.color = newColor;
  const newSub = prompt('Nowy podtytuł:', gate.sub);
  if (newSub !== null) gate.sub = newSub;
  const newTag = prompt('Nowy tag:', gate.tag);
  if (newTag !== null) gate.tag = newTag;

  saveToIndexedDB();
  openWorld(currentWorld);
  logMessage(`Edytowano bramę: ${gate.name}`);
}

// Usuwanie bramy
function deleteGate(e, gateId) {
  e.stopPropagation();
  if (!confirm('Usunąć bramę i wszystkie księgi?')) return;

  currentWorld.gates = currentWorld.gates.filter(g => g.id !== gateId);
  saveToIndexedDB();
  openWorld(currentWorld);
  logMessage(`Usunięto bramę ID ${gateId}`);
}

// Dodawanie księgi
function addBook(gateId) {
  const gate = currentWorld.gates.find(g => g.id === gateId);
  if (!gate) return;

  const title = prompt('Tytuł księgi:');
  if (!title) return;
  const content = prompt('Treść:', 'Nowa treść...');
  const status = prompt('Status:', 'w przygotowaniu');

  const newBook = {
    id: Date.now().toString(),
    title,
    status,
    content
  };

  gate.books.push(newBook);
  saveToIndexedDB();
  openWorld(currentWorld);
  logMessage(`Dodano księgę: ${title}`);
}

// Edycja księgi
function editBook(e, gateId, bookId) {
  e.stopPropagation();
  const gate = currentWorld.gates.find(g => g.id === gateId);
  const book = gate.books.find(b => b.id === bookId);
  if (!book) return;

  const newTitle = prompt('Nowy tytuł:', book.title);
  if (newTitle) book.title = newTitle;
  const newContent = prompt('Nowa treść:', book.content);
  if (newContent !== null) book.content = newContent;
  const newStatus = prompt('Nowy status:', book.status);
  if (newStatus) book.status = newStatus;

  saveToIndexedDB();
  openWorld(currentWorld);
  logMessage(`Edytowano księgę: ${book.title}`);
}

// Usuwanie księgi
function deleteBook(e, gateId, bookId) {
  e.stopPropagation();
  if (!confirm('Usunąć księgę?')) return;

  const gate = currentWorld.gates.find(g => g.id === gateId);
  gate.books = gate.books.filter(b => b.id !== bookId);

  saveToIndexedDB();
  openWorld(currentWorld);
  logMessage(`Usunięto księgę ID ${bookId}`);
}

// Otwieranie księgi
function openBook(gate, book) {
  elements.contentArea.innerHTML = `
    <button onclick="openWorld(currentWorld)" style="margin-bottom:32px;padding:16px 32px;background:#1e40af;border:none;border-radius:12px;color:#fff;cursor:pointer;font-weight:600;">← Powrót</button>
    <h2 style="color:${gate.color};margin:0 0 32px;font-size:40px;text-shadow:0 0 40px \( {gate.color}60;"> \){escapeHtml(book.title)}</h2>
    <p style="opacity:0.7;margin-bottom:32px;font-size:18px;">${escapeHtml(gate.name)}</p>
    <div style="line-height:1.8;font-size:18px;opacity:0.95;">${escapeHtml(book.content || 'Brak treści')}</div>
  `;
  logMessage(`Otworzono księgę: ${book.title}`);
}

// Log
function logMessage(message) {
  if (!elements.log) return;
  const timestamp = new Date().toLocaleTimeString();
  elements.log.textContent += `[${timestamp}] ${message}\n`;
  elements.log.scrollTop = elements.log.scrollHeight;
}

// Bezpieczeństwo
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

// Inicjalizacja
document.addEventListener('DOMContentLoaded', async () => {
  await openDB();
  await loadData();
  logMessage(`System ETERNIVERSE Multi-World – Załadowany (${DATA.worlds.length} światów aktywnych)`);
});