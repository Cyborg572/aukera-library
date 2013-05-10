"use strict";
var auk = auk || {};

/*
 * ---------------------------------------------------------------------------
 *  Aukera.js
 *  This file creates the core of the game engine, the Gob object. Gobs are
 *  flexible objects that features can be added to in order to create the
 *  objects in a game. This file also contains a special Game object, which is
 *  a Gob with methods for running the game loop.
 * ---------------------------------------------------------------------------
 */

// "Global" variables
auk.modules = [];


// ========================================================================
//  The Gob Object
// ========================================================================

/**
 * The Gob object is an array of gobs with some extra methods for handling it's
 * children, including adding, removing, and passing along events.
 * @param {int} x      The Gob's X position in px.
 * @param {int} y      The Gob's Y position in px.
 * @param {int} z      The Gob's X position in px.
 * @param {int} width  The Gob's width in px.
 * @param {int} height The Gob's height in px.
 */
auk.Gob = function (x, y, z, width, height) {
	// Position the Gob
	this.x = x;
	this.y = y;
	this.z = z;
	this.width = width;
	this.height = height;

	// Game integration
	this.game = null;

	// feature mixin support
	this.eventSteps = {};

	this.childSteps = [];
	this.orphanSteps = [];
};
auk.Gob.prototype = [];

/**
 * Dispatches a given game event to the appropriate event step methods, and then
 * calls fireGameEvent again on all child gobs. If the children are not Gobs, it
 * falls back on calling a function with the event name.
 *
 * @param {string} eventName The name of the event to trigger.
 * @param {bool}   shallow   If true, the function will not recurse.
 */
auk.Gob.prototype.fireGameEvent = function (eventName, shallow) {
	var gobCount = this.length;
	var gob;
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

	for (i = 0; i < gobCount; i += 1) {
		gob = this[i];
		if (gob.fireGameEvent) {
			gob.fireGameEvent(eventName);
		} else if (gob[eventName]) {
			gob[eventName]();
		}
	}

	return this;
};

/**
 * Adds a new step function to execute for a given game event.
 *
 * @param {string}   eventName    The name of the event to add the function to.
 * @param {function} stepFunction The function to call.
 */
auk.Gob.prototype.addEventStep = function (eventName, stepFunction) {
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
auk.Gob.prototype.removeEventStep = function (eventName, stepFunction) {
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
 * Adds features to the object
 *
 * This is accomplished by calling the feature's addTo function on
 * this object. Using add() on the Gob allows chaining.
 *
 * @param feature: the feature to add
 * @param options: An options object to pass to the addTo function.
 */
auk.Gob.prototype.addFeature = function (feature, options) {

	if (feature.addTo) {
		feature.addTo(this, options);
	}

	return this;
};

/**
 * Removes a feature from the object
 *
 * This is accomplished by calling the features removeFrom function with this
 * object. Using remove() on the Gob allows chaining.
 *
 * @param  {feature} feature The feature to remove
 */
auk.Gob.prototype.removeFeature = function (feature) {

	if (feature.removeFrom) {
		feature.removeFrom(this);
	}

	return this;
};

/**
 * Adds a child gob. Removes it from it's former parent if necessary.
 *
 * @param  {gob} The gob to be added
 * @return {gob} The gob that was added.
 */
auk.Gob.prototype.addGob = function (gob) {
	// Remove from existing parent
	if (gob.parent && gob.parent.removeGob) {
		gob.parent.removeGob(gob);
	}

	// Add the gob
	gob.game = this.game;
	gob.parent = this;
	this.push(gob);

	if (gob.fireGameEvent) {
		gob.fireGameEvent('becomeChild');
	} else if (gob.becomeChild) {
		gob.becomeChild();
	}

	return this;
};

/**
 * Removes a child gob.
 *
 * @param gob: the child gob to remove
 */
auk.Gob.prototype.removeGob = function (gob) {
	var gobPos = this.indexOf(gob);

	if (gobPos !== -1) {

		if (gob.fireGameEvent) {
			gob.fireGameEvent('becomeOrphan');
		} else if (gob.becomeOrphan) {
			gob.becomeOrphan();
		}

		delete gob.game;
		delete gob.parent;
		this.splice(gobPos, 1);

	}

	return this;
};

// ========================================================================
//  The Game Object
// ========================================================================

/**
 * The Game object is a special Gob that calls it's own fireGameEvent function,
 * and can initialize modules. It also stores the grid size, and the
 * global-esque storage bucket.
 * @param {int} width  Width of the game in px.
 * @param {int} height Height of the game in px.
 */
auk.Game = function (width, height) {
	this.width = width;
	this.height = height;
	this.x = 0;
	this.y = 0;
	this.z = 0;

	// Global game variables
	this.loopSteps = ['update']; // Main loop sequence
	this.bucket = {}; // Storage for game objects not in use.

	// Since a Game is also a Gob, it needs to reference itself
	this.game = this;

};

// Set the Game prototype to be a Gob.
auk.Game.prototype = new auk.Gob();

/**
 * This method runs through the updated steps defined for this game and passes
 * them in sequence to fireGameEvent.
 */
auk.Game.prototype.doMainLoop = function () {
	var stepCount = this.loopSteps.length;
	var game = this;
	var i;

	// Run all the update functions
	for (i = 0; i < stepCount; i += 1) {
		this.fireGameEvent(this.loopSteps[i]);
	}

	// Run update again in 30ms
	setTimeout(function() {game.doMainLoop();}, 30);
};

/**
 * Calls the initialize functions for every extension, and starts the
 * main update loop
 */
auk.Game.prototype.init = function () {
	var moduleCount = auk.modules.length,
		i;

	// Run all the init functions
	for (i = 0; i < moduleCount; i += 1) {
		if (auk.modules[i].init) { auk.modules[i].init(this); }
	}

	// Start the main loop
	this.doMainLoop();

	return this;
};
