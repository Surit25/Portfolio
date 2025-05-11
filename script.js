// Three.js Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

camera.position.setZ(30);
camera.position.setY(5);

// Add fog to the scene
scene.fog = new THREE.FogExp2(0x000000, 0.01);

// Create multiple geometric shapes
const torusGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
const torusMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x2ecc71,
    wireframe: true,
    shininess: 100
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.z = -15;
scene.add(torus);

// Add floating crystals
const crystals = [];
for(let i = 0; i < 10; i++) {
    const crystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(Math.random() * 2 + 1),
        new THREE.MeshPhongMaterial({
            color: new THREE.Color(`hsl(${Math.random() * 360}, 70%, 50%)`),
            shininess: 100,
            transparent: true,
            opacity: 0.8
        })
    );
    crystal.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50
    );
    crystal.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
    );
    crystals.push(crystal);
    scene.add(crystal);
}

// Add a floating platform
const platformGeometry = new THREE.CylinderGeometry(15, 15, 1, 32, 1, false);
const platformMaterial = new THREE.MeshPhongMaterial({
    color: 0x3498db,
    shininess: 100,
    transparent: true,
    opacity: 0.6
});
const platform = new THREE.Mesh(platformGeometry, platformMaterial);
platform.position.y = -10;
scene.add(platform);

// Enhanced Lighting Setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Main spotlight
const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(0, 25, 0);
spotLight.angle = Math.PI / 4;
spotLight.penumbra = 0.1;
spotLight.decay = 2;
spotLight.distance = 200;
spotLight.castShadow = true;
scene.add(spotLight);

// Colored point lights
const colors = [0xff0000, 0x00ff00, 0x0000ff];
const pointLights = colors.map((color, index) => {
    const light = new THREE.PointLight(color, 1, 50);
    const angle = (index / colors.length) * Math.PI * 2;
    light.position.set(
        Math.cos(angle) * 20,
        5,
        Math.sin(angle) * 20
    );
    return light;
});
pointLights.forEach(light => scene.add(light));

// Add stars
function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
    scene.add(star);
}
Array(200).fill().forEach(addStar);

// Mouse movement effect
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

// Enhanced Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Smooth camera movement
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    camera.rotation.y += 0.05 * (targetX - camera.rotation.y);
    camera.rotation.x += 0.05 * (targetY - camera.rotation.x);

    // Rotate torus
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;

    // Animate crystals
    crystals.forEach((crystal, i) => {
        crystal.rotation.x += 0.01;
        crystal.rotation.y += 0.015;
        crystal.position.y += Math.sin(Date.now() * 0.001 + i) * 0.02;
    });

    // Animate platform
    platform.rotation.y += 0.005;
    platform.position.y = -10 + Math.sin(Date.now() * 0.001) * 2;

    // Animate point lights
    pointLights.forEach((light, i) => {
        const angle = Date.now() * 0.001 + (i * Math.PI * 2 / pointLights.length);
        light.position.x = Math.cos(angle) * 20;
        light.position.z = Math.sin(angle) * 20;
    });

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Initialize animations
animate();

// Skill bars animation
const skillLevels = document.querySelectorAll('.skill-level');
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.width = entry.target.parentElement.dataset.level || '0%';
        }
    });
}, observerOptions);

skillLevels.forEach(skill => observer.observe(skill));
