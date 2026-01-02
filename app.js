// ETERNIVERSE – Rozszerzony Kod JS z pełną edycją ksiąg (Full CRUD)
// Dodawanie, edycja, usuwanie ksiąg w każdej bramie + zapis w localStorage

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

const STORAGE_KEY = 'eterniverse_data_v4';

// Wbudowana baza danych ETERNIVERSE – Pełne 10 Bram kanonicznych
let DATA = {
  "system": "ETERNIVERSE",
  "version": "4.1 Full CRUD",
  "architect": "Maciej Maciuszek",
  "worlds": [
    {
      "id": "core",
      "name": "ETERUNIVERSE – Rdzeń",
      "description": "Centralny system nawigacji świadomości. Mapa przejścia ból → świadomość → wola → obfitość → integracja.",
      "gates": [
        { "id": 1, "name": "BRAMA I — INTERSEEKER", "color": "#28D3C6", "sub": "Psychika · Cień · Trauma", "tag": "CORE/PSYCHE", "books": [] },
        { "id": 2, "name": "BRAMA II — CUSTOS / GENEZA", "color": "#D9A441", "sub": "Strażnik · Początek", "tag": "CORE/ORIGIN", "books": [] },
        { "id": 3, "name": "BRAMA III — ETERSEEKER", "color": "#12C65B", "sub": "Wola · Pole · Architektura", "tag": "CORE/FIELD", "books": [] },
        { "id": 4, "name": "BRAMA IV — ARCHETYPY / WOLA", "color": "#9B6BFF", "sub": "Role · Przeznaczenie", "tag": "CORE/WILL", "books": [] },
        { "id": 5, "name": "BRAMA V — OBFITOSEEKER", "color": "#FFB14B", "sub": "Obfitość · Przepływ", "tag": "EMBODIED/FLOW", "books": [] },
        { "id": 6, "name": "BRAMA VI — BIOSEEKER", "color": "#FF6B6B", "sub": "Ciało · Biologia", "tag": "EMBODIED/BIO", "books": [] },
        { "id": 7, "name": "BRAMA VII — SPLĄTANIE / AI", "color": "#9B6BFF", "sub": "Obserwator · Technologia", "tag": "META/TECH", "books": [] },
        { "id": 8, "name": "BRAMA VIII — TRAJEKTORIE", "color": "#28D3C6", "sub": "Czas · Linie życia", "tag": "META/PHYSICS", "books": [] },
        { "id": 9, "name": "BRAMA IX — ETERNIONY / KOLEKTYW", "color": "#D9A441", "sub": "Wspólnota · Węzły", "tag": "COLLECTIVE", "books": [] },
        { "id": 10, "name": "BRAMA X — ETERUNIVERSE", "color": "#12C65B", "sub": "Integracja · Absolut", "tag": "INTEGRATION", "books": [] }
      ]
    }
  ]
};

let currentWorld = null;
let currentGate = null;

// Ładowanie z localStorage
function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    DATA = JSON.parse(saved);
    logMessage('Dane załadowane z pamięci lokalnej');
  }
}

