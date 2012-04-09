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

		// Position the actor
		this.x = posx;
		this.y = posy;
		this.z = posz;

		// Game integration
		this.game = null;

		// feature mixin support
		this.updateSteps = [];

		// Attach the HTML
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
		var self = this,
		    steps = this.updateSteps,
		    sCount = steps.length,
		    i;

		// Apply the features
		for (i = 0; i < sCount; i += 1) {
			steps[i].call(this);
		}

		// Render the element in it's new location'
		self.html.style.webkitTransform = "translate3D("+(self.x/100)+"em, "+(self.y/100)+"em, "+(self.z/100)+"em) rotateX(-90deg)";
		//self.html.style.zIndex = Math.ceil((self.y/100)  > 0 ? (self.y/100) : 0);
	};

	/*
	 * auk.Actor#add();
	 * 
	 * Adds features to the object by calling the feature's addTo function on
	 * this object. using add() on the actor allows chaining.
	 * 
	 * @param feature: the feature to add
	 * @param options: An options object to pass to the addTo function.
	 */
	auk.Actor.prototype.add = function (feature, options) {
		if (feature.addTo) {
			feature.addTo(this, options);
		}
		return this;
	};

}(window.auk = window.auk || {}));
