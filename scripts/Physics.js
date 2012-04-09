/*jslint browser: true, devel: true */
/*
 * ---------------------------------------------------------------------------
 *	Physics.js
 *	This file extends the game engine to various physics-based functions. 
 * ---------------------------------------------------------------------------
 */

(function (auk) {

	"use strict";

	// Physics is a library, not a Constructor, p will be added as auk.physics
	var p = {};

	// The motor feature
	p.motor = function () {
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
		this.vector.subtract({x: this.vector.x/3, y: this.vector.y/3, z:0});
		this.x += this.vector.x;
		this.y += this.vector.y;
		this.z += this.vector.z;
	};

	// Adds the motor feature to actors.
	p.motor.addTo = function (actor, options) {
		if (!options.speed) {options.speed = 1;}
		actor.speed = options.speed;
		actor.vector = new auk.Vector([0, 0, 0], actor.speed);
		actor.updateSteps.push(this);
	};

	// Jump Feature
	p.jump = function () {
		if (this.controller.getState('jump') && this.z <= 0) {
			this.vector.add({x:0, y:0, z:this.jumpStrength});
		} else if(this.z > 0) {
			this.vector.add({x:0, y:0, z:-4});
		} else if (this.z <= 0) {
			this.z = 0;
			this.vector.add({x:0, y:0, z:-this.vector.z});
		}
	};

	p.jump.addTo = function (actor, options) {
		if (!options.power) {options.power = 3;}
		actor.jumpStrength = options.power;
		actor.updateSteps.push(this);
	};

	// Store p as auk.physics
	auk.physics = p;

}(window.auk = window.auk || {}));
