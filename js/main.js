var g_scene;
var g_keyboardIds = { w: 87, s: 83, a: 65, d:68, q: 81, e: 69, m: 77};
var g_constAsteroids = { maxX: 225, maxY: 225, maxZ: 225};
var g_asteroids = new Array();
var g_mainLazer;
var g_mouse = { x: 0, y: 0, lastAngX: 0, lastAngY: 0, angX: 0, angY: 0 }; 
var g_angOffSet = { angX: 0, angY: 0, minAng: 70, angInc: 2 };
var g_lazers = new Array();
var g_ship;
var g_camera;
var g_large;
var g_maxSize = 300;
var g_timeInit = 0;
var g_timeEnd = 0;
var g_gameEnded = false;
var g_fountain;
var g_particleSystem;
var g_shipInited = false;
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
        g_particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, -2);    // Starting from
        g_particleSystem.maxEmitBox = new BABYLON.Vector3(1, 5, 0);     // to...
        
        // Color of all particles
        g_particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
        g_particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
        g_particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
        
        // Size of each particle (random between...
        g_particleSystem.minSize = 0.2;
        g_particleSystem.maxSize = 0.5;
        
        // Life time of each particle (random between ...
        g_particleSystem.minLifeTime = 0.3;
        g_particleSystem.maxLifeTime = .5;
        
        // Emission rate
        g_particleSystem.emitRate = 30000;
        
        // Blend mode: BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        g_particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        
        // No gravity yo...
        
        // Direction of each particle after it has been emitted
        g_particleSystem.direction1 = new BABYLON.Vector3(-7, 0, 4);
        g_particleSystem.direction2 = new BABYLON.Vector3(7, 4, -4);
        
        // Angular speed, in radians
        g_particleSystem.minAngularSpeed = 0;
        g_particleSystem.maxAngularSpeed = Math.PI/4;
        
        g_particleSystem.targetStopDuration = 3;
        
        // Speed
        g_particleSystem.minEmitPower = 1;
        g_particleSystem.maxEmitPower = 3;
        g_particleSystem.updateSpeed = 0.005;
        
        // Dispose
        g_particleSystem.disposeOnStop = false;
        
        // Start the particle system
        g_particleSystem.start();
       
        // Attach the camera to the scene
        g_scene.activeCamera.attachControl(canvas);
        
        // Load models
//        BABYLON.SceneLoader.ImportMesh("ship", "models/scene/", "scene.babylon", g_scene, function (newMeshes) 
//        { 
//            g_ship = newMeshes[0]; 
//            g_camera.target = g_ship.position = new BABYLON.Vector3(0, 0, 0);
//            g_fountain.position = g_ship.position;
//            g_fountain.rotation = g_ship.rotation;
//            g_ship.scaling.x = .2; 
//            g_ship.scaling.y = .2; 
//            g_ship.scaling.z = .2; 
//            g_ship = new Ship(1, 1, 1, 1, 1, 1, g_ship); 
//            g_ship.head = BABYLON.Mesh.CreateBox("head", 3.0, g_scene);
//            g_ship.head.parent = g_ship.mesh;
//            g_ship.head.position.y = -1;
//            g_ship.head.isVisible = false;
//            g_camera.setPosition(new BABYLON.Vector3(0, 0, -50));
//            g_shipInited = true;
//        });
        
        BABYLON.SceneLoader.ImportMesh("", "models/exampleScene/", "Viper.babylon", g_scene, function (newMeshes) 
        { 
            g_ship = newMeshes[0]; 
            g_camera.target = g_ship.position = new BABYLON.Vector3(0, 0, 0);
            g_ship.rotation.y = 0;
            g_fountain.position = g_ship.position;
            g_fountain.rotation = g_ship.rotation;
            g_ship.scaling.x = 1; 
            g_ship.scaling.y = 1; 
            g_ship.scaling.z = 1; 
            g_ship = new Ship(1, 1, 1, 1, 1, 1, g_ship); 
            g_ship.head = BABYLON.Mesh.CreateBox("head", 3.0, g_scene);
            g_ship.head.parent = g_ship.mesh;
            g_ship.head.position.x = -1;
            g_ship.head.isVisible = false;
            g_camera.setPosition(new BABYLON.Vector3(50, 0, 0));
            g_shipInited = true;
        });
        
        BABYLON.SceneLoader.ImportMesh("asteroid1", "models/scene/", "scene.babylon", g_scene, function (newMeshes) 
        { 
            g_large = newMeshes[0];
            g_large.position = new BABYLON.Vector3(100000, 0, 0);
            g_large.scaling.x = .2; 
            g_large.scaling.y = .2; 
            g_large.scaling.z = .2; 
            initAsteroids(333);
        });
        
