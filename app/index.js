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

// Create a three.js light
const pointLight = new THREE.PointLight(0xffffff, 0.8);
// set position
pointLight.position.x = 0;
pointLight.position.y = 10;
pointLight.position.z = 0;
scene.add(pointLight);

var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

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

// Add snowman
const bottomSphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 20, 20),
  new THREE.MeshLambertMaterial({ color: 0xeeeeee })
);
bottomSphere.position.set(0, 1, -4);
scene.add(bottomSphere);

const middleSphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.4, 20, 20),
  new THREE.MeshLambertMaterial({ color: 0xeeeeee })
);
middleSphere.position.set(0, 1.8, -4);
scene.add(middleSphere);

const topSphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.3, 20, 20),
  new THREE.MeshLambertMaterial({ color: 0xeeeeee })
);
topSphere.position.set(0, 2.4, -4);
scene.add(topSphere);

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
