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

	auk.Actor.prototype.update = function () {
		this.html.style.webkitTransform = "translate3D("+this.x+"px, "+this.y+"px, "+this.z+"px)";
		this.x += 1;
	};

}(window.auk = window.auk || {}));
