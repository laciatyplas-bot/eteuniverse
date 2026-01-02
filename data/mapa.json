// js/data.js — Master Edition 2026 – Nieśmiertelny Magazyn Pamięci
class DataStore {
  static data = null;
  static initialized = false;

  static async init() {
    if (this.initialized) return;

    console.log('🌀 Ładowanie pamięci ETERNIVERSE...');

    try {
      // ZMIENIONE: mapa.json zamiast map.json
      const response = await fetch('data/mapa.json?t=' + Date.now());

      if (!response.ok) {
        throw new Error(`Błąd ${response.status}: plik nie znaleziony`);
      }

      this.data = await response.json();
      console.log('✅ Mapa załadowana – ETERNIVERSE gotowe');
      console.log('Światów:', this.data.worlds.length);

      this.initialized = true;

      // Powiadomienie dla reszty aplikacji
      document.dispatchEvent(new CustomEvent('datastore:ready'));

    } catch (error) {
      console.error('❌ Błąd ładowania:', error);
      alert('Nie można załadować pliku data/mapa.json – sprawdź nazwę i lokalizację pliku');

      // Fallback – pusty świat
      this.data = { worlds: [] };
      this.initialized = true;
    }
  }

  static getWorlds() {
    return this.data?.worlds || [];
  }

  static getWorldById(id) {
    return this.data?.worlds?.find(w => w.id === id);
  }
}

// Start po załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
  DataStore.init();
});

window.DataStore = DataStore;