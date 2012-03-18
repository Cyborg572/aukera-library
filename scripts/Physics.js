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
			this.y -= this.speed;
		}
		if (this.controller.getState('right')) {
			this.x += this.speed;
		}
		if (this.controller.getState('down')) {
			this.y += this.speed;
		}
		if (this.controller.getState('left')) {
			this.x -= this.speed;
		}
	};

	// Adds the motor feature to actors.
	p.motor.addTo = function (actor, options) {
		if (!options.speed) {options.speed = 5;}
		actor.speed = options.speed;
		actor.updateSteps.push(this);
	};

	// Jump Feature
	p.jump = function () {
		if (this.controller.getState('jump') && !this.jumping) {
			this.z += this.jumpStrength;
			console.log('atempting jump');
		}
		if ((this.z > 0 && !this.controller.getState('jump')) || this.z > 33) {
			this.jumping = true;
		}
		if (this.z > 0) {
			this.z -= 1;
		} else {
			this.z = 0;
			this.jumping = false;
		}
	};

	p.jump.addTo = function (actor, options) {
		if (!options.power) {options.power = 3;}
		actor.jumpStrength = options.power;
		actor.jumping = false;
		actor.updateSteps.push(this);
		console.log('adding jump');
	};

	// Store p as auk.physics
	auk.physics = p;

}(window.auk = window.auk || {}));
