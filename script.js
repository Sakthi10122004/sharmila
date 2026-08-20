document.addEventListener('DOMContentLoaded', () => {

    // ── Floating particles ──
    const pbg = document.getElementById('particleBg');
    const pColors = ['#fbcfe8','#a5f3fc','#ddd6fe','#fde68a'];
    function spawnParticle() {
        const p = document.createElement('div');
        p.className = 'particle';
        const sz = Math.random()*6+3;
        Object.assign(p.style, {
            width:sz+'px', height:sz+'px',
            background:pColors[Math.floor(Math.random()*pColors.length)],
            left:Math.random()*100+'%', bottom:'-10px',
            animationDuration:(Math.random()*12+10)+'s'
        });
        pbg.appendChild(p);
        setTimeout(()=>p.remove(),22000);
    }
    setInterval(spawnParticle,2000);
    for(let i=0;i<6;i++) setTimeout(spawnParticle,i*400);

    // ── Cursor trail (desktop only) ──
    const canvas = document.getElementById('cursorCanvas');
    const ctx = canvas.getContext('2d');
    let trails = [];
    function resizeCanvas(){canvas.width=window.innerWidth;canvas.height=window.innerHeight}
    resizeCanvas();
    window.addEventListener('resize',resizeCanvas);

    if(window.matchMedia('(pointer:fine)').matches){
        document.addEventListener('mousemove',e=>{
            trails.push({x:e.clientX,y:e.clientY,a:1,sz:3});
            if(trails.length>30) trails.shift();
        });
        function drawTrail(){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            trails.forEach((t,i)=>{
                t.a-=0.03;t.sz+=0.05;
                if(t.a<=0) return;
                ctx.beginPath();
                ctx.arc(t.x,t.y,t.sz,0,Math.PI*2);
                ctx.fillStyle=`rgba(236,72,153,${t.a*0.4})`;
                ctx.fill();
            });
            trails=trails.filter(t=>t.a>0);
            requestAnimationFrame(drawTrail);
        }
        drawTrail();
    }

    // ── Scroll progress ──
    const progBar = document.getElementById('scrollProgress');
    window.addEventListener('scroll',()=>{
        const h = document.documentElement.scrollHeight-window.innerHeight;
        progBar.style.width = (window.scrollY/h*100)+'%';
    });

    // ── Intro ──
    const intro = document.getElementById('intro');
    const introBtn = document.getElementById('introBtn');
    const mainWrap = document.getElementById('mainWrap');

    // Intro particles
    const ip = document.getElementById('introParticles');
    for(let i=0;i<20;i++){
        const d = document.createElement('div');
        d.className='particle';
        const sz=Math.random()*5+2;
        Object.assign(d.style,{
            width:sz+'px',height:sz+'px',
            background:pColors[Math.floor(Math.random()*pColors.length)],
            left:Math.random()*100+'%',bottom:'-10px',
            animationDuration:(Math.random()*8+5)+'s',
            animationDelay:(Math.random()*3)+'s'
        });
        ip.appendChild(d);
    }

    introBtn.addEventListener('click',()=>{
        intro.classList.add('hide');
        setTimeout(()=>{
            intro.style.display='none';
            mainWrap.classList.add('show');
            startTypewriter();
            initReveal();
            initNavDots();
        },800);
    });

    // ── Typewriter ──
    function startTypewriter(){
        const el = document.getElementById('heroTitle');
        const text = 'En Anbu Sharmila...';
        let i=0;
        el.innerHTML='<span class="cursor"></span>';
        function type(){
            if(i<text.length){
                el.innerHTML=text.substring(0,i+1)+'<span class="cursor"></span>';
                i++;
                setTimeout(type,text[i-1]==='.'?200:65);
            } else {
                setTimeout(()=>{el.innerHTML=text;},1500);
            }
        }
        type();
    }

    // ── Scroll Reveal ──
    function initReveal(){
        const obs = new IntersectionObserver(entries=>{
            entries.forEach(e=>{
                if(e.isIntersecting){e.target.classList.add('shown');obs.unobserve(e.target);}
            });
        },{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
        document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
    }

    // ── Side Nav Dots ──
    function initNavDots(){
        const sections = ['hero','quote','cards','memories','letters','promise','footer'];
        const dots = document.querySelectorAll('.nav-dot');
        dots.forEach(d=>{
            d.addEventListener('click',()=>{
                const target = document.getElementById(d.dataset.section);
                if(target) target.scrollIntoView({behavior:'smooth'});
            });
        });
        const secObs = new IntersectionObserver(entries=>{
            entries.forEach(e=>{
                if(e.isIntersecting){
                    dots.forEach(d=>d.classList.remove('active'));
                    const match = [...dots].find(d=>d.dataset.section===e.target.id);
                    if(match) match.classList.add('active');
                }
            });
        },{threshold:0.3});
        sections.forEach(id=>{
            const el=document.getElementById(id);
            if(el) secObs.observe(el);
        });
    }

    // ── 3D Tilt Cards ──
    document.querySelectorAll('.tilt-card').forEach(card=>{
        card.addEventListener('mousemove',e=>{
            const r=card.getBoundingClientRect();
            const x=(e.clientX-r.left)/r.width-.5;
            const y=(e.clientY-r.top)/r.height-.5;
            card.style.transform=`perspective(600px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave',()=>{card.style.transform='';});
        // Touch support
        card.addEventListener('touchmove',e=>{
            const t=e.touches[0];
            const r=card.getBoundingClientRect();
            const x=(t.clientX-r.left)/r.width-.5;
            const y=(t.clientY-r.top)/r.height-.5;
            card.style.transform=`perspective(600px) rotateY(${x*6}deg) rotateX(${-y*6}deg)`;
        },{passive:true});
        card.addEventListener('touchend',()=>{card.style.transform='';});
    });

    // ── ZERO text interaction ──
    const zeroEl = document.getElementById('zeroText');
    if(zeroEl){
        zeroEl.addEventListener('click',()=>{
            zeroEl.classList.remove('shake');
            void zeroEl.offsetWidth;
            zeroEl.classList.add('shake');
        });
        zeroEl.addEventListener('mouseenter',()=>{
            zeroEl.style.color='var(--aqua)';
        });
        zeroEl.addEventListener('mouseleave',()=>{
            zeroEl.style.color='';
        });
    }

    // ── Why card tap ripple ──
    const whyCard = document.getElementById('whyCard');
    if(whyCard){
        whyCard.addEventListener('click',e=>{
            whyCard.style.borderColor='rgba(236,72,153,.3)';
            setTimeout(()=>{whyCard.style.borderColor='';},600);
        });
    }

    // ── Hug Button ──
    const hugBtn = document.getElementById('hugBtn');
    const hugResp = document.getElementById('hugResp');
    hugBtn.addEventListener('click',()=>{
        hugBtn.classList.add('done');
        hugResp.classList.add('show');
        hugResp.style.display='block';
        launchConfetti();
        for(let i=0;i<10;i++) setTimeout(spawnParticle,i*80);
    });

    function launchConfetti(){
        const colors=['#ec4899','#06b6d4','#8b5cf6','#f59e0b','#fbcfe8','#a5f3fc'];
        for(let i=0;i<45;i++){
            setTimeout(()=>{
                const c=document.createElement('div');
                c.className='confetti';
                Object.assign(c.style,{
                    left:Math.random()*100+'vw',top:'-10px',
                    background:colors[Math.floor(Math.random()*colors.length)],
                    width:(Math.random()*8+4)+'px',height:(Math.random()*8+4)+'px',
                    animationDuration:(Math.random()*1.5+1.5)+'s'
                });
                document.body.appendChild(c);
                setTimeout(()=>c.remove(),3000);
            },i*30);
        }
    }

    // ── Love Meter ──
    const loveTap = document.getElementById('loveTap');
    const loveBar = document.getElementById('loveBar');
    const loveNum = document.getElementById('loveNum');
    let loves=0;

    loveTap.addEventListener('click',e=>{
        loves++;
        loveNum.textContent=loves;
        loveBar.style.width=Math.min(loves,100)+'%';
        loveTap.classList.remove('pop');
        void loveTap.offsetWidth;
        loveTap.classList.add('pop');

        // Burst heart at click pos
        const h=document.createElement('div');
        h.className='burst-heart';
        h.innerHTML='<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/></svg>';
        h.style.left=e.clientX-10+'px';
        h.style.top=e.clientY-10+'px';
        document.body.appendChild(h);
        setTimeout(()=>h.remove(),800);

        if(loves===10||loves===50||loves===100) launchConfetti();
    });

    // ── E-card hover sound-like vibration (haptic on mobile) ──
    document.querySelectorAll('.e-card').forEach(card=>{
        card.addEventListener('click',()=>{
            if(navigator.vibrate) navigator.vibrate(30);
        });
    });

});
