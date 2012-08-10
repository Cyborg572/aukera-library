/*jshint immed:true latedef:true newcap:true strict:true globalstrict:true */
"use strict"; var auk = auk || {};

/*
 * ---------------------------------------------------------------------------
 *  Game.js
 *  This file creates the core of the game engine, including the actor
 *  listing, and update loop. Room objects are also included here, since they
 *  are a core part of the game engine.
 * ---------------------------------------------------------------------------
 */

// "Global" variables
auk.modules = [];

auk.Gob = function () {
	this.recurse = false;

	// Relay to gobify if any arguments are given.
	if (arguments.length > 0) {
		return auk.Gob.gobify.apply(auk.Gob, arguments);
	}
};

auk.Gob.prototype = {};

/**
 * Dispatches a given game event to the appropriate method, and then calls
 * gameEvent again on all child Gobs.
 *
 * @param  {string} eventName The name of the event to trigger
 * @return {}
 */
auk.Gob.prototype.gameEvent = function (eventName) {
	var gobCount = this.length;
	var gob;
	var i;

	if (this[eventName]) {
		this[eventName]();
	}

	if (this.recurse) {
		for (i = 0; i < gobCount; i += 1) {
			gob = this[i];
			if (gob.gameEvent) {
				gob.gameEvent(eventName);
			} else if (gob instanceof Array) {
				auk._gameEventRecursive.call(gob, eventName);
			} else {
				auk._gameEvent.call(gob, eventName);
			}
		}
	}

	return this;
};

/**
 * addGob
 *
 * Registers a new Gob to be updated during the main loop.
 *
 * @param gob The gob to be added
 * @return The gob that was added.
 */
auk.Gob.prototype.addGob = function (gob) {
	// Let the gob know what game it's part of
	gob.game = this.game;
	gob.parentGob = this;

	// Add the gob to the game
	this.push(gob);

	// Return the gob, makes for a nicer API
	return gob;
};

/**
 * removeGob
 *
 * Removes an gob from the game, by removing it from the actors array.
 *
 * @param gob: the gob to remove from the game
 */
auk.Gob.prototype.removeGob = function (gob) {
	// The gob is no longer part of a game
	gob.game = null;
	gob.parentGob = null;

	// Remove the gob from the game
	this.splice(this.indexOf(gob), 1);
};

/**
 * Turns any object into a Gob by attaching the proper all of the methods of a
 * Gob object.
 *
 * @param {} futureGob The object to be gobified.
 * @param {boolean} recurse whether the gob should be recursive or not.
 * @returns {} FutureGob, but with a new gameEvent method.
 */
auk.Gob.gobify = function (futureGob, recurse) {
	var i;
	for (i in auk.Gob.prototype) {
		futureGob[i] = auk.Gob.prototype[i];
	}

	if ((typeof recurse === 'undefined' || recurse) && futureGob instanceof Array) {
		futureGob.recurse = true;
	}

	return futureGob;
};

// ========================================================================
//  The Game Object
// ========================================================================

/**
 * Game constructor
 *
 * @param display   The DOM object that will become the container for the game
 * @param grid      The size of the game's grid, in pixels.
 */
auk.Game = function (grid) {

	// Global game variables
	this.grid = grid; // The size of 1 grid unit
	this.loopSteps = ['update']; // Mainloop sequence
	this.bucket = {}; // Storage for game objects not in use.

	// Since a Game is also a GOB, it needs to reference itself
	this.game = this;

};

// Set the Game prototype to be a Gob.
auk.Game.prototype = auk.Gob.gobify([]);

/**
 * Update function
 *
 * This function runs through all the high-level objects in the game that
 * have update functions. Just the main room at this point in time. Future
 * updates will probably abstract this a bit more.
 */
auk.Game.prototype.mainLoop = function () {
	var stepCount = this.loopSteps.length;
	var game = this;
	var i;

	// Run all the update functions
	for (i = 0; i < stepCount; i += 1) {
		this.gameEvent(this.loopSteps[i]);
	}

	// Run update again in 30ms
	setTimeout(function() {game.mainLoop();}, 30);
};

/**
 * Init function
 *
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
	this.mainLoop();

};
