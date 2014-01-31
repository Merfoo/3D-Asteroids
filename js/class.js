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
    this.vConstInc = 0.01;
    this.vX = 0;
    this.vY = 0;
    this.vZ = 0;
    
    this.bMoveForward = false;
    this.killedAsteroids = 0;
    this.lives = 100;
    
    this.reset = function()
    {
        this.vXMax = 0;
        this.vYMax = 0;
        this.vZMax = 0;
        this.vConst = 0;
        this.vX = 0;
        this.vY = 0;
        this.vZ = 0;

        this.bMoveForward = false;
        this.bShooting = false;
        this.killedAsteroids = 0;
        this.lives = 100;
        this.mesh.position.x = 0;
        this.mesh.position.y = 0;
        this.mesh.position.z = 0;
        this.mesh.rotation = new BABYLON.Vector3(0, 0, 0);
    };
};

Laser = function(vX, vY, vZ, mesh)
{
    this.mesh = mesh;
    this.vX = vX;
    this.vY = vY;
    this.vZ = vZ;
};

Timer = function()
{
    this.startTime = new Date().getTime() / 1000;;
    this.endTime = new Date().getTime() / 1000;;
    this.bIsRunning = false;
    
    this.start = function()
    {
        if(!this.bIsRunning)
        {
            this.startTime = new Date().getTime() / 1000;
            this.bIsRunning = true;
        }
    };
    
    this.stop = function()
    {
      if(this.bIsRunning)
      {
          this.endTime = new Date().getTime() / 1000;
          this.bIsRunning = false;
      }
    };
    
    this.get = function()
    {
        if(this.bIsRunning)
            return (new Date().getTime() / 1000 ) - this.startTime;
        
        return Math.floor((this.endTime - this.startTime) * 100 + 0.5) / 100;
    };
};