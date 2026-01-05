// ============================================
// SCROLL & ELEMENT ANIMATIONS
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

    // FIX: Targeting specific footer button so Resume button is not hidden
    const footerBtn = document.querySelector('#contact .aesthetic-btn');
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

// 3D TILT LOGIC
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

// KINETIC TYPOGRAPHY
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

// HOLOGRAPHIC FOIL LOGIC
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

function animateEntrance() {
    gsap.from(".hero-text h1", { x: -50, opacity: 0, duration: 1.5, ease: "power4.out" });
    gsap.from(".hero-text .subtitle", { x: -30, opacity: 0, duration: 1.5, delay: 0.3 });
    // Animate the Resume Button after the subtitle
    gsap.from(".hero-cta-wrapper", { y: 20, opacity: 0, duration: 1.5, delay: 0.6, ease: "expo.out" });
    gsap.from(".hero-visual", { x: 50, opacity: 0, duration: 1.5, delay: 0.5, ease: "power4.out" });
}