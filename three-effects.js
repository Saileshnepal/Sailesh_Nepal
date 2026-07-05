// Three.js background effects
(function() {
    // Import Three.js
    const THREE = window.THREE;

    // Canvas setup
    const canvas = document.getElementById('bg-canvas');
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x6c63ff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0xff6b6b, 1);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);
    
    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    const scaleArray = new Float32Array(particlesCount);
    
    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Position
        posArray[i] = (Math.random() - 0.5) * 100;
        posArray[i + 1] = (Math.random() - 0.5) * 100;
        posArray[i + 2] = (Math.random() - 0.5) * 100;
        
        // Scale
        scaleArray[i / 3] = Math.random();
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));
    
    // Material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.1,
        sizeAttenuation: true,
        transparent: true,
        color: 0x6c63ff,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    // Particles mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Floating objects
    const objectsGroup = new THREE.Group();
    scene.add(objectsGroup);
    
    // Create geometric objects
    const geometries = [
        new THREE.TetrahedronGeometry(1, 0),
        new THREE.IcosahedronGeometry(1, 0),
        new THREE.OctahedronGeometry(1, 0),
        new THREE.DodecahedronGeometry(1, 0)
    ];
    
    // Create materials with different colors
    const materials = [
        new THREE.MeshPhongMaterial({ color: 0x6c63ff, flatShading: true }),
        new THREE.MeshPhongMaterial({ color: 0xff6b6b, flatShading: true }),
        new THREE.MeshPhongMaterial({ color: 0x4a45b1, flatShading: true }),
        new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true })
    ];
    
    // Create multiple objects and add them to the scene
    for (let i = 0; i < 20; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        
        const object = new THREE.Mesh(geometry, material);
        
        // Random position
        object.position.x = (Math.random() - 0.5) * 60;
        object.position.y = (Math.random() - 0.5) * 60;
        object.position.z = (Math.random() - 0.5) * 60;
        
        // Random rotation
        object.rotation.x = Math.random() * Math.PI;
        object.rotation.y = Math.random() * Math.PI;
        object.rotation.z = Math.random() * Math.PI;
        
        // Random scale
        const scale = Math.random() * 0.5 + 0.5;
        object.scale.set(scale, scale, scale);
        
        // Add custom properties for animation
        object.userData.rotationSpeed = {
            x: (Math.random() - 0.5) * 0.01,
            y: (Math.random() - 0.5) * 0.01,
            z: (Math.random() - 0.5) * 0.01
        };
        
        object.userData.floatSpeed = (Math.random() - 0.5) * 0.01;
        object.userData.floatDistance = Math.random() * 2;
        object.userData.initialY = object.position.y;
        object.userData.floatOffset = Math.random() * Math.PI * 2;
        
        objectsGroup.add(object);
    }
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Smooth camera movement following mouse
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        
        camera.rotation.y += 0.05 * (targetX - camera.rotation.y);
        camera.rotation.x += 0.05 * (targetY - camera.rotation.x);
        
        // Rotate particles
        particlesMesh.rotation.x += 0.0005;
        particlesMesh.rotation.y += 0.0005;
        
        // Animate floating objects
        objectsGroup.children.forEach((object) => {
            // Rotation
            object.rotation.x += object.userData.rotationSpeed.x;
            object.rotation.y += object.userData.rotationSpeed.y;
            object.rotation.z += object.userData.rotationSpeed.z;
            
            // Floating motion
            object.position.y = object.userData.initialY + 
                Math.sin(Date.now() * 0.001 + object.userData.floatOffset) * 
                object.userData.floatDistance;
        });
        
        // Render
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Scroll parallax effect
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        particlesMesh.rotation.x = scrollY * 0.0005;
        particlesMesh.rotation.y = scrollY * 0.0005;
        
        objectsGroup.rotation.y = scrollY * 0.0002;
        objectsGroup.position.z = scrollY * 0.01;
    });
})();