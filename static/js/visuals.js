// ============================================
// THREE.JS (GRAVITATIONAL LENSING + OPEN CONSTELLATIONS)
// ============================================

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

    // --- MATERIALS ---
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

        // A. COLOR INTERPOLATION
        const targetColor = document.documentElement.classList.contains('mode-red') ? redModeColor : baseColor;
        
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
            if(window.starState.speed < 0.05) gsap.to(window.starState, { speed: 0.05, duration: 2 }); 
        },
        onLeaveBack: () => { 
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