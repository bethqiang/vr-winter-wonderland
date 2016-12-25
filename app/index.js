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

var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
hemiLight.position.set(0, 500, 0);
scene.add(hemiLight);

var dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(-1, 0.75, 1);
scene.add(dirLight);

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

// Add ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(10000, 10000),
  new THREE.MeshBasicMaterial({ color: 0xeeeeee })
);
ground.rotation.x -= Math.PI / 2;
scene.add(ground);

const JSONLoader = new THREE.JSONLoader();
JSONLoader.load('../img/penguin/penguin.js', function(geometry, materials) {
  const material = new THREE.MeshFaceMaterial(materials);
  const object = new THREE.Mesh(geometry, material);
  object.position.y = 1;
  object.position.z = -2;
  object.rotation.y -= Math.PI / 2;
  object.scale.set(0.05, 0.05, 0.05);
  scene.add(object);
});

JSONLoader.load('../img/trees/winter-trees.js', function(geometry, materials) {
  const material = new THREE.MeshFaceMaterial(materials);
  const object = new THREE.Mesh(geometry, material);
  object.position.y = 3.75;
  object.position.z = -50;
  object.position.x = -10;
  object.rotation.y -= Math.PI / 2;
  object.scale.set(2, 2, 2);
  scene.add(object);
});

window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);

// Request animation frame loop function
let vrDisplay;

function animate() {

  animateSnow();

  controls.update();
  // Render the scene through the manager.
  manager.render(scene, camera);
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
