// js/app.js — ETERNIVERSE CORE + EDITOR

(() => {
  const App = {
    data: null,
    currentWorld: null,
    currentGate: null,

    async init() {
      try {
        const res = await fetch('data/mapa.json?t=' + Date.now());
        if (!res.ok) throw new Error('Nie można załadować mapa.json');
        this.data = await res.json();
      } catch (e) {
        alert(e.message);
        return;
      }

      // Local override
      const local = localStorage.getItem('ETERNIVERSE_DATA');
      if (local) this.data = JSON.parse(local);

      this.renderWorlds();
      this.bindEditor();
      this.openWorld(this.data.worlds[0]);
    },

    saveLocal() {
      localStorage.setItem('ETERNIVERSE_DATA', JSON.stringify(this.data, null, 2));
    },

    renderWorlds() {
      const list = document.getElementById('worldList');
      list.innerHTML = '<h2>Światy</h2>';

      this.data.worlds.forEach(w => {
        const b = document.createElement('button');
        b.textContent = w.name;
        b.onclick = () => this.openWorld(w);
        list.appendChild(b);
      });
    },

    openWorld(world) {
      this.currentWorld = world;
      const c = document.getElementById('gatesContainer');
      c.innerHTML = `<h2>${world.name}</h2><p>${world.description}</p>`;

      world.gates.forEach(g => {
        const d = document.createElement('div');
        d.className = 'gate';
        d.innerHTML = `<h3>${g.name}</h3>`;
        d.onclick = () => {
          this.currentGate = g;
          document.getElementById('editor-info').textContent =
            `Edytujesz: ${world.name} → ${g.name}`;
        };

        if (!g.books) g.books = [];

        g.books.forEach(book => {
          const p = document.createElement('p');
          p.textContent = '📘 ' + book.title;
          d.appendChild(p);
        });

        c.appendChild(d);
      });
    },

    bindEditor() {
      document.getElementById('saveBookBtn').onclick = () => {
        if (!this.currentGate) {
          alert('Najpierw wybierz bramę');
          return;
        }

        const title = document.getElementById('editor-title').value.trim();
        if (!title) {
          alert('Brak tytułu');
          return;
        }

        const book = {
          title,
          content: document.getElementById('editor-content').value,
          links: {
            amazon: document.getElementById('editor-amazon').value,
            wattpad: document.getElementById('editor-wattpad').value
          }
        };

        this.currentGate.books.push(book);
        this.saveLocal();
        this.openWorld(this.currentWorld);

        document.getElementById('editor-title').value = '';
        document.getElementById('editor-content').value = '';
        document.getElementById('editor-amazon').value = '';
        document.getElementById('editor-wattpad').value = '';
      };
    }
  };

  document.addEventListener('DOMContentLoaded', () => App.init());
})();