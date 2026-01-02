// js/data.js
class DataStore {
  static data = null;

  static async load() {
    try {
      const res = await fetch('data/mapa.json?t=' + Date.now());
      if (!res.ok) throw new Error('Plik nie znaleziony');
      this.data = await res.json();
      console.log('Mapa załadowana', this.data);
      document.dispatchEvent(new CustomEvent('data-ready'));
    } catch (err) {
      console.error('Błąd ładowania', err);
    }
  }

  static getWorlds() {
    return this.data?.worlds || [];
  }
}

DataStore.load();
window.DataStore = DataStore;