/* ==========================================================================
   CINEMATIC ENGINE & PROCEDURAL SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------------
    // 1. DYNAMIC CANVAS COSMIC STARFIELD & FLOATING NEBULA PARTICLES
    // ----------------------------------------------------------------------
    const canvas = document.getElementById('cinemaCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleColors = [
        'rgba(244, 114, 182, 0.45)', // Pink
        'rgba(56, 189, 248, 0.45)',  // Aqua
        'rgba(251, 207, 232, 0.35)', // Light pink
        'rgba(186, 230, 253, 0.35)'  // Light aqua
    ];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class StarParticle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * 2.2 + 0.6;
            this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
            this.speedY = Math.random() * 0.4 + 0.1;
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.alpha = Math.random() * 0.8 + 0.2;
            this.pulseSpeed = Math.random() * 0.02 + 0.005;
        }
        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            this.alpha += Math.sin(Date.now() * this.pulseSpeed) * 0.01;

            if (this.y < 0) this.y = canvas.height;
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    for (let i = 0; i < 90; i++) {
        particles.push(new StarParticle());
    }

    function renderAtmosphere() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(renderAtmosphere);
    }
    renderAtmosphere();

    // ----------------------------------------------------------------------
    // 2. AMBIENT CURSOR SPOTLIGHT TRACKER
    // ----------------------------------------------------------------------
    const spotlight = document.getElementById('ambientSpotlight');
    window.addEventListener('pointermove', (e) => {
        spotlight.style.left = `${e.clientX}px`;
        spotlight.style.top = `${e.clientY}px`;
    });

    // ----------------------------------------------------------------------
    // 3. SKELETAL EYE TRACKING FOR AVATAR CHARACTERS (SAKTHI & SHARMILA)
    // ----------------------------------------------------------------------
    const sakthiHead = document.getElementById('sakthiHead');
    const sharmilaHead = document.getElementById('sharmilaHead');

    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Boy eye tracking calculation
        if (sakthiHead) {
            const rect = sakthiHead.getBoundingClientRect();
            const headCenterX = rect.left + rect.width / 2;
            const headCenterY = rect.top + rect.height / 2;
            const angle = Math.atan2(mouseY - headCenterY, mouseX - headCenterX);
            const rotateDeg = (angle * 180 / Math.PI) / 8; // gentle rotation
            sakthiHead.style.transform = `rotate(${Math.max(-15, Math.min(15, rotateDeg))}deg)`;
        }

        // Girl soft tilt
        if (sharmilaHead) {
            const rectG = sharmilaHead.getBoundingClientRect();
            const headCenterX = rectG.left + rectG.width / 2;
            const headCenterY = rectG.top + rectG.height / 2;
            const angleG = Math.atan2(mouseY - headCenterY, mouseX - headCenterX);
            const rotateDegG = (angleG * 180 / Math.PI) / 10;
            sharmilaHead.style.transform = `rotate(${Math.max(-12, Math.min(12, rotateDegG))}deg)`;
        }
    });

    // ----------------------------------------------------------------------
    // 4. ACT ROUTING & TIMELINE SCRUBBING ENGINE
    // ----------------------------------------------------------------------
    let currentAct = 0;
    const totalActs = 5;
    const scenes = document.querySelectorAll('.movie-scene');
    const actPills = document.querySelectorAll('.act-pill');
    const sceneNumDisplay = document.getElementById('sceneNumber');
    const playhead = document.getElementById('scrubPlayhead');

    window.goToAct = function(targetActIndex) {
        if (targetActIndex < 0 || targetActIndex >= totalActs) return;

        currentAct = targetActIndex;
        scenes.forEach((scene, idx) => {
            scene.classList.toggle('active', idx === currentAct);
        });

        actPills.forEach((pill, idx) => {
            pill.classList.toggle('active', idx === currentAct);
        });

        sceneNumDisplay.textContent = `0${currentAct + 1}`;
        playhead.style.width = `${((currentAct + 1) / totalActs) * 100}%`;

        if (navigator.vibrate) navigator.vibrate(20);
    };

    actPills.forEach((pill, idx) => {
        pill.addEventListener('click', () => goToAct(idx));
    });

    document.getElementById('nextActBtn').addEventListener('click', () => {
        goToAct((currentAct + 1) % totalActs);
    });

    document.getElementById('prevActBtn').addEventListener('click', () => {
        goToAct((currentAct - 1 + totalActs) % totalActs);
    });

    // Scrubber click detection
    const scrubTrack = document.getElementById('scrubTrack');
    scrubTrack.addEventListener('click', (e) => {
        const rect = scrubTrack.getBoundingClientRect();
        const clickRatio = (e.clientX - rect.left) / rect.width;
        const targetAct = Math.floor(clickRatio * totalActs);
        goToAct(targetAct);
    });

    // ----------------------------------------------------------------------
    // 5. INTERACTIVE ACT 2: COSMIC ZERO PORTAL (PHYSICS DRAG & ROTATION)
    // ----------------------------------------------------------------------
    const zeroPortal = document.getElementById('zeroPortal');
    const digitalZero = document.getElementById('digitalZero');
    let isDraggingZero = false;

    if (zeroPortal) {
        zeroPortal.addEventListener('mousedown', () => isDraggingZero = true);
        window.addEventListener('mouseup', () => isDraggingZero = false);
        window.addEventListener('mousemove', (e) => {
            if (isDraggingZero) {
                const rotX = (e.clientX / window.innerWidth - 0.5) * 40;
                const rotY = (e.clientY / window.innerHeight - 0.5) * 40;
                digitalZero.style.transform = `rotateX(${-rotY}deg) rotateY(${rotX}deg) scale(1.2)`;
                spawnBurst(e.clientX, e.clientY, 1, '#f472b6');
            }
        });
    }

    // ----------------------------------------------------------------------
    // 6. INTERACTIVE ACT 5: GRAND HUG GENERATOR (PRESS & HOLD FOR 3 SECONDS)
    // ----------------------------------------------------------------------
    const hugTrigger = document.getElementById('giantHugTrigger');
    const hugFill = document.getElementById('hugFillProgress');
    const hugText = document.getElementById('hugTriggerText');
    let hugTimer = null;
    let hugProgress = 0;

    function startHugHold(e) {
        hugProgress = 0;
        hugFill.style.width = '0%';
        hugText.textContent = 'Transmitting Love...';

        hugTimer = setInterval(() => {
            hugProgress += 3.5;
            hugFill.style.width = `${hugProgress}%`;

            if (hugProgress >= 100) {
                clearInterval(hugTimer);
                completeGrandHug(e);
            }
        }, 40);
    }

    function cancelHugHold() {
        if (hugProgress < 100) {
            clearInterval(hugTimer);
            hugFill.style.width = '0%';
            hugText.textContent = 'Press & Hold for Hug';
        }
    }

    function completeGrandHug(e) {
        hugTrigger.style.pointerEvents = 'none';
        hugText.textContent = 'Hug Received With Love!';
        const cx = e.clientX || window.innerWidth / 2;
        const cy = e.clientY || window.innerHeight / 2;

        for (let i = 0; i < 35; i++) {
            setTimeout(() => {
                spawnBurst(
                    cx + (Math.random() - 0.5) * 100,
                    cy + (Math.random() - 0.5) * 100,
                    1,
                    i % 2 === 0 ? '#f472b6' : '#38bdf8'
                );
            }, i * 35);
        }

        if (navigator.vibrate) navigator.vibrate([60, 80, 150]);
    }

    if (hugTrigger) {
        hugTrigger.addEventListener('mousedown', startHugHold);
        hugTrigger.addEventListener('touchstart', startHugHold, { passive: true });
        window.addEventListener('mouseup', cancelHugHold);
        window.addEventListener('touchend', cancelHugHold);
    }

    // ----------------------------------------------------------------------
    // 7. PROCEDURAL PARTICLE BURST GENERATOR (SVG HEARTS & STARS)
    // ----------------------------------------------------------------------
    function spawnBurst(x, y, count, color = '#f472b6') {
        for (let i = 0; i < count; i++) {
            const burst = document.createElement('div');
            burst.className = 'canvas-heart-burst';
            burst.innerHTML = `
                <svg viewBox="0 0 24 24" width="22" height="22" fill="${color}">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>`;
            burst.style.left = `${x}px`;
            burst.style.top = `${y}px`;
            burst.style.setProperty('--tx', `${(Math.random() - 0.5) * 200}px`);
            burst.style.setProperty('--ty', `${(Math.random() - 1) * 180}px`);
            document.body.appendChild(burst);
            setTimeout(() => burst.remove(), 1400);
        }
    }

    // ----------------------------------------------------------------------
    // 8. SYNTHESIZER AUDIO DRIVER (WEB AUDIO API CHORD ARPEGGIATOR)
    // ----------------------------------------------------------------------
    const synthBtn = document.getElementById('synthAudioBtn');
    let audioCtx = null;
    let isPlayingAudio = false;
    let noteInterval = null;

    const chords = [
        [261.63, 329.63, 392.00, 523.25], // C Major
        [220.00, 261.63, 329.63, 440.00], // A Minor
        [174.61, 220.00, 261.63, 349.23], // F Major
        [196.00, 246.94, 293.66, 392.00]  // G Major
    ];

    function playCalmTone(freq) {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.5);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 2.6);
    }

    synthBtn.addEventListener('click', () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        isPlayingAudio = !isPlayingAudio;
        synthBtn.style.color = isPlayingAudio ? 'var(--pink-accent)' : 'var(--text-soft)';

        if (isPlayingAudio) {
            let chordIdx = 0;
            let noteIdx = 0;
            noteInterval = setInterval(() => {
                const currentChord = chords[chordIdx];
                playCalmTone(currentChord[noteIdx]);
                noteIdx++;
                if (noteIdx >= currentChord.length) {
                    noteIdx = 0;
                    chordIdx = (chordIdx + 1) % chords.length;
                }
            }, 600);
        } else {
            if (noteInterval) clearInterval(noteInterval);
        }
    });

});