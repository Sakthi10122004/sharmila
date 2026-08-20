document.addEventListener('DOMContentLoaded', () => {

    // ── 1. Starfield Particle Background (Smooth Canvas) ──
    const canvas = document.getElementById('starCanvas');
    const ctx = canvas.getContext('2d');
    let stars = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < 70; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.8 + 0.5,
            alpha: Math.random() * 0.7 + 0.2,
            speed: Math.random() * 0.3 + 0.1
        });
    }

    function renderStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => {
            s.y -= s.speed;
            if (s.y < 0) s.y = canvas.height;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
            ctx.fill();
        });
        requestAnimationFrame(renderStars);
    }
    renderStars();

    // ── 2. Interactive Spotlight Following Pointer ──
    const spotlight = document.getElementById('glowSpotlight');
    window.addEventListener('pointermove', (e) => {
        spotlight.style.left = `${e.clientX}px`;
        spotlight.style.top = `${e.clientY}px`;
    });

    // ── 3. Scroll Progress ──
    const progressEl = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        progressEl.style.width = `${progress}%`;
    });

    // ── 4. Intro Curtain Unseal ──
    const openBtn = document.getElementById('openEnvelopeBtn');
    const introCurtain = document.getElementById('introCurtain');
    
    openBtn.addEventListener('click', () => {
        introCurtain.classList.add('opened');
        spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 20);
        setTimeout(startTypewriter, 600);
    });

    // ── 5. Typewriter Effect ──
    function startTypewriter() {
        const textTarget = document.getElementById('typewriterText');
        const phrase = 'En Anbu Sharmila...';
        let idx = 0;
        textTarget.textContent = '';
        
        function step() {
            if (idx < phrase.length) {
                textTarget.textContent += phrase[idx];
                idx++;
                setTimeout(step, 80);
            }
        }
        step();
    }

    // ── 6. 3D Card Tilt on Hover / Touch ──
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

    // ── 7. Flip Cards Toggle (Mobile & Desktop) ──
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
            if (navigator.vibrate) navigator.vibrate(20);
        });
    });

    // ── 8. ZERO Pulse Trigger ──
    const zeroTrigger = document.getElementById('zeroTrigger');
    zeroTrigger.addEventListener('click', (e) => {
        zeroTrigger.style.transform = 'scale(1.4) rotate(-8deg)';
        setTimeout(() => zeroTrigger.style.transform = '', 300);
        spawnBurst(e.clientX, e.clientY, 8);
    });

    // ── 9. Press & Hold for Hug (Timer Progress) ──
    const holdBtn = document.getElementById('holdHugBtn');
    const holdProgress = document.getElementById('holdProgress');
    const hugFeedback = document.getElementById('hugFeedback');
    const hugBtnText = document.getElementById('hugBtnText');
    let holdTimer = null;
    let progressVal = 0;

    function startHold(e) {
        progressVal = 0;
        holdProgress.style.width = '0%';
        holdTimer = setInterval(() => {
            progressVal += 4;
            holdProgress.style.width = `${progressVal}%`;
            if (progressVal >= 100) {
                clearInterval(holdTimer);
                completeHug(e);
            }
        }, 30);
    }

    function cancelHold() {
        if (progressVal < 100) {
            clearInterval(holdTimer);
            holdProgress.style.width = '0%';
        }
    }

    function completeHug(e) {
        holdBtn.style.pointerEvents = 'none';
        hugBtnText.textContent = 'Hug Sent!';
        hugFeedback.style.display = 'block';
        const clientX = e.clientX || window.innerWidth / 2;
        const clientY = e.clientY || window.innerHeight / 2;
        spawnBurst(clientX, clientY, 25);
        if (navigator.vibrate) navigator.vibrate([40, 60, 100]);
    }

    holdBtn.addEventListener('mousedown', startHold);
    holdBtn.addEventListener('touchstart', startHold, { passive: true });
    window.addEventListener('mouseup', cancelHold);
    window.addEventListener('touchend', cancelHold);

    // ── 10. Tap to Send Love Meter ──
    const tapLoveBtn = document.getElementById('tapLoveBtn');
    const meterFill = document.getElementById('meterFill');
    const loveCount = document.getElementById('loveCount');
    let count = 0;

    tapLoveBtn.addEventListener('click', (e) => {
        count++;
        loveCount.textContent = count;
        meterFill.style.width = `${Math.min(count * 5, 100)}%`;
        spawnBurst(e.clientX, e.clientY, 3);
        if (navigator.vibrate) navigator.vibrate(15);
    });

    // ── 11. Floating SVG Heart Spawner ──
    function spawnBurst(x, y, amount) {
        for (let i = 0; i < amount; i++) {
            const svg = document.createElement('div');
            svg.className = 'flying-heart-svg';
            svg.innerHTML = `
                <svg viewBox="0 0 24 24" width="22" height="22" fill="#f43f5e">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>`;
            svg.style.left = `${x}px`;
            svg.style.top = `${y}px`;
            svg.style.setProperty('--tx', `${(Math.random() - 0.5) * 120}px`);
            document.body.appendChild(svg);
            setTimeout(() => svg.remove(), 1200);
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