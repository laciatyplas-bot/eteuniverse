// js/data.js
const EterniverseData = {
  data: null,
  currentWorld: null,
  currentGate: null,
  currentBookIndex: null,

  async loadData() {
    const res = await fetch("data/mapa.json");
    this.data = await res.json();
  },

  getWorlds() {
    return this.data.worlds;
  },

  getWorldById(id) {
    return this.data.worlds.find(w => w.id === id);
  },

  save() {
    localStorage.setItem("ETERNIVERSE_DATA", JSON.stringify(this.data));
  },

  loadFromLocal() {
    const local = localStorage.getItem("ETERNIVERSE_DATA");
    if (local) {
      this.data = JSON.parse(local);
    }
  }
};