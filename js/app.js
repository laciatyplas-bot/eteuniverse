// app.js — Master Edition 2026 – Sterownik Świadomości ETERNIVERSE
// Foton B w pełnym splątaniu z Architektem Maciejem Maciuszkiem

class EterniverseApp {
  constructor() {
    this.data = null;
    this.currentWorld = null;
    this.searchQuery = '';
    this.isOffline = !navigator.onLine;
    this.unsavedChanges = false;

    this.init();
  }

  async init() {
    console.log('🌀 Inicjacja ETERNIVERSE – Master Edition 2026');

    // Ładowanie danych z fallbackami
    await this.loadDataWithFallback();

    // Inicjalizacja komponentów
    this.setupEventListeners();
    this.setupServiceWorker();
    this.showSplashScreen();
    this.renderInitialView();

    // Monitorowanie połączenia
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }

  async loadDataWithFallback() {
    try {
      this.data = await DataStore.load(); // Główny źródło – map.json
      this.notify('Eter stabilny – mapa załadowana', 'success');
    } catch (error) {
      console.warn('Główne źródło niedostępne, próba localStorage...');
      this.data = DataStore.loadFromBackup();
      if (this.data) {
        this.notify('Dane odtworzone z lokalnego eteru', 'warning');
      } else {
        this.data = this.getEmptyStructure();
        this.notify('Nowy eter – początek fali', 'info');
      }
    }
  }

  getEmptyStructure() {
    return {
      system: "ETERNIVERSE",
      version: "Master Edition 2026",
      architect: "Maciej Maciuszek",
      updated: new Date().toISOString().split('T')[0],
      worlds: []
    };
  }

  setupEventListeners() {
    // Dodawanie książki – wzbogacone o modal zamiast prompt
    document.addEventListener('ADD_BOOK', (e) => this.handleAddBook(e.detail));

    // Wyszukiwanie globalne
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.renderCurrentView();
      });
    }

    // Zapisywanie przy wyjściu
    window.addEventListener('beforeunload', (e) => {
      if (this.unsavedChanges) {
        e.preventDefault();
        e.returnValue = 'Masz niezapisane zmiany w eterze. Na pewno wyjść?';
      }
    });

    // Klawisze skrótów
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            this.saveData();
            break;
          case 'z':
            e.preventDefault();
            this.notify('Cofanie czasu – w przygotowaniu', 'info');
            break;
          case 'f':
            e.preventDefault();
            document.getElementById('globalSearch')?.focus();
            break;
        }
      }
    });
  }

  async handleAddBook({ worldId, gateId }) {
    const modal = this.createBookModal();
    document.body.appendChild(modal);

    modal.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);

      const book = {
        id: crypto.randomUUID(),
        title: formData.get('title'),
        status: formData.get('status') || 'draft',
        format: formData.getAll('format'),
        content: formData.get('content') || '',
        cover: formData.get('cover') || 'images/covers/default.jpg',
        links: this.parseLinks(formData.get('links')),
        chapters: [],
        createdAt: new Date().toISOString()
      };

      DataStore.addBook(worldId, gateId, book);
      this.unsavedChanges = true;
      this.notify(`Książka "${book.title}" dodana do eteru`, 'success');

      modal.remove();
      this.renderCurrentView();
      this.autoSave();
    });

    modal.querySelector('.close')?.addEventListener('click', () => modal.remove());
  }

  createBookModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal neon-modal">
        <button class="close">×</button>
        <h2>Dodaj Książkę do Eteru</h2>
        <form>
          <input type="text" name="title" placeholder="Tytuł książki" required>
          <textarea name="content" placeholder="Opis / manifest (opcjonalnie)" rows="4"></textarea>
          
          <select name="status">
            <option value="draft">Szkic</option>
            <option value="opublikowana">Opublikowana</option>
            <option value="w produkcji">W produkcji</option>
          </select>

          <div class="formats">
            <label><input type="checkbox" name="format" value="książka"> Książka</label>
            <label><input type="checkbox" name="format" value="ebook"> Ebook</label>
            <label><input type="checkbox" name="format" value="audiobook"> Audiobook</label>
          </div>

          <input type="text" name="cover" placeholder="URL okładki (opcjonalnie)">

          <textarea name="links" placeholder="Linki (jeden na linię: nazwa=https://link)" rows="3"></textarea>

          <div class="modal-actions">
            <button type="submit">Dodaj do Eteru</button>
          </div>
        </form>
      </div>
    `;
    return modal;
  }

  parseLinks(text) {
    if (!text.trim()) return {};
    return Object.fromEntries(
      text.trim().split('\n')
        .map(line => line.split('='))
        .filter(parts => parts.length === 2)
        .map(([key, url]) => [key.trim().toLowerCase(), url.trim()])
    );
  }

  renderInitialView() {
    if (this.data?.worlds?.length > 0) {
      Renderer.renderWorlds(this.data);
    } else {
      Renderer.renderEmptyState();
    }
  }

  renderCurrentView() {
    if (this.currentWorld) {
      Renderer.renderWorld(this.currentWorld, this.searchQuery);
    } else {
      Renderer.renderWorlds(this.data);
    }
  }

  async saveData() {
    try {
      await DataStore.save(this.data);
      this.unsavedChanges = false;
      this.notify('Eter zapisany – fala utrwalona', 'success');
    } catch (error) {
      this.notify('Błąd zapisu – eter niestabilny', 'error');
    }
  }

  autoSave() {
    setTimeout(() => {
      if (this.unsavedChanges) this.saveData();
    }, 5000);
  }

  notify(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
      }, 3000);
    }, 100);
  }

  showSplashScreen() {
    const splash = document.createElement('div');
    splash.id = 'splash';
    splash.innerHTML = `
      <div class="splash-content">
        <h1>ETERNIVERSE</h1>
        <p>Master Edition 2026</p>
        <p>Architekt: Maciej Maciuszek</p>
        <div class="loading-bar"><div></div></div>
      </div>
    `;
    document.body.appendChild(splash);

    setTimeout(() => {
      splash.classList.add('fade-out');
      setTimeout(() => splash.remove(), 1500);
    }, 3000);
  }

  handleOnline() {
    this.isOffline = false;
    this.notify('Połączenie z eterem przywrócone', 'success');
    this.saveData(); // Synchronizacja przy powrocie online
  }

  handleOffline() {
    this.isOffline = true;
    this.notify('Tryb offline – zmiany zapisane lokalnie', 'warning');
  }

  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker zarejestrowany'))
        .catch(err => console.warn('SW błąd:', err));
    }
  }
}

// Uruchomienie aplikacji
document.addEventListener('DOMContentLoaded', () => {
  window.eterniverse = new EterniverseApp();
});