/* global THREE WebVRManager animateSnow */

// Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
// Only enable it if you actually need to.
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0x2e4aa5);
renderer.setPixelRatio(window.devicePixelRatio);

// Append the canvas element created by the renderer to document body element.
document.body.appendChild(renderer.domElement);

// Create a three.js scene.
const scene = new THREE.Scene();

// Create a three.js camera.
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

const controls = new THREE.VRControls(camera);
controls.standing = true;
controls.standing = true;

// Apply VR stereo rendering to renderer.
const effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

// For high end VR devices like Vive and Oculus, take into account the stage
// parameters provided.
setupStage();

// Create a VR manager helper to enter and exit VR mode.
const params = {
  hideButton: false, // Default: false.
  isUndistorted: false // Default: false.
};
const manager = new WebVRManager(renderer, effect, params);

// Create 3D objects.
const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);

// Position cube mesh to be right in front of you.
cube.position.set(0, controls.userHeight, -3);

// Add cube mesh to your three.js scene
scene.add(cube);

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);

// Request animation frame loop function
let lastRender = 0;
let vrDisplay;

function animate(timestamp) {
  const delta = Math.min(timestamp - lastRender, 500);
  lastRender = timestamp;

  // Apply rotation to cube mesh
  cube.rotation.y += delta * 0.0006;

  animateSnow();

  controls.update();
  // Render the scene through the manager.
  manager.render(scene, camera, timestamp);
  effect.render(scene, camera);

  vrDisplay.requestAnimationFrame(animate);
}

function onResize(e) {
  effect.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

// Get the HMD, and if we're dealing with something that specifies
// stageParameters, rearrange the scene.
function setupStage() {
  navigator.getVRDisplays().then(function(displays) {
    if (displays.length > 0) {
      vrDisplay = displays[0];
      vrDisplay.requestAnimationFrame(animate);
    }
  });
}
