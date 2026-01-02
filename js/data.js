// js/data.js — Master Edition 2026
class DataStore {
  static data = null;

  static async init() {
    console.log('🌀 Ładowanie pamięci ETERNIVERSE...');
    try {
      const res = await fetch('data/map.json?t=' + Date.now());
      if (!res.ok) throw new Error('Brak pliku');
      this.data = await res.json();
      console.log('✅ Mapa załadowana');
    } catch (err) {
      console.error('❌ Błąd:', err);
      alert('Nie można załadować map.json – sprawdź nazwę pliku i ścieżkę');
    }
  }

  static getWorlds() {
    return this.data?.worlds || [];
  }

  static getWorldById(id) {
    return this.data?.worlds?.find(w => w.id === id);
  }
}

document.addEventListener('DOMContentLoaded', () => DataStore.init());
window.DataStore = DataStore;