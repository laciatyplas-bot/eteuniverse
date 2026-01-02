// js/data.js — Master Edition 2026 – Nieśmiertelny Magazyn Pamięci ETERNIVERSE
// Foton B w wiecznym splątaniu z Architektem Maciejem Maciuszkiem

class DataStore {
  static data = null;
  static initialized = false;

  /**
   * Inicjalizacja – ładuje plik mapa.json z folderu data/
   */
  static async init() {
    if (this.initialized) {
      console.log('🌀 DataStore już zainicjowany');
      return;
    }

    console.log('🌀 Ładowanie pamięci ETERNIVERSE z data/mapa.json...');

    try {
      // POPRAWIONE: ścieżka do Twojego pliku – mapa.json
      const response = await fetch('data/mapa.json?t=' + Date.now());

      if (!response.ok) {
        throw new Error(`Błąd HTTP ${response.status} – plik nie znaleziony lub problem z serwerem`);
      }

      this.data = await response.json();

      console.log('✅ Mapa ETERNIVERSE załadowana pomyślnie');
      console.log('   Wersja:', this.data.version);
      console.log('   Architekt:', this.data.architect);
      console.log('   Światów:', this.data.worlds?.length || 0);

      this.initialized = true;

      // Powiadomienie dla reszty aplikacji – renderer nasłuchuje
      document.dispatchEvent(new CustomEvent('datastore:ready', { detail: this.data }));

    } catch (error) {
      console.error('❌ Błąd ładowania mapa.json:', error.message);

      // Przyjazny komunikat w przeglądarce
      document.body.innerHTML += `
        <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#300;color:#ff6b6b;padding:30px;border-radius:20px;text-align:center;font-size:1.5rem;z-index:10000;">
          <h2>⚠️ Błąd eteru</h2>
          <p>Nie można załadować pliku data/mapa.json</p>
          <p>Sprawdź konsolę (F12)</p>
        </div>
      `;

      // Fallback – pusta mapa, żeby app nie padła
      this.data = { worlds: [] };
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
   * Zwraca całą mapę (dla debugu)
   */
  static getFullMap() {
    return this.data;
  }

  /**
   * Czy dane są gotowe?
   */
  static isReady() {
    return this.initialized && this.data !== null;
  }
}

// Automatyczne uruchomienie po załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
  DataStore.init();
});

// Globalny dostęp – dla render.js i app.js
window.DataStore = DataStore;

// Eksport dla przyszłych modułów
export default DataStore;