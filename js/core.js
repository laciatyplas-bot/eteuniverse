// ========================================
// ETERNIVERSE MASTER 2026 - core.js
// SERCE APLIKACJI — Core Engine + Utils
// ========================================

'use strict';

const CoreEngine = {
  version: '2.1.0',
  debug: true,
  performanceMode: false,
  modules: {},
  hotkeys: {},
  rafTasks: new Set(),

  // =========================
  // 🚀 INIT
  // =========================
  init() {
    this.setupPolyfills();
    this.setupPerformance();
    this.bindGlobalEvents();
    this.startHeartbeat();
    this.setupHotkeys();
    this.devTools();

    if (this.debug) {
      console.group('%c🔥 ETERNIVERSE CORE READY', 'color:#00ff88;font-size:16px');
      console.log('Version:', this.version);
      console.log('Modules:', Object.keys(this.modules));
      console.groupEnd();
    }
  },

  // =========================
  // 🛠️ POLYFILLS
  // =========================
  setupPolyfills() {
    if (typeof window.CustomEvent !== 'function') {
      window.CustomEvent = function (event, params = {}) {
        const evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(
          event,
          !!params.bubbles,
          !!params.cancelable,
          params.detail
        );
        return evt;
      };
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = cb => setTimeout(cb, 1000 / 60);
    }

    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = id => clearTimeout(id);
    }
  },

  // =========================
  // ⚡ PERFORMANCE
  // =========================
  setupPerformance() {
    this.debounce = (fn, delay = 300) => {
      let t;
      return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), delay);
      };
    };

    this.throttleRAF = fn => {
      let scheduled = false;
      return (...args) => {
        if (!scheduled) {
          scheduled = true;
          requestAnimationFrame(() => {
            fn.apply(this, args);
            scheduled = false;
          });
        }
      };
    };
  },

  // =========================
  // 🎧 GLOBAL EVENTS
  // =========================
  bindGlobalEvents() {
    document.addEventListener('visibilitychange', () => {
      document.documentElement.classList.toggle(
        'paused',
        document.hidden
      );
    });

    window.addEventListener('online', () =>
      this.showToast('🌐 Połączono z siecią', 'success')
    );
    window.addEventListener('offline', () =>
      this.showToast('⚠️ Brak połączenia', 'warn')
    );

    window.addEventListener('resize', this.throttleRAF(() => {
      document.dispatchEvent(new CustomEvent('core:resize'));
    }));

    window.addEventListener('error', e =>
      this.errorHandler(e.error || e.message, 'global')
    );

    window.addEventListener('unhandledrejection', e =>
      this.errorHandler(e.reason, 'promise')
    );
  },

  // =========================
  // 💓 HEARTBEAT
  // =========================
  startHeartbeat() {
    let last = performance.now();

    setInterval(() => {
      const now = performance.now();
      const fps = 1000 / (now - last);
      last = now;

      if (this.debug && fps < 45) {
        console.warn(`🐌 Low FPS: ${fps.toFixed(1)}`);
      }

      document.dispatchEvent(
        new CustomEvent('core:heartbeat', {
          detail: { fps }
        })
      );
    }, 1000);
  },

  // =========================
  // 📦 MODULE SYSTEM
  // =========================
  registerModule(name, module) {
    if (this.modules[name]) {
      console.warn(`Module ${name} already registered`);
      return;
    }

    this.modules[name] = module;

    if (typeof module.init === 'function') {
      try {
        module.init();
      } catch (e) {
        this.errorHandler(e, `module:${name}`);
      }
    }

    if (this.debug) {
      console.log(`📦 Module registered: ${name}`);
    }
  },

  getModule(name) {
    return this.modules[name];
  },

  // =========================
  // 🎮 HOTKEYS
  // =========================
  setupHotkeys() {
    document.addEventListener('keydown', e => {
      const key = e.key.toLowerCase();
      const combo =
        `${e.ctrlKey || e.metaKey ? 'ctrl+' : ''}` +
        `${e.shiftKey ? 'shift+' : ''}${key}`;

      if (this.hotkeys[combo]) {
        e.preventDefault();
        this.hotkeys[combo].callback();
      }
    });
  },

  registerHotkey(combo, callback, description = '') {
    this.hotkeys[combo.toLowerCase()] = { callback, description };
  },

  // =========================
  // 🎨 TOASTS
  // =========================
  showToast(message, type = 'info', timeout = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    Object.assign(toast.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '1rem 1.5rem',
      borderRadius: '24px',
      fontWeight: '600',
      zIndex: 9999,
      background: {
        success: '#00ff88',
        warn: '#ffb14b',
        error: '#ff6b6b',
        info: '#00d4ff'
      }[type] || '#00d4ff',
      color: '#000',
      boxShadow: '0 10px 30px rgba(0,0,0,.25)',
      animation: 'toastIn .35s ease'
    });

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastOut .35s ease forwards';
      setTimeout(() => toast.remove(), 350);
    }, timeout);
  },

  // =========================
  // 🧠 STATE (GLOBAL)
  // =========================
  state: new Proxy({}, {
    set(target, prop, value) {
      target[prop] = value;
      document.dispatchEvent(
        new CustomEvent('core:state', { detail: { prop, value } })
      );
      return true;
    }
  }),

  // =========================
  // 🧯 ERROR HANDLER
  // =========================
  errorHandler(error, scope = 'unknown') {
    console.error(`❌ [${scope}]`, error);
    this.showToast(`Błąd: ${error?.message || error}`, 'error');
  },

  // =========================
  // 🧪 DEV TOOLS
  // =========================
  devTools() {
    if (!this.debug) return;

    window.eterniverseDev = {
      clearStorage: () => {
        localStorage.clear();
        location.reload();
      },
      modules: () => console.table(this.modules),
      state: () => console.table(this.state)
    };

    console.log('%c🧪 DevTools ready', 'color:#00ff88');
  }
};

// =========================
// 🔥 BOOTSTRAP
// =========================
(function boot() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CoreEngine.init());
  } else {
    CoreEngine.init();
  }

  window.CoreEngine = CoreEngine;

  // Inject toast animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes toastIn { from{transform:translateX(300px);opacity:0} to{opacity:1} }
    @keyframes toastOut { to{transform:translateX(300px);opacity:0} }
  `;
  document.head.appendChild(style);
})();