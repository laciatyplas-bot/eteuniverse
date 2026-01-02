// ETERNIVERSE – Ultimate Edition JS (wszystkie ulepszenia zintegrowane + poprawione ładowanie ksiąg)
// Pełna edycja światów, bram i ksiąg + IndexedDB + ładowanie z map.json + przykładowe księgi w danych domyślnych

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

// Ładowanie danych: najpierw map.json, potem IndexedDB, na końcu domyślne
async function loadData() {
  if (!db) await openDB();

  // 1. Próba z map.json
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
    renderWorlds();
    return;
  }

  // 3. Domyślne dane z przykładowymi księgami
  DATA = getDefaultData();
  saveToIndexedDB();
  logMessage('Załadowno domyślne dane z przykładowymi księgami');
  renderWorlds();
}

// Pobieranie z IndexedDB
function getFromIndexedDB() {
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get('core_data');
    request.onsuccess = () => resolve(request.result ? request.result.data : null);
    request.onerror = () => resolve(null);
  });
}

// Zapisywanie do IndexedDB
function saveToIndexedDB() {
  if (!db) return;
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  store.put({ id: 'core_data', data: DATA });
}

// Domyślne dane z przykładowymi księgami
function getDefaultData() {
  return {
    "system": "ETERNIVERSE",
    "version": "Ultimate 2026",
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
            "sub": "Psychika · Cień · Trauma · Mechanizmy przetrwania",
            "tag": "CORE/PSYCHE",
            "books": [
              {
                "id": "book1",
                "title": "INTERSEEKER: Geneza",
                "status": "opublikowana",
                "content": "Surowa autobiograficzna historia spod pieca – dzieciństwo, trauma, ogień jako symbol odrodzenia."
              },
              {
                "id": "book2",
                "title": "InterSeeker – Atlas Wewnętrzny",
                "status": "opublikowana",
                "content": "Podręcznik konfrontacji z Cieniem i mechanizmami przetrwania."
              },
              {
                "id": "book3",
                "title": "INTERSEEKER: Efekt Cienia",
                "status": "opublikowana",
                "content": "Tom 2 serii – test na nowe życie."
              }
            ]
          },
          {
            "id": "2",
            "name": "BRAMA II — CUSTOS / GENEZA",
            "color": "#D9A441",
            "sub": "Strażnik · Rdzeń · Początek · Błąd pierwotny",
            "tag": "CORE/ORIGIN",
            "books": []
          },
          {
            "id": "3",
            "name": "BRAMA III — ETERSEEKER",
            "color": "#12C65B",
            "sub": "Wola · Pole · Architektura rzeczywistości",
            "tag": "CORE/FIELD",
            "books": [
              {
                "id": "book4",
                "title": "EterSeeker: Kronika Woli",
                "status": "opublikowana (Amazon)",
                "content": "Protokół reprogramowania woli za pomocą oddechu, częstotliwości i spójności pola."
              },
              {
                "id": "book5",
                "title": "Interfejs Świadomości",
                "status": "opublikowana (#1 metafizyka)",
                "content": "Nauka czytania znaków rzeczywistości jako komunikatów pola."
              }
            ]
          },
          {
            "id": "4",
            "name": "BRAMA IV — ARCHETYPY / WOLA",
            "color": "#9B6BFF",
            "sub": "Konstrukcja · Role · Przeznaczenie",
            "tag": "CORE/WILL",
            "books": []
          },
          {
            "id": "5",
            "name": "BRAMA V — OBFITOSEEKER",
            "color": "#FFB14B",
            "sub": "Materia · Przepływ · Manifestacja · Obfitość",
            "tag": "EMBODIED/FLOW",
            "books": [
              {
                "id": "book6",
                "title": "ObfitoSeeker – Kod Obfitości",
                "status": "opublikowana",
                "content": "Kod, który nie mówi o pieniądzach – mówi o regułach gry i powrocie do syna."
              }
            ]
          },
          {
            "id": "6",
            "name": "BRAMA VI — BIOSEEKER",
            "color": "#FF6B6B",
            "sub": "Ciało · Biologia · Regulacja · Hardware",
            "tag": "EMBODIED/BIO",
            "books": []
          },
          {
            "id": "7",
            "name": "BRAMA VII — SPLĄTANIE / AI",
            "color": "#9B6BFF",
            "sub": "Obserwator · Meta-tożsamość · Technologia",
            "tag": "META/TECH",
            "books": []
          },
          {
            "id": "8",
            "name": "BRAMA VIII — TRAJEKTORIE",
            "color": "#28D3C6",
            "sub": "Kod Życia · Linie Czasu · Fizyka Duszy",
            "tag": "META/PHYSICS",
            "books": []
          },
          {
            "id": "9",
            "name": "BRAMA IX — ETERNIONY / KOLEKTYW",
            "color": "#D9A441",
            "sub": "Węzły Pola · Wspólnota · Misja zbiorowa",
            "tag": "COLLECTIVE",
            "books": []
          },
          {
            "id": "10",
            "name": "BRAMA X — ETERUNIVERSE",
            "color": "#12C65B",
            "sub": "Integracja · Jedność · Architekt · Absolut",
            "tag": "INTEGRATION",
            "books": []
          }
        ]
      }
    ]
  };
}

