const selectors = {
  worldList: '#worldList',
  contentArea: '#contentArea',
  log: '#log',
  searchInput: '#searchInput',
  filterSelect: '#filterSelect',
  sortSelect: '#sortSelect',
  themeToggle: '#themeToggle'
};

const elements = {
  worldList: document.querySelector(selectors.worldList),
  contentArea: document.querySelector(selectors.contentArea),
  log: document.querySelector(selectors.log),
  searchInput: document.querySelector(selectors.searchInput),
  filterSelect: document.querySelector(selectors.filterSelect),
  sortSelect: document.querySelector(selectors.sortSelect),
  themeToggle: document.querySelector(selectors.themeToggle)
};

// Wbudowana baza danych ETERNIVERSE – Pełne 10 Bram kanonicznych (2026)
const DATA = {
  "system": "ETERNIVERSE",
  "version": "3.0 Ultimate",
  "architect": "Maciej Maciuszek",
  "worlds": [
    {
      "id": "core",
      "name": "ETERUNIVERSE – Rdzeń",
      "description": "Centralny system nawigacji świadomości. Mapa przejścia ból → świadomość → wola → obfitość → integracja. Fundament całej architektury rzeczywistości.",
      "gates": [
        { "id": 1, "name": "BRAMA I — INTERSEEKER", "color": "#28D3C6", "sub": "Psychika · Cień · Trauma · Mechanizmy przetrwania", "tag": "CORE/PSYCHE", "books": 3, "status": "aktywna" },
        { "id": 2, "name": "BRAMA II — CUSTOS / GENEZA", "color": "#D9A441", "sub": "Strażnik · Rdzeń · Początek · Błąd pierwotny", "tag": "CORE/ORIGIN", "books": 1, "status": "planowana" },
        { "id": 3, "name": "BRAMA III — ETERSEEKER", "color": "#12C65B", "sub": "Wola · Pole · Architektura rzeczywistości", "tag": "CORE/FIELD", "books": 3, "status": "aktywna" },
        { "id": 4, "name": "BRAMA IV — ARCHETYPY / WOLA", "color": "#9B6BFF", "sub": "Konstrukcja · Role · Przeznaczenie", "tag": "CORE/WILL", "books": 1, "status": "planowana" },
        { "id": 5, "name": "BRAMA V — OBFITOSEEKER", "color": "#FFB14B", "sub": "Materia · Przepływ · Manifestacja · Obfitość", "tag": "EMBODIED/FLOW", "books": 2, "status": "aktywna" },
        { "id": 6, "name": "BRAMA VI — BIOSEEKER", "color": "#FF6B6B", "sub": "Ciało · Biologia · Regulacja · Hardware", "tag": "EMBODIED/BIO", "books": 1, "status": "w przygotowaniu" },
        { "id": 7, "name": "BRAMA VII — SPLĄTANIE / AI", "color": "#9B6BFF", "sub": "Obserwator · Meta-tożsamość · Technologia", "tag": "META/TECH", "books": 3, "status": "aktywna" },
        { "id": 8, "name": "BRAMA VIII — TRAJEKTORIE", "color": "#28D3C6", "sub": "Kod Życia · Linie Czasu · Fizyka Duszy", "tag": "META/PHYSICS", "books": 1, "status": "planowana" },
        { "id": 9, "name": "BRAMA IX — ETERNIONY / KOLEKTYW", "color": "#D9A441", "sub": "Węzły Pola · Wspólnota · Misja zbiorowa", "tag": "COLLECTIVE", "books": 1, "status": "idea" },
        { "id": 10, "name": "BRAMA X — ETERUNIVERSE", "color": "#12C65B", "sub": "Integracja · Jedność · Architekt · Absolut", "tag": "INTEGRATION", "books": 1, "status": "planowana" }
      ]
    }
  ]
};

let currentWorld = null;
let filteredGates = [];

// Renderowanie listy światów
function renderWorlds() {
  elements.worldList.innerHTML = '';
  DATA.worlds.forEach(world => {
    const button = document.createElement('button');
    button.textContent = `\( {world.name} ( \){world.gates.length} bram)`;
    button.style.cssText = 'display:block;width:100%;padding:24px;margin:20px 0;border:none;border-radius:24px;background:linear-gradient(135deg,#0f2138,#071626);color:#E6F6F5;font-size:24px;font-weight:700;cursor:pointer;box-shadow:0 16px 60px rgba(0,0,0,0.7);transition:all 0.6s ease;';
    button.addEventListener('mouseover', () => button.style.transform = 'translateY(-12px) scale(1.04)');
    button.addEventListener('mouseout', () => button.style.transform = 'translateY(0) scale(1)');
    button.addEventListener('click', () => openWorld(world));
    elements.worldList.appendChild(button);
  });
}

