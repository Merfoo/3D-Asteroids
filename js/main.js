var g_keyboardIds = { w: 87, s: 83, a: 65, d:68, q: 81, e: 69, m: 77, left: 37, up: 38, right: 39, down: 40 };
var g_mouse = { lastAngX: 0, lastAngY: 0, angX: 0, angY: 0, angOffX: 0, angOffY: 0, minAng: 70, angInc: 2 }; 
var g_lazers = new Array();
var g_asteroids = new Array();
var g_timeGame = new Timer();
var g_asteroidAmount = 300;
var g_maxSize = 400;
var g_progShip = 0.0;
var g_progAsteroid = 0.0;
var g_music = true;
var g_gameReady = false;
var g_canvasLoading = null;
var g_ship = null;
var g_camera = null;
var g_scene = null;
var g_mainLazer = null;
var g_mainAsteroid = null;

window.onload = function(){
    var canvas = document.getElementById("canvasGame");
    
    // Check support
    if (!BABYLON.Engine.isSupported())
        window.alert('Browser not supported');
    
    else 
    {
        // Loading Canvas
        g_canvasLoading = document.getElementById("canvasLoading").getContext("2d");
        g_canvasLoading.canvas.width = window.innerWidth;
        g_canvasLoading.canvas.height = window.innerHeight;
        progressLoop();
        
        // Babylon
        var engine = new BABYLON.Engine(canvas, true);
        
        // Create scene
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
        
        // Make main lazer
        g_mainLazer = BABYLON.Mesh.CreateCylinder("cylinder", 10, 0.6, 0.6, 6, g_scene, false);
        g_mainLazer.material = new BABYLON.StandardMaterial("texture", g_scene);
        g_mainLazer.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
        g_mainLazer.position = new BABYLON.Vector3(100000, 0, 0);
        
        // Load models
        BABYLON.SceneLoader.ImportMesh("", "scenes/viperShip/", "Viper.babylon", g_scene, 
            function (newMeshes) 
            { 
                g_ship = newMeshes[0]; 
                g_ship.position = new BABYLON.Vector3(0, 0, 0);
                g_ship.rotation = new BABYLON.Vector3(0, 0, 0);
                g_ship = new Ship(g_ship); 
                g_ship.head = BABYLON.Mesh.CreateBox("head", 1.0, g_scene);
                g_ship.head.parent = g_ship.mesh;
                g_ship.head.position.x = -1;
                g_ship.head.isVisible = false;
                g_ship.lazerHeadLeft = BABYLON.Mesh.CreateBox("lazerHeadLeft", 1.0, g_scene);
                g_ship.lazerHeadLeft.parent = g_ship.mesh;
                g_ship.lazerHeadLeft.position.z = -2.3;
                g_ship.lazerHeadLeft.position.y = -.25;
                g_ship.lazerHeadLeft.isVisible = false;
                g_ship.lazerHeadRight = BABYLON.Mesh.CreateBox("lazerHeadRight", 1.0, g_scene);
                g_ship.lazerHeadRight.parent = g_ship.mesh;
                g_ship.lazerHeadRight.position.z = 2.3;
                g_ship.lazerHeadRight.position.y = -.25;
                g_ship.lazerHeadRight.isVisible = false;
                g_ship.particleSystem = makeShipParticle(g_ship.mesh); 
                g_ship.particleSystemLeft = makeShipParticle(g_ship.mesh); 
                g_ship.particleSystemRight = makeShipParticle(g_ship.mesh); 
                g_ship.particleSystem.minEmitBox = new BABYLON.Vector3(14, 1.25, -.25);    // Starting from
                g_ship.particleSystem.maxEmitBox = new BABYLON.Vector3(18, 2.0, .25);     // to...
                g_ship.particleSystemLeft.minEmitBox = new BABYLON.Vector3(14, -.25, -1.45);    // Starting from
                g_ship.particleSystemLeft.maxEmitBox = new BABYLON.Vector3(18, .25, -2.25);     // to...
                g_ship.particleSystemRight.minEmitBox = new BABYLON.Vector3(14, -.25, 1.45);    // Starting from
                g_ship.particleSystemRight.maxEmitBox = new BABYLON.Vector3(18, .25, 2.25);     // to...
                g_camera.target = g_ship.mesh.position;
                g_camera.setPosition(new BABYLON.Vector3(50, 0, 0));
                g_progShip = 100;
                
                BABYLON.SceneLoader.ImportMesh("asteroid1", "scenes/gilShip/", "scene.babylon", g_scene, 
                    function (newMeshes) 
                    { 
                        g_mainAsteroid = newMeshes[0];
                        g_mainAsteroid.position = new BABYLON.Vector3(100000, 0, 0);
                        g_mainAsteroid.scaling.x = .2; 
                        g_mainAsteroid.scaling.y = .2; 
                        g_mainAsteroid.scaling.z = .2; 
                        g_progAsteroid = 100;
                        
                        progressLoop();
                        initGame();
                        
                        // Once the scene is loaded, just register a render loop to render it
                        engine.runRenderLoop(function () {
                            if(g_gameReady)
                            {    
                                gameLoop();
                                g_scene.render();
                            }
                        });

                        // Resize
                        window.addEventListener("resize", function () {
                            engine.resize();
                        });

                        window.addEventListener("keydown", keyboardEvent, true);
                        window.addEventListener("keyup", keyboardEvent, true);
                        window.addEventListener("mousemove", mouseMoveEvent, true);
                        window.addEventListener("mousedown", mouseDownEvent, true);
                    }, 
                    function(e)
                    {
                        if(e.lengthComputable)
                            g_progAsteroid = (e.loaded * 100 / e.total).toFixed();

                        progressLoop();
                    }
                ); 
            },
            function(e)
            {
                if(e.lengthComputable)
                    g_progShip = (e.loaded * 100 / e.total).toFixed();
                
                progressLoop();
            }
        );
    }
};

