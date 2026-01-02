// js/data.js — Master Edition 2026 – Ładowanie pamięci
class DataStore {
  static data = null;
  static ready = false;

  static async load() {
    console.log('Ładowanie mapa.json...');

    try {
      const res = await fetch('data/mapa.json?t=' + Date.now());
      if (!res.ok) throw new Error('Plik nie znaleziony');

      this.data = await res.json();
      this.ready = true;
      console.log('Mapa załadowana!', this.data);

      // Powiadomienie dla renderera
      document.dispatchEvent(new CustomEvent('data-ready'));
    } catch (err) {
      console.error('Błąd:', err);
      alert('Nie można załadować data/mapa.json – sprawdź nazwę pliku w folderze data/');
    }
  }

  static getWorlds() {
    return this.data?.worlds || [];
  }

  static getWorldById(id) {
    return this.data?.worlds?.find(w => w.id === id);
  }
}

// Start
DataStore.load();
window.DataStore = DataStore;