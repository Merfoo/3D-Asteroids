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

//anything that moves will extend moving objects
//input: x,y,z - location; 
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

StaticObject = function( x, y, z )
{
    this.x = x;
    this.y = y;
    this.z = z;
}

//---------------
//children classes
//---------------

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

Laser = function( x, y, z, vx, vy, vz, r )
{
    inheritanceManager.extend(this, MovingObject);
    this.x = x;
    this.y = y;
    this.z = z;
    this.vx = vx;
    this.vy = vy;
    this.vz = vz;
    this.r = r;

    this.bIsHit = false;
}

Pickup = function( x, y, z, type, amount )
{
    inheritanceManager.extend(this, StaticObject);
    this.x = x;
    this.y = y;
    this.z = z;

    this.type = type;
    this.amount = amount;
}