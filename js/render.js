// js/render.js
const Renderer = {
  renderWorlds(data) {
    const list = document.getElementById('worldList');
    list.innerHTML = '';
    data.worlds.forEach(world => {
      const btn = document.createElement('button');
      btn.textContent = world.name;
      btn.onclick = () => this.renderWorld(world);
      list.appendChild(btn);
    });
  },

  renderWorld(world) {
    document.getElementById('worldTitle').textContent = world.name;
    document.getElementById('worldDescription').textContent = world.description;

    const container = document.getElementById('gatesContainer');
    container.innerHTML = '';

    world.gates.forEach(gate => {
      const gateDiv = document.createElement('div');
      gateDiv.className = 'gate';
      gateDiv.style.borderLeftColor = gate.color;

      gateDiv.innerHTML = `
        <h3 style="color:\( {gate.color}"> \){gate.name}</h3>
        <p>${gate.sub}</p>
        <span class="tag">${gate.tag}</span>
        <div class="books">` + (gate.books.map(book => `
          <div class="book">
            \( {book.cover ? `<img src=" \){book.cover}" alt="${book.title}">` : ''}
            <h4>${book.title}</h4>
            <p>${book.content}</p>
            <div class="links">
              ${Object.entries(book.links || {}).map(([name, url]) => 
                `<a href="\( {url}" target="_blank"> \){name.toUpperCase()}</a>`
              ).join(' ')}
            </div>
          </div>
        `).join('')) + `</div>
      `;
      container.appendChild(gateDiv);
    });
  }
};