function progressLoop()
{
    var loadingText = "NOW LOADING...";
    var size = { width: g_canvasLoading.canvas.width, height: g_canvasLoading.canvas.height };
    var prog = Math.floor((num(g_progShip) + num(g_progAsteroid)) * 100 / 200);
    
    g_canvasLoading.fillStyle = "black";
    g_canvasLoading.fillRect(0, 0, size.width, size.height);
    
    g_canvasLoading.textBaseline = "top";
    g_canvasLoading.fillStyle = "white";
    g_canvasLoading.font = "150px Calibri";
    g_canvasLoading.fillText(loadingText, size.width * 0.13, size.height * 0.2);
    g_canvasLoading.font = "75px Calibri";
    g_canvasLoading.fillText(prog + "%", size.width * 0.75, size.height * 0.5);
    
    if(num(prog) === 100)
    {
        document.getElementById("canvasLoading").style.zIndex = -100;
        g_gameReady = true;
    }
}

function initGame()
{    
    g_ship.reset();
    
    for(var index = 0; index < g_asteroidAmount; index++)
    {
        if(g_asteroids.length < g_asteroidAmount)
        {
            var newMesh = g_mainAsteroid.clone();

            newMesh.position = new BABYLON.Vector3(0, 0, 0); 
            newMesh.scaling.x = (Math.random() * 0.2) + 0.15;
            newMesh.scaling.y = (Math.random() * 0.2) + 0.15; 
            newMesh.scaling.z = (Math.random() * 0.2) + 0.15;

            var rX = getRandomNumber(-10, 10) / 100;
            var rZ = getRandomNumber(-10, 10) / 100;
            g_asteroids.push(new Asteroid(0, 0, 0, rX, 0, rZ, newMesh));
        }
        
        resetAsteroid(index);
    }
    
    g_timeGame.start();
}

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

        if(g_ship.head.intersectsMesh(g_asteroids[i].mesh, true)) 
        {
            g_ship.lives--;

            if(g_ship.lives <= 0)
            {
                g_timeGame.stop();
                alert("GAME OVER: Took you " + Math.floor(g_timeGame.get()) + " seconds to die.");
                initGame();
            }
        }

        document.getElementById("health").innerHTML="Health: " + g_ship.lives + ", Asteroids Killed: " + g_ship.killedAsteroids;
    }
}

