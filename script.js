document.addEventListener('DOMContentLoaded', () => {

    // ── 1. Soft Light Particles Canvas (Light Pink & Aqua Ambient) ──
    const canvas = document.getElementById('ambientCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const colors = ['rgba(244, 114, 182, 0.4)', 'rgba(56, 189, 248, 0.4)', 'rgba(251, 207, 232, 0.3)'];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2.5 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: Math.random() * 0.4 + 0.1,
            speedX: (Math.random() - 0.5) * 0.2
        });
    }

    function renderAmbient() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.y -= p.speedY;
            p.x += p.speedX;
            if (p.y < 0) p.y = canvas.height;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });
        requestAnimationFrame(renderAmbient);
    }
    renderAmbient();

    // ── 2. Interactive Spotlight Pointer Follow ──
    const spotlight = document.getElementById('glowSpotlight');
    window.addEventListener('pointermove', (e) => {
        spotlight.style.left = `${e.clientX}px`;
        spotlight.style.top = `${e.clientY}px`;
    });

    // ── 3. Scroll Progress Indicator ──
    const scrollBar = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const current = (window.scrollY / total) * 100;
        scrollBar.style.width = `${current}%`;
    });

    // ── 4. Wax Seal & Envelope Unseal Sequence ──
    const envelopeCurtain = document.getElementById('envelopeCurtain');
    const envelopeWrapper = document.getElementById('envelopeWrapper');

    envelopeWrapper.addEventListener('click', (e) => {
        envelopeCurtain.classList.add('unsealed');
        spawnHearts(window.innerWidth / 2, window.innerHeight / 2, 25);
        setTimeout(startTypewriter, 500);
    });

    // ── 5. Typewriter Effect ──
    function startTypewriter() {
        const target = document.getElementById('typewriterTarget');
        const text = 'En Anbu Sharmila...';
        let idx = 0;
        target.textContent = '';

        function step() {
            if (idx < text.length) {
                target.textContent += text[idx];
                idx++;
                setTimeout(step, 80);
            }
        }
        step();
    }

    // ── 6. 3D Card Physics Tilt on Move ──
    const tiltCards = document.querySelectorAll('.interactive-tilt');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ── 7. Flip Cards Toggle ──
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
            if (navigator.vibrate) navigator.vibrate(20);
        });
    });

    // ── 8. ZERO Pulse Reaction ──
    const zeroTrigger = document.getElementById('zeroTrigger');
    zeroTrigger.addEventListener('click', (e) => {
        zeroTrigger.style.transform = 'scale(1.4) rotate(-8deg)';
        setTimeout(() => zeroTrigger.style.transform = '', 300);
        spawnHearts(e.clientX, e.clientY, 8);
    });

    // ── 9. Hold to Hug Interaction ──
    const holdBtn = document.getElementById('holdHugBtn');
    const holdProgress = document.getElementById('holdProgress');
    const hugFeedback = document.getElementById('hugFeedback');
    const hugBtnText = document.getElementById('hugBtnText');
    let timer = null;
    let progress = 0;

    function startHold(e) {
        progress = 0;
        holdProgress.style.width = '0%';
        timer = setInterval(() => {
            progress += 4;
            holdProgress.style.width = `${progress}%`;
            if (progress >= 100) {
                clearInterval(timer);
                finishHug(e);
            }
        }, 30);
    }

    function cancelHold() {
        if (progress < 100) {
            clearInterval(timer);
            holdProgress.style.width = '0%';
        }
    }

    function finishHug(e) {
        holdBtn.style.pointerEvents = 'none';
        hugBtnText.textContent = 'Hug Sent With Love!';
        hugFeedback.style.display = 'block';
        const clientX = e.clientX || window.innerWidth / 2;
        const clientY = e.clientY || window.innerHeight / 2;
        spawnHearts(clientX, clientY, 28);
        if (navigator.vibrate) navigator.vibrate([50, 70, 100]);
    }

    holdBtn.addEventListener('mousedown', startHold);
    holdBtn.addEventListener('touchstart', startHold, { passive: true });
    window.addEventListener('mouseup', cancelHold);
    window.addEventListener('touchend', cancelHold);

    // ── 10. Tap to Send Love Hearts ──
    const tapLoveBtn = document.getElementById('tapLoveBtn');
    const meterFill = document.getElementById('meterFill');
    const loveCount = document.getElementById('loveCount');
    let loves = 0;

    tapLoveBtn.addEventListener('click', (e) => {
        loves++;
        loveCount.textContent = loves;
        meterFill.style.width = `${Math.min(loves * 6, 100)}%`;
        spawnHearts(e.clientX, e.clientY, 4);
        if (navigator.vibrate) navigator.vibrate(15);
    });

    // ── 11. Floating SVG Hearts Particle Burst ──
    function spawnHearts(x, y, amount) {
        for (let i = 0; i < amount; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart-particle';
            heart.innerHTML = `
                <svg viewBox="0 0 24 24" width="22" height="22" fill="#f472b6">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>`;
            heart.style.left = `${x}px`;
            heart.style.top = `${y}px`;
            heart.style.setProperty('--tx', `${(Math.random() - 0.5) * 140}px`);
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 1200);
        }
    }

    // ── 12. Floating Nav Smooth Scroll ──
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const el = document.getElementById(targetId);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
        });
    });

});