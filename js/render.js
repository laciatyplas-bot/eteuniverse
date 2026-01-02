// ==============================
// RENDER.JS — WYŚWIETLANIE ŚWIATA
// ==============================

const Renderer = (() => {
  const root = document.getElementById('app');

  function clear() {
    root.innerHTML = '';
  }

  function renderWorlds(data) {
    clear();

    data.worlds.forEach(world => {
      const worldEl = document.createElement('section');
      worldEl.className = 'world';

      worldEl.innerHTML = `<h2>${world.name}</h2>`;
      world.gates.forEach(gate => {
        worldEl.appendChild(renderGate(world.id, gate));
      });

      root.appendChild(worldEl);
    });
  }

  function renderGate(worldId, gate) {
    const gateEl = document.createElement('div');
    gateEl.className = 'gate';

    const header = document.createElement('h3');
    header.textContent = gate.name;
    gateEl.appendChild(header);

    gate.books.forEach(book => {
      const bookEl = document.createElement('div');
      bookEl.className = 'book';
      bookEl.innerHTML = `
        <strong>${book.title}</strong>
        <div>Status: ${book.status}</div>
      `;
      gateEl.appendChild(bookEl);
    });

    const addBtn = document.createElement('button');
    addBtn.textContent = '+ Dodaj książkę';
    addBtn.onclick = () => {
      document.dispatchEvent(new CustomEvent('ADD_BOOK', {
        detail: { worldId, gateId: gate.id }
      }));
    };

    gateEl.appendChild(addBtn);
    return gateEl;
  }

  return {
    renderWorlds
  };
})();