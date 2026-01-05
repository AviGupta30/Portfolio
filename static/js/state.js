// ============================================
// GLOBAL STATE
// ============================================
console.log("Initializing Void Portfolio...");

// Register ScrollTrigger immediately
gsap.registerPlugin(ScrollTrigger);

// Shared state for Three.js and Keyboard controls
window.starState = { speed: 0.0005 };