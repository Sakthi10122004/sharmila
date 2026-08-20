// ================================================================
// EN UYIR SHARMILAKU — CINEMATIC LOVE LETTER ENGINE
// A light-aqua / light-pink interactive letter, told in 8 scenes.
// ================================================================
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==============================================================
  // 1. AMBIENT CANVAS — floating petals & fireflies on a light sky
  // ==============================================================
  const canvas = document.getElementById('loveCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COLORS = ['rgba(248,187,208,0.55)', 'rgba(179,229,252,0.55)', 'rgba(242,153,184,0.4)', 'rgba(129,212,250,0.4)'];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Petal {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : -20;
      this.r = Math.random() * 3 + 1.5;
      this.color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      this.vy = Math.random() * 0.5 + 0.2;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.sway = Math.random() * Math.PI * 2;
      this.swaySpeed = Math.random() * 0.02 + 0.01;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
    }
    update() {
      this.sway += this.swaySpeed;
      this.y += this.vy;
      this.x += this.vx + Math.sin(this.sway) * 0.4;
      this.rotation += this.rotSpeed;
      if (this.y > canvas.height + 20) this.reset(false);
      if (this.x < -20) this.x = canvas.width + 20;
      if (this.x > canvas.width + 20) this.x = -20;
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.beginPath();
      ctx.ellipse(0, 0, this.r * 1.6, this.r, 0, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  class Firefly {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.baseR = Math.random() * 1.4 + 0.6;
      this.phase = Math.random() * Math.PI * 2;
      this.speed = Math.random() * 0.015 + 0.008;
      this.driftX = (Math.random() - 0.5) * 0.15;
      this.driftY = (Math.random() - 0.5) * 0.15;
    }
    update() {
      this.phase += this.speed;
      this.x += this.driftX;
      this.y += this.driftY;
      if (this.x < 0 || this.x > canvas.width) this.driftX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.driftY *= -1;
    }
    draw() {
      const glow = (Math.sin(this.phase) + 1) / 2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.baseR + glow * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 236, 179, ${0.15 + glow * 0.35})`;
      ctx.fill();
    }
  }

  const PETAL_COUNT = reduceMotion ? 0 : 46;
  const FIREFLY_COUNT = reduceMotion ? 0 : 18;
  for (let i = 0; i < PETAL_COUNT; i++) particles.push(new Petal());
  const fireflies = [];
  for (let i = 0; i < FIREFLY_COUNT; i++) fireflies.push(new Firefly());

  function renderCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    fireflies.forEach(f => { f.update(); f.draw(); });
    requestAnimationFrame(renderCanvas);
  }
  renderCanvas();

  // ==============================================================
  // 2. AMBIENT SPOTLIGHT + CURSOR HEART TRAIL
  // ==============================================================
  const spot = document.getElementById('ambientSpot');
  let lastTrail = 0;
  window.addEventListener('pointermove', e => {
    spot.style.left = e.clientX + 'px';
    spot.style.top = e.clientY + 'px';
    const now = Date.now();
    if (!reduceMotion && now - lastTrail > 90) {
      lastTrail = now;
      spawnTrailHeart(e.clientX, e.clientY);
    }
  });

  function spawnTrailHeart(x, y) {
    const el = document.createElement('div');
    el.className = 'trail-heart';
    el.innerHTML = `<svg viewBox="0 0 24 24" width="10" height="10" fill="${Math.random() > 0.5 ? '#f299b8' : '#81d4fa'}"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.transition = 'transform 0.8s ease-out, opacity 0.8s ease-out';
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = `translate(${(Math.random() - 0.5) * 24}px, ${20 + Math.random() * 20}px) scale(0.4)`;
      el.style.opacity = '0';
    });
    setTimeout(() => el.remove(), 850);
  }

  // ==============================================================
  // 3. ENVELOPE INTRO SEQUENCE
  // ==============================================================
  const envelopeOverlay = document.getElementById('envelopeOverlay');
  const envelopeBox = document.getElementById('envelopeBox');
  const waxSeal = document.getElementById('waxSeal');

  function openEnvelope() {
    if (envelopeBox.classList.contains('is-open')) return;
    envelopeBox.classList.add('is-open');
    if (navigator.vibrate) navigator.vibrate([20, 30, 20]);
    for (let i = 0; i < 16; i++) setTimeout(() => spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 2), i * 55);
    setTimeout(() => {
      envelopeOverlay.classList.add('opened');
      document.body.style.overflow = '';
      startAmbientHearts();
    }, 1300);
  }
  waxSeal.addEventListener('click', openEnvelope);
  waxSeal.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openEnvelope(); });

  // ==============================================================
  // 4. CHARACTER EYE-TRACKING + BLINKING
  // ==============================================================
  const sakthiHead = document.getElementById('sakthiHead');
  const sharmilaHead = document.getElementById('sharmilaHead');

  window.addEventListener('mousemove', e => {
    if (sakthiHead) {
      const r = sakthiHead.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const ang = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI / 14;
      sakthiHead.style.transform = `rotate(${Math.max(-10, Math.min(10, ang))}deg)`;
    }
    if (sharmilaHead) {
      const r = sharmilaHead.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const ang = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI / 16;
      sharmilaHead.style.transform = `rotate(${Math.max(-8, Math.min(8, ang))}deg)`;
    }
  });

  function blinkLoop() {
    document.querySelectorAll('.char-lids').forEach(lid => {
      lid.classList.add('blink');
      setTimeout(() => lid.classList.remove('blink'), 140);
    });
    setTimeout(blinkLoop, 2600 + Math.random() * 2600);
  }
  if (!reduceMotion) setTimeout(blinkLoop, 1800);

  // ==============================================================
  // 5. ACT NAVIGATION
  // ==============================================================
  let currentAct = 0;
  const totalActs = 8;
  const scenes = document.querySelectorAll('.scene');
  const pills = document.querySelectorAll('.act-pill');
  const sceneNum = document.getElementById('sceneNum');
  const playhead = document.getElementById('scrubPlayhead');

  window.goToAct = function (idx) {
    if (idx < 0 || idx >= totalActs) return;
    currentAct = idx;
    scenes.forEach((s, i) => s.classList.toggle('active', i === idx));
    pills.forEach((p, i) => p.classList.toggle('active', i === idx));
    sceneNum.textContent = '0' + (idx + 1);
    playhead.style.width = ((idx + 1) / totalActs * 100) + '%';
    if (navigator.vibrate) navigator.vibrate(14);
    if (!reduceMotion) for (let i = 0; i < 7; i++) setTimeout(() => spawnFloatHeart(), i * 70);
    triggerTypewriter(scenes[idx]);
  };

  pills.forEach((p, i) => p.addEventListener('click', () => goToAct(i)));
  document.getElementById('nextBtn').addEventListener('click', () => goToAct((currentAct + 1) % totalActs));
  document.getElementById('prevBtn').addEventListener('click', () => goToAct((currentAct - 1 + totalActs) % totalActs));
  document.getElementById('scrubTrack').addEventListener('click', e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    goToAct(Math.max(0, Math.min(totalActs - 1, Math.floor(ratio * totalActs))));
  });

  window.addEventListener('keydown', e => {
    if (!envelopeOverlay.classList.contains('opened')) return;
    if (e.key === 'ArrowRight') goToAct((currentAct + 1) % totalActs);
    if (e.key === 'ArrowLeft') goToAct((currentAct - 1 + totalActs) % totalActs);
  });

  // touch swipe between scenes
  let touchStartX = null;
  document.getElementById('stage').addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  document.getElementById('stage').addEventListener('touchend', e => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 60) {
      if (dx < 0) goToAct((currentAct + 1) % totalActs);
      else goToAct((currentAct - 1 + totalActs) % totalActs);
    }
    touchStartX = null;
  }, { passive: true });

  document.getElementById('replayBtn').addEventListener('click', () => {
    goToAct(0);
    envelopeBox.classList.remove('is-open');
    envelopeOverlay.classList.remove('opened');
    document.body.style.overflow = 'hidden';
  });

  // ==============================================================
  // 6. TYPEWRITER REVEAL FOR KEY LINES
  // ==============================================================
  const typewriterCache = new WeakMap();
  function triggerTypewriter(sceneEl) {
    if (reduceMotion) return;
    const target = sceneEl.querySelector('[data-typewriter]');
    if (!target) return;
    const full = typewriterCache.has(target) ? typewriterCache.get(target) : target.textContent;
    typewriterCache.set(target, full);
    target.textContent = '';
    let i = 0;
    clearInterval(target._twTimer);
    target._twTimer = setInterval(() => {
      target.textContent = full.slice(0, i);
      i++;
      if (i > full.length) clearInterval(target._twTimer);
    }, 22);
  }
  // run once for the first visible scene
  setTimeout(() => triggerTypewriter(document.querySelector('.scene.active')), 400);

  // ==============================================================
  // 7. ZERO PORTAL — drag & tilt interaction (Act 3)
  // ==============================================================
  const zeroRing = document.getElementById('zeroRing');
  const zeroNum = document.getElementById('zeroNum');
  let dragging = false;
  if (zeroRing) {
    const startDrag = () => (dragging = true);
    const endDrag = () => (dragging = false);
    zeroRing.addEventListener('mousedown', startDrag);
    zeroRing.addEventListener('touchstart', startDrag, { passive: true });
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);
    window.addEventListener('mousemove', e => handleZeroDrag(e.clientX, e.clientY));
    window.addEventListener('touchmove', e => {
      if (!dragging) return;
      const t = e.touches[0];
      handleZeroDrag(t.clientX, t.clientY);
    }, { passive: true });
    function handleZeroDrag(x, y) {
      if (!dragging || !zeroNum) return;
      const rx = (x / window.innerWidth - 0.5) * 30;
      const ry = (y / window.innerHeight - 0.5) * 30;
      zeroNum.style.transform = `rotateX(${-ry}deg) rotateY(${rx}deg) scale(1.14)`;
      if (!reduceMotion) spawnBurst(x, y, 1);
    }
  }

  // ==============================================================
  // 8. MEMORY POLAROIDS — tap for a caption note
  // ==============================================================
  const polaroids = document.querySelectorAll('.polaroid');
  const polaroidNote = document.getElementById('polaroidNote');
  polaroids.forEach(p => {
    p.addEventListener('click', () => {
      const note = p.getAttribute('data-note') || '';
      polaroidNote.textContent = note;
      polaroidNote.classList.remove('show');
      void polaroidNote.offsetWidth;
      polaroidNote.classList.add('show');
      if (!reduceMotion) spawnBurst(p.getBoundingClientRect().left + 40, p.getBoundingClientRect().top + 40, 4);
    });
  });

  // ==============================================================
  // 9. FLOATING HEARTS + BURST PARTICLES
  // ==============================================================
  function spawnBurst(x, y, count = 2) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'burst-particle';
      const color = i % 2 === 0 ? '#f299b8' : '#81d4fa';
      el.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="${color}"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.setProperty('--tx', (Math.random() - 0.5) * 170 + 'px');
      el.style.setProperty('--ty', (Math.random() - 1) * 150 + 'px');
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1500);
    }
  }

  function spawnFloatHeart() {
    if (reduceMotion) return;
    const el = document.createElement('div');
    el.className = 'float-heart';
    el.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="${Math.random() > 0.5 ? '#f299b8' : '#81d4fa'}"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    el.style.left = (10 + Math.random() * 80) + '%';
    el.style.top = (40 + Math.random() * 40) + '%';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3400);
  }

  let ambientHeartInterval = null;
  function startAmbientHearts() {
    if (reduceMotion || ambientHeartInterval) return;
    ambientHeartInterval = setInterval(() => { if (Math.random() > 0.45) spawnFloatHeart(); }, 2400);
  }

  function spawnConfetti(x, y, count = 20) {
    const colors = ['#f8bbd0', '#b3e5fc', '#f299b8', '#81d4fa', '#fff0f5'];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-bit';
      const size = Math.random() * 6 + 4;
      el.style.width = size + 'px';
      el.style.height = size * 0.5 + 'px';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.left = (x + (Math.random() - 0.5) * 120) + 'px';
      el.style.top = y + 'px';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2700);
    }
  }

  // ==============================================================
  // 10. HUG GENERATOR (Act 8)
  // ==============================================================
  const hugTrigger = document.getElementById('hugTrigger');
  const hugFill = document.getElementById('hugFill');
  const hugText = document.getElementById('hugText');
  let hugTimer = null, hugProgress = 0;

  function startHug(e) {
    hugProgress = 0;
    hugFill.style.width = '0%';
    hugText.textContent = 'Sending Love...';
    clearInterval(hugTimer);
    hugTimer = setInterval(() => {
      hugProgress += 3.6;
      hugFill.style.width = hugProgress + '%';
      if (hugProgress >= 100) {
        clearInterval(hugTimer);
        hugText.textContent = 'Hug Received';
        hugTrigger.style.pointerEvents = 'none';
        const cx = e && e.clientX ? e.clientX : window.innerWidth / 2;
        const cy = e && e.clientY ? e.clientY : window.innerHeight / 2;
        for (let i = 0; i < 26; i++) setTimeout(() => spawnBurst(cx, cy, 2), i * 40);
        spawnConfetti(cx, cy, 30);
        if (navigator.vibrate) navigator.vibrate([50, 70, 120]);
        setTimeout(() => {
          hugTrigger.style.pointerEvents = 'auto';
          hugText.textContent = 'Press & Hold for a Warm Hug';
          hugFill.style.width = '0%';
        }, 2600);
      }
    }, 30);
  }
  function cancelHug() {
    if (hugProgress < 100) {
      clearInterval(hugTimer);
      hugFill.style.width = '0%';
      hugText.textContent = 'Press & Hold for a Warm Hug';
    }
  }
  if (hugTrigger) {
    hugTrigger.addEventListener('mousedown', startHug);
    hugTrigger.addEventListener('touchstart', startHug, { passive: true });
    window.addEventListener('mouseup', cancelHug);
    window.addEventListener('touchend', cancelHug);
  }

  // ==============================================================
  // 11. AMBIENT AUDIO SYNTH — soft generative chords
  // ==============================================================
  const audioBtn = document.getElementById('audioToggle');
  let audioCtx = null, isPlaying = false, noteInterval = null;
  const chords = [
    [261.63, 329.63, 392.00, 523.25],
    [220.00, 261.63, 329.63, 440.00],
    [174.61, 220.00, 261.63, 349.23],
    [196.00, 246.94, 293.66, 392.00]
  ];
  function playTone(freq) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.055, audioCtx.currentTime + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.4);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 2.6);
  }
  audioBtn.addEventListener('click', () => {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    isPlaying = !isPlaying;
    audioBtn.classList.toggle('active', isPlaying);
    if (isPlaying) {
      let ci = 0, ni = 0;
      noteInterval = setInterval(() => {
        const c = chords[ci];
        playTone(c[ni]);
        ni++;
        if (ni >= c.length) { ni = 0; ci = (ci + 1) % chords.length; }
      }, 600);
    } else if (noteInterval) {
      clearInterval(noteInterval);
    }
  });

  // ==============================================================
  // 12. REPLY MODAL — write something back, saved locally
  // ==============================================================
  const replyToggle = document.getElementById('replyToggle');
  const replyModal = document.getElementById('replyModal');
  const replyBackdrop = document.getElementById('replyBackdrop');
  const replyClose = document.getElementById('replyClose');
  const replyText = document.getElementById('replyText');
  const replySave = document.getElementById('replySave');
  const replyLog = document.getElementById('replyLog');
  const STORAGE_KEY = 'sharmila-letter-replies';

  function loadReplies() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }
  function saveReplies(list) {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (err) { /* storage unavailable */ }
  }
  function renderReplies() {
    const list = loadReplies();
    replyLog.innerHTML = '';
    list.slice().reverse().forEach(entry => {
      const div = document.createElement('div');
      div.className = 'reply-entry';
      const p = document.createElement('p');
      p.textContent = entry.text;
      const time = document.createElement('time');
      time.textContent = new Date(entry.at).toLocaleString();
      div.appendChild(p);
      div.appendChild(time);
      replyLog.appendChild(div);
    });
  }
  function openReplyModal() {
    replyModal.classList.add('open');
    replyModal.setAttribute('aria-hidden', 'false');
    renderReplies();
    replyText.focus();
  }
  function closeReplyModal() {
    replyModal.classList.remove('open');
    replyModal.setAttribute('aria-hidden', 'true');
  }
  replyToggle.addEventListener('click', openReplyModal);
  replyClose.addEventListener('click', closeReplyModal);
  replyBackdrop.addEventListener('click', closeReplyModal);
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeReplyModal(); });
  replySave.addEventListener('click', () => {
    const val = replyText.value.trim();
    if (!val) return;
    const list = loadReplies();
    list.push({ text: val, at: Date.now() });
    saveReplies(list);
    replyText.value = '';
    renderReplies();
    spawnBurst(window.innerWidth / 2, window.innerHeight * 0.4, 10);
  });

  // ==============================================================
  // 13. INITIAL LOAD BURST
  // ==============================================================
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    if (reduceMotion) return;
    for (let i = 0; i < 10; i++) setTimeout(() => spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 1), i * 90);
  }, 500);

  // ==============================================================
  // 14. SCENE CURTAIN — a soft light wipe the moment the letter opens
  // ==============================================================
  function playCurtain() {
    if (reduceMotion) return;
    const curtain = document.createElement('div');
    curtain.className = 'scene-curtain';
    document.body.appendChild(curtain);
    setTimeout(() => curtain.remove(), 1200);
  }
  const originalOpenEnvelope = openEnvelope;
  waxSeal.removeEventListener('click', openEnvelope);
  waxSeal.addEventListener('click', () => { originalOpenEnvelope(); playCurtain(); });

  // ==============================================================
  // 15. VISITED-SCENE TRACKING (pills get a small dot once seen)
  // ==============================================================
  const visited = new Set([0]);
  function markVisited(idx) {
    visited.add(idx);
    pills.forEach((p, i) => p.classList.toggle('visited', visited.has(i)));
  }
  markVisited(0);

  // ==============================================================
  // 16. SCENE ANNOUNCER (screen-reader friendly scene changes)
  // ==============================================================
  const sceneAnnouncer = document.getElementById('sceneAnnouncer');
  const sceneTitles = [
    'Scene one, the silence and unseen messages',
    'Scene two, that night and the sudden rejection',
    'Scene three, the zero and the effort no one else made',
    'Scene four, the wait behind every notification',
    'Scene five, missing my innocent Sharmila',
    'Scene six, our memories',
    'Scene seven, the deep apology',
    'Scene eight, safe flight and the weekend ahead'
  ];

  // ==============================================================
  // 17. FINISHED-LETTER CELEBRATION
  // ==============================================================
  const finishedBanner = document.getElementById('finishedBanner');
  let hasCelebrated = false;
  function celebrateFinish() {
    if (hasCelebrated) return;
    hasCelebrated = true;
    finishedBanner.classList.add('show');
    if (!reduceMotion) {
      spawnConfetti(window.innerWidth / 2, 40, 46);
      for (let i = 0; i < 10; i++) setTimeout(() => spawnFloatHeart(), i * 120);
    }
    setTimeout(() => finishedBanner.classList.remove('show'), 4200);
  }

  // ==============================================================
  // 18. FLOATING WORD PARTICLES ("sorry", "always", "miss you")
  // ==============================================================
  const emotionalWords = ['sorry', 'always', 'miss you', 'forever', 'en uyire', 'yours'];
  function spawnWordParticle() {
    if (reduceMotion) return;
    const el = document.createElement('div');
    el.className = 'word-particle';
    el.textContent = emotionalWords[Math.floor(Math.random() * emotionalWords.length)];
    el.style.left = (8 + Math.random() * 84) + '%';
    el.style.top = (55 + Math.random() * 30) + '%';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4300);
  }

  // ==============================================================
  // 19. IDLE NUDGE — a gentle reminder if she pauses mid-letter
  // ==============================================================
  const idleNudge = document.getElementById('idleNudge');
  let idleTimer = null;
  function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleNudge.classList.remove('show');
    if (!envelopeOverlay.classList.contains('opened')) return;
    idleTimer = setTimeout(() => {
      idleNudge.classList.add('show');
      setTimeout(() => idleNudge.classList.remove('show'), 3600);
    }, 25000);
  }
  ['mousemove', 'touchstart', 'keydown', 'click'].forEach(evt => window.addEventListener(evt, resetIdleTimer, { passive: true }));
  resetIdleTimer();

  // ==============================================================
  // 20. BUTTON RIPPLE EFFECT
  // ==============================================================
  function attachRipple(selector) {
    document.querySelectorAll(selector).forEach(btn => {
      btn.addEventListener('click', e => {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 620);
      });
    });
  }
  attachRipple('.next-btn, .replay-btn, .album-link, .reply-save');

  // ==============================================================
  // 21. DIALOGUE CARD SUBTLE TILT ON MOUSE MOVE (desktop only)
  // ==============================================================
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.dialogue-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `rotateX(${py * -3}deg) rotateY(${px * 3}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  // ==============================================================
  // 22. SCRUB TRACK TICK MARKS (one per scene)
  // ==============================================================
  (function buildScrubTicks() {
    const track = document.getElementById('scrubTrack');
    for (let i = 1; i < totalActs; i++) {
      const tick = document.createElement('div');
      tick.className = 'scrub-tick';
      tick.style.left = (i / totalActs * 100) + '%';
      track.appendChild(tick);
    }
  })();

  // ==============================================================
  // 23. WIRE UP goToAct EXTRAS (announcer, visited, word particles, finish)
  // ==============================================================
  const baseGoToAct = window.goToAct;
  window.goToAct = function (idx) {
    baseGoToAct(idx);
    markVisited(idx);
    if (sceneAnnouncer) sceneAnnouncer.textContent = sceneTitles[idx] || '';
    if (!reduceMotion && Math.random() > 0.5) setTimeout(spawnWordParticle, 500);
    if (idx === totalActs - 1) setTimeout(celebrateFinish, 900);
    resetIdleTimer();
    try { window.localStorage.setItem('sharmila-letter-last-scene', String(idx)); } catch (err) { /* ignore */ }
  };

  // ==============================================================
  // 24. RESUME BANNER — pick up where she left off on a return visit
  // ==============================================================
  const resumeBanner = document.getElementById('resumeBanner');
  const resumeYes = document.getElementById('resumeYes');
  (function offerResume() {
    let lastScene = 0;
    try { lastScene = parseInt(window.localStorage.getItem('sharmila-letter-last-scene'), 10) || 0; } catch (err) { lastScene = 0; }
    if (lastScene > 0) {
      const showResume = () => {
        resumeBanner.classList.add('show');
        setTimeout(() => resumeBanner.classList.remove('show'), 8000);
      };
      const checkOpened = setInterval(() => {
        if (envelopeOverlay.classList.contains('opened')) {
          clearInterval(checkOpened);
          setTimeout(showResume, 800);
        }
      }, 300);
      resumeYes.addEventListener('click', () => {
        window.goToAct(lastScene);
        resumeBanner.classList.remove('show');
      });
    }
  })();

  // ==============================================================
  // 25. KEYBOARD SHORTCUT HELP TOGGLE
  // ==============================================================
  const shortcutHelp = document.getElementById('shortcutHelp');
  let helpVisible = false;
  window.addEventListener('keydown', e => {
    if (e.key === '?') {
      helpVisible = !helpVisible;
      shortcutHelp.classList.toggle('show', helpVisible);
    }
  });
  setTimeout(() => {
    if (envelopeOverlay.classList.contains('opened')) {
      shortcutHelp.classList.add('show');
      helpVisible = true;
      setTimeout(() => { shortcutHelp.classList.remove('show'); helpVisible = false; }, 5000);
    }
  }, 2200);

  // ==============================================================
  // 26. TAG & CHECKLIST REVEAL ON SCROLL (IntersectionObserver)
  // ==============================================================
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('in-view');
      });
    }, { threshold: 0.35 });
    document.querySelectorAll('.tag-group, .check-grid').forEach(el => revealObserver.observe(el));
  }

  // ==============================================================
  // 27. GENTLE PARALLAX ON THE CHARACTER DUO (Act 1)
  // ==============================================================
  const charDuo = document.querySelector('.char-duo');
  if (charDuo && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', e => {
      const px = (e.clientX / window.innerWidth - 0.5) * 8;
      charDuo.style.transform = `translateX(${px}px)`;
    });
  }

})();