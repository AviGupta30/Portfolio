console.log("Initializing SmartFlex Module...");

// ============================================
// 1. PRELOADER LOGIC (ADDED FIX)
// ============================================
function initPreloader() {
    const counter = document.querySelector('.counter');
    const preloader = document.querySelector('.preloader');

    if (counter && preloader) {
        let count = { val: 0 };
        
        // Animate counter from 0 to 100
        gsap.to(count, {
            val: 100,
            duration: 1.0,
            ease: "power2.out",
            onUpdate: () => {
                counter.innerText = Math.floor(count.val);
            },
            onComplete: () => {
                // Slide the preloader up to reveal content
                gsap.to(preloader, {
                    yPercent: -100,
                    duration: 0.8,
                    ease: "power4.inOut"
                });
            }
        });
    }
}

// ============================================
// 2. WEATHER API SIMULATION
// ============================================
function initWeatherWidget() {
    const dot = document.querySelector('.dot');
    const statusText = document.getElementById('api-status');
    const card = document.getElementById('weather-card');
    
    // Pulse animation for the dot
    if(dot) {
        gsap.to(dot, { 
            opacity: 0.2, 
            duration: 0.8, 
            yoyo: true, 
            repeat: -1, 
            ease: "power1.inOut" 
        });
    }

    // Hover effect to simulate data fetch
    if(card && statusText && dot) {
        card.addEventListener('mouseenter', () => {
            statusText.textContent = "FETCHING DATA...";
            statusText.style.color = "#00f3ff";
            dot.style.backgroundColor = "#00f3ff";
            dot.style.boxShadow = "0 0 10px #00f3ff";
        });

        card.addEventListener('mouseleave', () => {
            setTimeout(() => {
                statusText.textContent = "API ACTIVE";
                statusText.style.color = "#22c55e";
                dot.style.backgroundColor = "#22c55e";
                dot.style.boxShadow = "0 0 10px #22c55e";
            }, 500);
        });
    }
}

// ============================================
// 3. PAGE SPECIFIC ANIMATIONS
// ============================================
function initPageAnimations() {
    // Stagger the gallery images specifically
    const galleryImages = document.querySelectorAll('.gallery-item');
    if(galleryImages.length > 0) {
        ScrollTrigger.batch(galleryImages, {
            onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
            start: "top 85%"
        });
        
        // Initial set state for batch
        gsap.set(galleryImages, { opacity: 0, y: 30 });
    }
}

// Run functions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initPreloader(); // <--- This function call fixes the stuck screen
    initWeatherWidget();
    initPageAnimations();
});