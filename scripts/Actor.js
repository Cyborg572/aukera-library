/*
 * ---------------------------------------------------------------------------
 *	Actor.js
 *	This file defines a basic Actor object that can be inherited from
 * ---------------------------------------------------------------------------
 */

(function (auk) {

	"use strict";

	// =======================================================================
	//	Create the Map constructor
	// =======================================================================

	/*
	 * auk.Actor()
	 *
	 * Constructor for actor objects
	 *
	 * @param posx: starting X position of the actor
	 * @param posy: starting Y position of the actor
	 * @param posz: starting Z position of the actor
	 *
	 */

	auk.Actor = function (posx, posy, posz) {

		this.x = posx;
		this.y = posy;
		this.z = posz;

		this.game = null;
		this.updateTimer = null;

		this.html = document.createElement('div');
		this.html.id = "actor";

	};

	/*
	 * auk.Actor#update()
	 * 
	 * Does the processing the actor needs to do every frame.
	 * 
	 * @param delay: the number of milliseconds to wait
	 */
	auk.Actor.prototype.update = function () {
		// Make a copy of this for callbacks
		var self = this;

		// Apply the physics logic
		self.x += 1;

		// Render the element in it's new location'
		self.html.style.webkitTransform = "translate3D("+self.x+"px, "+self.y+"px, "+self.z+"px)";

	};

}(window.auk = window.auk || {}));