//        BABYLON.SceneLoader.ImportMesh("laser", "models/scene/", "scene.babylon", g_scene, function (newMeshes) 
//        { 
//            g_mainLazer = newMeshes[0];
//            g_mainLazer.position = new BABYLON.Vector3(100000, 0, 0);
//            g_mainLazer.scaling.x = .5; 
//            g_mainLazer.scaling.y = .5; 
//            g_mainLazer.scaling.z = .5; 
//        });
        
        g_scene.executeWhenReady(function(){
            // Once the scene is loaded, just register a render loop to render it
            engine.runRenderLoop(function () {
                g_scene.beforeRender = gameLoop();
                g_scene.render();
            });
        
            // Resize
            window.addEventListener("resize", function () {
                engine.resize();
            });

            window.addEventListener("keydown", keyboardEvent, true);
            window.addEventListener("keyup", keyboardEvent, true);
            window.addEventListener("mousemove", mouseMoveEvent, true);
            window.addEventListener("mousedown", mouseDownEvent, true);
        });
    } 
};

function updateLazers()
{
    for(var index = 0; index < g_lazers.length; index++)
    {
        g_lazers[index].mesh.position.x += g_lazers[index].vX;
        g_lazers[index].mesh.position.y += g_lazers[index].vY;
        g_lazers[index].mesh.position.z += g_lazers[index].vZ;
        
        if(outOfBounds(g_lazers[index].mesh.position))
        {
            g_lazers[index].mesh.dispose();
            g_lazers.splice(index, 1);
        }
    }
}

function updateAsteroids()
{
    for(var index = 0; index < g_asteroids.length; index++)
    {
        g_asteroids[index].mesh.rotation.x += g_asteroids[index].rX;
        g_asteroids[index].mesh.rotation.y += g_asteroids[index].rY;
        g_asteroids[index].mesh.rotation.z += g_asteroids[index].rZ;
        g_asteroids[index].mesh.position.x += g_asteroids[index].vX;
        g_asteroids[index].mesh.position.y += g_asteroids[index].vY;
        g_asteroids[index].mesh.position.z += g_asteroids[index].vZ;
        
        if(outOfBounds(g_asteroids[index].mesh.position))
            resetAsteroid(index);
    }
}

