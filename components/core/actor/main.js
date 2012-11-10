/*jshint immed:true latedef:true newcap:true strict:true globalstrict:true */
"use strict"; var auk = auk || {};

/**
 * ---------------------------------------------------------------------------
 *  Actor
 *
 *  This file defines a basic Actor object that can be inherited from
 * ---------------------------------------------------------------------------
 */

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
	this.eventSteps = {};

	// Attach the HTML
	this.html = document.createElement('div');
	this.html.className = "actor";

	// Add the image to the html
	this.imageHTML = document.createElement('img');
	this.imageHTML.src = this.image;
	this.html.appendChild(this.imageHTML);

/**
 * Adds a new step function to execute for a given game event.
 *
 * @param {string}   eventName    The name of the event to add the function to.
 * @param {function} stepFunction The function to call.
 */
auk.Actor.prototype.addEventStep = function (eventName, stepFunction) {
	if (!this.eventSteps.hasOwnProperty(eventName)) {
		this.eventSteps[eventName] = [];
	}
	this.eventSteps[eventName].push(stepFunction);
	return this;
};

/**
 * Removes the given function from the given event.
 *
 * @param  {sting}    eventName    The name of the event to remove the function
 *                                 from.
 * @param  {function} stepFunction The function to remove.
 */
auk.Actor.prototype.removeEventStep = function (eventName, stepFunction) {
	var functionIndex;
	if (this.eventSteps[eventName]) {
		functionIndex = this.eventSteps[eventName].indexOf(stepFunction);
		if (functionIndex !== -1) {
			this.eventSteps[eventName].splice(functionIndex, 1);
		}
	}
	return this;
};

/**
 * Handels game events by running through the steps defined for those events.
 *
 * @param {eventName} The name of the event to react to.
 */
auk.Actor.prototype.fireGameEvent = function (eventName) {
	var steps;
	var stepCount;
	var i;

	if (this.eventSteps[eventName]) {
		steps = this.eventSteps[eventName];
		stepCount = steps.length;
		for (i = 0; i < stepCount; i += 1) {
			steps[i].call(this);
		}
	}

	// Render the element in it's new location'
	this.html.style[auk.transform] = "translate3D("+(this.x)+"em, "+(this.y)+"em, "+(this.z)+"em) rotateX(0deg)";

	return this;
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

/**
 * Removes a feature from the object
 *
 * This is accomplished by calling the features removeFrom function with this
 * object. Using remove() on the actor allows chaining.
 *
 * @param  {feature} feature The feature to remove
 */
auk.Actor.prototype.remove = function (feature) {

	if (feature.removeFrom) {
		feature.removeFrom(this);
	}

	return this;
};
