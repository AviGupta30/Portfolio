console.log("Initializing Void Portfolio...");

gsap.registerPlugin(ScrollTrigger);

// ============================================
// GLOBAL STATE FOR KEYBOARD CONTROLS
// ============================================
window.starState = { speed: 0.0005 };

// ============================================
// 1. SMOOTH SCROLL (LENIS) + PARALLAX + COSMIC FOG + AURORA
// ============================================
let lenis;
if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.08, smooth: true, direction: 'vertical' });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    lenis.on('scroll', (e) => {
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

        // D. AURORA SCROLL EFFECT (FIXED)
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

// ============================================
// 2. PAGE TRANSITIONS & SMART NAV
// ============================================
function initPageTransitions() {
    if(!document.querySelector('.transition-curtain')) {
        const curtain = document.createElement('div');
        curtain.className = 'transition-curtain';
        document.body.appendChild(curtain);
        
        gsap.to(curtain, { 
            yPercent: -100, 
            duration: 1.2, 
            ease: "power4.inOut", 
            delay: 0.2,
            onComplete: () => {
                if(window.location.hash && lenis) {
                    setTimeout(() => {
                        lenis.scrollTo(window.location.hash, { immediate: false, duration: 1.5 });
                    }, 100);
                }
            }
        });
    }

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('mailto')) return;

        e.preventDefault(); 

        const curtain = document.querySelector('.transition-curtain');
        const isHash = href.startsWith('#');
        const targetId = isHash ? href.substring(1) : null;
        const targetElement = targetId ? document.getElementById(targetId) : null;

        if (targetElement) {
            if(lenis) {
                lenis.scrollTo(targetElement, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
            } else {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
        else {
            gsap.fromTo(curtain, 
                { yPercent: 100 }, 
                { 
                    yPercent: 0, 
                    duration: 0.8, 
                    ease: "power4.inOut",
                    onComplete: () => {
                        if (isHash) {
                            window.location.href = '/' + href;
                        } else {
                            window.location.href = href;
                        }
                    }
                }
            );
        }
    });
}

// ============================================
// 3. NAVIGATION & OVERLAYS & FOOTER HINTS
// ============================================
function injectGlobalElements() {
    const navHTML = `
    <nav class="floating-dock">
        <a href="#home" class="dock-item magnetic-btn active"><span class="btn-text"><i data-lucide="home"></i></span></a>
        <a href="#about" class="dock-item magnetic-btn"><span class="btn-text"><i data-lucide="user"></i></span></a>
        <a href="#certifications" class="dock-item magnetic-btn"><span class="btn-text"><i data-lucide="award"></i></span></a>
        <a href="#work" class="dock-item magnetic-btn"><span class="btn-text"><i data-lucide="grid"></i></span></a>
        <a href="#contact" class="dock-item magnetic-btn"><span class="btn-text"><i data-lucide="message-square"></i></span></a>
    </nav>`;
    
    if (!document.querySelector('.floating-dock')) document.body.insertAdjacentHTML('beforeend', navHTML);
    if (!document.querySelector('.global-spotlight')) document.body.insertAdjacentHTML('beforeend', `<div class="global-spotlight"></div>`);
    
    // Inject Control Hints into Footer
    const footerMeta = document.querySelector('.footer-meta .meta-item:last-child');
    if(footerMeta) {
        const hintHTML = `
        <div class="code-hints">
            <p class="code-hint">CMD: 'red' / 'cyan'</p>
            <p class="code-hint">CMD: 'speedup' / 'speeddown'</p>
        </div>`;
        if(!footerMeta.querySelector('.code-hints')) {
            footerMeta.insertAdjacentHTML('beforeend', hintHTML);
        }
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
}
injectGlobalElements();

// ============================================
// 4. MAIN INIT
// ============================================
function initAll() {
    animateEntrance();
    initThreeJS(); 
    initScrollAnimations();
    initAudio();
    initContactReveal(); 
    initModalLogic(); 
    initSkillShow(); 
    init3DTilt(); 
    initMagneticDock();
    initMagneticFields(); 
    initKineticType(); 
    initTimeUpdate(); 
    initMouseParallax(); 
    initPageTransitions(); 
    initImageModal(); 
    initHolographicCards(); 
    initKeyboardControls(); // NEW: Keyboard listener
    ScrollTrigger.refresh();
}

function animateEntrance() {
    gsap.from(".hero-text h1", { x: -50, opacity: 0, duration: 1.5, ease: "power4.out" });
    gsap.from(".hero-text .subtitle", { x: -30, opacity: 0, duration: 1.5, delay: 0.3 });
    gsap.from(".hero-visual", { x: 50, opacity: 0, duration: 1.5, delay: 0.5, ease: "power4.out" });
}

if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initAll); } 
else { initAll(); }

// ============================================
// 5. SCROLL REVEAL ANIMATIONS
// ============================================
function initScrollAnimations() {
    document.querySelectorAll('.section-title').forEach(title => {
        gsap.fromTo(title, { y: 30, opacity: 0 }, { scrollTrigger: { trigger: title, start: "top 90%" }, y: 0, opacity: 1, duration: 1.0, ease: "power3.out" });
    });

    const aboutCard = document.querySelector('.about-card');
    if(aboutCard) {
        gsap.fromTo(aboutCard, { scale: 0.95, opacity: 0 }, { scrollTrigger: { trigger: aboutCard, start: "top 85%" }, scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" });
    }

    const eduCards = document.querySelectorAll('.edu-card');
    if(eduCards.length > 0) {
        gsap.fromTo(eduCards, { y: 30, opacity: 0 }, { scrollTrigger: { trigger: ".education-grid", start: "top 80%" }, y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" });
    }

    const certCards = document.querySelectorAll('.cert-card');
    if(certCards.length > 0) {
        gsap.fromTo(certCards, { x: -30, opacity: 0 }, { scrollTrigger: { trigger: ".cert-grid", start: "top 80%" }, x: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out" });
    }

    const timelineItems = document.querySelectorAll('.timeline-item');
    if(timelineItems.length > 0) {
        gsap.fromTo(timelineItems, 
            { y: 50, opacity: 0 },
            { scrollTrigger: { trigger: ".timeline", start: "top 80%" }, y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
        );
    }

    const skillList = document.querySelector('.skill-list');
    if(skillList) {
        gsap.fromTo(skillList, { opacity: 0 }, { scrollTrigger: { trigger: "#skill-runway-container", start: "top 70%" }, opacity: 0.6, duration: 2 });
    }

    const workCards = document.querySelectorAll('#work .card');
    if(workCards.length > 0) {
        gsap.fromTo(workCards, { y: 50, opacity: 0 }, { scrollTrigger: { trigger: "#work", start: "top 80%" }, y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out" });
    }

    const footerBtn = document.querySelector('.aesthetic-btn');
    const footerMeta = document.querySelector('.footer-meta');
    if(footerBtn) {
        gsap.fromTo(footerBtn, { scale: 0.5, opacity: 0 }, { scrollTrigger: { trigger: "#contact", start: "top 75%" }, scale: 1, opacity: 1, duration: 1.5, ease: "expo.out" });
    }
    if(footerMeta) {
        gsap.fromTo(footerMeta, { y: 20, opacity: 0 }, { scrollTrigger: { trigger: "#contact", start: "top 75%" }, y: 0, opacity: 1, duration: 1, delay: 0.5 });
    }
    
    const hud = document.getElementById('adaptive-hud');
    if(hud) {
        gsap.fromTo(hud, { x: 50, opacity: 0 }, { duration: 1, delay: 1, x: 0, opacity: 1 });
    }
}

// ============================================
// 6. SKILL MODEL SHOW
// ============================================
const mySkills = [
    { name: "JAVA", icon: "devicon-java-plain" },
    { name: "PYTHON", icon: "devicon-python-plain" },
    { name: "HTML5", icon: "devicon-html5-plain" },
    { name: "CSS3", icon: "devicon-css3-plain" },
    { name: "JS", icon: "devicon-javascript-plain" },
    { name: "FASTAPI", icon: "devicon-fastapi-plain" },
    { name: "GIT", icon: "devicon-git-plain" },
    { name: "C", icon: "devicon-c-plain" },
    { name: "MYSQL", icon: "devicon-mysql-plain" },
    { name: "MONGODB", icon: "devicon-mongodb-plain" }
];

function initSkillShow() {
    const stage = document.getElementById('skill-stage');
    if(!stage) return;
    let index = 0;
    function spawnModel() {
        const skill = mySkills[index];
        const model = document.createElement('div');
        model.className = 'skill-model';
        model.innerHTML = `<i class="${skill.icon}"></i><span>${skill.name}</span>`;
        stage.appendChild(model);
        const tl = gsap.timeline({ onComplete: () => { model.remove(); } });
        tl.fromTo(model, 
            { x: "-150%", left: "0%", opacity: 0, scale: 0.5 },
            { x: "-50%", left: "50%", opacity: 1, scale: 1.2, duration: 1.5, ease: "power2.out" }
        )
        .to(model, { scale: 1.3, textShadow: "0 0 20px #00f3ff", duration: 0.8 })
        .to(model, { 
            x: "150%", left: "100%", opacity: 0, scale: 0.5, duration: 1.2, ease: "power2.in",
            onStart: () => {
                index = (index + 1) % mySkills.length;
                gsap.delayedCall(0.5, spawnModel); 
            }
        });
    }
    spawnModel();
}

// ============================================
// 7. CONTACT & MODAL LOGIC
// ============================================
function initContactReveal() {
    const btn = document.getElementById('reveal-contact-btn');
    const details = document.getElementById('contact-details');
    if(btn && details) {
        btn.addEventListener('click', () => {
            details.classList.toggle('show');
            if (details.classList.contains('show')) {
                btn.innerHTML = `HIDE DETAILS <i data-lucide="chevron-up" style="width: 14px; display: inline;"></i>`;
            } else {
                btn.innerHTML = `SHOW DETAILS <i data-lucide="chevron-down" style="width: 14px; display: inline;"></i>`;
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });
    }
}

function initModalLogic() {
    const openBtn = document.getElementById('open-contact-modal');
    const modal = document.getElementById('contact-modal');
    const closeBtn = document.getElementById('close-modal');
    const form = document.getElementById('contact-form');
    if(openBtn && modal && closeBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.classList.add('cursor-visible'); 
        });
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.classList.remove('cursor-visible');
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.classList.remove('cursor-visible');
            }
        });
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const btnText = document.getElementById('btn-text');
            const status = document.getElementById('form-status');
            btnText.textContent = "TRANSMITTING...";
            emailjs.sendForm('service_sigz2vi', 'template_plm10hw', this)
                .then(function() {
                    btnText.textContent = "SENT SUCCESSFULLY";
                    status.textContent = "Transmission received. Stand by for response.";
                    status.style.color = "#22c55e";
                    form.reset();
                    setTimeout(() => { 
                        modal.classList.remove('active'); 
                        document.body.classList.remove('cursor-visible'); 
                        btnText.textContent = "SEND TRANSMISSION"; 
                        status.textContent=""; 
                    }, 3000);
                }, function(error) {
                    btnText.textContent = "FAILED";
                    status.textContent = "Connection error. Please try again.";
                    status.style.color = "red";
                });
        });
    }
}

// ============================================
// 8. THREE.JS (GRAVITATIONAL LENSING + OPEN CONSTELLATIONS)
// ============================================

// Mouse Tracking for Parallax
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

function initThreeJS() {
    const container = document.getElementById('webgl-container');
    if (!container) return;
    while(container.firstChild) container.removeChild(container.firstChild);

    // Setup Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    camera.position.z = 15;

    // --- MATERIALS (Now with Color Targets) ---
    // FIXED: Changed baseColor from 0xffffff to 0x00f3ff to match Cyan default
    const baseColor = new THREE.Color(0x00f3ff); 
    const redModeColor = new THREE.Color(0xff0000); 
    
    // 1. Stars
    const particlesCount = 700;
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);
    const originalPosArray = new Float32Array(particlesCount * 3); 

    for(let i = 0; i < particlesCount * 3; i++) { 
        const val = (Math.random() - 0.5) * 60;
        posArray[i] = val;
        originalPosArray[i] = val;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    // Default color set to Cyan
    const starMaterial = new THREE.PointsMaterial({ size: 0.08, color: 0x00f3ff, transparent: true, opacity: 0.8 });
    const starMesh = new THREE.Points(particlesGeometry, starMaterial);
    scene.add(starMesh);

    // 2. Lines
    const maxLines = 10; 
    const lineGeometry = new THREE.BufferGeometry();
    const linePos = new Float32Array(maxLines * 2 * 3);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00f3ff, transparent: true, opacity: 0 });
    const constellationMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(constellationMesh);

    // 3. Nodes
    const nodeGeometry = new THREE.BufferGeometry();
    const nodePos = new Float32Array(6 * 3); 
    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
    const nodeMaterial = new THREE.PointsMaterial({ 
        size: 0.12, color: 0x00f3ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending 
    });
    const constellationNodesMesh = new THREE.Points(nodeGeometry, nodeMaterial);
    scene.add(constellationNodesMesh);

    // FIXED: Removed local starState, logic now uses window.starState
    
    let constelState = {
        isActive: false, opacity: 0, indices: [],
        nextSpawnTime: Date.now() + 2000, despawnTime: 0
    };

    function getScreenToWorld(x, y) {
        const mouse = new THREE.Vector2();
        mouse.x = (x / window.innerWidth) * 2 - 1;
        mouse.y = -(y / window.innerHeight) * 2 + 1;
        const vec = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        vec.unproject(camera);
        const dir = vec.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        return camera.position.clone().add(dir.multiplyScalar(distance));
    }

    // --- ANIMATION LOOP ---
    function animate() {
        requestAnimationFrame(animate);
        const now = Date.now();

        // A. COLOR INTERPOLATION (Updated to check HTML tag)
        const targetColor = document.documentElement.classList.contains('mode-red') ? redModeColor : baseColor;
        
        // Smoothly transition colors
        starMaterial.color.lerp(targetColor, 0.05);
        lineMaterial.color.lerp(targetColor, 0.05);
        nodeMaterial.color.lerp(targetColor, 0.05);

        // B. ROTATION (Uses Global State)
        starMesh.rotation.y -= window.starState.speed;

        // C. GRAVITY & PHYSICS
        const voidEl = document.querySelector('.singularity-void');
        const positions = starMesh.geometry.attributes.position.array;
        
        if (voidEl) {
            const rect = voidEl.getBoundingClientRect();
            if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const gravityCenter = getScreenToWorld(centerX, centerY);
                const cosR = Math.cos(starMesh.rotation.y);
                const sinR = Math.sin(starMesh.rotation.y);

                for(let i=0; i<particlesCount; i++) {
                    const ox = originalPosArray[i*3], oy = originalPosArray[i*3+1], oz = originalPosArray[i*3+2];
                    const wx = ox * cosR - oz * sinR, wy = oy; // World Coords
                    const dx = gravityCenter.x - wx, dy = gravityCenter.y - wy;
                    const distSq = dx*dx + dy*dy;
                    
                    if (distSq < 25) {
                        const dist = Math.sqrt(distSq);
                        const force = (1.5 / (dist + 0.1)) * 0.5; 
                        positions[i*3] = ox + dx * force;
                        positions[i*3+1] = oy + dy * force;
                        positions[i*3+2] = oz + (force * 2); 
                    } else {
                        positions[i*3] += (ox - positions[i*3]) * 0.1;
                        positions[i*3+1] += (oy - positions[i*3+1]) * 0.1;
                        positions[i*3+2] += (oz - positions[i*3+2]) * 0.1;
                    }
                }
                starMesh.geometry.attributes.position.needsUpdate = true;
            }
        }

        // D. CONSTELLATIONS
        if (!constelState.isActive) {
            if (now > constelState.nextSpawnTime) {
                let seedIdx = Math.floor(Math.random() * particlesCount);
                constelState.isActive = true;
                constelState.despawnTime = now + 10000;
                constelState.nextSpawnTime = now + 12000;
            }
        } else {
            if (now < constelState.despawnTime - 2000) constelState.opacity += (1.0 - constelState.opacity) * 0.05; 
            else constelState.opacity *= 0.95; 
            if (now > constelState.despawnTime) { constelState.isActive = false; constelState.opacity = 0; }
        }

        constellationMesh.material.opacity = constelState.opacity * 0.25; 
        constellationNodesMesh.material.opacity = constelState.opacity; 
        renderer.render(scene, camera);
    }
    animate();

    // CONTACT SECTION SPEEDUP
    ScrollTrigger.create({
        trigger: "#contact",
        start: "top bottom", end: "bottom bottom",
        onEnter: () => { 
            // Check global state
            if(window.starState.speed < 0.05) gsap.to(window.starState, { speed: 0.05, duration: 2 }); 
        },
        onLeaveBack: () => { 
            // Reset global state
            if(window.starState.speed > 0.005) gsap.to(window.starState, { speed: 0.0005, duration: 2 }); 
        }
    });
    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    container.style.opacity = '1';
}

// HUD CLOCK
function initTimeUpdate() {
    const timeEl = document.getElementById('hud-time');
    if(timeEl) {
        setInterval(() => {
            const now = new Date();
            timeEl.innerText = now.toLocaleTimeString('en-US', { hour12: false });
        }, 1000);
    }
}

function initAudio() {
    const drone = document.getElementById('audio-drone');
    const click = document.getElementById('audio-click');
    if(drone) drone.volume = 0.2;
    const startAudio = () => {
        if(drone) { drone.play().catch(() => {}); }
        document.removeEventListener('click', startAudio);
        document.removeEventListener('keydown', startAudio);
    };
    document.addEventListener('click', startAudio);
    document.addEventListener('keydown', startAudio);
    
    document.querySelectorAll('a, button, .card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if(click) { click.currentTime = 0; click.volume = 0.1; click.play().catch(() => {}); }
        });
    });
}

