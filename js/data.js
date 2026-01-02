// ==============================
// DATA.JS — CENTRALNY MAGAZYN DANYCH
// ==============================

const DataStore = (() => {
  const STORAGE_KEY = 'ETERNIVERSE_DATA_V1';
  let data = null;

  async function load() {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      data = JSON.parse(local);
      console.log('[Data] Loaded from localStorage');
      return data;
    }

    const res = await fetch('./data/mapa.json');
    data = await res.json();
    save();
    console.log('[Data] Loaded from mapa.json');
    return data;
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data, null, 2));
  }

  function get() {
    return data;
  }

  function addBook(worldId, gateId, book) {
    const world = data.worlds.find(w => w.id === worldId);
    if (!world) return;

    const gate = world.gates.find(g => g.id === gateId);
    if (!gate) return;

    gate.books.push(book);
    save();
  }

  return {
    load,
    get,
    save,
    addBook
  };
})();