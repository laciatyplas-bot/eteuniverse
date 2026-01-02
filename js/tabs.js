// ========================================
// ETERNIVERSE MASTER 2026 - tabs.js
// Stabilny, animowany system zakładek
// ========================================

'use strict';

class TabsMaster {
  constructor() {
    this.activeTab = null;
    this.lastActiveTab = null;
    this.isTransitioning = false;
    this.tabs = [];
    this.contents = [];
    this.init();
  }

  // 🚀 INIT
  init() {
    this.tabs = Array.from(document.querySelectorAll('.tab-btn'));
    this.contents = Array.from(document.querySelectorAll('.tab-content'));

    if (!this.tabs.length || !this.contents.length) {
      console.warn('TabsMaster: brak zakładek lub treści');
      return;
    }

    this.bindEvents();
    this.restoreState();
    this.observeResize();

    console.log('🗂️ TabsMaster v2.1 uruchomiony');
  }

  // 🎯 EVENTS
  bindEvents() {
    this.tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchTab(btn.dataset.tab);
      });

      btn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.switchTab(btn.dataset.tab);
        }
      });
    });

    // MOBILE SWIPE
    let startX = 0;
    document.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    });

    document.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 60) {
        diff > 0 ? this.nextTab() : this.prevTab();
      }
    });
  }

  // 🔄 SWITCH TAB
  async switchTab(tabId) {
    if (this.isTransitioning || tabId === this.activeTab) return;

    const nextContent = document.getElementById(`${tabId}Tab`);
    if (!nextContent) {
      console.warn(`TabsMaster: brak contentu dla ${tabId}`);
      return;
    }

    this.isTransitioning = true;
    this.lastActiveTab = this.activeTab;

    // HIDE CURRENT
    if (this.activeTab) {
      const currentContent = document.getElementById(`${this.activeTab}Tab`);
      if (currentContent) {
        currentContent.style.opacity = '0';
        currentContent.style.transform = 'translateX(20px)';
        await this.wait(200);
        currentContent.classList.remove('active');
      }
    }

    // BUTTON STATES
    this.tabs.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
      btn.setAttribute(
        'aria-selected',
        btn.dataset.tab === tabId ? 'true' : 'false'
      );
    });

    // SHOW NEXT
    nextContent.classList.add('active');
    nextContent.style.opacity = '0';
    nextContent.style.transform = 'translateX(-20px)';

    await this.wait(30);

    nextContent.style.transition =
      'opacity 0.35s ease, transform 0.35s ease';
    nextContent.style.opacity = '1';
    nextContent.style.transform = 'translateX(0)';

    this.activeTab = tabId;
    this.isTransitioning = false;

    this.persistState();
    this.dispatchTabEvents(tabId);
    this.track(tabId);
  }

  // 📦 EVENTS FOR OTHER MODULES
  dispatchTabEvents(tabId) {
    document.dispatchEvent(
      new CustomEvent('tab:change', { detail: { tab: tabId } })
    );

    const map = {
      map: 'renderMap',
      editor: 'renderEditor',
      analytics: 'renderAnalytics',
      ai: 'initAIStudio',
      timeline: 'renderTimeline'
    };

    if (map[tabId]) {
      document.dispatchEvent(new CustomEvent(map[tabId]));
    }
  }

  // ➡️ NEXT / PREV
  nextTab() {
    const i = this.tabs.findIndex(b => b.dataset.tab === this.activeTab);
    const next = (i + 1) % this.tabs.length;
    this.switchTab(this.tabs[next].dataset.tab);
  }

  prevTab() {
    const i = this.tabs.findIndex(b => b.dataset.tab === this.activeTab);
    const prev = i === 0 ? this.tabs.length - 1 : i - 1;
    this.switchTab(this.tabs[prev].dataset.tab);
  }

  // 💾 STATE
  persistState() {
    localStorage.setItem('eterniverse_active_tab', this.activeTab);
  }

  restoreState() {
    const saved = localStorage.getItem('eterniverse_active_tab');
    const exists = this.tabs.find(b => b.dataset.tab === saved);

    if (exists) {
      this.switchTab(saved);
    } else {
      this.switchTab(this.tabs[0].dataset.tab);
    }
  }

  // 📏 RESPONSIVE
  observeResize() {
    const nav = document.querySelector('.tab-nav');
    if (!nav) return;

    const update = () => {
      if (window.innerWidth < 768) {
        nav.classList.add('mobile');
      } else {
        nav.classList.remove('mobile');
      }
    };

    window.addEventListener('resize', update);
    update();
  }

  // ⏱️ UTILS
  wait(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  // 📊 TRACKING
  track(tabId) {
    const stats = JSON.parse(localStorage.getItem('tabs_usage') || '{}');
    stats[tabId] = (stats[tabId] || 0) + 1;
    stats.last = tabId;
    stats.time = Date.now();
    localStorage.setItem('tabs_usage', JSON.stringify(stats));
  }
}

// 🔥 INIT
document.addEventListener('DOMContentLoaded', () => {
  window.TabsMaster = new TabsMaster();

  document.querySelector('.tab-nav')?.setAttribute('role', 'tablist');
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.setAttribute('role', 'tab');
    btn.setAttribute('tabindex', '0');
  });
});