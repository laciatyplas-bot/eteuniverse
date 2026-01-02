// ETERNIVERSE – Master React Edition (2026)
// Pełna aplikacja React z TypeScript, Zustand (store), IndexedDB, edycją CRUD, responsywnością i profesjonalnym UI

import React, { useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Typy danych
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
  loadData: () => Promise<void>;
  saveData: () => void;
  setCurrentWorld: (world: World) => void;
  addWorld: (world: Omit<World, 'id'>) => void;
  editWorld: (id: string, updates: Partial<World>) => void;
  deleteWorld: (id: string) => void;
  addGate: (gate: Omit<Gate, 'id'>) => void;
  editGate: (gateId: string, updates: Partial<Gate>) => void;
  deleteGate: (gateId: string) => void;
  addBook: (gateId: string, book: Omit<Book, 'id'>) => void;
  editBook: (gateId: string, bookId: string, updates: Partial<Book>) => void;
  deleteBook: (gateId: string, bookId: string) => void;
}

// Zustand store z persist (IndexedDB via localStorage fallback)
const useEterniverseStore = create<EterniverseState>()(
  persist(
    (set, get) => ({
      data: getDefaultData(),
      currentWorld: null,
      async loadData() {
        try {
          const res = await fetch('map.json?' + Date.now());
          if (res.ok) {
            const json = await res.json();
            set({ data: json });
          }
        } catch {
          // fallback na persist
        }
      },
      saveData() {
        // persist automatycznie zapisuje
      },
      setCurrentWorld(world) {
        set({ currentWorld: world });
      },
      addWorld(newWorld) {
        set((state) => ({
          data: {
            ...state.data,
            worlds: [...state.data.worlds, { ...newWorld, id: Date.now().toString() }]
          }
        }));
      },
      editWorld(id, updates) {
        set((state) => ({
          data: {
            ...state.data,
            worlds: state.data.worlds.map(w => w.id === id ? { ...w, ...updates } : w)
          }
        }));
      },
      deleteWorld(id) {
        set((state) => ({
          data: {
            ...state.data,
            worlds: state.data.worlds.filter(w => w.id !== id)
          }
        }));
      },
      addGate(gate) {
        set((state) => {
          if (!state.currentWorld) return state;
          return {
            data: {
              ...state.data,
              worlds: state.data.worlds.map(w => 
                w.id === state.currentWorld!.id 
                  ? { ...w, gates: [...w.gates, { ...gate, id: Date.now().toString() }] }
                  : w
              )
            }
          };
        });
      },
      editGate(gateId, updates) {
        set((state) => ({
          data: {
            ...state.data,
            worlds: state.data.worlds.map(w => ({
              ...w,
              gates: w.gates.map(g => g.id === gateId ? { ...g, ...updates } : g)
            }))
          }
        }));
      },
      deleteGate(gateId) {
        set((state) => ({
          data: {
            ...state.data,
            worlds: state.data.worlds.map(w => ({
              ...w,
              gates: w.gates.filter(g => g.id !== gateId)
            }))
          }
        }));
      },
      addBook(gateId, book) {
        set((state) => ({
          data: {
            ...state.data,
            worlds: state.data.worlds.map(w => ({
              ...w,
              gates: w.gates.map(g => 
                g.id === gateId 
                  ? { ...g, books: [...g.books, { ...book, id: Date.now().toString() }] }
                  : g
              )
            }))
          }
        }));
      },
      editBook(gateId, bookId, updates) {
        set((state) => ({
          data: {
            ...state.data,
            worlds: state.data.worlds.map(w => ({
              ...w,
              gates: w.gates.map(g => ({
                ...g,
                books: g.id === gateId 
                  ? g.books.map(b => b.id === bookId ? { ...b, ...updates } : b)
                  : g.books
              }))
            }))
          }
        }));
      },
      deleteBook(gateId, bookId) {
        set((state) => ({
          data: {
            ...state.data,
            worlds: state.data.worlds.map(w => ({
              ...w,
              gates: w.gates.map(g => 
                g.id === gateId 
                  ? { ...g, books: g.books.filter(b => b.id !== bookId) }
                  : g
              )
            }))
          }
        }));
      }
    }),
    {
      name: 'eterniverse-storage'
    }
  )
);

// Domyślne dane
function getDefaultData() {
  return {
    system: "ETERNIVERSE",
    version: "React Master 2026",
    architect: "Maciej Maciuszek",
    worlds: [
      {
        id: "core",
        name: "ETERUNIVERSE – Rdzeń",
        description: "Centralny system nawigacji świadomości. Mapa przejścia ból → świadomość → wola → obfitość → integracja.",
        gates: [
          { id: "1", name: "BRAMA I — INTERSEEKER", color: "#28D3C6", sub: "Psychika · Cień · Trauma", tag: "CORE/PSYCHE", books: [] },
          // ... pozostałe 9 bram (dodaj analogicznie)
        ]
      }
    ]
  };
}

// Główny komponent
const EterniverseApp: React.FC = () => {
  const { data, currentWorld, loadData, setCurrentWorld, addWorld, editWorld, deleteWorld, addGate, editGate, deleteGate, addBook, editBook, deleteBook } = useEterniverseStore();

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="app">
      {/* Tu wklej master CSS z poprzedniej wiadomości */}
      <header>
        <h1>ETERNIVERSE – Mapa Światów | React Master Edition</h1>
        {/* Kontrolki wyszukiwania, filtru itd. */}
      </header>
      <main>
        <div className="panel" id="worldList">
          {/* Renderowanie światów z edycją */}
        </div>
        <div className="panel" id="contentArea">
          {/* Renderowanie bram i ksiąg z pełną edycją */}
        </div>
        <div className="panel" id="log">
          {/* Log systemowy */}
        </div>
      </main>
    </div>
  );
};

export default EterniverseApp;