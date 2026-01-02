// ========================================
// ETERNIVERSE MASTER PANEL 2026 - app.js
// Główny orchestrator
// ========================================

'use strict';

class EterniverseMaster {
  constructor() {
    this.state = {
      currentTab: 'map',
      currentWorld: null,
      currentBook: null,
      unsavedChanges: false,
      history: [],
      historyIndex: -1,
      dataVersion: '1.0'
    };

    this.worlds = [];
    this.books = [];
    this.settings = { theme: 'dark', autosave: true };

    this.init();
  }

  /* ================= INIT ================= */

  async init() {
    console.log('🌌 ETERNIVERSE MASTER INIT');

    await this.loadAllData();
    this.bindGlobalEvents();
    this.initTabs();
    this.initMap();
    this.initAI();
    this.initAnalytics();

    this.switchTab('map');
    this.startServices();
  }

  /* ================= DATA ================= */

  async loadAllData() {
    try {
      const cached = localStorage.getItem('eterniverse_master');
      if (cached) {
        const parsed = JSON.parse(cached);
        this.worlds = parsed.worlds || [];
        this.books = parsed.books || [];
        return;
      }

      // demo fallback
      this.worlds = [
        { id: 'eter1', name: 'Eter-1', color: '#00ff88' },
        { id: 'kwant', name: 'Kwantowe Splątanie', color: '#ff6b6b' }
      ];

      this.books = [];
    } catch (e) {
      console.error('❌ Błąd ładowania danych', e);
    }
  }

  saveAllData() {
    localStorage.setItem(
      'eterniverse_master',
      JSON.stringify({ worlds: this.worlds, books: this.books })
    );
    this.state.unsavedChanges = false;
  }

  /* ================= EVENTS ================= */

  bindGlobalEvents() {
    document.addEventListener('keydown', e => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault();
            this.saveCurrent();
            break;
          case 'n':
            e.preventDefault();
            this.newBook();
            break;
        }
      }
    });
  }

  /* ================= TABS ================= */

  initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () =>
        this.switchTab(btn.dataset.tab)
      );
    });
  }

  switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t =>
      t.classList.remove('active')
    );
    document.querySelectorAll('.tab-btn').forEach(b =>
      b.classList.remove('active')
    );

    const tab = document.getElementById(`${tabId}Tab`);
    const btn = document.querySelector(`[data-tab="${tabId}"]`);

    if (tab && btn) {
      tab.classList.add('active');
      btn.classList.add('active');
      this.state.currentTab = tabId;
    }

    if (tabId === 'editor') this.renderSuperEditor();
    if (tabId === 'analytics') this.renderDashboard();
  }

  /* ================= MAP ================= */

  initMap() {
    const canvas = document.getElementById('mapCanvas');
    if (!canvas) return;

    this.mapCtx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const animate = () => {
      this.renderMap();
      requestAnimationFrame(animate);
    };
    animate();
  }

  renderMap() {
    const ctx = this.mapCtx;
    if (!ctx) return;

    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    ctx.clearRect(0, 0, w, h);

    this.worlds.forEach((wld, i) => {
      const x = w / 2 + Math.cos(i) * 150;
      const y = h / 2 + Math.sin(i) * 150;

      ctx.fillStyle = wld.color || '#00d4ff';
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.font = '14px Orbitron';
      ctx.textAlign = 'center';
      ctx.fillText(wld.name, x, y + 55);
    });
  }

  /* ================= EDITOR ================= */

  renderSuperEditor() {
    const titleEl = document.getElementById('editor-title');
    const contentEl = document.getElementById('editor-content');

    if (!titleEl || !contentEl) return;

    if (!this.currentBook) {
      titleEl.value = '';
      contentEl.innerHTML = '';
      return;
    }

    titleEl.value = this.currentBook.title || '';
    contentEl.innerHTML = this.currentBook.content || '';
  }

  saveCurrent() {
    if (!this.currentBook) return;

    const titleEl = document.getElementById('editor-title');
    const contentEl = document.getElementById('editor-content');

    this.currentBook.title = titleEl?.value || '';
    this.currentBook.content = contentEl?.innerHTML || '';
    this.currentBook.updated = new Date().toISOString();

    this.saveAllData();
    this.showToast('💾 Zapisano');
  }

  newBook() {
    const book = {
      id: `book_${Date.now()}`,
      title: 'Nowa książka',
      content: '',
      status: 'draft'
    };

    this.books.push(book);
    this.currentBook = book;
    this.switchTab('editor');
    this.showToast('➕ Nowa książka');
  }

  /* ================= ANALYTICS ================= */

  renderDashboard() {
    const total = document.getElementById('totalBooks');
    if (total) total.textContent = this.books.length;
  }

  /* ================= AI ================= */

  initAI() {
    const btn = document.getElementById('generateContent');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const out = document.getElementById('aiOutput');
      if (out) out.textContent = '🤖 AI wygenerowało treść (mock)';
    });
  }

  /* ================= SERVICES ================= */

  startServices() {
    setInterval(() => {
      if (this.state.unsavedChanges) this.saveAllData();
    }, 30000);

    const contentEl = document.getElementById('editor-content');
    if (contentEl) {
      contentEl.addEventListener('input', () => this.updateWordCount());
    }
  }

  updateWordCount() {
    const el = document.getElementById('editor-content');
    const counter = document.getElementById('wordCount');
    if (!el || !counter) return;

    const text = el.innerText || '';
    const count = text.trim().split(/\s+/).filter(Boolean).length;
    counter.textContent = `${count} słów`;
  }

  /* ================= UI ================= */

  showToast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText =
      'position:fixed;top:90px;right:20px;background:#00ff88;color:#000;padding:12px 20px;border-radius:20px;font-weight:bold;z-index:9999';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }
}

/* ================= START ================= */

document.addEventListener('DOMContentLoaded', () => {
  window.eterniverse = new EterniverseMaster();
});