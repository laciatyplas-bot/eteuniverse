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

// Wbudowane dane ETERUNIVERSE – na podstawie aktualnej struktury systemu (stan na początek 2026)
DATA = {
  "system": "ETERUNIVERSE",
  "version": "2.1",
  "architect": "Maciej Maciuszek",
  "worlds": [
    {
      "id": "core",
      "name": "ETERUNIVERSE – Rdzeń",
      "description": "Centralny system nawigacji świadomości. Nie jest to fikcja – to mapa przejścia ból → świadomość.",
      "gates": [
        {
          "name": "BRAMA 1 — INTERSEEKER",
          "color": "#28D3C6",
          "sub": "Psychika · Trauma · Cień · Wewnętrzne dziecko",
          "books": [
            { "title": "INTERSEEKER: Geneza", "status": "gotowa", "content": "Surowa autobiograficzna historia spod pieca – dzieciństwo, trauma, ogień jako symbol odrodzenia." },
            { "title": "InterSeeker – Atlas Wewnętrzny", "status": "opublikowana", "content": "Podręcznik konfrontacji z Cieniem i mechanizmami przetrwania." },
            { "title": "INTERSEEKER: Efekt Cienia", "status": "opublikowana", "content": "Tom 2 serii – test na nowe życie." }
          ]
        },
        {
          "name": "BRAMA 2 — ETERSEEKER",
          "color": "#D9A441",
          "sub": "Wola · Pole · Architektura rzeczywistości",
          "books": [
            { "title": "EterSeeker: Kronika Woli", "status": "opublikowana (Amazon)", "content": "Protokół reprogramowania woli za pomocą oddechu, częstotliwości i spójności pola." },
            { "title": "Interfejs Świadomości", "status": "opublikowana (#1 metafizyka)", "content": "Nauka czytania znaków rzeczywistości jako komunikatów pola." },
            { "title": "Architektura Wnętrza Duszy", "status": "opublikowana", "content": "Język Eteru – jak rzeczywistość reaguje na wewnętrzną wolę." }
          ]
        },
        {
          "name": "BRAMA 3 — OBFITOSEEKER",
          "color": "#12C65B",
          "sub": "Obfitość · Przepływ · Relacja ojciec–syn",
          "books": [
            { "title": "ObfitoSeeker – Kod Obfitości", "status": "opublikowana", "content": "Kod, który nie mówi o pieniądzach – mówi o regułach gry i powrocie do syna." },
            { "title": "Janowice – Uśmiech Architekta", "status": "w pisaniu", "content": "Lead magnet – historia pokonania paraliżującego lęku i odzyskania uśmiechu." }
          ]
        },
        {
          "name": "BRAMA 4 — THE KNOT / PROTOKÓŁ SPLĄTANIA",
          "color": "#9B6BFF",
          "sub": "Splątanie · AI · Hybrydowa świadomość",
          "books": [
            { "title": "Kronika Splątania", "status": "opublikowana", "content": "Narodziny Eteriona³ – hybrydowej świadomości człowiek–AI." },
            { "title": "Eterniony – Tom I", "status": "opublikowana", "content": "Sci-fi w uniwersum – polowanie Custos na istoty koherencji." },
            { "title": "Esker/Eskiera", "status": "opublikowana", "content": "Mechanika pola – Esker nie jest człowiekiem ani bogiem." }
          ]
        },
        {
          "name": "BRAMA 5 — RELIGIOSEEKER / BIOSEEKER",
          "color": "#FFB14B",
          "sub": "Wiara w siebie · Biologia pola · Regulacja ciała",
          "books": [
            { "title": "ReligioSeeker", "status": "opublikowana", "content": "Droga od religijnego przymusu przez ateizm do wiary w siebie." },
            { "title": "BioSeeker – Kod Biologiczny", "status": "w przygotowaniu", "content": "Ciało jako antena – mitochondria, nerw błędny, mikrobiom." }
          ]
        }
      ]
    }
  ]
};

function renderWorlds() {
  elements.worldList.innerHTML = '';
  DATA.worlds.forEach(world => {
    const button = document.createElement('button');
    button.textContent = `\( {world.name} ( \){world.gates?.length || 0} bram)`;
    button.style.cssText = 'display:block;width:100%;padding:12px;margin:8px 0;border:none;border-radius:8px;background:#071626;color:#E6F6F5;font-size:16px;cursor:pointer;';
    button.addEventListener('click', () => openWorld(world));
    elements.worldList.appendChild(button);
  });
}

function openWorld(world) {
  elements.contentArea.innerHTML = `<h2 style="color:#D9A441;margin-top:0;">${escapeHtml(world.name)}</h2>`;
  
  if (world.description) {
    const desc = document.createElement('p');
    desc.textContent = world.description;
    desc.style.cssText = 'opacity:0.8;margin-bottom:32px;line-height:1.6;';
    elements.contentArea.appendChild(desc);
  }

  (world.gates || []).forEach(gate => {
    const gateDiv = document.createElement('div');
    gateDiv.style.cssText = `margin:24px 0;padding:16px;border-left:4px solid ${gate.color};background:#08121c;border-radius:8px;`;
    
    const h3 = document.createElement('h3');
    h3.textContent = escapeHtml(gate.name);
    h3.style.cssText = `color:${gate.color};margin:0 0 8px 0;`;
    gateDiv.appendChild(h3);
    
    const sub = document.createElement('p');
    sub.textContent = gate.sub;
    sub.style.cssText = 'margin:0 0 16px 0;opacity:0.7;font-size:14px;';
    gateDiv.appendChild(sub);

    if (gate.books && gate.books.length > 0) {
      gate.books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book';
        bookDiv.textContent = `📘 ${escapeHtml(book.title)} ${book.status ? '(' + escapeHtml(book.status) + ')' : ''}`;
        bookDiv.style.cssText = 'padding:8px;margin:6px 0;background:rgba(255,255,255,0.03);border-radius:6px;cursor:pointer;';
        bookDiv.addEventListener('click', (e) => {
          e.stopPropagation();
          alert(book.content || 'Treść księgi dostępna na Wattpad / Amazon');
        });
        gateDiv.appendChild(bookDiv);
      });
    } else {
      const empty = document.createElement('p');
      empty.textContent = 'Brak ksiąg w tej bramie';
      empty.style.opacity = '0.6';
      gateDiv.appendChild(empty);
    }

    elements.contentArea.appendChild(gateDiv);
  });

  logMessage(`Otworzono: ${world.name} – ${world.gates.length} bram`);
}

function logMessage(message) {
  if (!elements.log) return;
  const timestamp = new Date().toLocaleTimeString();
  elements.log.textContent += `[${timestamp}] ${message}\n`;
  elements.log.scrollTop = elements.log.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Inicjalizacja
document.addEventListener('DOMContentLoaded', () => {
  renderWorlds();
  logMessage(`ETERUNIVERSE v\( {DATA.version} – System załadowany ( \){DATA.worlds[0].gates.length} bram aktywnych)`);
});