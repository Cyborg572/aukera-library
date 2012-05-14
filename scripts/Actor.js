/*jslint browser: true, devel: true */
/**
 * ---------------------------------------------------------------------------
 *  Actor.js
 *  This file defines a basic Actor object that can be inherited from
 * ---------------------------------------------------------------------------
 */

"use strict";
var auk = window.auk || {};

// =======================================================================
//  Create the Map constructor
// =======================================================================

/**
 * Constructor for actor objects
 *
 * @param posx: starting X position of the actor
 * @param posy: starting Y position of the actor
 * @param posz: starting Z position of the actor
 */

auk.Actor = function (posx, posy, posz, image) {

	// Position the actor
	this.x = posx;
	this.y = posy;
	this.z = posz;

	// Saves the path to the image
	this.image = image;

	// Game integration
	this.game = null;

	// feature mixin support
	this.updateSteps = [];

	// Attach the HTML
	this.html = document.createElement('div');
	this.html.className = "actor";

	// Add the image to the html
	this.imageHTML = document.createElement('img');
	this.imageHTML.src = this.image;
	this.html.appendChild(this.imageHTML);

};

/**
 * Does the processing the actor needs to do every frame.
 *
 * @param delay: the number of milliseconds to wait
 */
auk.Actor.prototype.update = function () {

	// Make a copy of this for callbacks
	var i;
	var steps = this.updateSteps;
	var sCount = steps.length;

	// Apply the features
	for (i = 0; i < sCount; i += 1) {
		steps[i].call(this);
	}

	// Render the element in it's new location'
	this.html.style[auk.transform] = "translate3D("+(this.x)+"em, "+(this.y)+"em, "+(this.z)+"em) rotateX(0deg)";

};

/**
 * Adds features to the object
 *
 * This is accomplished by calling the feature's addTo function on
 * this object. Using add() on the actor allows chaining.
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