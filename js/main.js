var g_scene;
var g_keyboardIds = { w: 87, s: 83, a: 65, d:68, q: 81, e: 69, space: 32, m: 77};
var g_constAsteroids = { maxX: 225, maxY: 225, maxZ: 225};
var g_asteroids = new Array();
var g_ship;
var g_camera;
var g_large;
var g_maxSize = 300;
var g_timeInit = 0;
var g_timeEnd = 0;
var g_gameEnded = false;
var g_fountain;
var g_particleSystem;
var g_music = true;

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
        var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 1, 0), g_scene);
        light0.diffuse = new BABYLON.Color3(1, 1, 1);
        light0.specular = new BABYLON.Color3(1, 1, 1);
        light0.groundColor = new BABYLON.Color3(0, 0, 0);

        //Adding of the Arc Rotate Camera
        g_camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, new BABYLON.Vector3.Zero(), g_scene);
        
        // Add fog
        g_scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
        g_scene.fogDensity = 0.005;
        
        // Fountain
        g_fountain = BABYLON.Mesh.CreateBox("fountain", 1.0, g_scene);
        g_particleSystem = new BABYLON.ParticleSystem("particles", 2000, g_scene);
        g_particleSystem.particleTexture = new BABYLON.Texture("images/Flare.png", g_scene);
        
        // Where the particles come from
        g_particleSystem.emitter = g_fountain;
        g_particleSystem.minEmitBox = new BABYLON.Vector3(0, 0, -2);    // Starting from
        g_particleSystem.maxEmitBox = new BABYLON.Vector3(0, 5, 0);     // to...
        
        // Color of all particles
        g_particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
        g_particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
        g_particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
        
        // Size of each particle (random between...
        g_particleSystem.minSize = 0.1;
        g_particleSystem.maxSize = 0.5;
        
        // Life time of each particle (random between ...
        g_particleSystem.minLifeTime = 0.3;
        g_particleSystem.maxLifeTime = .7;
        
        // Emission rate
        g_particleSystem.emitRate = 30000;
        
        // Blend mode: BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        g_particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        
        // No gravity yo...
        
        // Direction of each particle after it has been emitted
        g_particleSystem.direction1 = new BABYLON.Vector3(-6, 8, 4);
        g_particleSystem.direction2 = new BABYLON.Vector3(6, 8, -4);
        
        // Angular speed, in radians
        g_particleSystem.minAngularSpeed = 0;
        g_particleSystem.maxAngularSpeed = Math.PI/4;
        
        g_particleSystem.targetStopDuration = 3;
        
        // Speed
        g_particleSystem.minEmitPower = 1;
        g_particleSystem.maxEmitPower = 3;
        g_particleSystem.updateSpeed = 0.005;
        
        // Dispose
        g_particleSystem.disposeOnStop = true;
        
        // Start the particle system
        g_particleSystem.start();
       
        // Attach the camera to the scene
        //g_scene.activeCamera.attachControl(canvas);
    
        // Load models
        BABYLON.SceneLoader.ImportMesh("ship", "models/scene/", "scene.babylon", g_scene, function (newMeshes) 
        { 
            g_ship = newMeshes[0]; 
            g_camera.target = g_ship.position = new BABYLON.Vector3(0, 0, 0);
            g_fountain.position = g_ship.position;
            g_fountain.rotation = g_ship.rotation;
            g_ship.scaling.x = .2; 
            g_ship.scaling.y = .2; 
            g_ship.scaling.z = .2; 
            g_ship = new Ship(1, 1, 1, 1, 1, 1, g_ship); 
            g_ship.head = BABYLON.Mesh.CreateBox("head", 3.0, g_scene);
            g_ship.head.parent = g_ship.mesh;
            g_ship.head.position.y = -100;
            g_ship.head.position.y = -100;
            g_camera.setPosition(new BABYLON.Vector3(0, 0, -50));
        });
        
        BABYLON.SceneLoader.ImportMesh("asteroid1", "models/scene/", "scene.babylon", g_scene, function (newMeshes) 
        { 
            g_large = newMeshes[0];
            g_large.position = new BABYLON.Vector3(100000, 0, 0);
            g_large.scaling.x = .2; 
            g_large.scaling.y = .2; 
            g_large.scaling.z = .2; 
        });
        
        g_scene.executeWhenReady(function(){
            initAsteroids(100);
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
        });
    } 
};