function updateShip()
{       
    var headPosition = g_ship.head.getAbsolutePosition();
    g_ship.vXMax = (headPosition.x - g_ship.mesh.position.x) * 5;
    g_ship.vYMax = (headPosition.y - g_ship.mesh.position.y) * 5;
    g_ship.vZMax = (headPosition.z - g_ship.mesh.position.z) * 5;
    
    if(g_ship.bMoveForward)
    {
        g_ship.particleSystem.start();
        g_ship.particleSystemLeft.start();
        g_ship.particleSystemRight.start();
        g_ship.vConst += g_ship.vConstInc;
        
        if(g_ship.vConst > 1)
            g_ship.vConst = 1;
    }
    
    else
    {
        g_ship.vConst -= g_ship.vConstInc;
        
        if(g_ship.vConst < 0)
        {
            g_ship.particleSystem.stop();
            g_ship.particleSystemLeft.stop();
            g_ship.particleSystemRight.stop();
            g_ship.vConst = 0;
        }
    }

    g_ship.vX = g_ship.vXMax * g_ship.vConst;
    g_ship.vY = g_ship.vYMax * g_ship.vConst;
    g_ship.vZ = g_ship.vZMax * g_ship.vConst;
    g_ship.mesh.position.x += g_ship.vX;
    g_ship.mesh.position.y += g_ship.vY;
    g_ship.mesh.position.z += g_ship.vZ;
        
    if(Math.abs(g_mouse.angY + g_mouse.angOffY) <= 100)
    {
        var diffAngX = (g_mouse.angX - g_mouse.lastAngX);
        var diffAngY = (g_mouse.angY - g_mouse.lastAngY);
        
        if(g_mouse.angY > g_mouse.minAng && diffAngY >= 0)
            g_mouse.angOffY += g_mouse.angInc;

        if(g_mouse.angY < -g_mouse.minAng && diffAngY <= 0)
            g_mouse.angOffY -= g_mouse.angInc;

        if(g_mouse.angX > g_mouse.minAng && diffAngX >= 0)
            g_mouse.angOffX += g_mouse.angInc;

        if(g_mouse.angX < -g_mouse.minAng && diffAngX <= 0)
            g_mouse.angOffX -= g_mouse.angInc;

        g_ship.mesh.rotation.y = toRadian(g_mouse.angX + g_mouse.angOffX);
        g_ship.mesh.rotation.z = toRadian(g_mouse.angY + g_mouse.angOffY);
        g_camera.beta = -1 * toRadian((g_mouse.angY * .65) - 80 + g_mouse.angOffY);
        g_camera.alpha = -1 * toRadian((g_mouse.angX * .65) + g_mouse.angOffX); 
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

function makeLazer()
{
    var xShip = g_ship.mesh.position.x;
    var yShip = g_ship.mesh.position.y;
    var zShip = g_ship.mesh.position.z;
    var headPosition = g_ship.head.getAbsolutePosition();
    var vX = (headPosition.x - xShip) * 7;
    var vY = (headPosition.y - yShip) * 7;
    var vZ = (headPosition.z - zShip) * 7;
    var posLeft = g_ship.lazerHeadLeft.getAbsolutePosition();
    var posRight = g_ship.lazerHeadRight.getAbsolutePosition();

    g_lazers.push(new Laser(vX, vY, vZ, makeShipLazer(posLeft.x + vX * 1.5, posLeft.y + vY * 1.5, posLeft.z + vZ * 1.5)));
    g_lazers.push(new Laser(vX, vY, vZ, makeShipLazer(posRight.x + vX * 1.5, posRight.y + vY * 1.5, posRight.z + vZ * 1.5)));
}

function makeShipLazer(x, y, z)
{
    var lazer = g_mainLazer.clone();
    lazer.position = new BABYLON.Vector3(x, y, z);
    lazer.rotation.x = g_ship.mesh.rotation.x;
    lazer.rotation.y = g_ship.mesh.rotation.y;
    lazer.rotation.z = g_ship.mesh.rotation.z + toRadian(90);
    return lazer;
}

// Handles mousedown events
function mouseDownEvent()
{
    makeLazer();
}

function mouseMoveEvent(e)
{
    var halfWidth = Math.floor(window.innerWidth / 2);
    var halfHeight = Math.floor(window.innerHeight / 2);
    
    g_mouse.lastAngX = g_mouse.angX;
    g_mouse.lastAngY = g_mouse.angY;
    g_mouse.angX = 90 - toDegree(Math.acos((e.clientX - halfWidth) / halfWidth));
    g_mouse.angY = 90 - toDegree(Math.acos((e.clientY - halfHeight) / halfHeight));
}

function resetAsteroid(index)
{
    var mode = getRandomNumber(1, 6);
    var x = getRandomNumber(-g_maxSize + 1, g_maxSize - 1) + g_ship.mesh.position.x;
    var y = getRandomNumber(-g_maxSize + 1, g_maxSize - 1) + g_ship.mesh.position.y;
    var z = getRandomNumber(-g_maxSize + 1, g_maxSize - 1) + g_ship.mesh.position.z;

    switch(mode)
    {
        case 1: // Start Top
            y = g_maxSize - 1 + g_ship.mesh.position.y;
            break;

        case 2: // Start Bottom
            y = -g_maxSize + 1 + g_ship.mesh.position.y;
            break;

        case 3: // Start Forward
            x = -g_maxSize + 1 + g_ship.mesh.position.x;
            break;

        case 4: // Start Backward
            x = g_maxSize - 1 + g_ship.mesh.position.x;
            break;

        case 5: // Start Left
            z = -g_maxSize + 1 + g_ship.mesh.position.z; 
            break

        case 6: // Start Right
            z = g_maxSize - 1 + g_ship.mesh.position.z;
            break;
    }
    
    // Const for asteroi velocity
    var minConst = g_maxSize * 0.4;
    var maxConst = g_maxSize * 0.7;
    var shipRadius = 50;
    var newX = g_ship.mesh.position.x + getRandomNumber(-shipRadius, shipRadius);
    var newY = g_ship.mesh.position.y + getRandomNumber(-shipRadius, shipRadius);
    var newZ = g_ship.mesh.position.z + getRandomNumber(-shipRadius, shipRadius);
    var vX = (newX - x) / getRandomNumber(minConst, maxConst); 
    var vY = (newY - y) / getRandomNumber(minConst, maxConst); 
    var vZ = (newZ - z) / getRandomNumber(minConst, maxConst);
    
    g_asteroids[index].mesh.position.x = x;
    g_asteroids[index].mesh.position.y = y;
    g_asteroids[index].mesh.position.z = z;
    g_asteroids[index].vX = vX;
    g_asteroids[index].vY = vY;
    g_asteroids[index].vZ = vZ;
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

function makeShipParticle(mesh)
{
        var particleSystem = new BABYLON.ParticleSystem("particles", 1000, g_scene);
        particleSystem.particleTexture = new BABYLON.Texture("images/Flare.png", g_scene);
        particleSystem.emitter = mesh;    
        particleSystem.minEmitBox = new BABYLON.Vector3(14, 1.25, -.25);    // Starting from
        particleSystem.maxEmitBox = new BABYLON.Vector3(21, 2.0, .25);     // to...
        particleSystem.color1 = new BABYLON.Color4(0.9, 0.3, 0.2, 1.0);
        particleSystem.color2 = new BABYLON.Color4(0.9, 0.3, 0.2, 1.0);
        particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.0, 0.0);
        particleSystem.minSize = 0.75;
        particleSystem.maxSize = 3.75;
        particleSystem.minLifeTime = 0.0025;
        particleSystem.maxLifeTime = 0.0125;
        particleSystem.emitRate = 750;
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        particleSystem.direction1 = new BABYLON.Vector3(0, 10, -0); // (width, depth, height)
        particleSystem.direction2 = new BABYLON.Vector3(0, -10, 0);
        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = Math.PI * 2;
        particleSystem.targetStopDuration = 0;
        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 3;
        particleSystem.updateSpeed = 0.005;
        particleSystem.disposeOnStop = false;
        
        return particleSystem;
}

// Forces javascript to interpret the variable as a number
function num(number)
{
    return number - 0;
}