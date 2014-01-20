var g_scene;
var g_keyboardIds = { w: 87, s: 83, a: 65, d:68, q: 81, e: 69, space: 32};
var g_constAsteroids = { maxX: 100, maxY: 100, maxZ: 100, maxVX: 100, maxVY: 100, maxVZ: 100 };
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
var g_shipInited = false;
var g_timeInit = 0;
var g_timeEnd = 0;
var g_gameEnded = false;
var g_fountain;
var g_particleSystem;

window.onload = function(){
    var canvas = document.getElementById("canvas");
    g_timeInit = new Date().getTime() / 1000;

    // Check support
    if (!BABYLON.Engine.isSupported())
        window.alert('Browser not supported');
    
    else 
    {
        // Babylon
        var engine = new BABYLON.Engine(canvas, true);

        //Creation of the scene 
        g_scene = new BABYLON.Scene(engine);

        //Adding of the light on the scene
        g_light = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(0, -1, 0), g_scene);
        g_light2 = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(0, 1, 0), g_scene);

        //Adding of the Arc Rotate Camera
        g_camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, new BABYLON.Vector3.Zero(), g_scene);
        
        // Add fog
        g_scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
        g_scene.fogDensity = 0.01;
        
        // Fountain
        g_fountain = BABYLON.Mesh.CreateBox("fountain", 1.0, g_scene);
        g_particleSystem = new BABYLON.ParticleSystem("particles", 2000, g_scene);
        g_particleSystem.particleTexture = new BABYLON.Texture("images/Flare.png", g_scene);
        
        // Where the particles come from
        g_particleSystem.emitter = g_fountain;
        g_particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0);    // Starting from
        g_particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0);     // to...
        
        // Color of all particles
        g_particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
        g_particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
        g_particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
        
        // Size of each particle (random between...
        g_particleSystem.minSize = 0.1;
        g_particleSystem.maxSize = 0.5;
        
        // Life time of each particle (random between ...
        g_particleSystem.minLifeTime = 0.3;
        g_particleSystem.maxLifeTime = 1.5;
        
        // Emission rate
        g_particleSystem.emitRate = 3000;
        
        // Blend mode: BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        g_particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        
        // No gravity yo...
        
        // Direction of each particle after it has been emitted
        g_particleSystem.direction1 = new BABYLON.Vector3(-3, 8, 2);
        g_particleSystem.direction2 = new BABYLON.Vector3(3, 8, -2);
        
        // Angular speed, in radians
        g_particleSystem.minAngularSpeed = 0;
        g_particleSystem.maxAngularSpeed = Math.PI;
        
        g_particleSystem.targetStopDuration = 3;
        
        // Speed
        g_particleSystem.minEmitPower = 1;
        g_particleSystem.maxEmitPower = 3;
        g_particleSystem.updateSpeed = 0.005;
        
        // Dispose
        g_particleSystem.disposeOnStop = true;
        
        // Start the particle system
        g_particleSystem.start();
       
        // Load models
        BABYLON.SceneLoader.ImportMesh("ship", "models/scene/", "scene.babylon", g_scene, function (newMeshes) 
        { 
            g_ship = newMeshes[0]; 
            g_camera.target = g_ship.position = new BABYLON.Vector3(0, 0, 0); 
            g_fountain.position = g_ship.position; 
            g_fountain.rotation = g_ship.rotation;
            g_ship = new Ship(1, 1, 1, 1, 1, 1, g_ship); 
            g_ship.mesh.scaling.x = .2; 
            g_ship.mesh.scaling.y = .2; 
            g_ship.mesh.scaling.z = .2; 
            g_camera.setPosition(new BABYLON.Vector3(0, 0, -50));
        });
        
