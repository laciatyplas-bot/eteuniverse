// js/render.js
document.addEventListener('data-ready', () => {
  const worlds = DataStore.getWorlds();
  const worldList = document.getElementById('worldList');
  const gatesContainer = document.getElementById('gatesContainer');
  const worldTitle = document.getElementById('worldTitle');
  const worldDesc = document.getElementById('worldDescription');

  if (!worldList || !gatesContainer) return;

  worldList.innerHTML = '<h2>Światy Eteru</h2>';

  worlds.forEach(world => {
    const btn = document.createElement('button');
    btn.textContent = world.name;
    btn.onclick = () => {
      worldTitle.textContent = world.name;
      worldDesc.textContent = world.description || '';
      gatesContainer.innerHTML = '';

      world.gates.forEach(gate => {
        const gateDiv = document.createElement('div');
        gateDiv.style.borderLeft = `10px solid ${gate.color}`;
        gateDiv.innerHTML = `<h3 style="color:\( {gate.color}"> \){gate.name}</h3><p>\( {gate.sub}</p><strong> \){gate.tag}</strong>`;

        const booksDiv = document.createElement('div');
        if (gate.books.length > 0) {
          gate.books.forEach(book => {
            const bookDiv = document.createElement('div');
            bookDiv.innerHTML = `
              \( {book.cover ? `<img src=" \){book.cover}" alt="${book.title}">` : ''}
              <h4>${book.title}</h4>
              <p>${book.content}</p>
              <div>
                \( {Object.entries(book.links || {}).map(([site, url]) => `<a href=" \){url}" target="_blank">${site}</a>`).join(' ')}
              </div>
            `;
            booksDiv.appendChild(bookDiv);
          });
        } else {
          booksDiv.innerHTML = '<p>Pusta brama...</p>';
        }
        gateDiv.appendChild(booksDiv);
        gatesContainer.appendChild(gateDiv);
      });
    };
    worldList.appendChild(btn);
  });

  // Otwórz pierwszy świat
  if (worlds.length > 0) worlds[0].querySelector('button')?.click();
});