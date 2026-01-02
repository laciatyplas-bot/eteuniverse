// ========================================
// ETERNIVERSE MASTER 2026 - map3d.js v2.1
// Ultra stabilna mapa 3D (Canvas)
// ========================================

'use strict';

class Map3DPro {
  constructor() {
    this.canvas =
      document.getElementById('mapCanvas') ||
      document.querySelector('#interactiveMap canvas');

    if (!this.canvas) {
      console.warn('🗺️ Map3D: canvas not found');
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.dpr = window.devicePixelRatio || 1;

    this.worlds = DataAPI.getWorlds();
    this.mouse = { x: 0, y: 0, prevX: 0, prevY: 0, down: false, hovered: null };
    this.camera = {
      zoom: 1.2,
      rotation: 0,
      targetRotation: 0,
      tilt: 0.7,
      focusWorld: null
    };

    this.particles = [];
    this.tooltip = null;
    this.isDragging = false;
    this.lastTime = performance.now();

    this.init();
  }

  // =========================
  // INIT
  // =========================
  init() {
    this.resize();
    this.bindEvents();
    this.initParticles();
    this.initTooltip();

    document.addEventListener('worldsUpdated', () => {
      this.worlds = DataAPI.getWorlds();
    });

    requestAnimationFrame(this.animate.bind(this));

    console.log('🌌 Map3D Pro v2.1 READY');
  }

  // =========================
  // RESIZE (FIXED DPR BUG)
  // =========================
  resize() {
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * this.dpr;
    this.canvas.height = rect.height * this.dpr;

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    this.w = rect.width;
    this.h = rect.height;
    this.cx = this.w / 2;
    this.cy = this.h / 2;
  }

  // =========================
  // EVENTS
  // =========================
  bindEvents() {
    this.canvas.addEventListener('mousemove', e => this.onMove(e));
    this.canvas.addEventListener('mousedown', () => (this.mouse.down = true));
    this.canvas.addEventListener('mouseup', () => this.onUp());
    this.canvas.addEventListener('mouseleave', () => this.onLeave());
    this.canvas.addEventListener('wheel', e => this.onWheel(e), { passive: false });

    window.addEventListener(
      'resize',
      CoreEngine.debounce(() => this.resize(), 100)
    );
  }

  onMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;

    if (this.mouse.down) {
      const dx = this.mouse.x - this.mouse.prevX;
      const dy = this.mouse.y - this.mouse.prevY;
      this.camera.targetRotation += dx * 0.008;
      this.camera.tilt = Math.max(0.3, Math.min(1.2, this.camera.tilt + dy * 0.004));
      this.isDragging = true;
    }

    this.mouse.prevX = this.mouse.x;
    this.mouse.prevY = this.mouse.y;

    this.updateHover();
    this.moveTooltip(e.clientX, e.clientY);
  }

  onUp() {
    if (!this.isDragging) this.onClick();
    this.mouse.down = false;
    this.isDragging = false;
  }

  onLeave() {
    this.mouse.hovered = null;
    this.hideTooltip();
  }

  onWheel(e) {
    e.preventDefault();
    this.camera.zoom = Math.max(0.6, Math.min(3, this.camera.zoom - e.deltaY * 0.002));
  }

  // =========================
  // INTERACTION
  // =========================
  updateHover() {
    const world = this.getWorldAt(this.mouse.x, this.mouse.y);

    if (world !== this.mouse.hovered) {
      this.mouse.hovered = world;
      if (world) this.showTooltip(world.name, world.description);
      else this.hideTooltip();
    }
  }

  onClick() {
    if (!this.mouse.hovered) return;
    this.selectWorld(this.mouse.hovered);
    CoreEngine.showToast(`🌍 ${this.mouse.hovered.name}`, 'success');
  }

  getWorldAt(x, y) {
    return this.worlds.find(w => {
      if (!w.screenPos) return false;
      const dx = w.screenPos.x - x;
      const dy = w.screenPos.y - y;
      return Math.hypot(dx, dy) < 42;
    });
  }

  selectWorld(world) {
    this.camera.focusWorld = world;

    document.dispatchEvent(
      new CustomEvent('worldSelected', {
        detail: {
          world,
          books: DataAPI.getBooks(world.id),
          stats: DataAPI.getStats()
        }
      })
    );

    this.spawnExplosion(world);
    this.playTone();
  }

  // =========================
  // LOOP
  // =========================
  animate(t) {
    const dt = t - this.lastTime;
    this.lastTime = t;

    this.update(dt);
    this.render();

    requestAnimationFrame(this.animate.bind(this));
  }

