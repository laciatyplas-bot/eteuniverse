// Czysty JavaScript – Modułowa mapa ETERNIVERSE (bez HTML/CSS)

let DATA = null;

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

async function loadData(url = 'data/map.json') {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    DATA = await response.json();
    renderWorlds();
    logMessage(`System załadowany – ${DATA.worlds.length} światów dostępnych`);
  } catch (error) {
    logMessage(`Błąd ładowania danych: ${error.message}`);
    elements.worldList.innerHTML = '<div class="loading">Nie udało się załadować mapy</div>';
  }
}

function renderWorlds() {
  elements.worldList.innerHTML = '';
  DATA.worlds.forEach(world => {
    const button = document.createElement('button');
    button.textContent = `\( {world.name} ( \){world.gates?.length || 0} bram)`;
    button.addEventListener('click', () => openWorld(world));
    elements.worldList.appendChild(button);
  });
}

function openWorld(world) {
  elements.contentArea.innerHTML = `<h2>${escapeHtml(world.name)}</h2>`;
  
  if (world.description) {
    const desc = document.createElement('p');
    desc.textContent = world.description;
    desc.style.opacity = '0.8';
    desc.style.marginBottom = '24px';
    elements.contentArea.appendChild(desc);
  }

  (world.gates || []).forEach(gate => {
    const gateDiv = document.createElement('div');
    gateDiv.className = 'gate';

    const h3 = document.createElement('h3');
    h3.textContent = escapeHtml(gate.name);
    gateDiv.appendChild(h3);

    if (gate.books && gate.books.length > 0) {
      gate.books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book';
        bookDiv.textContent = `📘 ${escapeHtml(book.title)} ${book.status ? '(' + escapeHtml(book.status) + ')' : ''}`;
        bookDiv.style.cursor = 'pointer';
        bookDiv.addEventListener('click', () => {
          alert(book.content || 'Treść księgi niedostępna');
        });
        gateDiv.appendChild(bookDiv);
      });
    } else {
      const empty = document.createElement('p');
      empty.textContent = 'Brak ksiąg';
      empty.style.opacity = '0.6';
      gateDiv.appendChild(empty);
    }

    elements.contentArea.appendChild(gateDiv);
  });

  logMessage(`Otworzono świat: ${world.name}`);
}

function logMessage(message) {
  const timestamp = new Date().toLocaleTimeString();
  elements.log.textContent += `[${timestamp}] ${message}\n`;
  elements.log.scrollTop = elements.log.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Inicjalizacja po załadowaniu DOM
document.addEventListener('DOMContentLoaded', () => {
  loadData();
});