// ============================================
// 9. 3D TILT LOGIC
// ============================================
function init3DTilt() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const glare = document.createElement('div');
        glare.className = 'card-glare';
        card.appendChild(glare);

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5; 
            const rotateY = ((x - centerX) / centerX) * 5;

            gsap.to(card, {
                duration: 0.5, rotateX: rotateX, rotateY: rotateY, scale: 1.02,
                ease: "power2.out", transformPerspective: 1000
            });
            gsap.to(glare, {
                duration: 0.5, x: (x - centerX) * 0.8, y: (y - centerY) * 0.8,
                opacity: 1, ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.8, rotateX: 0, rotateY: 0, scale: 1,
                ease: "elastic.out(1, 0.5)" 
            });
            gsap.to(glare, { duration: 0.8, opacity: 0, ease: "power2.out" });
        });
    });
}

// ============================================
// 10. MAGNETIC DOCK (MACOS EFFECT) + NEW BUTTONS
// ============================================
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

// ============================================
// 11. KINETIC TYPOGRAPHY
// ============================================
function initKineticType() {
    gsap.fromTo(".text-engineer", 
        { xPercent: -15 }, 
        { scrollTrigger: { trigger: "#about", start: "top bottom", end: "bottom top", scrub: 1 }, xPercent: 15 }
    );

    gsap.fromTo(".text-syntax", 
        { xPercent: 15 }, 
        { scrollTrigger: { trigger: ".skill-list", start: "top bottom", end: "bottom top", scrub: 1 }, xPercent: -15 }
    );

    gsap.fromTo(".text-authorized", 
        { xPercent: -15 }, 
        { scrollTrigger: { trigger: ".cert-grid", start: "top bottom", end: "bottom top", scrub: 1 }, xPercent: 15 }
    );

    gsap.fromTo(".text-creator", 
        { xPercent: -15 }, 
        { scrollTrigger: { trigger: "#work", start: "top bottom", end: "bottom top", scrub: 1 }, xPercent: 15 }
    );

    gsap.fromTo(".text-connect", 
        { xPercent: 5 }, 
        { scrollTrigger: { trigger: "#contact", start: "top bottom", end: "bottom top", scrub: 1 }, xPercent: -5 }
    );
}