  update() {
    this.camera.rotation += (this.camera.targetRotation - this.camera.rotation) * 0.1;
    this.updateParticles();

    if (this.camera.focusWorld) {
      const i = this.worlds.indexOf(this.camera.focusWorld);
      const angle = (i / this.worlds.length) * Math.PI * 2;
      this.camera.targetRotation = angle;
      if (Math.abs(this.camera.rotation - angle) < 0.01) {
        this.camera.focusWorld = null;
      }
    }
  }

  // =========================
  // RENDER
  // =========================
  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);

    const bg = ctx.createRadialGradient(
      this.cx * 0.6,
      this.cy * 0.4,
      0,
      this.cx,
      this.cy,
      Math.max(this.w, this.h)
    );
    bg.addColorStop(0, '#142864');
    bg.addColorStop(1, '#020216');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, this.w, this.h);

    ctx.save();
    ctx.translate(this.cx, this.cy);
    ctx.rotate(this.camera.rotation);
    ctx.scale(1 / this.camera.zoom, this.camera.tilt / this.camera.zoom);

    this.renderWorlds();
    this.renderLinks();
    this.renderParticles();

    ctx.restore();
  }

  renderWorlds() {
    this.worlds.forEach((w, i) => {
      const angle = (i / this.worlds.length) * Math.PI * 2;
      const r = 140 + Math.sin(Date.now() * 0.004 + i) * 20;

      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;

      w.screenPos = { x: x + this.cx, y: y + this.cy };

      const g = this.ctx.createRadialGradient(x, y, 0, x, y, 45);
      g.addColorStop(0, w.color);
      g.addColorStop(1, 'transparent');

      this.ctx.fillStyle = g;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 32, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#fff';
      this.ctx.font = 'bold 16px Orbitron';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(w.name, x, y + 58);
    });
  }

  renderLinks() {
    this.worlds.forEach(w1 => {
      if (!w1.connections) return;
      w1.connections.forEach(id => {
        const w2 = this.worlds.find(w => w.id === id);
        if (!w2) return;

        this.ctx.strokeStyle = 'rgba(0,212,255,.3)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(w1.screenPos.x - this.cx, w1.screenPos.y - this.cy);
        this.ctx.lineTo(w2.screenPos.x - this.cx, w2.screenPos.y - this.cy);
        this.ctx.stroke();
      });
    });
  }

  // =========================
  // PARTICLES
  // =========================
  initParticles() {
    for (let i = 0; i < 80; i++) this.particles.push(this.newParticle());
  }

  newParticle() {
    return {
      x: (Math.random() - 0.5) * 500,
      y: (Math.random() - 0.5) * 500,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      life: Math.random() * 100
    };
  }

  updateParticles() {
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) Object.assign(p, this.newParticle());
    });
  }

  renderParticles() {
    this.ctx.fillStyle = 'rgba(0,212,255,.4)';
    this.particles.forEach(p => {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  spawnExplosion(world) {
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: world.screenPos.x - this.cx,
        y: world.screenPos.y - this.cy,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 40
      });
    }
  }

  // =========================
  // TOOLTIP
  // =========================
  initTooltip() {
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'map-tooltip';
    Object.assign(this.tooltip.style, {
      position: 'fixed',
      pointerEvents: 'none',
      background: 'rgba(0,20,40,.95)',
      color: '#fff',
      padding: '10px 16px',
      borderRadius: '16px',
      opacity: 0,
      transition: 'all .25s ease',
      zIndex: 9999
    });
    document.body.appendChild(this.tooltip);
  }

  moveTooltip(x, y) {
    if (!this.tooltip) return;
    this.tooltip.style.left = x + 18 + 'px';
    this.tooltip.style.top = y + 18 + 'px';
  }

  showTooltip(title, desc) {
    this.tooltip.innerHTML = `<strong>${title}</strong><br><span style="opacity:.8">${desc}</span>`;
    this.tooltip.style.opacity = 1;
  }

  hideTooltip() {
    if (this.tooltip) this.tooltip.style.opacity = 0;
  }

  // =========================
  // AUDIO
  // =========================
  playTone() {
    try {
      if (!this.audioCtx) this.audioCtx = new AudioContext();
      const osc = this.audioCtx.createOscillator();
      const g = this.audioCtx.createGain();
      osc.connect(g);
      g.connect(this.audioCtx.destination);
      osc.frequency.value = 520;
      g.gain.value = 0.08;
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.15);
    } catch {}
  }
}

// =========================
// INIT
// =========================
document.addEventListener('DOMContentLoaded', () => {
  window.Map3DPro = new Map3DPro();
});