// Renderowanie listy światów
function renderWorlds() {
  elements.worldList.innerHTML = '';
  DATA.worlds.forEach(world => {
    const button = document.createElement('button');
    button.textContent = `\( {world.name} ( \){world.gates.length} bram)`;
    button.style.cssText = 'display:block;width:100%;padding:20px;margin:16px 0;border:none;border-radius:20px;background:linear-gradient(135deg,#0f2138,#071626);color:#E6F6F5;font-size:22px;font-weight:700;cursor:pointer;box-shadow:0 12px 40px rgba(0,0,0,0.6);transition:all 0.5s ease;';
    button.addEventListener('mouseover', () => button.style.transform = 'translateY(-8px) scale(1.03)');
    button.addEventListener('mouseout', () => button.style.transform = 'translateY(0) scale(1)');
    button.addEventListener('click', () => openWorld(world));
    elements.worldList.appendChild(button);
  });
}

// Otwieranie świata
function openWorld(world) {
  currentWorld = world;
  elements.contentArea.innerHTML = `
    <h2 style="color:#D9A441;margin:0 0 32px;font-size:36px;text-align:center;text-shadow:0 8px 32px rgba(217,164,65,0.4);">${escapeHtml(world.name)}</h2>
    <p style="opacity:0.9;font-size:18px;line-height:1.8;margin-bottom:40px;text-align:center;max-width:900px;">${escapeHtml(world.description)}</p>
    <button style="margin-bottom:40px;padding:16px 32px;background:#1e40af;border:none;border-radius:12px;color:#fff;cursor:pointer;font-weight:600;" onclick="addGate()">+ Dodaj nową Bramę</button>
  `;

  world.gates.forEach(gate => renderGate(gate));
  logMessage(`Otworzono świat: ${world.name}`);
}

// Renderowanie bramy z księgami
function renderGate(gate) {
  const gateDiv = document.createElement('div');
  gateDiv.style.cssText = 'margin:48px 0;padding:32px;background:linear-gradient(145deg,#08121c,#0f2138);border-radius:24px;box-shadow:0 16px 60px rgba(0,0,0,0.8);border-left:8px solid ' + gate.color + ';position:relative;';

  const h3 = document.createElement('h3');
  h3.textContent = escapeHtml(gate.name);
  h3.style.cssText = 'color:' + gate.color + ';margin:0 0 16px;font-size:28px;text-shadow:0 0 30px ' + gate.color + '40;';
  gateDiv.appendChild(h3);

  if (gate.sub) {
    const sub = document.createElement('p');
    sub.textContent = gate.sub;
    sub.style.cssText = 'margin:0 0 24px;opacity:0.85;font-size:16px;text-align:center;';
    gateDiv.appendChild(sub);
  }

  if (gate.tag) {
    const tag = document.createElement('span');
    tag.textContent = gate.tag;
    tag.style.cssText = 'display:block;text-align:center;margin-bottom:24px;font-size:16px;padding:12px 32px;background:linear-gradient(135deg,rgba(217,164,65,0.25),rgba(40,211,198,0.25));color:#D9A441;border-radius:60px;letter-spacing:2px;font-weight:800;box-shadow:0 12px 32px rgba(217,164,65,0.4);';
    gateDiv.appendChild(tag);
  }

  const booksHeader = document.createElement('div');
  booksHeader.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin:32px 0 16px;';
  booksHeader.innerHTML = `<strong style="font-size:20px;color:#E6F6F5;">Księgi (${gate.books.length})</strong>`;
  
  const addBtn = document.createElement('button');
  addBtn.textContent = '+ Dodaj księgę';
  addBtn.style.cssText = 'padding:10px 20px;background:#1e40af;border:none;border-radius:12px;color:#fff;cursor:pointer;font-weight:600;';
  addBtn.onclick = () => addBook(gate);
  booksHeader.appendChild(addBtn);
  gateDiv.appendChild(booksHeader);

  if (gate.books.length > 0) {
    gate.books.forEach(book => {
      const bookDiv = document.createElement('div');
      bookDiv.style.cssText = 'padding:24px;margin:20px 0;background:rgba(15,33,56,0.5);border-radius:20px;border:1px solid rgba(255,255,255,0.1);position:relative;transition:all 0.4s ease;';
      bookDiv.addEventListener('mouseover', () => bookDiv.style.transform = 'translateX(16px) scale(1.02)');
      bookDiv.addEventListener('mouseout', () => bookDiv.style.transform = 'translateX(0) scale(1)');

      bookDiv.innerHTML = `
        <strong style="display:block;font-size:22px;color:#E6F6F5;margin-bottom:12px;">📘 ${escapeHtml(book.title)}</strong>
        <span style="display:inline-block;padding:8px 20px;background:rgba(217,164,65,0.3);color:#D9A441;border-radius:30px;font-size:14px;font-weight:800;">${escapeHtml(book.status || 'w przygotowaniu')}</span>
        <p style="margin:16px 0 0;line-height:1.6;opacity:0.9;">${escapeHtml(book.content || 'Brak treści')}</p>
      `;

      const actions = document.createElement('div');
      actions.style.cssText = 'position:absolute;top:20px;right:20px;display:flex;gap:8px;opacity:0;transition:opacity 0.3s;';
      actions.innerHTML = `
        <button style="padding:8px 16px;background:#2563eb;border:none;border-radius:8px;color:#fff;cursor:pointer;font-size:13px;" onclick="editBook(event, '\( {gate.id}', ' \){book.id}')">Edytuj</button>
        <button style="padding:8px 16px;background:#dc2626;border:none;border-radius:8px;color:#fff;cursor:pointer;font-size:13px;" onclick="deleteBook(event, '\( {gate.id}', ' \){book.id}')">Usuń</button>
      `;
      bookDiv.appendChild(actions);
      bookDiv.addEventListener('mouseover', () => actions.style.opacity = '1');
      bookDiv.addEventListener('mouseout', () => actions.style.opacity = '0');

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
function addBook(gate) {
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
  logMessage(`System ETERNIVERSE Ultimate – Załadowany z księgami`);
});