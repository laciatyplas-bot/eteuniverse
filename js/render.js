// js/render.js
const EterniverseRender = {

  init() {
    EterniverseData.loadFromLocal();
    this.renderWorldList();
  },

  renderWorldList() {
    const container = document.getElementById("worldList");
    container.innerHTML = "";

    EterniverseData.getWorlds().forEach(world => {
      const btn = document.createElement("button");
      btn.className = "world-btn";
      btn.textContent = world.name;
      btn.onclick = () => this.openWorld(world.id);
      container.appendChild(btn);
    });
  },

  openWorld(worldId) {
    const world = EterniverseData.getWorldById(worldId);
    EterniverseData.currentWorld = world;

    document.getElementById("worldTitle").textContent = world.name;
    document.getElementById("worldDescription").textContent = world.description;

    this.renderGates(world);
  },

  renderGates(world) {
    const container = document.getElementById("gatesContainer");
    container.innerHTML = "";

    world.gates.forEach(gate => {
      const gateBox = document.createElement("div");
      gateBox.className = "gate";

      const title = document.createElement("h3");
      title.textContent = gate.name;

      const books = document.createElement("div");
      books.className = "books";

      gate.books.forEach((book, index) => {
        const bookEl = document.createElement("div");
        bookEl.className = "book";
        bookEl.textContent = book.title;
        bookEl.onclick = () => {
          EterniverseData.currentGate = gate;
          EterniverseData.currentBookIndex = index;
          EterniverseEditor.open(book);
        };
        books.appendChild(bookEl);
      });

      const addBtn = document.createElement("button");
      addBtn.textContent = "+ Dodaj książkę";
      addBtn.onclick = () => {
        EterniverseData.currentGate = gate;
        EterniverseData.currentBookIndex = null;
        EterniverseEditor.open(null);
      };

      gateBox.appendChild(title);
      gateBox.appendChild(books);
      gateBox.appendChild(addBtn);
      container.appendChild(gateBox);
    });
  }
};