// ============================================
// 12. IMAGE LIGHTBOX LOGIC
// ============================================
function initImageModal() {
    const modal = document.getElementById('image-modal');
    const expandedImg = document.getElementById('expanded-image');
    const closeBtn = document.getElementById('close-image-modal');
    const certCards = document.querySelectorAll('.cert-card');

    certCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const imgPath = card.getAttribute('data-img');
            if(imgPath) {
                expandedImg.src = imgPath;
                modal.classList.add('active');
                document.body.classList.add('cursor-visible'); 
            }
        });
    });

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.classList.remove('cursor-visible');
    };

    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if(e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// ============================================
// 13. HOLOGRAPHIC FOIL LOGIC
// ============================================
function initHolographicCards() {
    const cards = document.querySelectorAll('.cert-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--holo-x', `${x}px`);
            card.style.setProperty('--holo-y', `${y}px`);
            card.style.setProperty('--holo-opacity', '1');
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--holo-opacity', '0');
        });
    });
}

// ============================================
// 14. KEYBOARD CONTROLS (NEW FEATURE)
// ============================================
function initKeyboardControls() {
    let keyBuffer = "";
    
    // We listen for typing on the whole document
    document.addEventListener('keydown', (e) => {
        // If user is typing in a form (like the contact form or chat), don't trigger cheats
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        // FIXED: Handle Backspace
        if (e.key === "Backspace") {
            keyBuffer = keyBuffer.slice(0, -1);
            return;
        }

        // Add key to buffer (lowercase)
        if(e.key.length === 1) { // Only letters/numbers
            keyBuffer += e.key.toLowerCase();
        }

        // Limit buffer size to avoid memory issues (keep last 20 chars)
        if(keyBuffer.length > 20) {
            keyBuffer = keyBuffer.substring(keyBuffer.length - 20);
        }

        // CHECK COMMANDS
        if (keyBuffer.endsWith("speedup")) {
            console.log("CMD: SPEED UP");
            // FIXED: Using global state
            window.starState.speed += 0.005;
            showToast(`SPEED INCREASED: ${(window.starState.speed * 1000).toFixed(0)}%`);
            keyBuffer = ""; // Clear buffer
        }

        if (keyBuffer.endsWith("speeddown")) {
            console.log("CMD: SPEED DOWN");
            // FIXED: Using global state with floor limit
            window.starState.speed = Math.max(0, window.starState.speed - 0.005);
            showToast(`SPEED DECREASED: ${(window.starState.speed * 1000).toFixed(0)}%`);
            keyBuffer = "";
        }

        if (keyBuffer.endsWith("red")) {
            console.log("CMD: RED MODE");
            // FIXED: Apply to HTML tag
            document.documentElement.classList.add('mode-red');
            showToast("SYSTEM ALERT: RED MODE ENGAGED");
            playOverdriveSound();
            keyBuffer = "";
        }

        if (keyBuffer.endsWith("cyan")) {
            console.log("CMD: CYAN MODE");
            // FIXED: Remove from HTML tag
            document.documentElement.classList.remove('mode-red');
            showToast("SYSTEM RESTORED: CYAN MODE");
            keyBuffer = "";
        }
    });
}

// Helper to show a temporary UI feedback (Toast)
function showToast(msg) {
    let toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
        background: rgba(0,0,0,0.8); border: 1px solid var(--accent);
        color: var(--accent); padding: 10px 20px; font-family: 'JetBrains Mono', monospace;
        font-size: 0.8rem; border-radius: 4px; z-index: 10000;
        box-shadow: 0 0 20px var(--accent-dim);
    `;
    toast.innerText = msg;
    document.body.appendChild(toast);
    
    gsap.fromTo(toast, {y: 20, opacity: 0}, {y: 0, opacity: 1, duration: 0.3});
    gsap.to(toast, {y: -20, opacity: 0, duration: 0.3, delay: 2, onComplete: () => toast.remove()});
}

function playOverdriveSound() {
    const audio = document.getElementById('audio-overdrive');
    if(audio) {
        audio.currentTime = 0;
        audio.volume = 0.5;
        audio.play().catch(e => console.log(e));
    }
}