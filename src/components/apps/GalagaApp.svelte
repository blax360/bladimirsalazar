<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  // ─── Reactive HUD state (Svelte 5 runes) ───────────────────────────
  let score = $state(0);
  let lives = $state(3);
  let scene = $state(1);
  let powerUp = $state('none');
  let comboCount = $state(0);

  // ─── Canvas / engine ───────────────────────────────────────────────
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let animationId = 0;
  let width = 0;
  let height = 0;

  let gameStarted = $state(false);
  let gameRunning = false;
  let gameWon = $state(false);
  let gameOver = $state(false);

  const keys: Record<string, boolean> = {};
  let lastShot = 0;
  const SHOT_COOLDOWN = 180;

  // ─── Audio (Web Audio API chiptune) ────────────────────────────────
  let audioCtx: AudioContext | null = null;

  function ensureAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  }

  function playShoot() {
    try {
      ensureAudio();
      if (!audioCtx) return;
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(1200, audioCtx.currentTime);
      o.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.08);
      g.gain.setValueAtTime(0.05, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(); o.stop(audioCtx.currentTime + 0.08);
    } catch {}
  }

  function playExplosion() {
    try {
      ensureAudio();
      if (!audioCtx) return;
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(250, audioCtx.currentTime);
      o.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.35);
      g.gain.setValueAtTime(0.1, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(); o.stop(audioCtx.currentTime + 0.35);
    } catch {}
  }

  function playPowerUp() {
    try {
      ensureAudio();
      if (!audioCtx) return;
      for (let i = 0; i < 3; i++) {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = 'sine';
        const t = audioCtx.currentTime + i * 0.08;
        o.frequency.setValueAtTime(440 + i * 220, t);
        g.gain.setValueAtTime(0.07, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        o.connect(g); g.connect(audioCtx.destination);
        o.start(t); o.stop(t + 0.15);
      }
    } catch {}
  }

  function playGameOver() {
    try {
      ensureAudio();
      if (!audioCtx) return;
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(400, audioCtx.currentTime);
      o.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 1);
      g.gain.setValueAtTime(0.15, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(); o.stop(audioCtx.currentTime + 1);
    } catch {}
  }

  function playBoss() {
    try {
      ensureAudio();
      if (!audioCtx) return;
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(80, audioCtx.currentTime);
      o.frequency.linearRampToValueAtTime(120, audioCtx.currentTime + 0.5);
      g.gain.setValueAtTime(0.12, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(); o.stop(audioCtx.currentTime + 0.6);
    } catch {}
  }

  function playCut() {
    try {
      ensureAudio();
      if (!audioCtx) return;
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(2000, audioCtx.currentTime);
      o.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.03);
      g.gain.setValueAtTime(0.03, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(); o.stop(audioCtx.currentTime + 0.03);
    } catch {}
  }

  function playVictory() {
    try {
      ensureAudio();
      if (!audioCtx) return;
      const notes = [523, 659, 784, 1047];
      for (let i = 0; i < notes.length; i++) {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = 'square';
        const t = audioCtx.currentTime + i * 0.12;
        o.frequency.setValueAtTime(notes[i], t);
        g.gain.setValueAtTime(0.08, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        o.connect(g); g.connect(audioCtx.destination);
        o.start(t); o.stop(t + 0.2);
      }
    } catch {}
  }

  // ─── Types ─────────────────────────────────────────────────────────
  type EnemyType = 'toma_mala' | 'bateria_muerta' | 'sd_corrupta' | 'sin_presupuesto' | 'focus_perdido' | 'actor_dramatico' | 'lloron';
  type PowerUpType = 'rapid' | 'wide' | 'extra' | 'cafe';

  interface Enemy {
    x: number; y: number; w: number; h: number;
    vx: number; vy: number;
    color: string;
    hp: number; maxHp: number;
    type: EnemyType;
    label: string;
    points: number;
    diveTimer: number;
    isDiving: boolean;
    hitFlash: number;
  }

  interface Boss {
    x: number; y: number; w: number; h: number;
    vx: number; hp: number; maxHp: number;
    shootTimer: number;
    angryTimer: number;
  }

  interface Projectile {
    x: number; y: number; w: number; h: number;
    vx: number; vy: number; color: string;
    kind: 'frame' | 'contract';
  }

  interface Particle {
    x: number; y: number; vx: number; vy: number;
    size: number; life: number; color: string;
  }

  interface Star { x: number; y: number; size: number; speed: number; }

  interface PowerUpDrop {
    x: number; y: number; vy: number; type: PowerUpType;
  }

  // ─── Game objects ──────────────────────────────────────────────────
  let player = { x: 0, y: 0, w: 44, h: 36, speed: 5 };
  let projectiles: Projectile[] = [];
  let enemies: Enemy[] = [];
  let boss: Boss | null = null;
  let particles: Particle[] = [];
  let stars: Star[] = [];
  let powerUps: PowerUpDrop[] = [];
  let playerPowerUp: PowerUpType | 'none' = 'none';
  let powerUpTimer = 0;
  let comboTimer = 0;
  let combo = 0;
  let shakeAmount = 0;
  let shakeTimer = 0;
  let invincible = false;
  let invincibleTimer = 0;
  let sceneTransition = 0;
  let sceneQuote = '';
  let quoteTimer = 0;
  let comboMessage = '';
  let comboMessageTimer = 0;
  let filmStripOffset = 0;

  const ENEMY_TYPES: Record<EnemyType, { color: string; label: string; hp: number; points: number }> = {
    toma_mala:       { color: '#ff4444', label: 'TOMA MALA',       hp: 1, points: 100 },
    bateria_muerta:  { color: '#ffaa00', label: 'BATERIA MUERTA',  hp: 1, points: 150 },
    sd_corrupta:     { color: '#ff00ff', label: 'SD CORRUPTA',     hp: 2, points: 250 },
    sin_presupuesto: { color: '#00ffff', label: 'SIN PRESUPUESTO', hp: 2, points: 300 },
    focus_perdido:   { color: '#888888', label: 'FOCUS PERDIDO',   hp: 1, points: 120 },
    actor_dramatico: { color: '#aa44ff', label: 'ACTOR DRAMATICO', hp: 3, points: 400 },
    lloron:          { color: '#ff66aa', label: 'LLORON',          hp: 2, points: 350 },
  };

  const DIRECTOR_QUOTES = [
    '¡CORTEN! ¿Alguien trajo cafe?',
    'La actriz se fue del set...',
    'El presupuesto se acabo pero SIGAMOS',
    '¡Esa toma era PERFECTA! ...se borro',
    'El guionista llora en el bano',
    '¡LUZ! ¡CAMARA! ...no hay camara',
    'El catering se comio el presupuesto',
    'El cliente quiere otro cambio "pequeno"',
    'La SD se formateo sola. Magia.',
    'El director de foto dice que es "artistico"',
    '¡CORTEN! El boom entro en cuadro',
    'Version final_v2_definitiva_FINAL_7.mp4',
  ];

  const GAME_OVER_REASONS = [
    'El productor huyo con el dinero',
    'La SD tenia un virus del 2003',
    'El actor principal se hizo influencer',
    'El clima decicio no cooperar. Nunca.',
    'Se acabo el cafe. Todo el cafe.',
    'El cliente pidio "que sea mas viral"',
    'El equipo se union al sindicato del miedo',
  ];

  function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ─── Resize / init ─────────────────────────────────────────────────
  function resize() {
    if (!canvas) return;
    const rect = canvas.parentElement?.getBoundingClientRect() ?? { width: 520, height: 400 };
    width = canvas.width = Math.max(200, rect.width);
    height = canvas.height = Math.max(150, rect.height);
    player.x = width / 2 - player.w / 2;
    player.y = height - 55;
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < 80; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.3,
        speed: Math.random() * 1.2 + 0.2,
      });
    }
  }

  // ─── Scene spawning ────────────────────────────────────────────────
  function getSceneEnemyPool(s: number): EnemyType[] {
    if (s <= 1) return ['toma_mala', 'focus_perdido', 'bateria_muerta'];
    if (s <= 3) return ['toma_mala', 'focus_perdido', 'bateria_muerta', 'sd_corrupta'];
    return ['toma_mala', 'focus_perdido', 'bateria_muerta', 'sd_corrupta', 'sin_presupuesto', 'actor_dramatico', 'lloron'];
  }

  function spawnScene() {
    enemies = [];
    boss = null;

    // Boss at scene 4 and scene 8
    if (scene === 4 || scene === 8) {
      spawnBoss();
      return;
    }

    const pool = getSceneEnemyPool(scene);
    const count = 5 + scene * 2;
    const cols = Math.min(8, count);
    const startX = (width - cols * 50) / 2;
    const rowSpacing = 38;

    for (let i = 0; i < count; i++) {
      const type = pool[i % pool.length];
      const meta = ENEMY_TYPES[type];
      const col = i % cols;
      const row = Math.floor(i / cols);
      enemies.push({
        x: startX + col * 50,
        y: -40 - row * rowSpacing,
        w: 36, h: 28,
        vx: 0.6 + scene * 0.08,
        vy: 0.2 + scene * 0.06,
        color: meta.color,
        hp: meta.hp, maxHp: meta.hp,
        type,
        label: meta.label,
        points: meta.points,
        diveTimer: Math.random() * 400 + 200,
        isDiving: false,
        hitFlash: 0,
      });
    }

    // Set initial formation direction
    formationDir = 1;
    formationOffset = 0;
  }

  function spawnBoss() {
    boss = {
      x: width / 2 - 60,
      y: -80,
      w: 120, h: 70,
      vx: 1.5,
      hp: 20, maxHp: 20,
      shootTimer: 90,
      angryTimer: 0,
    };
    playBoss();
  }

  let formationDir = 1;
  let formationOffset = 0;

  // ─── Particles ─────────────────────────────────────────────────────
  function explode(x: number, y: number, color: string, count: number = 15) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 1;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 1,
        life: 1,
        color,
      });
    }
  }

  // ─── Power-up drop ─────────────────────────────────────────────────
  function dropPowerUp(x: number, y: number) {
    if (Math.random() > 0.12) return;
    const types: PowerUpType[] = ['rapid', 'wide', 'extra', 'cafe'];
    const type = types[Math.floor(Math.random() * types.length)];
    powerUps.push({ x, y, vy: 1.5, type });
  }

  // ─── Reset ─────────────────────────────────────────────────────────
  function reset() {
    score = 0;
    lives = 3;
    scene = 1;
    combo = 0;
    comboCount = 0;
    powerUp = 'none';
    projectiles = [];
    enemies = [];
    boss = null;
    particles = [];
    powerUps = [];
    playerPowerUp = 'none';
    powerUpTimer = 0;
    invincible = false;
    invincibleTimer = 0;
    shakeAmount = 0;
    shakeTimer = 0;
    sceneTransition = 0;
    quoteTimer = 0;
    gameRunning = true;
    gameStarted = true;
    gameWon = false;
    gameOver = false;
    spawnScene();
  }

  // ─── Color helper ──────────────────────────────────────────────────
  function hexToRgb(hex: string): string {
    const map: Record<string, string> = {
      '#ff4444': '255,68,68', '#ffaa00': '255,170,0', '#ff00ff': '255,0,255',
      '#00ffff': '0,255,255', '#888888': '136,136,136', '#aa44ff': '170,68,255',
      '#ff66aa': '255,102,170', '#00ff00': '0,255,0', '#ffff00': '255,255,0',
      '#ff0000': '255,0,0', '#ffffff': '255,255,255', '#000000': '0,0,0',
      '#00ccff': '0,204,255',
    };
    return map[hex] || '255,255,255';
  }

  // ─── Drawing: camera (player) ──────────────────────────────────────
  function drawCamera(x: number, y: number, w: number, h: number) {
    if (!ctx) return;
    const blink = invincible && Math.floor(Date.now() / 100) % 2 === 0;
    if (blink) return;

    // Camera body
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(x, y + 6, w, h - 6);

    // Lens barrel
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2 + 2, 9, 0, Math.PI * 2);
    ctx.fill();

    // Lens glass — glowing
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#00ccff';
    ctx.fillStyle = '#00ccff';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2 + 2, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#0066aa';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2 + 2, 3, 0, Math.PI * 2);
    ctx.fill();

    // Viewfinder bump
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(x + w * 0.3, y, w * 0.4, 8);

    // Recording light — pulsing
    const recOn = Math.floor(Date.now() / 400) % 2 === 0;
    ctx.fillStyle = recOn ? '#ff0000' : '#440000';
    ctx.shadowBlur = recOn ? 6 : 0;
    ctx.shadowColor = '#ff0000';
    ctx.fillRect(x + w - 6, y + 8, 4, 4);
    ctx.shadowBlur = 0;

    // Shooting flash
    if (keys['Space'] || keys['Enter']) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.arc(x + w / 2, y + h / 2 + 2, 14, 0, Math.PI * 2);
      ctx.fill();
    }

    // Invincibility aura (cafe power-up)
    if (invincible) {
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ffff00';
      ctx.beginPath();
      ctx.arc(x + w / 2, y + h / 2 + 2, 22 + Math.sin(Date.now() / 80) * 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  // ─── Drawing: enemies ──────────────────────────────────────────────
  function drawEnemy(e: Enemy) {
    if (!ctx) return;
    const flash = e.hitFlash > 0;
    const drawColor = flash ? '#ffffff' : e.color;

    ctx.shadowBlur = 6;
    ctx.shadowColor = e.color;

    if (e.type === 'toma_mala') {
      // Clapperboard
      ctx.fillStyle = drawColor;
      ctx.fillRect(e.x, e.y + 5, e.w, e.h - 5);
      ctx.fillStyle = '#fff';
      ctx.fillRect(e.x, e.y, e.w, 5);
      ctx.fillStyle = drawColor;
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(e.x + i * 9, e.y, 5, 5);
      }
      ctx.fillStyle = '#fff';
      ctx.font = '7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('NG', e.x + e.w / 2, e.y + 18);
    } else if (e.type === 'bateria_muerta') {
      // Battery
      ctx.fillStyle = drawColor;
      ctx.fillRect(e.x + 3, e.y + 3, e.w - 6, e.h - 6);
      ctx.fillStyle = '#000';
      ctx.fillRect(e.x + e.w - 8, e.y + 8, 4, 8);
      ctx.fillRect(e.x + 8, e.y + 12, e.w - 16, 3);
      ctx.fillStyle = drawColor;
      ctx.fillRect(e.x + 8, e.y + 12, (e.w - 16) * 0.2, 3);
      // X mark
      ctx.strokeStyle = '#ff4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(e.x + 6, e.y + 6);
      ctx.lineTo(e.x + e.w - 6, e.y + e.h - 6);
      ctx.stroke();
    } else if (e.type === 'sd_corrupta') {
      // SD card
      ctx.fillStyle = drawColor;
      ctx.fillRect(e.x + 4, e.y + 4, e.w - 8, e.h - 8);
      ctx.fillStyle = '#000';
      ctx.fillRect(e.x + 8, e.y, 12, 6);
      ctx.fillStyle = '#fff';
      ctx.font = '6px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('ERR', e.x + e.w / 2, e.y + 18);
    } else if (e.type === 'sin_presupuesto') {
      // Money bag with X
      ctx.fillStyle = drawColor;
      ctx.beginPath();
      ctx.arc(e.x + e.w / 2, e.y + e.h / 2 + 2, e.w / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('$', e.x + e.w / 2, e.y + e.h / 2 + 5);
      ctx.strokeStyle = '#ff4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(e.x + 4, e.y + 4);
      ctx.lineTo(e.x + e.w - 4, e.y + e.h - 4);
      ctx.stroke();
    } else if (e.type === 'focus_perdido') {
      // Blurred circle
      ctx.fillStyle = 'rgba(136,136,136,0.4)';
      ctx.beginPath();
      ctx.arc(e.x + e.w / 2, e.y + e.h / 2, e.w / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(136,136,136,0.25)';
      ctx.beginPath();
      ctx.arc(e.x + e.w / 2 - 3, e.y + e.h / 2, e.w / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = drawColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(e.x + e.w / 2, e.y + e.h / 2, e.w / 2, 0, Math.PI * 2);
      ctx.stroke();
    } else if (e.type === 'actor_dramatico') {
      // Drama mask
      ctx.fillStyle = drawColor;
      ctx.beginPath();
      ctx.arc(e.x + e.w / 2, e.y + e.h / 2 + 2, e.w / 2 - 1, 0, Math.PI * 2);
      ctx.fill();
      // Eyes — tragic
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(e.x + e.w * 0.3, e.y + e.h * 0.4, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(e.x + e.w * 0.7, e.y + e.h * 0.4, 3, 0, Math.PI * 2);
      ctx.fill();
      // Mouth — open wail
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.ellipse(e.x + e.w / 2, e.y + e.h * 0.7, 4, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (e.type === 'lloron') {
      // Tear drop
      ctx.fillStyle = drawColor;
      ctx.beginPath();
      ctx.moveTo(e.x + e.w / 2, e.y);
      ctx.quadraticCurveTo(e.x + e.w, e.y + e.h * 0.5, e.x + e.w / 2, e.y + e.h);
      ctx.quadraticCurveTo(e.x, e.y + e.h * 0.5, e.x + e.w / 2, e.y);
      ctx.fill();
      // Tear shine
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.beginPath();
      ctx.arc(e.x + e.w * 0.38, e.y + e.h * 0.3, 2, 0, Math.PI * 2);
      ctx.fill();
      // Sad mouth
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(e.x + e.w / 2, e.y + e.h * 0.7, 4, Math.PI * 1.2, Math.PI * 1.8);
      ctx.stroke();
    }

    // HP indicator for multi-hp enemies
    if (e.maxHp > 1 && e.hp < e.maxHp) {
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ff4444';
      ctx.font = '6px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${e.hp}`, e.x + e.w / 2, e.y - 3);
    }

    ctx.shadowBlur = 0;
  }

  // ─── Drawing: boss ─────────────────────────────────────────────────
  function drawBoss(b: Boss) {
    if (!ctx) return;
    const flash = b.angryTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0;
    const faceColor = flash ? '#ffffff' : '#ff4444';

    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff0000';

    // Big angry face — circle
    ctx.fillStyle = faceColor;
    ctx.beginPath();
    ctx.arc(b.x + b.w / 2, b.y + b.h / 2, b.h / 2, 0, Math.PI * 2);
    ctx.fill();

    // Angry eyebrows
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(b.x + 20, b.y + 18);
    ctx.lineTo(b.x + 45, b.y + 25);
    ctx.lineTo(b.x + 45, b.y + 28);
    ctx.lineTo(b.x + 20, b.y + 24);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(b.x + b.w - 20, b.y + 18);
    ctx.lineTo(b.x + b.w - 45, b.y + 25);
    ctx.lineTo(b.x + b.w - 45, b.y + 28);
    ctx.lineTo(b.x + b.w - 20, b.y + 24);
    ctx.fill();

    // Eyes — glowing
    ctx.fillStyle = '#ffff00';
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#ffff00';
    ctx.beginPath();
    ctx.arc(b.x + b.w * 0.33, b.y + b.h * 0.45, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(b.x + b.w * 0.67, b.y + b.h * 0.45, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Pupils
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(b.x + b.w * 0.33, b.y + b.h * 0.45, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(b.x + b.w * 0.67, b.y + b.h * 0.45, 3, 0, Math.PI * 2);
    ctx.fill();

    // Angry mouth
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(b.x + b.w / 2, b.y + b.h * 0.75, 18, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    // Teeth
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(b.x + b.w / 2 - 16 + i * 8, b.y + b.h * 0.75 - 3, 4, 4);
    }

    // HP bar
    ctx.shadowBlur = 0;
    const barW = b.w;
    const barH = 5;
    const barX = b.x;
    const barY = b.y - 12;
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(barX, barY, barW * (b.hp / b.maxHp), barH);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, barH);

    // Label
    ctx.fillStyle = '#ff4444';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#ff0000';
    ctx.fillText('EL PRODUCTOR', b.x + b.w / 2, b.y - 18);
    ctx.shadowBlur = 0;
  }

  // ─── Drawing: projectiles ──────────────────────────────────────────
  function drawProjectile(p: Projectile) {
    if (!ctx) return;
    ctx.fillStyle = p.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = p.color;
    if (p.kind === 'frame') {
      // Film frame — rectangle with perforations
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#fff';
      ctx.fillRect(p.x + 1, p.y + 1, p.w - 2, p.h - 2);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x + 2, p.y + 2, p.w - 4, p.h - 4);
    } else {
      // Contract — crumpled paper
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#000';
      ctx.font = '6px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('$', p.x + p.w / 2, p.y + p.h - 2);
    }
    ctx.shadowBlur = 0;
  }

  // ─── Drawing: power-ups ────────────────────────────────────────────
  function drawPowerUp(p: PowerUpDrop) {
    if (!ctx) return;
    const colors: Record<PowerUpType, string> = {
      rapid: '#00ff00', wide: '#00ffff', extra: '#ff66aa', cafe: '#ffff00',
    };
    const labels: Record<PowerUpType, string> = {
      rapid: 'RAP', wide: 'WIDE', extra: '+1', cafe: 'CAFE',
    };
    ctx.shadowBlur = 12;
    ctx.shadowColor = colors[p.type];
    // Pulsing
    const pulse = Math.sin(Date.now() / 150) * 2;
    ctx.fillStyle = '#000';
    ctx.fillRect(p.x - 11, p.y - 9, 22 + pulse, 18);
    ctx.fillStyle = colors[p.type];
    ctx.fillRect(p.x - 10, p.y - 8, 20 + pulse, 16);
    ctx.fillStyle = '#000';
    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(labels[p.type], p.x, p.y + 3);
    ctx.shadowBlur = 0;
  }

  // ─── Drawing: film strip edges ─────────────────────────────────────
  function drawFilmStrips() {
    if (!ctx) return;
    const stripW = 12;
    const holeH = 7;
    const holeGap = 14;
    filmStripOffset = (filmStripOffset + 0.5) % holeGap;

    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, stripW, height);
    ctx.fillRect(width - stripW, 0, stripW, height);

    ctx.fillStyle = '#000';
    for (let y = -holeGap + filmStripOffset; y < height; y += holeGap) {
      ctx.fillRect(2, y, stripW - 4, holeH);
      ctx.fillRect(width - stripW + 2, y, stripW - 4, holeH);
    }

    // Film strip border lines
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(stripW, 0); ctx.lineTo(stripW, height);
    ctx.moveTo(width - stripW, 0); ctx.lineTo(width - stripW, height);
    ctx.stroke();
  }

  // ─── Drawing: CRT scanlines ────────────────────────────────────────
  function drawScanlines() {
    if (!ctx) return;
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = '#000';
    for (let y = 0; y < height; y += 3) {
      ctx.fillRect(0, y, width, 1);
    }
    ctx.globalAlpha = 1;
    // Vignette
    const grad = ctx.createRadialGradient(width / 2, height / 2, height / 3, width / 2, height / 2, height);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.4)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  // ─── Combo messages ────────────────────────────────────────────────
  function checkComboMessage(c: number) {
    if (c >= 12) { comboMessage = 'SCORSESE SE INCLINA!'; comboMessageTimer = 90; }
    else if (c >= 8) { comboMessage = 'LEGENDARIO!'; comboMessageTimer = 80; }
    else if (c >= 5) { comboMessage = 'EXCELENTE!'; comboMessageTimer = 70; }
    else if (c >= 3) { comboMessage = 'BUENA TOMA!'; comboMessageTimer = 60; }
  }

  // ─── Main update loop ──────────────────────────────────────────────
  function update() {
    if (!ctx) return;

    // Screen shake offset
    let shakeX = 0, shakeY = 0;
    if (shakeTimer > 0) {
      shakeX = (Math.random() - 0.5) * shakeAmount;
      shakeY = (Math.random() - 0.5) * shakeAmount;
      shakeTimer--;
      if (shakeTimer <= 0) shakeAmount = 0;
    }

    ctx.save();
    ctx.translate(shakeX, shakeY);

    // Clear
    ctx.fillStyle = '#000';
    ctx.fillRect(-shakeX, -shakeY, width + Math.abs(shakeX) * 2, height + Math.abs(shakeY) * 2);

    // Film strips
    drawFilmStrips();

    // Stars / dust
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    for (const s of stars) {
      s.y += s.speed;
      if (s.y > height) { s.y = 0; s.x = Math.random() * width; }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }

    if (gameRunning) {
      // ── Player movement ──
      if (keys['ArrowLeft'] || keys['KeyA']) player.x -= player.speed;
      if (keys['ArrowRight'] || keys['KeyD']) player.x += player.speed;
      player.x = Math.max(14, Math.min(width - player.w - 14, player.x));

      // ── Shooting ──
      const cooldown = playerPowerUp === 'rapid' ? 80 : SHOT_COOLDOWN;
      if (keys['Space'] || keys['Enter']) {
        const now = Date.now();
        if (now - lastShot > cooldown) {
          if (playerPowerUp === 'wide') {
            projectiles.push({ x: player.x + player.w / 2 - 2, y: player.y, w: 5, h: 14, vx: 0, vy: -9, color: '#00ff00', kind: 'frame' });
            projectiles.push({ x: player.x + 4, y: player.y + 5, w: 5, h: 12, vx: -1.5, vy: -7, color: '#00ff88', kind: 'frame' });
            projectiles.push({ x: player.x + player.w - 9, y: player.y + 5, w: 5, h: 12, vx: 1.5, vy: -7, color: '#00ff88', kind: 'frame' });
          } else {
            projectiles.push({ x: player.x + player.w / 2 - 2, y: player.y, w: 5, h: 14, vx: 0, vy: -9, color: '#00ff00', kind: 'frame' });
          }
          lastShot = now;
          playShoot();
        }
      }

      // ── Power-up timer ──
      if (playerPowerUp !== 'none') {
        powerUpTimer--;
        if (powerUpTimer <= 0) {
          playerPowerUp = 'none';
          powerUp = 'none';
          invincible = false;
        }
      }
      // Sync $state for HUD
      powerUp = playerPowerUp as string;

      // ── Invincibility ──
      if (invincible) {
        invincibleTimer--;
        if (invincibleTimer <= 0) {
          invincible = false;
          if (playerPowerUp === 'cafe') {
            playerPowerUp = 'none';
            powerUp = 'none';
          }
        }
      }

      // ── Combo timer ──
      if (combo > 0) {
        comboTimer--;
        if (comboTimer <= 0) { combo = 0; comboCount = 0; }
      }

      // ── Combo message timer ──
      if (comboMessageTimer > 0) comboMessageTimer--;

      // ── Scene quote timer ──
      if (quoteTimer > 0) quoteTimer--;

      // ── Update projectiles ──
      for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        p.x += p.vx;
        p.y += p.vy;
        drawProjectile(p);
        if (p.y < -20 || p.y > height + 20 || p.x < -20 || p.x > width + 20) {
          projectiles.splice(i, 1);
        }
      }

      // ── Formation movement ──
      if (enemies.length > 0 && !boss) {
        formationOffset += formationDir * (0.5 + scene * 0.05);
        let hitEdge = false;
        for (const e of enemies) {
          if (!e.isDiving) {
            e.x = e.x + formationDir * (0.5 + scene * 0.05);
            if (e.x <= 16 || e.x >= width - e.w - 16) hitEdge = true;
            e.y += e.vy * 0.3;
            e.hitFlash = Math.max(0, e.hitFlash - 1);
          }
        }
        if (hitEdge) {
          formationDir *= -1;
          for (const e of enemies) {
            if (!e.isDiving) e.y += 12;
          }
        }

        // Dive logic
        for (let i = enemies.length - 1; i >= 0; i--) {
          const e = enemies[i];
          e.diveTimer--;
          if (e.diveTimer <= 0 && !e.isDiving && scene >= 2 && Math.random() < 0.3) {
            e.isDiving = true;
            const dx = player.x - e.x;
            const dy = player.y - e.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            e.vx = (dx / dist) * (2 + scene * 0.15);
            e.vy = (dy / dist) * (2 + scene * 0.15);
          }
          if (e.isDiving) {
            e.x += e.vx;
            e.y += e.vy;
            e.hitFlash = Math.max(0, e.hitFlash - 1);
            if (e.y > height + 50) {
              enemies.splice(i, 1);
              continue;
            }
          }
          drawEnemy(e);
        }
      }

      // ── Boss logic ──
      if (boss) {
        boss.x += boss.vx;
        if (boss.x <= 16 || boss.x >= width - boss.w - 16) boss.vx *= -1;
        if (boss.y < 40) boss.y += 0.5;

        // Descend gradually
        if (boss.y < 50) boss.y += 0.3;

        // Shoot contracts
        boss.shootTimer--;
        if (boss.shootTimer <= 0) {
          const angle = Math.atan2(player.y - boss.y, player.x - boss.x);
          projectiles.push({
            x: boss.x + boss.w / 2,
            y: boss.y + boss.h,
            w: 10, h: 14,
            vx: Math.cos(angle) * 3,
            vy: Math.sin(angle) * 3,
            color: '#ff4444',
            kind: 'contract',
          });
          boss.shootTimer = 60 + Math.random() * 40;
          if (boss.hp < 10) boss.shootTimer = 40 + Math.random() * 30; // angrier
        }

        boss.angryTimer = Math.max(0, boss.angryTimer - 1);
        drawBoss(boss);
      }

      // ── Projectile-enemy collisions ──
      for (let pi = projectiles.length - 1; pi >= 0; pi--) {
        const p = projectiles[pi];
        if (p.kind === 'contract') continue; // boss projectiles, skip (handled by player collision)

        // Check boss
        if (boss && p.x < boss.x + boss.w && p.x + p.w > boss.x && p.y < boss.y + boss.h && p.y + p.h > boss.y) {
          projectiles.splice(pi, 1);
          boss.hp--;
          boss.angryTimer = 10;
          explode(p.x, p.y, '#ff4444', 6);
          playCut();
          if (boss.hp <= 0) {
            score += 5000;
            explode(boss.x + boss.w / 2, boss.y + boss.h / 2, '#ff4444', 40);
            explode(boss.x + boss.w / 2, boss.y + boss.h / 2, '#ffaa00', 20);
            playExplosion();
            boss = null;
            // Scene complete after boss dies
          }
          continue;
        }

        for (let ei = enemies.length - 1; ei >= 0; ei--) {
          const e = enemies[ei];
          if (p.x < e.x + e.w && p.x + p.w > e.x && p.y < e.y + e.h && p.y + p.h > e.y) {
            projectiles.splice(pi, 1);
            e.hp--;
            e.hitFlash = 5;
            if (e.hp <= 0) {
              combo++;
              comboCount = combo;
              comboTimer = 90;
              checkComboMessage(combo);
              const comboBonus = combo > 1 ? Math.floor(e.points * (combo * 0.1)) : 0;
              score += e.points + comboBonus;
              explode(e.x + e.w / 2, e.y + e.h / 2, e.color, 18);
              dropPowerUp(e.x + e.w / 2, e.y + e.h / 2);
              enemies.splice(ei, 1);
              playExplosion();
              playCut();
            } else {
              explode(p.x, p.y, e.color, 5);
            }
            break;
          }
        }
      }

      // ── Enemy-player / contract-player collisions ──
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        if (e.x < player.x + player.w && e.x + e.w > player.x && e.y < player.y + player.h && e.y + e.h > player.y) {
          enemies.splice(i, 1);
          explode(e.x + e.w / 2, e.y + e.h / 2, '#ff4444', 20);
          if (!invincible) {
            playerHit();
          }
        }
      }

      // Boss projectile (contract) collision with player
      for (let pi = projectiles.length - 1; pi >= 0; pi--) {
        const p = projectiles[pi];
        if (p.kind !== 'contract') continue;
        if (p.x < player.x + player.w && p.x + p.w > player.x && p.y < player.y + player.h && p.y + p.h > player.y) {
          projectiles.splice(pi, 1);
          explode(p.x, p.y, '#ff4444', 10);
          if (!invincible) {
            playerHit();
          }
        }
      }

      // Boss body collision with player
      if (boss && boss.x < player.x + player.w && boss.x + boss.w > player.x && boss.y < player.y + player.h && boss.y + boss.h > player.y) {
        if (!invincible) {
          playerHit();
          boss.angryTimer = 15;
        }
      }

      // ── Power-ups ──
      for (let i = powerUps.length - 1; i >= 0; i--) {
        const p = powerUps[i];
        p.y += p.vy;
        drawPowerUp(p);
        if (p.y > height + 20) { powerUps.splice(i, 1); continue; }
        if (p.x < player.x + player.w && p.x + 22 > player.x && p.y < player.y + player.h && p.y + 18 > player.y) {
          if (p.type === 'extra') {
            lives = Math.min(lives + 1, 5);
          } else if (p.type === 'cafe') {
            invincible = true;
            invincibleTimer = 360; // 6 seconds
            playerPowerUp = 'cafe';
            powerUpTimer = 360;
            powerUp = 'cafe';
          } else {
            playerPowerUp = p.type;
            powerUpTimer = 600;
            powerUp = p.type;
          }
          powerUps.splice(i, 1);
          playPowerUp();
        }
      }

      // ── Check scene complete ──
      if (gameRunning && enemies.length === 0 && !boss) {
        scene++;
        if (scene > 8) {
          gameWon = true;
          gameRunning = false;
          playVictory();
        } else {
          sceneQuote = pickRandom(DIRECTOR_QUOTES);
          quoteTimer = 120;
          playCut();
          spawnScene();
        }
      }
    }

    // ── Particles ──
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // gravity
      p.life -= 0.035;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      const rgb = hexToRgb(p.color);
      ctx.fillStyle = `rgba(${rgb},${p.life})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Draw player ──
    if (gameStarted) {
      drawCamera(player.x, player.y, player.w, player.h);
    }

    // ── In-canvas HUD (combo, quote, messages) ──
    if (gameStarted && gameRunning) {
      // Combo
      if (combo > 2) {
        ctx.fillStyle = '#ffff00';
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#ffff00';
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`COMBO x${combo}`, width / 2, 50);
        ctx.shadowBlur = 0;
      }

      // Combo message
      if (comboMessageTimer > 0 && comboMessage) {
        const alpha = Math.min(1, comboMessageTimer / 30);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#ff00ff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff00ff';
        ctx.font = '12px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(comboMessage, width / 2, height / 2 - 30);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      // Scene quote
      if (quoteTimer > 0 && sceneQuote) {
        const alpha = Math.min(1, quoteTimer / 40);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#00ffff';
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#00ffff';
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`"${sceneQuote}"`, width / 2, 75);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      // Power-up indicator
      if (playerPowerUp !== 'none') {
        const labels: Record<string, string> = {
          rapid: 'RAPID FIRE', wide: 'WIDE LENS', cafe: 'CAFEINA!',
        };
        const colors: Record<string, string> = {
          rapid: '#00ff00', wide: '#00ffff', cafe: '#ffff00',
        };
        ctx.fillStyle = colors[playerPowerUp] || '#00ffff';
        ctx.shadowBlur = 4;
        ctx.shadowColor = colors[playerPowerUp] || '#00ffff';
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.textAlign = 'left';
        const secs = Math.ceil(powerUpTimer / 60);
        ctx.fillText(`${labels[playerPowerUp] || ''} ${secs}s`, 18, 50);
        ctx.shadowBlur = 0;
      }
    }

    // ── Game Over screen ──
    if (gameOver && !gameRunning) {
      ctx.fillStyle = 'rgba(0,0,0,0.88)';
      ctx.fillRect(0, 0, width, height);
      ctx.textAlign = 'center';

      ctx.fillStyle = '#ff4444';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ff4444';
      ctx.font = '20px "Press Start 2P", monospace';
      ctx.fillText('PRODUCCION', width / 2, height / 2 - 60);
      ctx.fillText('CANCELADA', width / 2, height / 2 - 32);
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ffaa00';
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.fillText(`${gameOverReason}`, width / 2, height / 2 + 0);

      ctx.fillStyle = '#fff';
      ctx.font = '12px "Press Start 2P", monospace';
      ctx.fillText(`TAKE: ${score}`, width / 2, height / 2 + 28);

      ctx.fillStyle = '#aaa';
      ctx.font = '8px "Press Start 2P", monospace';
      ctx.fillText(`Escena alcanzada: ${Math.min(scene, 8)}/8`, width / 2, height / 2 + 48);

      ctx.fillStyle = '#00ffff';
      ctx.font = '8px "Press Start 2P", monospace';
      const blink = Math.floor(Date.now() / 500) % 2 === 0;
      if (blink) ctx.fillText('CLICK PARA REINTENTAR', width / 2, height / 2 + 80);
    }

    // ── Victory screen ──
    if (gameWon) {
      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      ctx.fillRect(0, 0, width, height);
      ctx.textAlign = 'center';

      ctx.fillStyle = '#ffaa00';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ffaa00';
      ctx.font = '20px "Press Start 2P", monospace';
      ctx.fillText('ESTRENO MUNDIAL!', width / 2, height / 2 - 50);
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#fff';
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.fillText('La pelicula se completo', width / 2, height / 2 - 20);

      ctx.fillStyle = '#00ff00';
      ctx.font = '14px "Press Start 2P", monospace';
      ctx.fillText(`BOX OFFICE: $${score}`, width / 2, height / 2 + 10);

      ctx.fillStyle = '#ff00ff';
      ctx.font = '8px "Press Start 2P", monospace';
      ctx.fillText('¡CORTA! IMPRIME! ESTA EN LA GORRA!', width / 2, height / 2 + 38);

      ctx.fillStyle = '#00ffff';
      ctx.font = '8px "Press Start 2P", monospace';
      const blink = Math.floor(Date.now() / 500) % 2 === 0;
      if (blink) ctx.fillText('CLICK PARA JUGAR DE NUEVO', width / 2, height / 2 + 70);
    }

    // ── Title screen ──
    if (!gameStarted) {
      ctx.fillStyle = 'rgba(0,0,0,0.9)';
      ctx.fillRect(0, 0, width, height);
      ctx.textAlign = 'center';

      // Animated title with glow
      const glowPulse = 8 + Math.sin(Date.now() / 200) * 4;
      ctx.shadowBlur = glowPulse;

      ctx.shadowColor = '#00ff00';
      ctx.fillStyle = '#00ff00';
      ctx.font = '24px "Press Start 2P", monospace';
      ctx.fillText('FILM BOSS', width / 2, height / 2 - 55);

      ctx.shadowColor = '#ff00ff';
      ctx.fillStyle = '#ff00ff';
      ctx.font = '8px "Press Start 2P", monospace';
      ctx.shadowBlur = 4;
      ctx.fillText('El juego de ser filmmaker', width / 2, height / 2 - 28);
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ffaa00';
      ctx.font = '7px "Press Start 2P", monospace';
      ctx.fillText('Eres una camara de cine.', width / 2, height / 2 - 8);
      ctx.fillText('Dispara FRAMES a los problemas.', width / 2, height / 2 + 4);
      ctx.fillText('Completa 8 escenas. Vence al Productor.', width / 2, height / 2 + 16);

      ctx.fillStyle = '#00ffff';
      ctx.font = '10px "Press Start 2P", monospace';
      const blink = Math.floor(Date.now() / 500) % 2 === 0;
      if (blink) ctx.fillText('CLICK PARA EMPEZAR', width / 2, height / 2 + 50);

      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.font = '7px "Press Start 2P", monospace';
      ctx.fillText('< - >  MOVER | ESPACIO GRABAR', width / 2, height / 2 + 75);
    }

    // ── CRT scanlines (always on top) ──
    drawScanlines();

    ctx.restore();

    animationId = requestAnimationFrame(update);
  }

  let gameOverReason = '';

  function playerHit() {
    lives--;
    combo = 0;
    comboCount = 0;
    shakeAmount = 8;
    shakeTimer = 20;
    explode(player.x + player.w / 2, player.y + player.h / 2, '#ff0000', 15);
    playExplosion();
    if (lives <= 0) {
      gameRunning = false;
      gameOver = true;
      gameOverReason = pickRandom(GAME_OVER_REASONS);
      playGameOver();
    }
  }

  // ─── Input handlers ────────────────────────────────────────────────
  function onKey(e: KeyboardEvent) {
    keys[e.code] = e.type === 'keydown';
    if (['Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter'].includes(e.code)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function onClick() {
    if (!gameStarted || gameOver || gameWon) {
      reset();
      canvas.focus();
    }
  }

  // ─── Lifecycle ─────────────────────────────────────────────────────
  let resizeObserver: ResizeObserver | null = null;

  onMount(() => {
    ctx = canvas.getContext('2d');
    resize();
    initStars();

    resizeObserver = new ResizeObserver(() => resize());
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    canvas.addEventListener('keydown', onKey);
    canvas.addEventListener('keyup', onKey);
    canvas.tabIndex = 0;
    canvas.focus();

    animationId = requestAnimationFrame(update);
  });

  onDestroy(() => {
    cancelAnimationFrame(animationId);
    if (resizeObserver) resizeObserver.disconnect();
    canvas?.removeEventListener('keydown', onKey);
    canvas?.removeEventListener('keyup', onKey);
    if (audioCtx) audioCtx.close();
  });
</script>

<div class="app-content" style="padding:0; background:#000; display:flex; flex-direction:column; height:100%; overflow:hidden;">
  <!-- HUD bar (Svelte DOM) -->
  <div
    style="padding:3px 8px; background:var(--win-face); border-bottom:1px solid var(--win-gray-dark); display:flex; align-items:center; justify-content:space-between; flex-shrink:0; gap:4px;"
  >
    <strong style="font-size:11px; white-space:nowrap;">🎬 FILM BOSS</strong>
    <span style="font-size:10px; color:var(--win-text-disabled); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
      TAKE: {score} | ESC: {Math.min(scene, 8)}/8 | {'🎬'.repeat(Math.max(0, lives))}
      {#if powerUp !== 'none'}
        <span style="color:#00ffff; margin-left:4px; font-weight:bold;">
          [{powerUp === 'rapid' ? 'RAPID FIRE' : powerUp === 'wide' ? 'WIDE LENS' : powerUp === 'cafe' ? 'CAFEINA!' : powerUp === 'extra' ? '+1' : ''}]
        </span>
      {/if}
    </span>
  </div>
  <canvas
    bind:this={canvas}
    onclick={onClick}
    style="width:100%; flex:1; image-rendering:pixelated; cursor:crosshair; display:block; background:#000;"
  ></canvas>
</div>