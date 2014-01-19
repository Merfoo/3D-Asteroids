var g_scene;
var g_keyboardIds = { w: 87, s: 83, a: 65, d:68 };
var g_asteroids = new Array();
var g_ship = Ship(0, 0, 0, 1, 1, 1, 0, 0, 0);
var g_shipTest = new Ship(0, 0, 0, 0.5, 0.5, 0.5, 0, 0, 0);

window.onload = function(){
    var canvas = document.getElementById("canvas");

    // Check support
    if (!BABYLON.Engine.isSupported())
        window.alert('Browser not supported');
    
    else 
    {
        // Babylon
        var engine = new BABYLON.Engine(canvas, true);

        //Creating scene (in "scene.js")
        g_scene = createScene(engine);

        g_scene.activeCamera.attachControl(canvas);


        // Once the scene is loaded, just register a render loop to render it
        engine.runRenderLoop(function () {
            gameLoop();
        });

        // Resize
        window.addEventListener("resize", function () {
            engine.resize();
        });
        
        window.addEventListener("keydown", keyboardEvent, true);
        window.addEventListener("keyup", keyboardEvent, true);
    } 
};

﻿function createScene(engine) {
    //Creation of the scene 
    var scene = new BABYLON.Scene(engine);

    //Adding of the light on the scene
    var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(10, 10, -30), scene);

    //Adding of the Arc Rotate Camera
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, new BABYLON.Vector3.Zero(), scene);

    // MESHES
    //------------

    //Creation of a box
    //(name of the box, size, scene)
    g_ship = BABYLON.Mesh.CreateBox("Box", 6.0, scene);
    
    //Creation of a smaller box to represent the center of the scene
    var center = BABYLON.Mesh.CreateBox("Box", 1.0, scene);


    //Positioning the elements
    g_ship.position = new BABYLON.Vector3(-10,0,0);//Positionnign by a vector
    
    return scene;
}

function gameLoop()
{
    //box.position.x += 10;
    g_scene.render();
}

function moveShip(ship, keyCode)
{
    switch(keyCode)
    {
        case g_keyboardIds.w:
            ship.position.y += g_shipTest.vy;
            break;
            
        case g_keyboardIds.s:
            ship.position.y -= g_shipTest.vy;
            break;
    
        case g_keyboardIds.a:
            ship.position.x -= g_shipTest.vx;
            break;
    
        case g_keyboardIds.d:
            ship.position.x += g_shipTest.vx;
            break;
    }
}

// Handles keyboard events
function keyboardEvent(event) 
{
    var keyCode = event.keyCode;
    
    if (event.type == "keydown")
    {
        if (keyCode == g_keyboardIds.w || keyCode == g_keyboardIds.s || keyCode == g_keyboardIds.a || keyCode == g_keyboardIds.d)
        {
            moveShip(g_ship, keyCode);
        }  
    }
}