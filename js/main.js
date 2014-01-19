var g_scene;
var g_keyboardIds = { w: 87, s: 83, a: 65, d:68 };
var g_asteroids = new Array();
var g_ship = new Ship(0, 0, 0, 1, 1, 1, 0, 0, 0);
var g_shipTest = new Ship(0, 0, 0, 0.5, 0.5, 0.5, 0, 0, 0);
var g_light;
var g_camera;

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
        //Creation of the scene 
        g_scene = new BABYLON.Scene(engine);

        //Adding of the light on the scene
        g_light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(10, 10, -30), g_scene);

        //Adding of the Arc Rotate Camera
        g_camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, new BABYLON.Vector3.Zero(), g_scene);
        BABYLON.SceneLoader.ImportMesh("", "models/scene/", "scene.babylon", g_scene, function (newMeshes) {g_ship = newMeshes[0]; g_ship.position = new BABYLON.Vector3(-10,0,0);});
        
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
            ship.position.y += g_shipTest.vY;
            break;
            
        case g_keyboardIds.s:
            ship.position.y -= g_shipTest.vY;
            break;
    
        case g_keyboardIds.a:
            ship.position.x -= g_shipTest.vX;
            break;
    
        case g_keyboardIds.d:
            ship.position.x += g_shipTest.vX;
            break;
        default:
            break;
    }
}

// Handles keyboard events
function keyboardEvent(event) 
{
    var keyCode = event.keyCode;
    
    if (event.type == "keydown")
    {
        moveShip(g_ship, keyCode);
    }
}