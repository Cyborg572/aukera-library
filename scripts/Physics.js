/*jslint browser: true, devel: true */
/*
 * ---------------------------------------------------------------------------
 *	Physics.js
 *	This file extends the game engine to various physics-based functions. 
 * ---------------------------------------------------------------------------
 */

(function (auk) {

	"use strict";

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
		this.vector.subtract({x: this.vector.x*p.friction, y: this.vector.y*p.friction, z:0});
		this.x += this.vector.x/100;
		this.y += this.vector.y/100;
		this.z += this.vector.z/100;
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
		if (this.controller.getState('jump') && this.z <= 0) {
			this.vector.add({x:0, y:0, z:this.jumpStrength});
		} else if(this.z > 0) {
			this.vector.add({x:0, y:0, z:-p.gravity});
		} else if (this.z <= 0) {
			this.z = 0;
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

}(window.auk = window.auk || {}));
