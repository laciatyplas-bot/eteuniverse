let DATA = null;

const worldList = document.getElementById('worldList');
const contentArea = document.getElementById('contentArea');
const log = document.getElementById('log');

fetch('data/map.json')
  .then(res => res.json())
  .then(json => {
    DATA = json;
    renderWorlds();
    logMessage('System załadowany');
  });

function renderWorlds() {
  worldList.innerHTML = '';
  DATA.worlds.forEach(world => {
    const btn = document.createElement('button');
    btn.textContent = world.name;
    btn.onclick = () => openWorld(world);
    worldList.appendChild(btn);
  });
}

function openWorld(world) {
  contentArea.innerHTML = '';
  world.gates.forEach(gate => {
    const h3 = document.createElement('h3');
    h3.textContent = gate.name;
    contentArea.appendChild(h3);

    gate.books.forEach(book => {
      const div = document.createElement('div');
      div.textContent = '📘 ' + book.title;
      contentArea.appendChild(div);
    });
  });

  logMessage(`Otwarty ${world.name}`);
}

function logMessage(msg) {
  log.textContent += msg + '\n';
}