function gameLoop()
{
    if(!g_gameEnded && g_shipInited)
    {
        //console.log(g_ship.mesh.position + " Pos: " + g_camera.position);
        console.log(toDegree(g_ship.mesh.rotation.y) + " " + toDegree(g_ship.mesh.rotation.z) + " Ang: " + toDegree(g_camera.beta) + " " + toDegree(g_camera.alpha));
        updateShip();
        updateAsteroids();
        updateLazers();
        
        for(var i = 0; i < g_asteroids.length; i++) 
        {
            for(var lazerIndex = 0; lazerIndex < g_lazers.length; lazerIndex++)
            {
                if(g_asteroids[i].mesh.intersectsPoint(g_lazers[lazerIndex].mesh.position))
                {    
                    g_ship.killedAsteroids++;
                    resetAsteroid(i);
                    g_lazers[lazerIndex].mesh.dispose();
                    g_lazers.splice(lazerIndex, 1);
                }
            }
            
            if(g_ship.mesh.intersectsPoint(g_asteroids[i].mesh.position)) 
            {
                g_ship.health -= 10;
                
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
            
            document.getElementById("health").innerHTML="Health: " + g_ship.health + ", Asteroids Killed: " + g_ship.killedAsteroids;
                
        }
    }
}

function updateShip()
{
    var headPosition = g_ship.head.getAbsolutePosition();
    g_ship.vX = (headPosition.x - g_ship.mesh.position.x) * 5;
    g_ship.vY = (headPosition.y - g_ship.mesh.position.y) * 5;
    g_ship.vZ = (headPosition.z - g_ship.mesh.position.z) * 5;
        
    if(g_shipInited && (g_ship.bMoveForward || g_ship.bMoveBackward))
    {
        g_particleSystem.start();

        if(g_ship.bMoveForward)
        {       
            g_ship.mesh.position.x += g_ship.vX;
            g_ship.mesh.position.y += g_ship.vY;
            g_ship.mesh.position.z += g_ship.vZ;
        }
        
        if(g_ship.bMoveBackward)
        {    
            g_ship.mesh.position.x -= g_ship.vX;
            g_ship.mesh.position.y -= g_ship.vY;
            g_ship.mesh.position.z -= g_ship.vZ;
        }
    }
    
    else
        g_particleSystem.stop();

    if(Math.abs(g_mouse.angY + g_angOffSet.angY) <= 111)
    {
        var diffAngX = (g_mouse.angX - g_mouse.lastAngX);
        var diffAngY = (g_mouse.angY - g_mouse.lastAngY);
        
        if(g_mouse.angY > g_angOffSet.minAng && diffAngY >= 0)
            g_angOffSet.angY += g_angOffSet.angInc;

        if(g_mouse.angY < -g_angOffSet.minAng && diffAngY <= 0)
            g_angOffSet.angY -= g_angOffSet.angInc;

        if(g_mouse.angX > g_angOffSet.minAng && diffAngX >= 0)
            g_angOffSet.angX += g_angOffSet.angInc;

        if(g_mouse.angX < -g_angOffSet.minAng && diffAngX <= 0)
            g_angOffSet.angX -= g_angOffSet.angInc;

        g_ship.mesh.rotation.y = toRadian(g_mouse.angX + g_angOffSet.angX);
        g_ship.mesh.rotation.z = toRadian(g_mouse.angY + g_angOffSet.angY);
        g_camera.beta = -1 * toRadian((g_mouse.angY * .69) - 80 + g_angOffSet.angY);
        g_camera.alpha = -1 * toRadian((g_mouse.angX * .69) + g_angOffSet.angX); 
    }   
}

// Handles keyboard events
function keyboardEvent(event) 
{    
    var keyCode = event.keyCode;
    
    if (event.type === "keydown")
    {        
        switch(keyCode)
        {
            case g_keyboardIds.w:
                g_ship.bMoveForward = true;
                break;
            
            case g_keyboardIds.s:
                g_ship.bMoveBackward = true;
                break;

            default:
                break;
        }
    }
    
    if (event.type === "keyup")
    {        
        switch(keyCode)
        {
            case g_keyboardIds.w:
                g_ship.bMoveForward = false;
                break;
            
            case g_keyboardIds.s:
                g_ship.bMoveBackward = false;
                break;
            
            case g_keyboardIds.m:
                if (g_music) 
                {
                    document.getElementById("musicPlayer").pause();
                    g_music = false;
                }

                else 
                {
                    document.getElementById("musicPlayer").play();
                    g_music = true;
                }
                break;

            default:
                break;
        }
    }
}

// Handles mousedown events
function mouseDownEvent(e)
{
    var lazer = BABYLON.Mesh.CreateSphere("lazer", 25, 3, g_scene);
    lazer.material = new BABYLON.StandardMaterial("texture1", g_scene);
    lazer.material.diffuseTexture = new BABYLON.Texture("images/Flare.png", g_scene);
    var xShip = g_ship.mesh.position.x;
    var yShip = g_ship.mesh.position.y;
    var zShip = g_ship.mesh.position.z;
    var headPosition = g_ship.head.getAbsolutePosition();
    var vX = (headPosition.x - xShip) * 7;
    var vY = (headPosition.y - yShip) * 7;
    var vZ = (headPosition.z - zShip) * 7;
    
    lazer.position = new BABYLON.Vector3(xShip + vX * 1.5, yShip + vY * 1.5, zShip + vZ * 1.5);
    g_lazers.push(new Laser(vX, vY, vZ, lazer));
}

//// Handles mousedown events
//function mouseDownEvent(e)
//{
//    var lazer = g_mainLazer.clone("0");
//    var xShip = g_ship.mesh.position.x;
//    var yShip = g_ship.mesh.position.y;
//    var zShip = g_ship.mesh.position.z;
//    var headPosition = g_ship.head.getAbsolutePosition();
//    var vX = (headPosition.x - xShip) * 10;
//    var vY = (headPosition.y - yShip) * 10;
//    var vZ = (headPosition.z - zShip) * 10;
//    
//    lazer.position = new BABYLON.Vector3(xShip + vX * 1.5, yShip + vY * 1.5, zShip + vZ * 1.5);
//    lazer.rotation.x = g_ship.mesh.rotation.x - toRadian(0);
//    lazer.rotation.y = g_ship.mesh.rotation.y - toRadian(45);
//    lazer.rotation.z = g_ship.mesh.rotation.z - toRadian(0);
//    g_lazers.push(new Laser(vX, vY, vZ, lazer));
//}

function mouseMoveEvent(e)
{
    var halfWidth = Math.floor(window.innerWidth / 2);
    var halfHeight = Math.floor(window.innerHeight / 2);
    var constX = Math.abs(90 / halfWidth);
    var constY = Math.abs(90 / halfHeight);
    
    g_mouse.lastAngX = g_mouse.angX;
    g_mouse.lastAngY = g_mouse.angY;
    g_mouse.angX = ((e.clientX - halfWidth) * constX);
    g_mouse.angY = ((e.clientY - halfHeight) * constY);
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
        
        var newMesh = g_large.clone();

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

function outOfBounds(pos)
{
    var xShip = g_ship.mesh.position.x;
    var yShip = g_ship.mesh.position.y;
    var zShip = g_ship.mesh.position.z;

    if(pos.x > g_maxSize + xShip || pos.y > g_maxSize + yShip || pos.z > g_maxSize + zShip || 
       pos.x < -g_maxSize + xShip || pos.y < -g_maxSize + yShip || pos.z < -g_maxSize + zShip)
        return true;
    
    return false;
}