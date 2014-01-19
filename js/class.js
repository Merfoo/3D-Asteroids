//handle inheritance because javascript doesn't
inheritanceManager = {};

inheritanceManager.extend = function( subClass, baseClass )
{
    function inheritance() {}
    inheritance.prototype = baseClass.prototype;
    subClass.prototype = new inheritance();
    subClass.prototype.constructor = subClass;
    subClass.baseConstructor = baseClass;
    subClass.superClass = baseClass.prototype;
}

//---------------
//parent classes
//---------------

//anything that moves will extend this
//input: x,y,z - location; vX,vY,vZ - velocity; rX,rY,rZ - rotation;
MovingObject = function( vX, vY, vZ, rX, rY, rZ )
{
    this.vX = vX;
    this.vY = vY;
    this.vZ = vZ;
    this.rX = rX;
    this.rY = rY;
    this.rZ = rZ;
}

//---------------
//children classes
//---------------

//a MovingObject shell, (nothing changes yet)
Asteroid = function( vX, vY, vZ, rX, rY, rZ, mesh )
{
    inheritanceManager.extend(this, MovingObject);
    this.mesh = mesh;
    this.x = mesh.position.x;
    this.y = mesh.position.y;
    this.z = mesh.position.z;
    this.vX = vX;
    this.vY = vY;
    this.vZ = vZ;
    this.rX = rX;
    this.rY = rY;
    this.rZ = rZ;
}

//a MovingObject with several other flags added
Ship = function( vX, vY, vZ, rX, rY, rZ, mesh )
{
    inheritanceManager.extend(this, MovingObject);
    this.mesh = mesh;
    this.x = mesh.position.x;
    this.y = mesh.position.y;
    this.z = mesh.position.z;
    this.vX = vX;
    this.vY = vY;
    this.vZ = vZ;
    this.rX = rX;
    this.rY = rY;
    this.rZ = rZ;

    this.bIsShooting = false;
    this.health = 100;
    this.shield = 100;
    this.ammo = 100;
    this.lives = 3;
}

//a Ship, bIsHit flag tells you when the laser has hit something
Laser = function( vX, vY, vZ, mesh )
{
    inheritanceManager.extend(this, Ship);
    this.mesh = mesh;
    this.vX = vX;
    this.vY = vY;
    this.vZ = vZ;

    this.bIsHit = false;
}

//a StaticObject, adds type to say what the type of Pickup is, adds amount to say how much should be added
Pickup = function( mesh, type, amount )
{
    this.mesh = mesh;
    this.x = mesh.position.x;
    this.y = mesh.position.y;
    this.z = mesn.position.z;

    this.type = type;
    this.amount = amount;
}