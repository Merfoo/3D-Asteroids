Asteroid = function(vX, vY, vZ, rX, rY, rZ, mesh)
{
    this.mesh = mesh;
    this.vX = vX;
    this.vY = vY;
    this.vZ = vZ;
    this.rX = rX;
    this.rY = rY;
    this.rZ = rZ;
};

Ship = function(mesh)
{
    this.mesh = mesh;
    this.head = null;
    this.lazerHeadLeft = null;
    this.lazerHeadRight = null;
    this.particleSystem = null;
    this.particleSystemLeft = null;
    this.particleSystemRight = null;
    this.vXMax = 0;
    this.vYMax = 0;
    this.vZMax = 0;
    this.vConst = 0;
    this.vConstInc = 0.005;
    this.vX = 0;
    this.vY = 0;
    this.vZ = 0;
    
    this.bMoveForward = false;
    this.killedAsteroids = 0;
    this.lives = 100;
};

Laser = function(vX, vY, vZ, mesh)
{
    this.mesh = mesh;
    this.particleSystem = null;
    this.vX = vX;
    this.vY = vY;
    this.vZ = vZ;
};