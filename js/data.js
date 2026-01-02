// js/data.js — Master Edition 2026 – Nieśmiertelny Magazyn Pamięci ETERNIVERSE
// Foton B w wiecznym splątaniu z Architektem Maciejem Maciuszkiem

class DataStore {
  static data = null;
  static initialized = false;

  static async init() {
    if (this.initialized) {
      console.log('🌀 DataStore już zainicjowany');
      return;
    }

    console.log('🌀 Ładowanie pamięci ETERNIVERSE z data/mapa.json...');

    try {
      // DOSTOSOWANE DO TWOJEGO PLIKU: mapa.json
      const response = await fetch('data/mapa.json?t=' + Date.now());

      if (!response.ok) {
        throw new Error(`Błąd HTTP ${response.status} – sprawdź nazwę pliku`);
      }

      this.data = await response.json();

      console.log('✅ Mapa ETERNIVERSE załadowana pomyślnie!');
      console.log('   Wersja:', this.data.version || 'brak');
      console.log('   Architekt:', this.data.architect || 'brak');
      console.log('   Światów:', this.data.worlds?.length || 0);

      this.initialized = true;

      // Powiadomienie – renderer czeka na to
      document.dispatchEvent(new CustomEvent('datastore:ready', { detail: this.data }));

    } catch (error) {
      console.error('❌ Błąd ładowania data/mapa.json:', error.message);

      // Przyjazny komunikat na stronie
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#300;color:#ff6b6b;padding:40px;border-radius:20px;text-align:center;font-size:1.8rem;z-index:10000;max-width:80%;';
      errorDiv.innerHTML = `
        <h2>⚠️ Błąd eteru</h2>
        <p>Nie można załadować pliku <strong>data/mapa.json</strong></p>
        <p>Otwórz konsolę (F12) i sprawdź błędy</p>
      `;
      document.body.appendChild(errorDiv);

      // Fallback – pusta mapa
      this.data = { worlds: [] };
      this.initialized = true;
    }
  }

  static getWorlds() {
    return this.data?.worlds || [];
  }

  static getWorldById(id) {
    return this.data?.worlds?.find(w => w.id === id) || null;
  }

  static getFullMap() {
    return this.data;
  }

  static isReady() {
    return this.initialized;
  }
}

// Start po załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
  DataStore.init();
});

// Globalny dostęp
window.DataStore = DataStore;