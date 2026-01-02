// ========================================
// ETERNIVERSE MASTER 2026 - app.js v3.0
// GŁÓWNY ORCHESTRATOR SYSTEMU
// ========================================

'use strict';

class EterniverseApp {
  constructor() {
    this.state = {
      activeTab: 'map',
      currentWorld: null,
      currentBook: null,
      dirty: false,
      lastSave: null
    };

    this.modules = {};
    this.init();
  }

  // =========================
  // INIT
  // =========================
  init() {
    console.log('🚀 ETERNIVERSE APP v3.0 – BOOT');

    this.cacheDOM();
    this.bindGlobalEvents();
    this.initModules();
    this.restoreState();

    CoreEngine.showToast('ETERNIVERSE gotowy', 'success');
  }

  cacheDOM() {
    this.dom = {
      worldList: document.getElementById('worldList'),
      miniWorldList: document.getElementById('miniWorldList'),
      gates: document.getElementById('gatesContainer'),
      autosave: document.getElementById('autosaveStatus'),
      title: document.getElementById('activeBookTitle'),
      editor: document.getElementById('editor-content')
    };
  }

  // =========================
  // MODULES
  // =========================
  initModules() {
    // Map 3D
    if (window.Map3DPro) {
      this.modules.map = window.Map3DPro;
    }

    // Rich editor
    if (window.RichEditorMaster) {
      this.modules.editor = new RichEditorMaster();
    }

    // Analytics
    if (window.AnalyticsMaster) {
      this.modules.analytics = window.AnalyticsMaster;
    }

    // Tabs
    if (window.TabsMaster) {
      this.modules.tabs = window.TabsMaster;
    }

    // AI Bella (jeśli istnieje)
    if (window.BellaMaster) {
      this.modules.ai = window.BellaMaster;
    }
  }

  // =========================
  // EVENTS
  // =========================
  bindGlobalEvents() {
    // TAB SWITCH
    document.addEventListener('tabContentLoad', e => {
      this.state.activeTab = e.detail.tabId;
      this.persistState();
    });

    // WORLD SELECT
    document.addEventListener('worldSelected', e => {
      this.setWorld(e.detail.world);
    });

    // EDITOR CHANGE
    document.addEventListener('input', CoreEngine.debounce(() => {
      if (this.state.currentBook) {
        this.state.dirty = true;
        this.updateAutosaveStatus('zmiany…');
        document.dispatchEvent(new CustomEvent('editorContentChanged'));
      }
    }, 300));

    // SAVE
    document.addEventListener('submit', e => {
      if (e.target.id === 'superEditorForm') {
        e.preventDefault();
        this.saveCurrent();
      }
    });

    // HOTKEYS FALLBACK
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        this.saveCurrent();
      }
    });
  }

  // =========================
  // WORLD / BOOK
  // =========================
  setWorld(world) {
    this.state.currentWorld = world;

    this.renderWorldLists();
    CoreEngine.showToast(`🌍 ${world.name}`, 'info');
  }

  openBook(book) {
    this.state.currentBook = book;
    this.state.dirty = false;

    if (this.dom.title) {
      this.dom.title.textContent = book.title || 'Nowa książka';
    }

    if (this.dom.editor) {
      this.dom.editor.innerHTML = book.content || '';
    }

    this.updateAutosaveStatus('wczytano');
  }

  // =========================
  // SAVE / AUTOSAVE
  // =========================
  saveCurrent() {
    if (!this.state.currentBook) return;

    const content = this.dom.editor?.innerHTML || '';
    const titleInput = document.getElementById('editor-title');

    const updated = {
      ...this.state.currentBook,
      title: titleInput?.value || this.state.currentBook.title,
      content,
      updatedAt: new Date().toISOString()
    };

    const saved = DataAPI.saveBook(updated);
    this.state.currentBook = saved;
    this.state.dirty = false;
    this.state.lastSave = Date.now();

    this.updateAutosaveStatus('zapisano');
    CoreEngine.showToast('💾 Zapisano książkę', 'success');
  }

  updateAutosaveStatus(text) {
    if (!this.dom.autosave) return;
    this.dom.autosave.textContent = `Autozapis: ${text}`;
  }

  // =========================
  // RENDER
  // =========================
  renderWorldLists() {
    if (!this.dom.miniWorldList) return;

    const worlds = DataAPI.getWorlds();

    this.dom.miniWorldList.innerHTML = worlds.map(w => `
      <div class="world-mini ${this.state.currentWorld?.id === w.id ? 'active' : ''}"
           data-id="${w.id}">
        <strong>${w.name}</strong><br/>
        <small>${w.books || 0} książek</small>
      </div>
    `).join('');

    this.dom.miniWorldList.querySelectorAll('.world-mini').forEach(el => {
      el.onclick = () => {
        const world = DataAPI.getWorld(el.dataset.id);
        if (world) this.setWorld(world);
      };
    });
  }

  // =========================
  // STATE
  // =========================
  persistState() {
    localStorage.setItem('eterniverse_app_state', JSON.stringify({
      activeTab: this.state.activeTab,
      currentWorld: this.state.currentWorld?.id || null
    }));
  }

  restoreState() {
    const raw = localStorage.getItem('eterniverse_app_state');
    if (!raw) return;

    try {
      const state = JSON.parse(raw);
      if (state.currentWorld) {
        const w = DataAPI.getWorld(state.currentWorld);
        if (w) this.setWorld(w);
      }
    } catch {}
  }
}

// =========================
// BOOT
// =========================
document.addEventListener('DOMContentLoaded', () => {
  window.eterniverse = new EterniverseApp();
});