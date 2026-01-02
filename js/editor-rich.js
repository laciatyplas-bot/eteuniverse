// ========================================
// ETERNIVERSE MASTER 2026 - editor-rich.js v2.1
// Rich Text Editor + Toolbar + History + Autosave
// ========================================

'use strict';

class RichEditorMaster {
  constructor() {
    this.editor =
      document.getElementById('editor-content') ||
      document.querySelector('.rich-editor');

    this.toolbar = document.querySelector('.editor-toolbar');

    this.history = [];
    this.historyIndex = -1;
    this.maxHistory = 100;

    this.isTyping = false;
    this.autosaveDelay = 800;
    this.autosaveTimer = null;

    if (!this.editor || !this.toolbar) {
      console.warn('📝 RichEditor: editor or toolbar not found');
      return;
    }

    this.init();
  }

  // =========================
  // INIT
  // =========================
  init() {
    this.editor.contentEditable = 'true';
    this.editor.spellcheck = true;

    this.buildToolbar();
    this.bindEvents();
    this.saveHistory(); // initial state

    console.log('✍️ RichEditor Master v2.1 READY');
  }

  // =========================
  // TOOLBAR
  // =========================
  buildToolbar() {
    if (this.toolbar.dataset.ready) return;
    this.toolbar.dataset.ready = 'true';

    const tools = [
      { cmd: 'bold', label: 'B' },
      { cmd: 'italic', label: 'I' },
      { cmd: 'underline', label: 'U' },
      { cmd: 'strikeThrough', label: 'S' },
      { cmd: 'insertUnorderedList', label: '•' },
      { cmd: 'insertOrderedList', label: '1.' },
      { cmd: 'formatBlock', value: 'h1', label: 'H1' },
      { cmd: 'formatBlock', value: 'h2', label: 'H2' },
      { cmd: 'formatBlock', value: 'p', label: 'P' },
      { cmd: 'createLink', label: '🔗' },
      { cmd: 'insertImage', label: '🖼️' },
      { cmd: 'undo', label: '↶' },
      { cmd: 'redo', label: '↷' }
    ];

    this.toolbar.innerHTML = '';

    tools.forEach(t => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = t.label;
      btn.dataset.cmd = t.cmd;
      if (t.value) btn.dataset.value = t.value;
      btn.addEventListener('click', () => this.exec(t.cmd, t.value));
      this.toolbar.appendChild(btn);
    });
  }

  // =========================
  // EVENTS
  // =========================
  bindEvents() {
    this.editor.addEventListener('input', () => this.onInput());
    this.editor.addEventListener('keydown', e => this.onKeyDown(e));
    this.editor.addEventListener('mouseup', () => this.storeSelection());
    this.editor.addEventListener('keyup', () => this.storeSelection());

    document.addEventListener('renderEditor', () => {
      this.restoreContent();
    });
  }

  // =========================
  // COMMAND EXECUTION
  // =========================
  exec(cmd, value = null) {
    this.restoreSelection();

    if (cmd === 'createLink') {
      const url = prompt('Wklej URL:');
      if (url) document.execCommand('createLink', false, url);
      return;
    }

    if (cmd === 'insertImage') {
      const url = prompt('URL obrazka:');
      if (url) document.execCommand('insertImage', false, url);
      return;
    }

    if (cmd === 'undo') {
      this.undo();
      return;
    }

    if (cmd === 'redo') {
      this.redo();
      return;
    }

    try {
      document.execCommand(cmd, false, value);
    } catch (e) {
      console.warn('execCommand failed:', cmd);
    }

    this.saveHistory();
  }

  // =========================
  // INPUT + AUTOSAVE
  // =========================
  onInput() {
    this.isTyping = true;

    clearTimeout(this.autosaveTimer);
    this.autosaveTimer = setTimeout(() => {
      this.saveHistory();
      this.autosave();
    }, this.autosaveDelay);
  }

  autosave() {
    const content = this.editor.innerHTML;
    localStorage.setItem('eterniverse_editor_draft', content);

    CoreEngine?.showToast('💾 Autozapis', 'success', 1500);
  }

  restoreContent() {
    const saved = localStorage.getItem('eterniverse_editor_draft');
    if (saved) this.editor.innerHTML = saved;
  }

  // =========================
  // HISTORY
  // =========================
  saveHistory() {
    const content = this.editor.innerHTML;

    if (
      this.historyIndex >= 0 &&
      this.history[this.historyIndex] === content
    )
      return;

    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(content);

    if (this.history.length > this.maxHistory) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }
  }

  undo() {
    if (this.historyIndex <= 0) return;
    this.historyIndex--;
    this.editor.innerHTML = this.history[this.historyIndex];
  }

  redo() {
    if (this.historyIndex >= this.history.length - 1) return;
    this.historyIndex++;
    this.editor.innerHTML = this.history[this.historyIndex];
  }

  // =========================
  // SELECTION
  // =========================
  storeSelection() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      this.selection = sel.getRangeAt(0);
    }
  }

  restoreSelection() {
    if (!this.selection) return;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(this.selection);
  }

  // =========================
  // HOTKEYS
  // =========================
  onKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      this.undo();
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      this.redo();
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      this.exec('bold');
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      this.exec('italic');
    }
  }
}

// =========================
// INIT
// =========================
document.addEventListener('DOMContentLoaded', () => {
  window.RichEditorMaster = new RichEditorMaster();
});