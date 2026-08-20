document.addEventListener('DOMContentLoaded', () => {

    // ── Twinkling Stars ──
    const starsContainer = document.getElementById('starsContainer');
    for (let i = 0; i < 70; i++) {
        const star = document.createElement('div');
        const size = Math.random() * 2.5 + 0.8;
        Object.assign(star.style, {
            position: 'absolute',
            width: size + 'px', height: size + 'px',
            background: '#fff', borderRadius: '50%',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            opacity: Math.random() * 0.5 + 0.1,
            animation: `twinkle ${Math.random() * 4 + 2}s ${Math.random() * 3}s infinite ease-in-out`
        });
        starsContainer.appendChild(star);
    }

    // ── Floating Hearts ──
    const heartsContainer = document.getElementById('floatingHearts');
    const heartSymbols = ['♥', '💕', '💗', '✨', '🤍'];
    function spawnHeart() {
        const heart = document.createElement('div');
        heart.className = 'float-heart';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 8 + 8) + 's';
        heart.style.fontSize = (Math.random() * 0.8 + 0.6) + 'rem';
        heartsContainer.appendChild(heart);
        setTimeout(() => heart.remove(), 16000);
    }
    setInterval(spawnHeart, 2500);
    for (let i = 0; i < 5; i++) setTimeout(spawnHeart, i * 600);

    // ── Intro Splash ──
    const splash = document.getElementById('introSplash');
    const enterBtn = document.getElementById('enterBtn');
    const mainContent = document.getElementById('mainContent');

    enterBtn.addEventListener('click', () => {
        splash.classList.add('hidden');
        mainContent.classList.add('visible');
        setTimeout(startTypewriter, 600);
        setTimeout(initReveal, 400);
    });

    // ── Typewriter Effect ──
    function startTypewriter() {
        const titleEl = document.getElementById('heroTitle');
        const text = 'En Anbu Sharmila... 🫀';
        let i = 0;
        titleEl.innerHTML = '<span class="cursor-blink">|</span>';
        function type() {
            if (i < text.length) {
                titleEl.innerHTML = text.substring(0, i + 1) + '<span class="cursor-blink">|</span>';
                i++;
                setTimeout(type, text[i - 1] === '.' ? 200 : 80);
            } else {
                setTimeout(() => { titleEl.innerHTML = text; }, 1500);
            }
        }
        type();
    }

    // ── Scroll Reveal ──
    function initReveal() {
        const items = document.querySelectorAll('.reveal-item');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, idx) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('revealed'), idx * 80);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        items.forEach(item => observer.observe(item));
    }

    // ── Open When Cards (Flip) ──
    document.querySelectorAll('.open-when-card').forEach(card => {
        card.addEventListener('click', () => card.classList.toggle('flipped'));
    });

    // ── Hug Button + Confetti ──
    const hugBtn = document.getElementById('sendLoveBtn');
    const hugResponse = document.getElementById('hugResponse');

    hugBtn.addEventListener('click', () => {
        hugBtn.classList.add('clicked');
        hugResponse.classList.add('show');
        hugResponse.style.display = 'block';
        launchConfetti();
    });

    function launchConfetti() {
        const colors = ['#ff4b72', '#a855f7', '#f59e0b', '#ec4899', '#8b5cf6', '#fff'];
        for (let i = 0; i < 60; i++) {
            setTimeout(() => {
                const piece = document.createElement('div');
                piece.className = 'confetti-piece';
                piece.style.left = Math.random() * 100 + 'vw';
                piece.style.top = '-10px';
                piece.style.background = colors[Math.floor(Math.random() * colors.length)];
                piece.style.width = (Math.random() * 8 + 4) + 'px';
                piece.style.height = (Math.random() * 8 + 4) + 'px';
                piece.style.animationDuration = (Math.random() * 1.5 + 1.5) + 's';
                document.body.appendChild(piece);
                setTimeout(() => piece.remove(), 3000);
            }, i * 30);
        }
    }
});
