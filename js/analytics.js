// ========================================
// ETERNIVERSE MASTER 2026 - analytics.js v2.1
// Dashboard • Stats • Canvas Charts • Live Updates
// ========================================

'use strict';

class AnalyticsMaster {
  constructor() {
    this.canvas = document.getElementById('chartCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.elements = {
      totalBooks: document.getElementById('totalBooks'),
      publishedBooks: document.getElementById('publishedBooks')
    };

    this.currentWorld = null;
    this.stats = null;

    this.init();
  }

  // =========================
  // INIT
  // =========================
  init() {
    this.loadStats();
    this.bindEvents();
    this.render();

    console.log('📊 Analytics Master v2.1 READY');
  }

  // =========================
  // EVENTS
  // =========================
  bindEvents() {
    // Tab render
    document.addEventListener('renderAnalytics', () => {
      this.loadStats();
      this.render();
    });

    // World selected
    document.addEventListener('worldSelected', e => {
      this.currentWorld = e.detail.world;
      this.loadStats();
      this.render();
    });

    // Editor change
    document.addEventListener('editorContentChanged', () => {
      this.loadStats();
      this.render();
    });

    // Resize
    window.addEventListener(
      'resize',
      CoreEngine.debounce(() => this.resize(), 200)
    );
  }

  // =========================
  // DATA
  // =========================
  loadStats() {
    const allBooks = DataAPI.getBooks();
    const worlds = DataAPI.getWorlds();

    const books = this.currentWorld
      ? allBooks.filter(b => b.world === this.currentWorld.id)
      : allBooks;

    const totalBooks = books.length;
    const published = books.filter(b => b.status === 'opublikowana').length;
    const production = books.filter(b => b.status === 'w produkcji').length;
    const planned = books.filter(b => b.status === 'planowana').length;

    const wordCount = books.reduce(
      (sum, b) => sum + (b.wordCount || 0),
      0
    );

    this.stats = {
      totalBooks,
      published,
      production,
      planned,
      wordCount,
      worldsCount: worlds.length
    };
  }

  // =========================
  // RENDER
  // =========================
  render() {
    if (!this.stats) return;

    this.renderCounters();
    this.renderChart();
  }

  renderCounters() {
    if (this.elements.totalBooks) {
      this.elements.totalBooks.textContent = this.stats.totalBooks;
    }

    if (this.elements.publishedBooks) {
      this.elements.publishedBooks.textContent = this.stats.published;
    }
  }

  // =========================
  // CANVAS CHART
  // =========================
  resize() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = 240;
    this.renderChart();
  }

  renderChart() {
    if (!this.ctx || !this.stats) return;

    const { published, production, planned } = this.stats;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    const data = [
      { label: 'LIVE', value: published, color: '#00ff88' },
      { label: 'PROD', value: production, color: '#ff6b6b' },
      { label: 'PLAN', value: planned, color: '#ffb14b' }
    ];

    const max = Math.max(...data.map(d => d.value), 1);
    const barWidth = w / (data.length * 2);

    data.forEach((d, i) => {
      const x = w / 2 + (i - 1) * barWidth * 2;
      const barHeight = (d.value / max) * (h - 40);

      // Bar
      ctx.fillStyle = d.color;
      ctx.fillRect(x - barWidth / 2, h - barHeight - 20, barWidth, barHeight);

      // Label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(d.label, x, h - 5);

      // Value
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText(d.value, x, h - barHeight - 30);
    });
  }
}

// =========================
// INIT
// =========================
document.addEventListener('DOMContentLoaded', () => {
  window.AnalyticsMaster = new AnalyticsMaster();
});