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

// ====== DANE ======
const DATA = {
  system: "ETERNIVERSE",
  version: "3.1",
  architect: "Maciej Maciuszek",
  worlds: [
    {
      id: "core",
      name: "ETERUNIVERSE — Rdzeń",
      description: "Mapa przejścia ból → świadomość → wola → integracja.",
      gates: [
        {
          id: 1,
          name: "BRAMA I — INTERSEEKER",
          color: "#28D3C6",
          sub: "Psychika · Cień · Trauma",
          books: [
            {
              title: "InterSeeker – Atlas Wewnętrzny",
              status: "opublikowana",
              content: "Podróż w głąb psyche. To nie jest motywacja. To rozbiór."
            }
          ]
        },
        {
          id: 2,
          name: "BRAMA II — ETERSEEKER",
          color: "#D9A441",
          sub: "Wola · Pole · Architektura",
          books: [
            {
              title: "EterSeeker – Architektura Woli",
              status: "opublikowana",
              content: "Wola nie jest życzeniem. Jest funkcją systemu."
            }
          ]
        }
      ]
    }
  ]
};

// ====== STAN ======
let currentWorld = null;
let currentGate = null;

// ====== RENDER ŚWIATÓW ======
function renderWorlds() {
  elements.worldList.innerHTML = '';
  DATA.worlds.forEach(world => {
    const btn = document.createElement('button');
    btn.textContent = world.name;
    btn.style.cssText = buttonStyle();
    btn.onclick = () => openWorld(world);
    elements.worldList.appendChild(btn);
  });
}

// ====== OTWARCIE ŚWIATA ======
function openWorld(world) {
  currentWorld = world;
  elements.contentArea.innerHTML = `
    <h2 style="color:#D9A441">${world.name}</h2>
    <p style="opacity:.8">${world.description}</p>
  `;
  world.gates.forEach(gate => renderGate(gate));
  log(`Otworzono świat: ${world.name}`);
}

// ====== RENDER BRAMY ======
function renderGate(gate) {
  const div = document.createElement('div');
  div.style.cssText = `
    margin:24px 0;
    padding:20px;
    border-left:6px solid ${gate.color};
    background:#08121c;
    border-radius:12px;
  `;

  div.innerHTML = `
    <h3 style="color:${gate.color}">${gate.name}</h3>
    <p style="opacity:.7">${gate.sub}</p>
  `;

  gate.books.forEach(book => {
    const b = document.createElement('div');
    b.textContent = `📘 ${book.title} (${book.status})`;
    b.style.cssText = bookStyle();
    b.onclick = () => openBook(gate, book);
    div.appendChild(b);
  });

  elements.contentArea.appendChild(div);
}

// ====== OTWARCIE KSIĄŻKI ======
function openBook(gate, book) {
  currentGate = gate;

  elements.contentArea.innerHTML = `
    <button onclick="openWorld(currentWorld)"
      style="margin-bottom:16px;background:none;border:none;color:#D9A441;cursor:pointer;font-size:16px;">
      ← Powrót
    </button>

    <h2 style="color:${gate.color}">${book.title}</h2>
    <p style="opacity:.7">${gate.name}</p>

    <div style="margin-top:24px;line-height:1.7;font-size:16px;">
      ${escapeHtml(book.content)}
    </div>

    <hr style="margin:40px 0;opacity:.2">

    <p style="opacity:.6;font-size:14px">
      🔒 Rozdziały / edytor / tryb czytania — moduł gotowy do podpięcia
    </p>
  `;

  log(`Otworzono książkę: ${book.title}`);
}

// ====== LOG ======
function log(msg) {
  if (!elements.log) return;
  const t = new Date().toLocaleTimeString();
  elements.log.textContent += `[${t}] ${msg}\n`;
  elements.log.scrollTop = elements.log.scrollHeight;
}

// ====== STYLES ======
function buttonStyle() {
  return `
    display:block;
    width:100%;
    padding:14px;
    margin:12px 0;
    background:#071626;
    color:#E6F6F5;
    border:none;
    border-radius:12px;
    font-size:18px;
    cursor:pointer;
  `;
}

function bookStyle() {
  return `
    margin:8px 0;
    padding:10px;
    background:rgba(255,255,255,.04);
    border-radius:8px;
    cursor:pointer;
  `;
}

// ====== SECURITY ======
function escapeHtml(text) {
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}

// ====== INIT ======
document.addEventListener('DOMContentLoaded', () => {
  renderWorlds();
  log(`ETERNIVERSE ${DATA.version} — gotowy`);
});