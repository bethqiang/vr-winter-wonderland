/* global THREE scene */

// Snowflake motion adapted from Seb Lee-Delisle's JSSnow
// https://github.com/sebleedelisle/live-coding-presentations/tree/master/2011/JSSnow

const TO_RADIANS = Math.PI / 180;

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
const texture = loader.load('../img/snowflake.png');
const pointsMaterial = new THREE.PointsMaterial({ color: 0xeeeeee, size: 2, map: texture, blending: THREE.AdditiveBlending, transparent: true });
const pointsSystem = new THREE.Points(points, pointsMaterial);
scene.add(pointsSystem);

function animateSnow() {
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
}
