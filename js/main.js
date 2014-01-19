var g_scene;
var g_keyboardIds = { w: 87, s: 83, a: 65, d:68, q: 81, e: 69};
var g_asteroids = new Array();
var g_ship;
var g_light;
var g_light2;
var g_camera;
var g_small;
var g_large;

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
        g_light = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(0, -1, 0), g_scene);
        g_light2 = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(0, 1, 0), g_scene);

        //Adding of the Arc Rotate Camera
        g_camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, new BABYLON.Vector3.Zero(), g_scene);

        //load models
        BABYLON.SceneLoader.ImportMesh("ship", "models/scene/", "scene.babylon", g_scene, function (newMeshes) { g_ship = newMeshes[0]; g_camera.target = g_ship.position = new BABYLON.Vector3(0, 0, 0); g_ship = new Ship(1, 1, 1, 1, 1, 1, g_ship); g_camera.setPosition(new BABYLON.Vector3(0, 0, -100)) });
        BABYLON.SceneLoader.ImportMesh("asteroid0", "models/scene/", "scene.babylon", g_scene, function (newMeshes) { g_small = newMeshes[0]; g_small.position = new BABYLON.Vector3(-250, -10, -10); });
        BABYLON.SceneLoader.ImportMesh("asteroid1", "models/scene/", "scene.babylon", g_scene, function (newMeshes) { g_large = newMeshes[0]; g_large.position = new BABYLON.Vector3(10, 10, 250); });

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
		canvas.addEventListener("mousemove", mouseEvent, true);
    } 
};

function gameLoop()
{
    g_scene.render();
}

function moveShip(ship, keyCode)
{
    switch(keyCode)
    {
        case g_keyboardIds.w:
            console.log(ship.mesh.position.z + " " + g_ship.vY)
            ship.mesh.position.z += g_ship.vY;
            break;
            
        case g_keyboardIds.s:
            ship.mesh.position.z -= g_ship.vY;
            break;
    
        case g_keyboardIds.a:
            ship.mesh.position.x -= g_ship.vX;
            break;
    
        case g_keyboardIds.d:
            ship.mesh.position.x += g_ship.vX;
            break;
            
        case g_keyboardIds.q:
            ship.mesh.rotation.x -= g_ship.rX * Math.PI / 180;
            break;
            
        case g_keyboardIds.e:
            ship.mesh.rotation.x += g_ship.rX * Math.PI / 180;
            break;
        default:
            break;
    }
}
function rotateShip (ship, thetaX, thetaY, xFollow, yFollow) 
{
	ship.mesh.rotation.y = thetaX;
	ship.mesh.rotation.x = thetaY; 
	
	ship.mesh.position.y += yFollow*g_ship.vY; 
	ship.mesh.position.x += xFollow*g_ship.vX; 

}

// Handles keyboard events
function keyboardEvent(event) 
{    
    if (event.type == "keydown")
    {
        var keyCode = event.keyCode;
        moveShip(g_ship, keyCode);
    }
}

//Handles mouse events
function mouseEvent(event) 
{
	var thetaX = 0;
	var thetaY = -Math.PI/2;
	var mouseX = event.clientX;
	var mouseY = event.clientY;
	var ystuff;
	var xstuff;
	var zstuff;
	if(mouseX < canvas.width/2) 
	{
		thetaX = ((canvas.width/2)-mouseX)/(canvas.width/2)*(-Math.PI/2);
	}
	else
	{
		thetaX = (mouseX-(canvas.width/2))/(canvas.width/2)*(Math.PI/2);
	}
	
	thetaY = ((canvas.height)-mouseY)/(canvas.height)*(-Math.PI);
	
	xFollow = ((canvas.width/2)-mouseX)/(canvas.width/2)*-1;
	
	yFollow = ((canvas.height/2)-mouseY)/(canvas.height/2);

	rotateShip(g_ship,thetaX, thetaY, xFollow, yFollow);
}