//        BABYLON.SceneLoader.ImportMesh("asteroid0", "models/scene/", "scene.babylon", g_scene, function (newMeshes)
//        { 
//            g_small = newMeshes[0];
//            g_small.position = new BABYLON.Vector3(100000, 0, 0); 
//            g_small.scaling.x = 1; 
//            g_small.scaling.y = 1; 
//            g_small.scaling.z = 1; 
//        });
        
        BABYLON.SceneLoader.ImportMesh("asteroid1", "models/scene/", "scene.babylon", g_scene, function (newMeshes) 
        { 
            g_large = newMeshes[0];
            g_large.position = new BABYLON.Vector3(100000, 0, 0);
            g_large.scaling.x = .2; 
            g_large.scaling.y = .2; 
            g_large.scaling.z = .2; 
            makeAsteroid(111);
        });
        
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
    for(var index = 0; index < g_asteroids.length; index++)
    {
        g_asteroids[index].mesh.position.x += g_asteroids[index].vX;
        g_asteroids[index].mesh.position.y += g_asteroids[index].vY;
        g_asteroids[index].mesh.position.z += g_asteroids[index].vZ;

        var xShip = g_ship.mesh.position.x;
        var yShip = g_ship.mesh.position.y;
        var zShip = g_ship.mesh.position.z;;
        
        var x = getRandomNumber(-g_constAsteroids.maxX, g_constAsteroids.maxX) + xShip;
        var y = getRandomNumber(-g_constAsteroids.maxY, g_constAsteroids.maxY) + yShip;
        var z = getRandomNumber(-g_constAsteroids.maxZ, g_constAsteroids.maxZ) + zShip;
             
        if(g_asteroids[index].mesh.position.x > g_maxSize + xShip || g_asteroids[index].mesh.position.y > g_maxSize + yShip || g_asteroids[index].mesh.position.z > g_maxSize + zShip)
        {
            g_asteroids[index].mesh.position.x = x;
            g_asteroids[index].mesh.position.y = y;
            g_asteroids[index].mesh.position.z = z;
        }
        
        else if(g_asteroids[index].mesh.position.x < -g_maxSize + xShip || g_asteroids[index].mesh.position.y < -g_maxSize + yShip || g_asteroids[index].mesh.position.z < -g_maxSize + zShip)
        {    
            g_asteroids[index].mesh.position.x = x;
            g_asteroids[index].mesh.position.y = y;
            g_asteroids[index].mesh.position.z = z;
        }
    }
}
function gameLoop()
{
    if(!g_gameEnded)
    {
        updateAsteroids();
        g_particleSystem.start();
        
        for(var i = 0; i < g_asteroids.length; i++) 
        {
            if(g_ship.mesh.intersectsPoint(g_asteroids[i].mesh.position)) 
            {
                g_ship.health -= 10;
                document.getElementById("health").innerHTML="Health: "+g_ship.health;

                if(g_ship.health < 0)
                {
                    g_ship.health = 0;
                    g_timeEnd = new Date().getTime() / 1000;
                    alert("GAME OVER: Took you " + Math.floor(g_timeEnd - g_timeInit) + " seconds to die.");
                    g_gameEnded = true;
                    location.reload();
                    break;
                }
            }
        }
        
        g_scene.render();
    }
}

function moveShip(ship, keyCode)
{
    switch(keyCode)
    {
        case g_keyboardIds.w:
            ship.mesh.position.z += g_ship.vY;
            break;
            
        case g_keyboardIds.s:
            ship.mesh.position.z -= g_ship.vY * 2;
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
    for(var index = 0; index < amount; index++)
    {
        var x = getRandomNumber(-g_constAsteroids.maxX, g_constAsteroids.maxX);
        var y = getRandomNumber(-g_constAsteroids.maxY, g_constAsteroids.maxY);
        var z = getRandomNumber(-g_constAsteroids.maxZ, g_constAsteroids.maxZ);

        var vX = (getRandomNumber(-10, 10) - 1) / 8.0;
        var vY = (getRandomNumber(-10, 10) - 1) / 8.0;
        var vZ = (getRandomNumber(-10, 10) - 1) / 8.0;
        
        var newMesh = g_large.clone("0");

        newMesh.position = new BABYLON.Vector3(x, y, z); 
        newMesh.scaling.x = (Math.random() * 0.2) + 0.1;
        newMesh.scaling.y = (Math.random() * 0.2) + 0.1; 
        newMesh.scaling.z = (Math.random() * 0.2) + 0.1;
        g_asteroids.push(new Asteroid(vX, vY, vZ, x, y, z, newMesh));
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