import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
interface Book {
  id: string;
  title: string;
  status: string;
  content: string;
}

interface Gate {
  id: string;
  name: string;
  color: string;
  sub: string;
  tag: string;
  books: Book[];
}

interface World {
  id: string;
  name: string;
  description: string;
  gates: Gate[];
}

interface EterniverseState {
  data: {
    system: string;
    version: string;
    architect: string;
    worlds: World[];
  };
  currentWorld: World | null;
  setCurrentWorld: (world: World | null) => void;
  addWorld: (name: string, description: string) => void;
  editWorld: (id: string, name: string, description: string) => void;
  deleteWorld: (id: string) => void;
  addGate: (worldId: string, name: string, color: string, sub: string, tag: string) => void;
  editGate: (worldId: string, gateId: string, name: string, color: string, sub: string, tag: string) => void;
  deleteGate: (worldId: string, gateId: string) => void;
  addBook: (worldId: string, gateId: string, title: string, status: string, content: string) => void;
  editBook: (worldId: string, gateId: string, bookId: string, title: string, status: string, content: string) => void;
  deleteBook: (worldId: string, gateId: string, bookId: string) => void;
}

// Default data with 10 gates
const getDefaultData = () => ({
  system: 'ETERNIVERSE',
  version: 'Master React 2026',
  architect: 'Maciej Maciuszek',
  worlds: [
    {
      id: 'core',
      name: 'ETERUNIVERSE – Rdzeń',
      description: 'Centralny system nawigacji świadomości.',
      gates: [
        { id: '1', name: 'BRAMA I — INTERSEEKER', color: '#28D3C6', sub: 'Psychika', tag: 'CORE/PSYCHE', books: [] },
        { id: '2', name: 'BRAMA II — CUSTOS / GENEZA', color: '#D9A441', sub: 'Początek', tag: 'CORE/ORIGIN', books: [] },
        { id: '3', name: 'BRAMA III — ETERSEEKER', color: '#12C65B', sub: 'Wola', tag: 'CORE/FIELD', books: [] },
        { id: '4', name: 'BRAMA IV — ARCHETYPY / WOLA', color: '#9B6BFF', sub: 'Role', tag: 'CORE/WILL', books: [] },
        { id: '5', name: 'BRAMA V — OBFITOSEEKER', color: '#FFB14B', sub: 'Obfitość', tag: 'EMBODIED/FLOW', books: [] },
        { id: '6', name: 'BRAMA VI — BIOSEEKER', color: '#FF6B6B', sub: 'Ciało', tag: 'EMBODIED/BIO', books: [] },
        { id: '7', name: 'BRAMA VII — SPLĄTANIE / AI', color: '#9B6BFF', sub: 'Technologia', tag: 'META/TECH', books: [] },
        { id: '8', name: 'BRAMA VIII — TRAJEKTORIE', color: '#28D3C6', sub: 'Czas', tag: 'META/PHYSICS', books: [] },
        { id: '9', name: 'BRAMA IX — ETERNIONY / KOLEKTYW', color: '#D9A441', sub: 'Wspólnota', tag: 'COLLECTIVE', books: [] },
        { id: '10', name: 'BRAMA X — ETERUNIVERSE', color: '#12C65B', sub: 'Integracja', tag: 'INTEGRATION', books: [] }
      ]
    }
  ]
});

