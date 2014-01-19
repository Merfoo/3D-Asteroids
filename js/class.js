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
//input: x,y,z - location; vx,vy,vz - velocity; rx,ry,rz - rotation;
MovingObject = function( x, y, z, vx, vy, vz, rx, ry, rz )
{
    this.x = x;
    this.y = y;
    this.z = z;
    this.vx = vx;
    this.vy = vy;
    this.vz = vz;
    this.rx = rx;
    this.ry = ry;
    this.rz = rz;
}

//anything that doesn't move will extend this
//input: x,y,z - location
StaticObject = function( x, y, z )
{
    this.x = x;
    this.y = y;
    this.z = z;
}

//---------------
//children classes
//---------------

//a MovingObject shell, (nothing changes yet)
Asteroid = function( x, y, z, vx, vy, vz, rx, ry, rz )
{
    inheritanceManager.extend(this, MovingObject);
    this.x = x;
    this.y = y;
    this.z = z;
    this.vx = vx;
    this.vy = vy;
    this.vz = vz;
    this.rx = rx;
    this.ry = ry;
    this.rz = rz;
}

//a MovingObject with several other flags added
Ship = function( x, y, z, vx, vy, vz, rx, ry, rz )
{
    inheritanceManager.extend(this, MovingObject);
    this.x = x;
    this.y = y;
    this.z = z;
    this.vx = vx;
    this.vy = vy;
    this.vz = vz;
    this.rx = rx;
    this.ry = ry;
    this.rz = rz;

    this.bIsShooting = false;
    this.health = 100;
    this.shield = 100;
    this.ammo = 100;
    this.lives = 3;
}

//a Ship, bIsHit flag tells you when the laser has hit something
Laser = function( vx, vy, vz )
{
    inheritanceManager.extend(this, Ship);
    this.vx = vx;
    this.vy = vy;
    this.vz = vz;

    this.bIsHit = false;
}

//a StaticObject, adds type to say what the type of Pickup is, adds amount to say how much should be added
Pickup = function( x, y, z, type, amount )
{
    inheritanceManager.extend(this, StaticObject);
    this.x = x;
    this.y = y;
    this.z = z;

    this.type = type;
    this.amount = amount;
}