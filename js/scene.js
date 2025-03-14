import * as THREE from 'three';

const scene = new THREE.Scene();

// 🔥 Set up Orthographic Camera (for 2D effects)
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
camera.position.z = 1;

// 🔥 Create WebGL Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// 🔥 Append renderer to `.crt-overlay`, NOT `body`
const crtOverlay = document.querySelector('.crt');
crtOverlay.appendChild(renderer.domElement);

const scanlineShader = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0.0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        opacity: { value: 1 }, // Adjust opacity of scanlines
        lineSpacing: { value: 8.0 }, // Distance between lines
        lineColor: { value: new THREE.Color(0xff0000) } // Red color (Hex)
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        uniform float opacity;
        uniform float lineSpacing;
        varying vec2 vUv;
         uniform vec3 lineColor;

        void main() {
            float line = mod(vUv.y * resolution.y + time * 40.0, lineSpacing);
            float intensity = smoothstep(0.8, 1.0, line); // Sharp edges
            gl_FragColor = vec4(lineColor, intensity * opacity);
        }
    `,
    transparent: true
});

scanlineShader.uniforms.lineColor.value.setHex(0xFFFFFF); // Change to Green (RGB)


// Fullscreen plane
const geometry = new THREE.PlaneGeometry(2, 2);
const mesh = new THREE.Mesh(geometry, scanlineShader);
scene.add(mesh);

// Animation loop
function animate() {
    scanlineShader.uniforms.time.value += 0.015;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();

// Handle Resize
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    scanlineShader.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
});
