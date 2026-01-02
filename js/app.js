// ==============================
// APP.JS — STEROWNIK SYSTEMU
// ==============================

document.addEventListener('DOMContentLoaded', async () => {
  const data = await DataStore.load();
  Renderer.renderWorlds(data);
});

// Obsługa dodawania książki
document.addEventListener('ADD_BOOK', (e) => {
  const { worldId, gateId } = e.detail;

  const title = prompt('Tytuł książki:');
  if (!title) return;

  const book = {
    id: crypto.randomUUID(),
    title,
    status: 'draft',
    chapters: [],
    audiobooks: []
  };

  DataStore.addBook(worldId, gateId, book);
  Renderer.renderWorlds(DataStore.get());
});