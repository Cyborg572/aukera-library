"use strict";
var auk = auk || {};

/*
 * ---------------------------------------------------------------------------
 *  Physics.js
 *  This file extends the game engine to various physics-based functions.
 * ---------------------------------------------------------------------------
 */

/**
 * The physics constructor
 *
 * @param settings The properties of this object become the properties of
 *                 the physics object.
 */
auk.Physics = function (settings) {
	this.gravity = settings.gravity;
	this.friction = settings.friction;
};

/**
 * Motor feature for actors
 *
 * This function should be added to an actor as a feature.
 */
auk.Physics.motor = function () {
	var p = this.room.physics;
	var m = Math;
	var t = this.room.data.terrain;
	var x;
	var y;
	var g;

	if (this.controller.getState('up')) {
		this.vector.add({x:0, y: -this.speed, z:0});
	}
	if (this.controller.getState('right')) {
		this.vector.add({x:this.speed, y:0, z:0});
	}
	if (this.controller.getState('down')) {
		this.vector.add({x:0, y:this.speed, z:0});
	}
	if (this.controller.getState('left')) {
		this.vector.add({x: -this.speed, y:0, z:0});
	}
	this.vector.subtract({
		x: this.vector.x*p.friction,
		y: this.vector.y*p.friction,
		z: 0
	});
	this.x += this.vector.x/100;
	this.y += this.vector.y/100;
	this.z += this.vector.z/100;

	// Walls, sort of
	x = m.floor(this.x);
	y = m.floor(this.y);
	if (x < 0) {
		x = 0;
	}
	if (y < 0) {
		y = 0;
	}
	g = m.max(
		t[x][y],
		x < 14 ? t[x+1][y] : t[x][y],
		y < 7 ? t[x][y+1] : t[x][y],
		(x < 14 && y < 7) ? t[x+1][y+1] : t[x][y]
	)/2;

	if (g > this.z) {
		this.x -= this.vector.x/100;
		this.vector.x = 0;
		this.y -= this.vector.y/100;
		this.vector.y = 0;
	}

};

/**
 * Adds the motor functionality to an actor
 *
 * @param actor   The actor that will be receiving this functionality
 * @param options An settings object with a speed property.
 */
auk.Physics.motor.addTo = function (actor, options) {
	if (!options.speed) {options.speed = 1;}
	actor.speed = options.speed;
	actor.vector = new auk.Vector([0, 0, 0], actor.speed);
	actor.updateSteps.push(this);
};

/**
 * Jump Feature for actors
 *
 * This function should be added to an actor as a feature.
 */
auk.Physics.jump = function () {
	var p = this.room.physics;
	var m = Math;
	var t = this.room.data.terrain;
	var x = m.floor(this.x);
	var y = m.floor(this.y);
	var g;

	if (x < 0) {
		x = 0;
	}
	if (y < 0) {
		y = 0;
	}

	g = m.max(
		t[x][y],
		x < 14 ? t[x+1][y] : t[x][y],
		y < 7 ? t[x][y+1] : t[x][y],
		(x < 14 && y < 7) ? t[x+1][y+1] : t[x][y]
	)/2;

	if (this.controller.getState('jump') && this.z <= g) {
		this.vector.add({x:0, y:0, z:this.jumpStrength});
	} else if(this.z > g) {
		this.vector.add({x:0, y:0, z:-p.gravity});
	} else if (this.z <= g) {
		this.z = g;
		this.vector.add({x:0, y:0, z:-this.vector.z});
	}
};

/**
 * Adds the jump functionality to an actor
 *
 * @param actor   The actor that will be receiving this functionality
 * @param options An settings object with a power property.
 */
auk.Physics.jump.addTo = function (actor, options) {
	if (!options.power) {options.power = 3;}
	actor.jumpStrength = options.power;
	actor.updateSteps.push(this);
};

// ========================================================================
//  Integrate physics with the rest of the game systems.
// ========================================================================

// Add the Terrain module to the list of modules.
auk.modules.push(auk.Physics);

/**
 * Does physics-related thing to rooms.
 *
 * When a room is initialized, this function is called to add Physics
 * capabilities.
 *
 * @param room The room being initialized
 */
auk.Physics.roomInit = function (room) {
	if (room.data.physics) {
		room.physics = new auk.Physics(room.data.physics);
	} else {
		room.physics = room.game.physics;
	}
};
