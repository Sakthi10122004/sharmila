document.addEventListener('DOMContentLoaded', () => {

    // ── Pastel Stars ──
    const starsC = document.getElementById('starsContainer');
    const sColors = ['#f9a8d4','#a5f3fc','#c4b5fd','#fde68a','#fbcfe8'];
    for (let i = 0; i < 60; i++) {
        const s = document.createElement('div');
        const sz = Math.random() * 3 + 1;
        Object.assign(s.style, {
            position:'absolute', width:sz+'px', height:sz+'px',
            background: sColors[Math.floor(Math.random()*sColors.length)],
            borderRadius:'50%',
            top: Math.random()*100+'%', left: Math.random()*100+'%',
            opacity: Math.random()*0.4+0.1,
            animation: `twinkle ${Math.random()*4+3}s ${Math.random()*3}s infinite ease-in-out`
        });
        starsC.appendChild(s);
    }

    // ── Floating Petals & Hearts ──
    const floatC = document.getElementById('floatingElements');
    const symbols = ['♥','🌸','💗','✨','🩷','🤍','💐','🌷'];
    function spawnFloat() {
        const el = document.createElement('div');
        el.className = 'float-heart';
        el.textContent = symbols[Math.floor(Math.random()*symbols.length)];
        el.style.left = Math.random()*100+'%';
        el.style.animationDuration = (Math.random()*10+8)+'s';
        el.style.fontSize = (Math.random()*0.7+0.5)+'rem';
        floatC.appendChild(el);
        setTimeout(() => el.remove(), 18000);
    }
    setInterval(spawnFloat, 2500);
    for (let i = 0; i < 4; i++) setTimeout(spawnFloat, i*500);

    // ── Envelope + Splash ──
    const splash = document.getElementById('introSplash');
    const enterBtn = document.getElementById('enterBtn');
    const mainContent = document.getElementById('mainContent');
    const envelope = document.getElementById('envelope');

    enterBtn.addEventListener('click', () => {
        envelope.classList.add('opened');
        enterBtn.style.pointerEvents = 'none';
        enterBtn.style.opacity = '0.5';
        setTimeout(() => {
            splash.classList.add('hidden');
            mainContent.classList.add('visible');
            setTimeout(startTypewriter, 500);
            setTimeout(initReveal, 300);
        }, 1600);
    });

    // ── Typewriter ──
    function startTypewriter() {
        const el = document.getElementById('heroTitle');
        const text = 'En Anbu Sharmila... 🫀';
        let i = 0;
        el.innerHTML = '<span class="cursor-blink">|</span>';
        function type() {
            if (i < text.length) {
                el.innerHTML = text.substring(0, i+1) + '<span class="cursor-blink">|</span>';
                i++;
                setTimeout(type, text[i-1]==='.' ? 180 : 70);
            } else {
                setTimeout(() => { el.innerHTML = text; }, 1200);
            }
        }
        type();
    }

    // ── Scroll Reveal ──
    function initReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
        document.querySelectorAll('.reveal-item').forEach(item => observer.observe(item));
    }

    // ── Flip Cards ──
    document.querySelectorAll('.open-when-card').forEach(card => {
        card.addEventListener('click', () => card.classList.toggle('flipped'));
    });

    // ── Hug Button + Confetti ──
    const hugBtn = document.getElementById('sendLoveBtn');
    const hugResp = document.getElementById('hugResponse');
    hugBtn.addEventListener('click', () => {
        hugBtn.classList.add('clicked');
        hugResp.classList.add('show');
        hugResp.style.display = 'block';
        launchConfetti();
        for (let i = 0; i < 12; i++) setTimeout(spawnFloat, i*100);
    });

    function launchConfetti() {
        const colors = ['#f472b6','#67e8f9','#c084fc','#fbbf24','#f9a8d4','#a5f3fc'];
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const p = document.createElement('div');
                p.className = 'confetti-piece';
                Object.assign(p.style, {
                    left: Math.random()*100+'vw', top: '-10px',
                    background: colors[Math.floor(Math.random()*colors.length)],
                    width: (Math.random()*8+4)+'px', height: (Math.random()*8+4)+'px',
                    animationDuration: (Math.random()*1.5+1.5)+'s'
                });
                document.body.appendChild(p);
                setTimeout(() => p.remove(), 3000);
            }, i*25);
        }
    }

    // ── Love Counter with floating hearts ──
    const loveTapBtn = document.getElementById('loveTapBtn');
    const loveCountEl = document.getElementById('loveCount');
    let loveCount = 0;

    loveTapBtn.addEventListener('click', (e) => {
        loveCount++;
        loveCountEl.textContent = loveCount;
        loveTapBtn.classList.remove('pop');
        void loveTapBtn.offsetWidth; // reflow
        loveTapBtn.classList.add('pop');

        // Spawn a floating heart at click position
        const heart = document.createElement('div');
        heart.className = 'tap-heart';
        heart.textContent = ['💗','💕','❤️','🩷','💖'][Math.floor(Math.random()*5)];
        heart.style.left = e.clientX + 'px';
        heart.style.top = e.clientY + 'px';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);

        // Milestone confetti
        if (loveCount === 10 || loveCount === 50 || loveCount === 100) {
            launchConfetti();
        }
    });

    // ── Parallax on emotion cards (subtle mouse move) ──
    document.querySelectorAll('.emotion-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `translateY(-4px) rotateY(${x*3}deg) rotateX(${-y*3}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
});
