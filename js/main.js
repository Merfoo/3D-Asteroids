// Get the Canvas element from our HTML below
var canvas;

// Load BABYLON 3D engine and set the root directory
var engine;

//Create a new scene with a camera (mandatory), a light (better) and a sphere (to see the origin)
var scene;

// Creating a camera looking to the zero point (0,0,0)
var camera;

// Creating a omnidirectional light
var light0;

// Creating a sphere of size 1, at 0,0,0
var origin;
    
function init()
{   
    // Get the Canvas element from our HTML below
    canvas = document.getElementById("renderCanvas");

    // Load BABYLON 3D engine and set the root directory
    engine = new BABYLON.Engine(canvas, true);

    //Create a new scene with a camera (mandatory), a light (better) and a sphere (to see the origin)
    scene = new BABYLON.Scene(engine);

    // Creating a camera looking to the zero point (0,0,0)
    camera = new BABYLON.ArcRotateCamera("Camera", 1, 0.8, 10, new BABYLON.Vector3(0, 0, 0), scene);

    // Creating a omnidirectional light
    light0 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 0, 10), scene);
    
    // Creating a sphere of size 1, at 0,0,0
    origin = BABYLON.Mesh.CreateSphere("origin", 10, 1.0, scene);

    // Attach the camera to the scene
    scene.activeCamera.attachControl(canvas);
    
    // Once the scene is loaded, just register a render loop to render it
    engine.runRenderLoop(function () {
        scene.render();
    });
}