// Zustand store z persist (IndexedDB via localStorage fallback for simplicity; for full IndexedDB, use idb-keyval)
export const useEterniverseStore = create<EterniverseState>()(
  persist(
    (set, get) => ({
      data: getDefaultData(),
      currentWorld: null,
      setCurrentWorld: (world) => set({ currentWorld: world }),
      addWorld: (name, description) => set((state) => ({
        data: {
          ...state.data,
          worlds: [...state.data.worlds, { id: Date.now().toString(), name, description, gates: [] }]
        }
      })),
      editWorld: (id, name, description) => set((state) => ({
        data: {
          ...state.data,
          worlds: state.data.worlds.map(w => w.id === id ? { ...w, name, description } : w)
        }
      })),
      deleteWorld: (id) => set((state) => ({
        data: {
          ...state.data,
          worlds: state.data.worlds.filter(w => w.id !== id)
        }
      })),
      addGate: (worldId, name, color, sub, tag) => set((state) => ({
        data: {
          ...state.data,
          worlds: state.data.worlds.map(w => w.id === worldId ? {
            ...w,
            gates: [...w.gates, { id: Date.now().toString(), name, color, sub, tag, books: [] }]
          } : w)
        }
      })),
      editGate: (worldId, gateId, name, color, sub, tag) => set((state) => ({
        data: {
          ...state.data,
          worlds: state.data.worlds.map(w => w.id === worldId ? {
            ...w,
            gates: w.gates.map(g => g.id === gateId ? { ...g, name, color, sub, tag } : g)
          } : w)
        }
      })),
      deleteGate: (worldId, gateId) => set((state) => ({
        data: {
          ...state.data,
          worlds: state.data.worlds.map(w => w.id === worldId ? {
            ...w,
            gates: w.gates.filter(g => g.id !== gateId)
          } : w)
        }
      })),
      addBook: (worldId, gateId, title, status, content) => set((state) => ({
        data: {
          ...state.data,
          worlds: state.data.worlds.map(w => w.id === worldId ? {
            ...w,
            gates: w.gates.map(g => g.id === gateId ? {
              ...g,
              books: [...g.books, { id: Date.now().toString(), title, status, content }]
            } : g)
          } : w)
        }
      })),
      editBook: (worldId, gateId, bookId, title, status, content) => set((state) => ({
        data: {
          ...state.data,
          worlds: state.data.worlds.map(w => w.id === worldId ? {
            ...w,
            gates: w.gates.map(g => g.id === gateId ? {
              ...g,
              books: g.books.map(b => b.id === bookId ? { ...b, title, status, content } : b)
            } : g)
          } : w)
        }
      })),
      deleteBook: (worldId, gateId, bookId) => set((state) => ({
        data: {
          ...state.data,
          worlds: state.data.worlds.map(w => w.id === worldId ? {
            ...w,
            gates: w.gates.map(g => g.id === gateId ? {
              ...g,
              books: g.books.filter(b => b.id !== bookId)
            } : g)
          } : w)
        }
      }))
    }),
    {
      name: 'eterniverse-storage'
    }
  )
);

// Komponent App
const App: React.FC = () => {
  const { data, currentWorld, setCurrentWorld, loadData, addWorld, editWorld, deleteWorld, addGate, editGate, deleteGate, addBook, editBook, deleteBook } = useEterniverseStore();

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="app">
      <header>
        <h1>ETERNIVERSE – Mapa Światów</h1>
      </header>
      <main>
        <div className="panel" id="worldList">
          <WorldList worlds={data.worlds} onSelect={setCurrentWorld} onAdd={addWorld} onEdit={editWorld} onDelete={deleteWorld} />
        </div>
        <div className="panel" id="contentArea">
          {currentWorld ? (
            <GateList world={currentWorld} onAddGate={addGate} onEditGate={editGate} onDeleteGate={deleteGate} onAddBook={addBook} onEditBook={editBook} onDeleteBook={deleteBook} />
          ) : (
            <p>Wybierz świat z listy</p>
          )}
        </div>
        <div class="panel" id="log">
          {/* Log komponent */}
        </div>
      </main>
    </div>
  );
};

// Komponent WorldList
const WorldList: React.FC<{ worlds: World[]; onSelect: (world: World) => void; onAdd: (name: string, description: string) => void; onEdit: (id: string, name: string, description: string) => void; onDelete: (id: string) => void; }> = ({ worlds, onSelect, onAdd, onEdit, onDelete }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleAdd = () => {
    const name = prompt('Nazwa świata:');
    const description = prompt('Opis:');
    if (name) onAdd(name, description || '');
  };

  const handleEdit = (world: World) => {
    const name = prompt('Nowa nazwa:', world.name);
    const description = prompt('Nowy opis:', world.description);
    if (name) onEdit(world.id, name, description || '');
  };

  return (
    <div>
      <button onClick={handleAdd}>+ Dodaj Świat</button>
      {worlds.map(world => (
        <button key={world.id} onClick={() => onSelect(world)}>
          {world.name}
          <span onClick={() => handleEdit(world)}>Edytuj</span>
          <span onClick={() => onDelete(world.id)}>Usuń</span>
        </button>
      ))}
    </div>
  );
};

// Komponent GateList
const GateList: React.FC<{ world: World; onAddGate: (name: string, color: string, sub: string, tag: string) => void; onEditGate: (gateId: string, name: string, color: string, sub: string, tag: string) => void; onDeleteGate: (gateId: string) => void; onAddBook: (gateId: string, title: string, status: string, content: string) => void; onEditBook: (gateId: string, bookId: string, title: string, status: string, content: string) => void; onDeleteBook: (gateId: string, bookId: string) => void; }> = ({ world, onAddGate, onEditGate, onDeleteGate, onAddBook, onEditBook, onDeleteBook }) => {
  // ... Implementacja podobna do WorldList, z renderowaniem bram i ksiąg + formami edycji (prompt lub modale)
  // Dla zwięzłości, implementacja analogiczna
};

// Komponent BookList
const BookList: React.FC<{ gate: Gate; onAdd: (title: string, status: string, content: string) => void; onEdit: (bookId: string, title: string, status: string, content: string) => void; onDelete: (bookId: string) => void; }> = ({ gate, onAdd, onEdit, onDelete }) => {
  // ... Implementacja listy ksiąg z edycją
};

// Inicjalizacja w index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));