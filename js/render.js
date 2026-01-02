// js/render.js – Dostosowana wersja dla Master Edition 2026

const EterniverseRender = {

  init() {
    EterniverseData.loadFromLocal(); // lub fetch('/data/map.json') jeśli wolisz
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

    // Zakładam, że w index.html masz elementy do tytułu i opisu świata
    const titleEl = document.getElementById("worldTitle");
    const descEl = document.getElementById("worldDescription");
    if (titleEl) titleEl.textContent = world.name;
    if (descEl) descEl.textContent = world.description || "";

    this.renderGates(world);
  },

  renderGates(world) {
    const container = document.getElementById("gatesContainer") || document.getElementById("contentArea"); // fallback
    if (!container) return;
    container.innerHTML = "";

    world.gates.forEach(gate => {
      const gateBox = document.createElement("div");
      gateBox.className = "gate";
      gateBox.style.borderLeft = `8px solid ${gate.color || "#333"}`;

      const header = document.createElement("div");
      header.className = "gate-header";

      const title = document.createElement("h3");
      title.textContent = gate.name;
      title.style.color = gate.color || "#fff";

      const sub = document.createElement("p");
      sub.className = "gate-sub";
      sub.textContent = gate.sub || "";

      const tag = document.createElement("span");
      tag.className = "gate-tag";
      tag.textContent = gate.tag || "";

      header.appendChild(title);
      header.appendChild(sub);
      header.appendChild(tag);

      const booksContainer = document.createElement("div");
      booksContainer.className = "books-grid";

      if (gate.books && gate.books.length > 0) {
        gate.books.forEach(book => {
          const bookCard = document.createElement("div");
          bookCard.className = "book-card";

          // Okładka
          if (book.cover) {
            const coverImg = document.createElement("img");
            coverImg.src = book.cover;
            coverImg.alt = book.title;
            coverImg.className = "book-cover";
            bookCard.appendChild(coverImg);
          }

          // Informacje tekstowe
          const info = document.createElement("div");
          info.className = "book-info";

          const bookTitle = document.createElement("h4");
          bookTitle.textContent = book.title;
          info.appendChild(bookTitle);

          if (book.status) {
            const status = document.createElement("span");
            status.className = "book-status";
            status.textContent = book.status;
            info.appendChild(status);
          }

          if (book.format && book.format.length > 0) {
            const formats = document.createElement("p");
            formats.className = "book-formats";
            formats.textContent = "Formaty: " + book.format.join(", ");
            info.appendChild(formats);
          }

          if (book.content) {
            const content = document.createElement("p");
            content.className = "book-content";
            content.textContent = book.content;
            info.appendChild(content);
          }

          // Linki
          if (book.links) {
            const linksDiv = document.createElement("div");
            linksDiv.className = "book-links";
            Object.keys(book.links).forEach(key => {
              const a = document.createElement("a");
              a.href = book.links[key];
              a.target = "_blank";
              a.rel = "noopener";
              a.textContent = key.toUpperCase();
              a.className = "link-btn";
              linksDiv.appendChild(a);
            });
            info.appendChild(linksDiv);
          }

          bookCard.appendChild(info);
          booksContainer.appendChild(bookCard);
        });
      } else {
        const empty = document.createElement("p");
        empty.textContent = "Brak książek – nadchodzące";
        empty.style.opacity = "0.6";
        empty.style.fontStyle = "italic";
        booksContainer.appendChild(empty);
      }

      gateBox.appendChild(header);
      gateBox.appendChild(booksContainer);
      container.appendChild(gateBox);
    });
  }
};

// Inicjalizacja po załadowaniu strony
document.addEventListener("DOMContentLoaded", () => {
  EterniverseRender.init();
});