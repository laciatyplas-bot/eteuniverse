// js/app.js — ETERNIVERSE CORE ENGINE
// Wersja stabilna pod GitHub Pages

(() => {
  const App = {
    data: null,
    currentWorld: null,

    async init() {
      console.log('ETERNIVERSE старт');

      try {
        const res = await fetch('data/mapa.json?t=' + Date.now());
        if (!res.ok) throw new Error('Nie można załadować mapa.json');
        this.data = await res.json();
      } catch (err) {
        this.showError(err.message);
        return;
      }

      if (!this.data.worlds || this.data.worlds.length === 0) {
        this.showError('Brak światów w mapa.json');
        return;
      }

      this.renderWorldList();
      this.openWorld(this.data.worlds[0]);
    },

    renderWorldList() {
      const container = document.getElementById('worldList');
      if (!container) return;

      container.innerHTML = '<h2>Światy Eteru</h2>';

      this.data.worlds.forEach(world => {
        const btn = document.createElement('button');
        btn.textContent = world.name;
        btn.className = 'world-btn';
        btn.onclick = () => this.openWorld(world);
        container.appendChild(btn);
      });
    },

    openWorld(world) {
      this.currentWorld = world;

      const gatesContainer = document.getElementById('gatesContainer');
      if (!gatesContainer) return;

      gatesContainer.innerHTML = `
        <h2>${world.name}</h2>
        <p>${world.description || ''}</p>
      `;

      if (!world.gates || world.gates.length === 0) {
        gatesContainer.innerHTML += '<p>Brak bram w tym świecie.</p>';
        return;
      }

      world.gates.forEach(gate => {
        const gateEl = document.createElement('div');
        gateEl.className = 'gate';
        gateEl.style.borderLeft = '6px solid #444';

        gateEl.innerHTML = `
          <h3>${gate.name}</h3>
        `;

        if (!gate.books || gate.books.length === 0) {
          gateEl.innerHTML += '<p>Pusta brama…</p>';
        } else {
          gate.books.forEach(book => {
            const bookEl = document.createElement('div');
            bookEl.className = 'book';

            bookEl.innerHTML = `
              <h4>${book.title}</h4>
              <p>${book.content || ''}</p>
            `;

            // Linki (Amazon, Wattpad itd.)
            if (book.links) {
              const linksDiv = document.createElement('div');
              linksDiv.className = 'book-links';

              Object.entries(book.links).forEach(([name, url]) => {
                const a = document.createElement('a');
                a.href = url;
                a.target = '_blank';
                a.rel = 'noopener';
                a.textContent = name.toUpperCase();
                linksDiv.appendChild(a);
              });

              bookEl.appendChild(linksDiv);
            }

            gateEl.appendChild(bookEl);
          });
        }

        gatesContainer.appendChild(gateEl);
      });
    },

    showError(msg) {
      document.body.innerHTML = `
        <div style="padding:40px;color:#ff6666">
          <h1>Błąd ETERNIVERSE</h1>
          <p>${msg}</p>
          <p>Sprawdź konsolę (F12).</p>
        </div>
      `;
      console.error(msg);
    }
  };

  document.addEventListener('DOMContentLoaded', () => App.init());
})();