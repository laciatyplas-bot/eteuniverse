// js/data.js — Master Edition 2026 – Nieśmiertelny Magazyn Pamięci ETERNIVERSE
// Foton B w wiecznym splątaniu z Architektem

class DataStore {
  static DB_NAME = 'EterniverseDB';
  static STORE_NAME = 'map';
  static VERSION = 3; // Zwiększ przy zmianie struktury
  static data = null;
  static currentWorld = null;
  static currentGate = null;
  static currentBookIndex = null;
  static unsavedChanges = false;
  static listeners = new Set(); // Dla powiadomień o zmianach

  // Inicjacja – ładuje z priorytetami: remote → IndexedDB → localStorage → default
  static async init() {
    console.log('🌀 Inicjacja Nieśmiertelnego Magazynu Pamięci...');

    // 1. Próba z remote (map.json)
    try {
      await this.loadFromRemote();
      this.notify('Mapa załadowana z eteru centralnego');
    } catch (err) {
      console.warn('Eter centralny niedostępny:', err.message);
      
      // 2. Fallback: IndexedDB
      try {
        await this.loadFromIndexedDB();
        this.notify('Pamięć odtworzona z głębokiego eteru (IndexedDB)');
      } catch {
        // 3. Fallback: localStorage
        this.loadFromLocalStorage();
        if (this.data) {
          this.notify('Pamięć przywrócona z lokalnego eteru');
        } else {
          this.loadDefaultStructure();
          this.notify('Nowy wszechświat – czysta fala');
        }
      }
    }

    // Autosave co 10 sekund jeśli są zmiany
    setInterval(() => {
      if (this.unsavedChanges) {
        this.saveAll();
      }
    }, 10000);

    this.markSaved();
  }

  static async loadFromRemote() {
    const res = await fetch('data/map.json?t=' + Date.now()); // cache busting
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    this.data = await res.json();
    await this.saveToIndexedDB(); // Aktualizacja głębokiej pamięci
  }

  static async loadFromIndexedDB() {
    const db = await this.openDB();
    const tx = db.transaction(this.STORE_NAME, 'readonly');
    const store = tx.objectStore(this.STORE_NAME);
    const request = store.get('master');

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        if (request.result) {
          this.data = request.result.data;
          resolve();
        } else {
          reject('Brak danych w IndexedDB');
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  static loadFromLocalStorage() {
    const saved = localStorage.getItem('ETERNIVERSE_BACKUP');
    if (saved) {
      try {
        this.data = JSON.parse(saved);
      } catch (e) {
        console.error('Błąd parsowania backupu localStorage');
      }
    }
  }

  static loadDefaultStructure() {
    this.data = {
      system: "ETERNIVERSE",
      version: "Master Edition 2026 – Pełna mapa wzbogacona",
      architect: "Maciej Maciuszek",
      updated: "2026-01-02",
      worlds: [] // Tu w przyszłości można dodać szkielet
    };
  }

  // === Operacje na danych ===
  static getWorlds() {
    return this.data?.worlds || [];
  }

  static getWorldById(id) {
    return this.data?.worlds?.find(w => w.id === id) || null;
  }

  static getGateById(worldId, gateId) {
    const world = this.getWorldById(worldId);
    return world?.gates?.find(g => g.id === gateId) || null;
  }

  static addBook(worldId, gateId, book) {
    const gate = this.getGateById(worldId, gateId);
    if (!gate) throw new Error('Brama nie istnieje');
    
    if (!gate.books) gate.books = [];
    gate.books.push(book);
    
    this.markUnsaved();
    this.notifyChange('book_added', { worldId, gateId, book });
  }

  static updateBook(worldId, gateId, bookId, updates) {
    const gate = this.getGateById(worldId, gateId);
    const book = gate?.books?.find(b => b.id === bookId);
    if (book) {
      Object.assign(book, updates);
      this.markUnsaved();
      this.notifyChange('book_updated', { book });
    }
  }

  static deleteBook(worldId, gateId, bookId) {
    const gate = this.getGateById(worldId, gateId);
    if (gate) {
      gate.books = gate.books.filter(b => b.id !== bookId);
      this.markUnsaved();
      this.notifyChange('book_deleted', { bookId });
    }
  }

  // === Zapisywanie ===
  static markUnsaved() {
    this.unsavedChanges = true;
  }

  static markSaved() {
    this.unsavedChanges = false;
  }

  static async saveAll() {
    if (!this.data || !this.unsavedChanges) return;

    try {
      await Promise.all([
        this.saveToIndexedDB(),
        this.saveToLocalStorage()
      ]);
      this.markSaved();
      this.notify('Fala zapisana – pamięć utrwalona w eterze');
    } catch (err) {
      this.notify('Błąd zapisu pamięci – spróbuj ponownie', 'error');
      console.error(err);
    }
  }

  static async saveToIndexedDB() {
    const db = await this.openDB();
    const tx = db.transaction(this.STORE_NAME, 'readwrite');
    const store = tx.objectStore(this.STORE_NAME);
    store.put({ id: 'master', data: this.data, savedAt: new Date().toISOString() });
    return tx.complete;
  }

  static saveToLocalStorage() {
    localStorage.setItem('ETERNIVERSE_BACKUP', JSON.stringify(this.data));
  }

  // === IndexedDB helper ===
  static openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.VERSION);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // === Powiadomienia o zmianach ===
  static subscribe(listener) {
    this.listeners.add(listener);
  }

  static unsubscribe(listener) {
    this.listeners.delete(listener);
  }

  static notifyChange(type, payload) {
    this.listeners.forEach(listener => listener({ type, payload }));
  }

  static notify(message, type = 'info') {
    // Dispatch custom event – łapie go app.js lub renderer
    document.dispatchEvent(new CustomEvent('eterniverse:notify', {
      detail: { message, type }
    }));
  }
}

// Automatyczne uruchomienie
document.addEventListener('DOMContentLoaded', () => {
  DataStore.init();
});