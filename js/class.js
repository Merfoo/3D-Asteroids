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
    this.vX = 0;
    this.vY = 0;
    this.vZ = 0;
    this.rX = 0;
    this.rY = 0;
    this.rZ = 0;
    
    this.bMoveForward = false;
    this.bMoveBackward = false;
    this.bIsShooting = false;
    this.killedAsteroids = 0;
    this.lives = 10;
};

Laser = function(vX, vY, vZ, mesh)
{
    this.mesh = mesh;
    this.particleSystem = null;
    this.vX = vX;
    this.vY = vY;
    this.vZ = vZ;
};