// Otwieranie świata
function openWorld(world) {
  currentWorld = world;
  filteredGates = world.gates.slice();
  renderGates();
  logMessage(`Otworzono świat: ${world.name}`);
}

// Renderowanie bram z filtrowaniem
function renderGates() {
  elements.contentArea.innerHTML = `
    <h2 style="color:#D9A441;margin:0 0 40px;font-size:40px;text-align:center;text-shadow:0 8px 32px rgba(217,164,65,0.5);">${escapeHtml(currentWorld.name)}</h2>
    <p style="opacity:0.9;font-size:20px;line-height:1.8;margin-bottom:48px;text-align:center;max-width:1000px;">${escapeHtml(currentWorld.description)}</p>
  `;

  filteredGates.forEach(gate => {
    const gateDiv = document.createElement('div');
    gateDiv.style.cssText = 'margin:56px 0;padding:40px;background:linear-gradient(145deg,#08121c,#0f2138);border-radius:28px;box-shadow:0 20px 80px rgba(0,0,0,0.8);border-left:12px solid ' + gate.color + ';transition:all 0.6s ease;';
    gateDiv.addEventListener('mouseover', () => gateDiv.style.transform = 'translateY(-8px) scale(1.02)');
    gateDiv.addEventListener('mouseout', () => gateDiv.style.transform = 'translateY(0) scale(1)');

    const h3 = document.createElement('h3');
    h3.textContent = escapeHtml(gate.name);
    h3.style.cssText = 'color:' + gate.color + ';margin:0 0 24px;font-size:32px;text-align:center;text-shadow:0 0 40px ' + gate.color + '60;';
    gateDiv.appendChild(h3);

    const sub = document.createElement('p');
    sub.textContent = gate.sub;
    sub.style.cssText = 'margin:0 0 32px;text-align:center;opacity:0.9;font-size:18px;';
    gateDiv.appendChild(sub);

    const tag = document.createElement('span');
    tag.textContent = gate.tag;
    tag.style.cssText = 'display:block;text-align:center;margin-bottom:32px;font-size:18px;padding:14px 40px;background:linear-gradient(135deg,rgba(217,164,65,0.25),rgba(40,211,198,0.25));color:#D9A441;border-radius:60px;letter-spacing:2.5px;font-weight:800;box-shadow:0 12px 32px rgba(217,164,65,0.4);';
    gateDiv.appendChild(tag);

    const info = document.createElement('p');
    info.textContent = `${gate.books} ksiąg | Status: ${gate.status}`;
    info.style.cssText = 'text-align:center;opacity:0.8;font-size:18px;font-style:italic;';
    gateDiv.appendChild(info);

    elements.contentArea.appendChild(gateDiv);
  });
}

// Wyszukiwanie
function setupSearch() {
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      filteredGates = currentWorld.gates.filter(gate => 
        gate.name.toLowerCase().includes(query) || 
        gate.sub.toLowerCase().includes(query) || 
        gate.tag.toLowerCase().includes(query)
      );
      renderGates();
    });
  }
}

// Filtr statusu
function setupFilter() {
  if (elements.filterSelect) {
    elements.filterSelect.addEventListener('change', (e) => {
      const filter = e.target.value;
      if (filter === 'all') {
        filteredGates = currentWorld.gates.slice();
      } else {
        filteredGates = currentWorld.gates.filter(gate => gate.status === filter);
      }
      renderGates();
    });
  }
}

// Sortowanie
function setupSort() {
  if (elements.sortSelect) {
    elements.sortSelect.addEventListener('change', (e) => {
      const criterion = e.target.value;
      filteredGates.sort((a, b) => {
        if (criterion === 'id') return a.id - b.id;
        if (criterion === 'books') return b.books - a.books;
        if (criterion === 'name') return a.name.localeCompare(b.name);
        if (criterion === 'status') return a.status.localeCompare(b.status);
        return 0;
      });
      renderGates();
    });
  }
}

// Dark/Light mode toggle
function setupThemeToggle() {
  if (elements.themeToggle) {
    elements.themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      elements.themeToggle.textContent = isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
      logMessage(`Tryb przełączony na ${isLight ? 'jasny' : 'ciemny'}`);
    });
  }
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
  div.textContent = text;
  return div.innerHTML;
}

// Inicjalizacja
document.addEventListener('DOMContentLoaded', () => {
  renderWorlds();
  setupSearch();
  setupFilter();
  setupSort();
  setupThemeToggle();
  logMessage(`System ETERNIVERSE v\( {DATA.version} – Załadowany ( \){DATA.worlds[0].gates.length} bram aktywnych)`);
});