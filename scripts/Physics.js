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

	// Store p as auk.physics
	auk.physics = p;

}(window.auk = window.auk || {}));
