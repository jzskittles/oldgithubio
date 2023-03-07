import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import SketchfabIntegration from "./SketchfabIntegration.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const GUI = dat.GUI;

const sketchfabIntegration = new SketchfabIntegration();
sketchfabIntegration.checkToken();

// Init scene
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(1, 1, -2);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas"),
});
renderer.setSize(window.innerWidth, window.innerHeight);
const light = new THREE.DirectionalLight(0xffffff, 1);
scene.add(light);
light.position.set(1.7, 1, -1);

// Set up orbital camera controls.
let controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const gltfLoader = new GLTFLoader();
gltfLoader.load('./assets/models/shiba/scene.gltf', (gltfScene) => {
  scene.add(gltfScene.scene);
  console.log("added shiba")
})

// Render loop
function update() {
  requestAnimationFrame(update);
  renderer.render(scene, camera);
}
update();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);

// Set up GUI controls
const gui = new GUI({ width: 300 });

// Add Sketchfab integration buttons to GUI
const sketchfabFolder = gui.addFolder('Sketchfab');
const sfParams = {
  "Sketchfab URL": '',
};

// If we detected a token, then show the text field for the user to paste in a URL
let loginButtonName = 'Login to Sketchfab';
if (sketchfabIntegration.token != null) {
  let lastValue;
  sketchfabFolder.add(sfParams, 'Sketchfab URL').onChange(async function (value) {
    if (lastValue != value) {
      lastValue = value;
      sketchfabIntegration.fetchAndDisplayModel(value, scene);
    }
  });
  loginButtonName = 'Re-login to Sketchfab';
}

const sketchfabOptions = {};
sketchfabOptions[loginButtonName] = sketchfabIntegration.authenticate;
sketchfabFolder.add(sketchfabOptions, loginButtonName);
sketchfabFolder.open();