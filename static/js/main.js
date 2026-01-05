// ============================================
// MAIN INITIALIZATION
// ============================================

function initAll() {
    // UI & Dom Injection
    injectGlobalElements();
    
    // Core Visuals & Animation
    animateEntrance();
    initThreeJS(); 
    initScrollAnimations();
    
    // UI Logic
    initAudio();
    initContactReveal(); 
    initModalLogic(); 
    initSkillShow(); 
    initImageModal(); 
    initTimeUpdate(); 
    
    // Interaction & Physics
    // NOTE: initSmoothScroll creates window.lenis used by initPageTransitions
    initSmoothScroll(); 
    init3DTilt(); 
    initMagneticDock();
    initMagneticFields(); 
    initKineticType(); 
    initMouseParallax(); 
    initHolographicCards(); 
    initKeyboardControls(); 
    
    // Navigation (Must run after initSmoothScroll)
    initPageTransitions(); 

    // Final Refresh
    ScrollTrigger.refresh();
}

if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initAll); } 
else { initAll(); }