// ============================================
// UI & INTERACTIONS
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

function initPageTransitions() {
    // 1. Create or Find Curtain
    let curtain = document.querySelector('.transition-curtain');
    if(!curtain) {
        curtain = document.createElement('div');
        curtain.className = 'transition-curtain';
        document.body.appendChild(curtain);
        
        // Initial Reveal Animation
        gsap.to(curtain, { 
            yPercent: -100, 
            duration: 1.2, 
            ease: "power4.inOut", 
            delay: 0.2,
            onComplete: () => {
                // Scroll to hash if exists (using window.lenis)
                if(window.location.hash && window.lenis) {
                    setTimeout(() => { 
                        window.lenis.scrollTo(window.location.hash, { immediate: false, duration: 1.5 }); 
                    }, 100);
                }
            }
        });
    }

    // 2. Global Click Interceptor
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        
        // Ignore empty, external, or mailto links
        if (!href || href.startsWith('http') || href.startsWith('mailto')) return;

        // PREVENT DEFAULT BROWSER NAVIGATION
        e.preventDefault(); 

        const isHash = href.startsWith('#');
        
        // CASE A: Hash Link (Smooth Scroll)
        if (isHash) {
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                if(window.lenis) {
                    window.lenis.scrollTo(targetElement, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                } else {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        } 
        // CASE B: Page Link (like smartflex.html)
        else {
            gsap.fromTo(curtain, 
                { yPercent: 100 }, // Start from bottom
                { 
                    yPercent: 0,   // Move to cover screen
                    duration: 0.8, 
                    ease: "power4.inOut",
                    onComplete: () => {
                        window.location.href = href; // Navigate
                    }
                }
            );
        }
    });
}

// CONTACT & MODAL LOGIC
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

// SKILL SHOW LOGIC
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

// IMAGE MODAL
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
    modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && modal.classList.contains('active')) closeModal(); });
}

// UTILITIES
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