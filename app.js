// ETERNIVERSE – Ultimate Edition z integracją GitHub API
// Pełna edycja + IndexedDB + synchronizacja z GitHub repo

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

// ====== KONFIGURACJA GITHUB ======
const GITHUB_CONFIG = {
  owner: 'TWOJ_LOGIN',           // ZMIEŃ na Twój GitHub username lub organizację
  repo: 'TWOJE_REPO',            // ZMIEŃ na nazwę repozytorium
  path: 'data/map.json',         // Ścieżka do pliku w repo
  token: 'ghp_TWÓJ_PERSONAL_ACCESS_TOKEN', // ZMIEŃ na Twój PAT (z uprawnieniem repo)
  branch: 'main'                 // Gałąź (main lub master)
};

let currentSHA = null; // SHA aktualnej wersji pliku (do update)

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

// Pobieranie danych z GitHub (priorytet)
async function loadFromGitHub() {
  try {
    const url = `https://api.github.com/repos/\( {GITHUB_CONFIG.owner}/ \){GITHUB_CONFIG.repo}/contents/\( {GITHUB_CONFIG.path}?ref= \){GITHUB_CONFIG.branch}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${GITHUB_CONFIG.token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) throw new Error(`GitHub API: ${response.status}`);

    const fileData = await response.json();
    const content = JSON.parse(atob(fileData.content));
    currentSHA = fileData.sha;

    DATA = content;
    saveToIndexedDB();
    logMessage('Dane załadowane z GitHub (map.json)');
    renderWorlds();
  } catch (err) {
    logMessage(`GitHub niedostępny: ${err.message} – ładowanie z IndexedDB`);
    await loadFromIndexedDB();
  }
}

// Ładowanie z IndexedDB (fallback)
async function loadFromIndexedDB() {
  if (!db) await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get('core_data');

    request.onsuccess = () => {
      if (request.result) {
        DATA = request.result.data;
        logMessage('Dane załadowane z IndexedDB (fallback)');
      } else {
        DATA = getDefaultData();
        logMessage('Załadowno domyślne dane');
      }
      renderWorlds();
      resolve();
    };
  });
}

// Zapisywanie do GitHub
async function pushToGitHub() {
  if (!currentSHA) {
    logMessage('Brak SHA – najpierw pobierz z GitHub');
    return;
  }

  const content = btoa(JSON.stringify(DATA, null, 2));
  const url = `https://api.github.com/repos/\( {GITHUB_CONFIG.owner}/ \){GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_CONFIG.token}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        message: `ETERNIVERSE sync: ${new Date().toISOString()}`,
        content: content,
        sha: currentSHA,
        branch: GITHUB_CONFIG.branch
      })
    });

    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

    const result = await response.json();
    currentSHA = result.content.sha;
    saveToIndexedDB();
    logMessage('Zmiany wypchnięte do GitHub (commit: ' + result.commit.sha.slice(0,7) + ')');
  } catch (err) {
    logMessage('Błąd push do GitHub: ' + err.message);
  }
}

// Zapisywanie do IndexedDB
function saveToIndexedDB() {
  if (!db) return;
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  store.put({ id: 'core_data', data: DATA });
}

// Domyślne dane
function getDefaultData() {
  return { /* ... Twoja domyślna struktura z 10 bramami ... */ };
}

// Dodatkowe przyciski GitHub w UI
function addGitHubControls() {
  const controls = document.createElement('div');
  controls.style.cssText = 'margin:20px;padding:20px;background:#111827;border-radius:12px;text-align:center;';
  controls.innerHTML = `
    <button onclick="loadFromGitHub()" style="margin:8px;padding:12px 24px;background:#2563eb;border:none;border-radius:12px;color:#fff;cursor:pointer;">Pobierz z GitHub</button>
    <button onclick="pushToGitHub()" style="margin:8px;padding:12px 24px;background:#16a34a;border:none;border-radius:12px;color:#fff;cursor:pointer;">Push zmiany do GitHub</button>
    <button onclick="exportToJSON()" style="margin:8px;padding:12px 24px;background:#1e40af;border:none;border-radius:12px;color:#fff;cursor:pointer;">Eksport lokalny JSON</button>
  `;
  elements.contentArea.insertAdjacentElement('afterbegin', controls);
}

// Eksport lokalny (jak wcześniej)
function exportToJSON() {
  const dataStr = JSON.stringify(DATA, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'map.json';
  a.click();
  URL.revokeObjectURL(url);
  logMessage('Lokalny eksport map.json');
}

// Inicjalizacja
document.addEventListener('DOMContentLoaded', async () => {
  await openDB();
  await loadFromGitHub(); // Priorytet GitHub
  addGitHubControls();
  logMessage(`System ETERNIVERSE vGitHub Sync – Załadowany`);
});