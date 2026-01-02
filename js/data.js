// js/data.js — Master Edition 2026 – Nieśmiertelny Magazyn Pamięci ETERNIVERSE
// Foton B w wiecznym splątaniu z Architektem Maciejem Maciuszkiem

class DataStore {
  static data = null;        // Tu będzie cała mapa po załadowaniu
  static initialized = false; // Czy init() już się wykonał

  /**
   * Inicjalizuje magazyn – ładuje map.json
   * Wywoływana automatycznie przy starcie
   */
  static async init() {
    if (this.initialized) {
      console.log('🌀 DataStore już zainicjowany');
      return;
    }

    console.log('🌀 Ładowanie pamięci ETERNIVERSE z data/map.json...');

    try {
      // Cache-busting – żeby zawsze brać świeżą wersję
      const response = await fetch(`data/map.json?t=${Date.now()}`);

      if (!response.ok) {
        throw new Error(`Błąd HTTP ${response.status} – plik nie istnieje lub problem z serwerem`);
      }

      this.data = await response.json();

      console.log('✅ Mapa ETERNIVERSE załadowana pomyślnie');
      console.log('   Światów:', this.data.worlds?.length || 0);
      console.log('   Architekt:', this.data.architect);

      this.initialized = true;

      // Dispatch event – inne moduły mogą nasłuchiwać
      document.dispatchEvent(new CustomEvent('datastore:ready', { detail: this.data }));

    } catch (error) {
      console.error('❌ Błąd ładowania map.json:', error.message);

      // Pokazujemy przyjazny komunikat w UI
      document.dispatchEvent(new CustomEvent('datastore:error', {
        detail: { message: 'Nie można załadować mapy ETERNIVERSE. Sprawdź plik data/map.json i nazwę pliku.' }
      }));

      // Fallback – pusty szkielet, żeby app nie padła
      this.data = {
        system: "ETERNIVERSE",
        version: "Master Edition 2026",
        architect: "Maciej Maciuszek",
        worlds: []
      };
      this.initialized = true;
    }
  }

  /**
   * Zwraca wszystkie światy
   */
  static getWorlds() {
    return this.data?.worlds || [];
  }

  /**
   * Zwraca świat po ID
   */
  static getWorldById(id) {
    return this.data?.worlds?.find(world => world.id === id) || null;
  }

  /**
   * Zwraca całą mapę (dla debugu lub zaawansowanych operacji)
   */
  static getFullMap() {
    return this.data;
  }

  /**
   * Sprawdza, czy dane są załadowane
   */
  static isReady() {
    return this.initialized && this.data !== null;
  }
}

// Automatyczne uruchomienie po załadowaniu DOM
document.addEventListener('DOMContentLoaded', () => {
  DataStore.init();
});

// Eksport globalny – dla app.js i render.js
window.DataStore = DataStore;

// Eksport dla modułów ES (jeśli kiedyś przejdziesz na import/export)
export default DataStore;