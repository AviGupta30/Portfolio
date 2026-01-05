// ============================================
// CONTROLS & INPUT
// ============================================

function initSmoothScroll() {
    if (typeof Lenis !== 'undefined') {
        // FIX: Attach to window to make it global across files
        window.lenis = new Lenis({ lerp: 0.08, smooth: true, direction: 'vertical' });
        
        window.lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => { window.lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);

        window.lenis.on('scroll', (e) => {
            const scrollY = e.scroll;
            const velocity = e.velocity;
            const speed = Math.abs(velocity);

            // A. VELOCITY BARS
            const opacity = Math.min(0.1 + (speed * 3.5), 1.0); 
            const stretch = 0.5 + Math.min(speed * 0.5, 2.5);
            const width = 6 + Math.min(speed * 2, 10);

            const bars = document.querySelectorAll('.velocity-bar');
            bars.forEach(bar => {
                bar.style.opacity = opacity;
                bar.style.transform = `translateY(-50%) scaleY(${stretch})`;
                bar.style.width = `${width}px`;
                bar.style.filter = `blur(${Math.max(0, 4 - speed)}px)`; 
            });

            // B. KINETIC PARALLAX LAYERS
            const layer1 = document.querySelector('.layer-1');
            const layer2 = document.querySelector('.layer-2');
            const layer3 = document.querySelector('.layer-3');
            if(layer1 && layer2 && layer3) {
                layer1.style.transform = `translateY(${scrollY * 0.1}px) scale(1)`;
                layer2.style.transform = `translateY(${scrollY * 0.2}px) scale(1.2)`;
                layer3.style.transform = `translateY(${scrollY * 0.3}px) scale(1.5)`;
            }

            // C. COSMIC FOG REACTIVITY
            const fog = document.getElementById('cosmic-fog');
            if(fog) {
                fog.style.transform = `translateY(${scrollY * -0.2}px)`; 
            }

            // D. AURORA SCROLL EFFECT
            const auroraOpacity = Math.min(speed * 0.05, 0.8); 
            gsap.to('.aurora-guide', { 
                opacity: auroraOpacity, 
                duration: 0.2, 
                ease: "power1.out",
                overwrite: true 
            });

            // E. HUD COORDINATES UPDATE
            const hudCoords = document.getElementById('hud-coords');
            if(hudCoords) {
                hudCoords.innerText = `Y:${Math.round(scrollY).toString().padStart(4, '0')}`;
            }

            // Update Dock & HUD Active State
            const sections = ['home', 'about', 'certifications', 'work', 'contact'];
            let current = 'home';
            sections.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) current = id;
                }
            });
            
            document.querySelectorAll('.dock-item').forEach(a => {
                a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
            });

            const hudSection = document.getElementById('hud-section');
            if(hudSection && hudSection.textContent !== current.toUpperCase()) {
                hudSection.textContent = current.toUpperCase();
            }
        });
    }
}

// MOUSE TRACKING & PARALLAX
function initMouseParallax() {
    const layers = document.querySelectorAll('.kinetic-layer');
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20; 
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        layers.forEach((layer, index) => {
            const depth = (index + 1) * 0.5;
            gsap.to(layer, { x: x * depth, y: y * depth, duration: 1, ease: "power2.out" });
        });
    });
}

function createTrail(x, y) {
    if (document.body.classList.contains('cursor-visible')) return;
    const dot = document.createElement('div');
    dot.className = 'trail-dot';
    document.body.appendChild(dot);
    gsap.set(dot, { x, y });
    gsap.to(dot, { duration: 0.8, opacity: 0, scale: 0.1, onComplete: () => dot.remove() });
}

// Global Mouse Event Listeners
document.addEventListener('mousemove', (e) => {
    const spotlight = document.querySelector('.global-spotlight');
    if(spotlight) {
        spotlight.style.setProperty('--x', `${e.clientX}px`);
        spotlight.style.setProperty('--y', `${e.clientY}px`);
    }
    
    if(!document.body.classList.contains('cursor-visible')) {
        createTrail(e.clientX, e.clientY);
        document.querySelectorAll('.card').forEach(card => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    }
});

// MAGNETIC DOCK
function initMagneticDock() {
    const dockContainer = document.querySelector('.floating-dock');
    const items = document.querySelectorAll('.dock-item');
    const maxDistance = 150; 
    
    if(!dockContainer || items.length === 0) return;

    dockContainer.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            const itemCenterX = rect.left + rect.width / 2;
            const distance = Math.abs(mouseX - itemCenterX);
            let scale = 1;
            if (distance < maxDistance) {
                scale = 1 + (1.5 - 1) * (1 - distance / maxDistance);
            }
            gsap.to(item, {
                width: 50 * scale, height: 50 * scale, fontSize: `${1 * scale}rem`,
                duration: 0.1, ease: "power2.out"
            });
        });
    });

    dockContainer.addEventListener('mouseleave', () => {
        items.forEach(item => {
            gsap.to(item, {
                width: 50, height: 50, fontSize: "1rem",
                duration: 0.3, ease: "elastic.out(1, 0.5)"
            });
        });
    });
}

function initMagneticFields() {
    const targets = document.querySelectorAll('.social-brand, .close-btn, #close-image-modal');
    targets.forEach(target => {
        target.addEventListener('mousemove', (e) => {
            const rect = target.getBoundingClientRect();
            const x = e.clientX - (rect.left + rect.width / 2);
            const y = e.clientY - (rect.top + rect.height / 2);
            gsap.to(target, { x: x * 0.3, y: y * 0.3, duration: 0.2 });
        });
        target.addEventListener('mouseleave', () => {
            gsap.to(target, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
        });
    });
}

// KEYBOARD CONTROLS
function initKeyboardControls() {
    let keyBuffer = "";
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === "Backspace") {
            keyBuffer = keyBuffer.slice(0, -1);
            return;
        }
        if(e.key.length === 1) keyBuffer += e.key.toLowerCase();
        if(keyBuffer.length > 20) keyBuffer = keyBuffer.substring(keyBuffer.length - 20);

        if (keyBuffer.endsWith("speedup")) {
            window.starState.speed += 0.005;
            showToast(`SPEED INCREASED: ${(window.starState.speed * 1000).toFixed(0)}%`);
            keyBuffer = "";
        }
        if (keyBuffer.endsWith("speeddown")) {
            window.starState.speed = Math.max(0, window.starState.speed - 0.005);
            showToast(`SPEED DECREASED: ${(window.starState.speed * 1000).toFixed(0)}%`);
            keyBuffer = "";
        }
        if (keyBuffer.endsWith("red")) {
            document.documentElement.classList.add('mode-red');
            showToast("SYSTEM ALERT: RED MODE ENGAGED");
            playOverdriveSound();
            keyBuffer = "";
        }
        if (keyBuffer.endsWith("cyan")) {
            document.documentElement.classList.remove('mode-red');
            showToast("SYSTEM RESTORED: CYAN MODE");
            keyBuffer = "";
        }
    });
}