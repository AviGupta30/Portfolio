console.log("Initializing Spotify Clone Module...");

// ============================================
// PRELOADER & ANIMATIONS
// ============================================
function initSpotify() {
    // 1. Preloader Logic
    const counter = document.querySelector('.counter');
    const preloader = document.querySelector('.preloader');

    if (counter && preloader) {
        let count = { val: 0 };
        
        // Slightly faster preloader for this lighter page
        gsap.to(count, {
            val: 100,
            duration: 0.8,
            ease: "power2.out",
            onUpdate: () => {
                counter.innerText = Math.floor(count.val);
            },
            onComplete: () => {
                gsap.to(preloader, {
                    yPercent: -100,
                    duration: 0.8,
                    ease: "power4.inOut"
                });
            }
        });
    }

    // 2. Reveal Animations
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate Text Sections
    gsap.utils.toArray('.reveal').forEach(elem => {
        gsap.fromTo(elem, 
            { y: 30, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: elem,
                    start: "top 85%"
                },
                y: 0, 
                opacity: 1, 
                duration: 1, 
                ease: "power3.out"
            }
        );
    });

    // Animate Gallery Images
    const galleryImages = document.querySelectorAll('.gallery-item, .feature-img');
    if(galleryImages.length > 0) {
        gsap.fromTo(galleryImages, 
            { scale: 0.95, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: ".details-grid",
                    start: "top 80%"
                },
                scale: 1, 
                opacity: 1, 
                duration: 0.8, 
                stagger: 0.1
            }
        );
    }
}

document.addEventListener('DOMContentLoaded', initSpotify);