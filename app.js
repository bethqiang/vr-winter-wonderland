/* global THREE WebVRManager */

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

// Snowflake motion adapted from Seb Lee-Delisle's JSSnow
// https://github.com/sebleedelisle/live-coding-presentations/tree/master/2011/JSSnow

var TO_RADIANS = Math.PI / 180;

THREE.Vector3.prototype.rotateX = function(angle){
  const cosRX = Math.cos(angle * TO_RADIANS);
  const sinRX = Math.sin(angle * TO_RADIANS);
  const tempy = this.y;
  const tempz = this.z;
  this.y = (tempy * cosRX) + (tempz * sinRX);
  this.z = (tempy * -sinRX) + (tempz * cosRX);
};

THREE.Vector3.prototype.rotateY = function(angle){
  const cosRY = Math.cos(angle * TO_RADIANS);
  const sinRY = Math.sin(angle * TO_RADIANS);
  const tempx = this.x;
  const tempz = this.z;
  this.x = (tempx * cosRY) + (tempz * sinRY);
  this.z = (tempx * -sinRY) + (tempz * cosRY);
};

function randomRange(min, max) {
  return ((Math.random() * (max - min)) + min);
}

// Add snowflakes to three.js scene
const points = new THREE.Geometry;
for (let i = 0; i < 2000; i++) {
  let point = new THREE.Vector3();
  point.x = THREE.Math.randFloatSpread(500);
  point.y = THREE.Math.randFloatSpread(500);
  point.z = THREE.Math.randFloatSpread(500);
  point.velocity = new THREE.Vector3(0, -Math.random(), 0);
  point.velocity.rotateY(randomRange(0, 360));
  point.velocity.rotateX(randomRange(-45, 45));
  points.vertices.push(point);
}
const loader = new THREE.TextureLoader();
const texture = loader.load('img/snowflake.png');
const pointsMaterial = new THREE.PointsMaterial({ color: 0xeeeeee, size: 2, map: texture, blending: THREE.AdditiveBlending, transparent: true });
const pointsSystem = new THREE.Points(points, pointsMaterial);
scene.add(pointsSystem);

// Request animation frame loop function
let lastRender = 0;
let vrDisplay;

function animate(timestamp) {
  const delta = Math.min(timestamp - lastRender, 500);
  lastRender = timestamp;

  // Apply rotation to cube mesh
  cube.rotation.y += delta * 0.0006;

  // Animate points
  // pointsSystem.rotation.y += 0.002;
  const vertices = pointsSystem.geometry.vertices;
  for (let i = 0; i < vertices.length; i++) {
    const v = vertices[i];
    if (v.y < -250) {
      v.y = 250;
      v.velocity.y = -Math.random();
    }
    if (v.x > 250) v.x = -250;
    else if (v.x < -250) v.x = 250;
    if (v.z > 250) v.z = -250;
    else if (v.z < -250) v.z = 250;

    v.velocity.y -= Math.random() * 0.0005;
    v.y += v.velocity.y;
    v.x += v.velocity.x;
    v.z += v.velocity.z;
  }
  pointsSystem.geometry.verticesNeedUpdate = true;

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