function updateAsteroids()
{
    for(var index = 0; index < g_asteroids.length; index++)
    {
        g_asteroids[index].mesh.rotation.x += g_asteroids[index].rX;
        g_asteroids[index].mesh.rotation.y += g_asteroids[index].rY;
        g_asteroids[index].mesh.rotation.z += g_asteroids[index].rZ;
        var xAster = g_asteroids[index].mesh.position.x += g_asteroids[index].vX;
        var yAster = g_asteroids[index].mesh.position.y += g_asteroids[index].vY;
        var zAster = g_asteroids[index].mesh.position.z += g_asteroids[index].vZ;
        var xShip = g_ship.mesh.position.x;
        var yShip = g_ship.mesh.position.y;
        var zShip = g_ship.mesh.position.z;
             
        if(xAster > g_maxSize + xShip || yAster > g_maxSize + yShip || zAster > g_maxSize + zShip || 
           xAster < -g_maxSize + xShip || yAster < -g_maxSize + yShip || zAster < -g_maxSize + zShip)
            resetAsteroid(index);
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
    console.log(g_ship.mesh.position + " " + g_ship.head.position + " " + g_ship.head.getAbsolutePosition());
    var headPosition = g_ship.head.getAbsolutePosition();
    g_ship.vX = (headPosition.x - g_ship.mesh.position.x) / 10;
    g_ship.vY = (headPosition.y - g_ship.mesh.position.y) / 10;
    g_ship.vZ = (headPosition.z - g_ship.mesh.position.z) / 10;
    
    switch(keyCode)
    {
        case g_keyboardIds.w:
            ship.mesh.position.x += g_ship.vX;
            ship.mesh.position.y += g_ship.vY;
            ship.mesh.position.z += g_ship.vZ;
            break;
            
        case g_keyboardIds.s:
            ship.mesh.position.z -= g_ship.vZ * 2;
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

        case g_keyboardIds.m:
            if (g_music) {
                document.getElementById("musicPlayer").pause();
                g_music = false;
            }
            else {
                document.getElementById("musicPlayer").play();
                g_music = true;
            }
        default:
            break;
    }
}

// Handles keyboard events
function keyboardEvent(event) 
{    
    if (event.type === "keydown")
    {
        var keyCode = event.keyCode;
        moveShip(g_ship, keyCode);
    }
}

//Handles mouse events
function mouseEvent(e) 
{
    var width = window.innerWidth;
    var height = window.innerHeight;
    var constX = Math.abs((Math.PI / 2) / (width / 2));
    var constY = Math.abs((Math.PI / 2) / (height / 2));
    var mouseX = (e.clientX - (width / 2)) * constX;
    var mouseY = (e.clientY - (height / 2)) * constY;
    
    g_ship.mesh.rotation.x = mouseY - (Math.PI / 2);
    g_ship.mesh.rotation.y = mouseX; 
    g_camera.beta = (-1 * (mouseY - (Math.PI / 2)));
    g_camera.alpha = (-1 * (mouseX + (Math.PI / 2)));
}

function initAsteroids(amount)
{
    for(var index = 0; index < amount; index++)
    {
        var x = getRandomNumber(-g_constAsteroids.maxX, g_constAsteroids.maxX);
        var y = getRandomNumber(-g_constAsteroids.maxY, g_constAsteroids.maxY);
        var z = getRandomNumber(-g_constAsteroids.maxZ, g_constAsteroids.maxZ);

        var vX = (getRandomNumber(-10, 10) - 1) / 18.0;
        var vY = (getRandomNumber(-10, 10) - 1) / 18.0;
        var vZ = (getRandomNumber(-10, 10) - 1) / 18.0;
        
        var newMesh = g_large.clone("0");

        newMesh.position = new BABYLON.Vector3(x, y, z); 
        newMesh.scaling.x = (Math.random() * 0.2) + 0.15;
        newMesh.scaling.y = (Math.random() * 0.2) + 0.15; 
        newMesh.scaling.z = (Math.random() * 0.2) + 0.15;
        
        var rX = getRandomNumber(-10, 10) / 100;
        var rZ = getRandomNumber(-10, 10) / 100;
        
        g_asteroids.push(new Asteroid(vX, vY, vZ, rX, 0, rZ, newMesh));
    }
}

function resetAsteroid(index)
{
    var x = getRandomNumber(-g_constAsteroids.maxX, g_constAsteroids.maxX) + g_ship.mesh.position.x;
    var y = getRandomNumber(-g_constAsteroids.maxY, g_constAsteroids.maxY) + g_ship.mesh.position.y;
    var z = getRandomNumber(-g_constAsteroids.maxZ, g_constAsteroids.maxZ) + g_ship.mesh.position.z;
    g_asteroids[index].mesh.position.x = x;
    g_asteroids[index].mesh.position.y = y;
    g_asteroids[index].mesh.position.z = z;
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

// Converts to radians
function toRadian(ang)
{
    return ang * Math.PI / 180;
}

// Converts to degrees
function toDegree(rad)
{
    return rad * 180 / Math.PI;
}