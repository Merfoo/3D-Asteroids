// Get the Canvas element from our HTML below
var canvas = document.getElementById("renderCanvas");

// Load BABYLON 3D engine and set the root directory
var engine = new BABYLON.Engine(canvas, true);

//Create a new scene with a camera (mandatory), a light (better) and a sphere (to see the origin)
var scene = new BABYLON.Scene(engine);

// Creating a camera looking to the zero point (0,0,0)
var camera = new BABYLON.ArcRotateCamera("Camera", 1, 0.8, 10, new BABYLON.Vector3(0, 0, 0), scene);

// Creating a omnidirectional light
var light0 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 0, 10), scene);

// Creating a sphere of size 1, at 0,0,0
var origin = BABYLON.Mesh.CreateSphere("origin", 10, 1.0, scene);

// Attach the camera to the scene
scene.activeCamera.attachControl(canvas);

// Once the scene is loaded, just register a render loop to render it
engine.runRenderLoop(function () {
    scene.render();
});