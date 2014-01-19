var g_scene;
var g_keyboardIds = { w: 87, s: 83, a: 65, d:68, q: 81, e: 69, space: 32};
var g_asteroids = new Array();
var g_ship;
var g_light;
var g_light2;
var g_camera;
var g_small;
var g_large;
var g_mouseX;
var g_mouseY;
var g_lasers = [];
var g_maxSize = 234;

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
		
		//skybox
		/*var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, g_scene);
		var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", g_scene);
		skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("Assets/skybox", g_scene);
		skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
		skyboxMaterial.backFaceCulling = false;
		skybox.material = skyboxMaterial;*/
		
		g_scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
		g_scene.fogDensity = 0.01;
        g_scene.clearColor = new BABYLON.Color4(0,0,0,0.0000000000000001); 
		
		
        //load models
        BABYLON.SceneLoader.ImportMesh("ship", "models/scene/", "scene.babylon", g_scene, function (newMeshes) { g_ship = newMeshes[0]; g_camera.target = g_ship.position = new BABYLON.Vector3(0, 0, 0); g_ship = new Ship(1, 1, 1, 1, 1, 1, g_ship); g_ship.mesh.scaling.x = .2; g_ship.mesh.scaling.y = .2; g_ship.mesh.scaling.z = .2; g_camera.setPosition(new BABYLON.Vector3(0, 0, -50));});
        BABYLON.SceneLoader.ImportMesh("asteroid0", "models/scene/", "scene.babylon", g_scene, function (newMeshes) { g_small = newMeshes[0]; g_small.position = new BABYLON.Vector3(-250, -10, -10); });
        BABYLON.SceneLoader.ImportMesh("asteroid1", "models/scene/", "scene.babylon", g_scene, function (newMeshes) { g_large = newMeshes[0]; g_large.position = new BABYLON.Vector3(10, 10, 250); g_large.scaling.x = .2; g_large.scaling.y = .2; g_large.scaling.z = .2; makeAsteroid(20);});
        //Adding of the Arc Rotate Camera
       // g_camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, new BABYLON.Vector3.Zero(), g_scene);
       //g_scene.activeCamera.attachControl(canvas);
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

function updateAsteroids()
{
    console.log(g_asteroids.length);
    
    for(var index = 0; index < g_asteroids.length; index++)
    {
        //console.log(g_asteroids[index].mesh.position.x + " " + g_asteroids[index].mesh.position.y + " " + g_asteroids[index].mesh.position.z);
        //console.log(g_asteroids[index].vX + " " + g_asteroids[index].vY + " " + g_asteroids[index].vZ);
        g_asteroids[index].mesh.position.x += g_asteroids[index].vX;
        g_asteroids[index].mesh.position.y += g_asteroids[index].vY;
        g_asteroids[index].mesh.position.z += g_asteroids[index].vZ;
        
        if(g_asteroids[index].mesh.position.x > g_maxSize || g_asteroids[index].mesh.position.y > g_maxSize || g_asteroids[index].mesh.position.z > g_maxSize)
        {
            g_asteroids[index].mesh.dispose(false);
            g_asteroids.splice(index, 1);
            makeAsteroid(1);
        }
        
        else if(g_asteroids[index].mesh.position.x < -g_maxSize || g_asteroids[index].mesh.position.y < -g_maxSize || g_asteroids[index].mesh.position.z < -g_maxSize)
        {    
            g_asteroids[index].mesh.dispose(false);
            g_asteroids.splice(index, 1);
            makeAsteroid(1);
        }
    }
}

function gameLoop()
{
    updateAsteroids();
    g_scene.render();
}

function moveShip(ship, keyCode)
{
    switch(keyCode)
    {
        case g_keyboardIds.w:
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
		
		case g_keyboardIds.space:
			BABYLON.SceneLoader.ImportMesh("laser", "models/scene/", "scene.babylon", g_scene, function (newMeshes) { var newLaser = new Laser(new Laser((canvas.width/2)-g_mouseX)/(canvas.width/2)*-1, ((canvas.height/2)-mouseY)/(canvas.height/2), 1, newLaser); g_lasers.push(newLaser)});
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
/*canvas.onclick = function () 
{
	var lasers = [];
	BABYLON.SceneLoader.ImportMesh("laser", "models/scene/", "scene.babylon", g_scene, function (newMeshes) { var newLaser = new Laser(new Laser((canvas.width/2)-g_mouseX)/(canvas.width/2)*-1, ((canvas.height/2)-mouseY)/(canvas.height/2), 1, newLaser); lasers.push(newLaser)});
}*/
//Handles mouse events
function mouseEvent(event) 
{
	var thetaX = 0;
	var thetaY = -Math.PI/2;
	var mouseX = event.clientX;
	var mouseY = event.clientY;
	var yFollow;
	var xFollow;
	g_mouseX = event.clientX;
	g_mouseY = event.clientY;
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

function makeAsteroid(amount)
{
    // Box with 600 x 600 x 600
    for(var index = 0; index < amount; index++)
    {
        BABYLON.SceneLoader.ImportMesh("asteroid1", "models/scene/", "scene.babylon", g_scene, function (newMeshes) 
        { 
            var x, y, z;

            x = getRandomNumber(-100, 100);
            y = getRandomNumber(-100, 100);
            z = getRandomNumber(-100, 100);

            var vX = (getRandomNumber(-1, 1) - 1) / 2;
            var vY = (getRandomNumber(-1, 1) - 1) / 2;
            var vZ = (getRandomNumber(-1, 1) - 1) / 2;
            newMeshes[0].position = new BABYLON.Vector3(x, y, z); 
            newMeshes[0].scaling.x = .15; 
            newMeshes[0].scaling.y = .15; 
            newMeshes[0].scaling.z = .15; 
            g_asteroids.push(new Asteroid(vX, vY, vZ, x, y, z, newMeshes[0]));
        });
    }
}

// Returns random number between iMin and iMax, include iMin and iMax
function getRandomNumber(iMin, iMax)
{
    if(iMax < iMin)
    {
        var temp = iMax;
        iMax = iMin;
        iMin = temp;
    }
    
    return Math.floor((Math.random() * ((iMax + 1) - iMin)) + iMin);
}