// Zapisywanie do localStorage
function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DATA));
  logMessage('Dane zapisane');
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
  `;

  world.gates.forEach(gate => renderGate(gate));
  logMessage(`Otworzono świat: ${world.name}`);
}

// Renderowanie pojedynczej bramy
function renderGate(gate) {
  const gateDiv = document.createElement('div');
  gateDiv.style.cssText = 'margin:48px 0;padding:32px;background:linear-gradient(145deg,#08121c,#0f2138);border-radius:24px;box-shadow:0 16px 60px rgba(0,0,0,0.8);border-left:8px solid ' + gate.color + ';';

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
    tag.style.cssText = 'display:block;text-align:center;margin-bottom:24px;font-size:16px;padding:12px 32px;background:linear-gradient(135deg,rgba(217,164,65,0.2),rgba(40,211,198,0.2));color:#D9A441;border-radius:50px;letter-spacing:2px;font-weight:800;box-shadow:0 8px 24px rgba(217,164,65,0.3);';
    gateDiv.appendChild(tag);
  }

  const booksHeader = document.createElement('div');
  booksHeader.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin:24px 0;';
  booksHeader.innerHTML = `<strong style="font-size:18px;color:#E6F6F5;">Księgi (${gate.books.length})</strong>`;
  
  const addBtn = document.createElement('button');
  addBtn.textContent = '+ Dodaj księgę';
  addBtn.style.cssText = 'padding:8px 16px;background:#1e40af;border:none;border-radius:8px;color:#fff;cursor:pointer;';
  addBtn.onclick = () => addBook(gate);
  booksHeader.appendChild(addBtn);
  gateDiv.appendChild(booksHeader);

  if (gate.books.length > 0) {
    gate.books.forEach(book => {
      const bookDiv = document.createElement('div');
      bookDiv.style.cssText = 'padding:20px;margin:16px 0;background:rgba(15,33,56,0.5);border-radius:16px;border:1px solid rgba(255,255,255,0.1);position:relative;';
      
      bookDiv.innerHTML = `
        <strong style="display:block;font-size:20px;color:#E6F6F5;margin-bottom:8px;">📘 ${escapeHtml(book.title)}</strong>
        <span style="display:inline-block;padding:6px 16px;background:rgba(217,164,65,0.3);color:#D9A441;border-radius:20px;font-size:14px;">${escapeHtml(book.status || 'w przygotowaniu')}</span>
        <p style="margin:12px 0;line-height:1.6;opacity:0.9;">${escapeHtml(book.content || 'Brak treści')}</p>
      `;

      const actions = document.createElement('div');
      actions.style.cssText = 'position:absolute;top:16px;right:16px;';
      actions.innerHTML = `
        <button style="margin-left:8px;padding:6px 12px;background:#2563eb;border:none;border-radius:6px;color:#fff;cursor:pointer;font-size:12px;" onclick="editBook(this.closest('.gate'), this.closest('div'), event)">Edytuj</button>
        <button style="margin-left:8px;padding:6px 12px;background:#dc2626;border:none;border-radius:6px;color:#fff;cursor:pointer;font-size:12px;" onclick="deleteBook(this.closest('.gate'), this.closest('div'), event)">Usuń</button>
      `;
      bookDiv.appendChild(actions);

      bookDiv.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') openBook(gate, book);
      });

      gateDiv.appendChild(bookDiv);
    });
  } else {
    const empty = document.createElement('p');
    empty.textContent = 'Brak opublikowanych ksiąg – kliknij + Dodaj księgę';
    empty.style.cssText = 'opacity:0.6;text-align:center;font-style:italic;';
    gateDiv.appendChild(empty);
  }

  elements.contentArea.appendChild(gateDiv);
}

// Otwieranie księgi
function openBook(gate, book) {
  elements.contentArea.innerHTML = `
    <button onclick="openWorld(currentWorld)" style="margin-bottom:24px;padding:12px 24px;background:#1e40af;border:none;border-radius:12px;color:#fff;cursor:pointer;">← Powrót do świata</button>
    <h2 style="color:${gate.color};margin:0 0 24px;font-size:36px;text-shadow:0 0 40px \( {gate.color}60;"> \){escapeHtml(book.title)}</h2>
    <p style="opacity:0.7;margin-bottom:32px;">${escapeHtml(gate.name)}</p>
    <div style="line-height:1.8;font-size:18px;opacity:0.95;">${escapeHtml(book.content || 'Brak treści')}</div>
  `;
  logMessage(`Otworzono księgę: ${book.title}`);
}

// Dodawanie księgi
function addBook(gate) {
  const title = prompt('Tytuł nowej księgi:');
  if (!title) return;
  const content = prompt('Treść księgi (opcjonalnie):', 'Nowa treść...');
  const status = prompt('Status (np. opublikowana, w pisaniu):', 'w pisaniu');

  const newBook = {
    id: (gate.books.length + 1),
    title,
    status,
    content
  };

  gate.books.push(newBook);
  saveData();
  renderGates();
  logMessage(`Dodano księgę: ${title}`);
}

// Edycja księgi
function editBook(gate, bookDiv, e) {
  e.stopPropagation();
  const book = gate.books.find(b => b.title === bookDiv.querySelector('strong').textContent.slice(2));

  const newTitle = prompt('Nowy tytuł:', book.title);
  if (newTitle) book.title = newTitle;
  const newContent = prompt('Nowa treść:', book.content);
  if (newContent !== null) book.content = newContent;
  const newStatus = prompt('Nowy status:', book.status);
  if (newStatus) book.status = newStatus;

  saveData();
  renderGates();
  logMessage(`Edytowano księgę: ${book.title}`);
}

// Usuwanie księgi
function deleteBook(gate, bookDiv, e) {
  e.stopPropagation();
  if (!confirm('Usunąć tę księgę?')) return;

  const bookTitle = bookDiv.querySelector('strong').textContent.slice(2);
  gate.books = gate.books.filter(b => b.title !== bookTitle);

  saveData();
  renderGates();
  logMessage(`Usunięto księgę: ${bookTitle}`);
}

// Log z timestampami
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
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  renderWorlds();
  logMessage(`System ETERNIVERSE v\( {DATA.version} – Załadowany ( \){DATA.worlds[0].gates.length} bram aktywnych)`);
});