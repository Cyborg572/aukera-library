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


// ========================================================================
//  The Gob Object
// ========================================================================

/**
 * The Gob object is an array of gobs with some extra methods for handling it's
 * children, including adding, removing, and passing along events.
 */
auk.Gob = function () {};
auk.Gob.prototype = [];

/**
 * Dispatches a given game event to the appropriate method, and then calls
 * fireGameEvent again on all child gobs. If the children are not Gobs, it falls
 * back on calling a function with the event name.
 *
 * @param  {string} eventName The name of the event to trigger
 */
auk.Gob.prototype.fireGameEvent = function (eventName) {
	var gobCount = this.length;
	var gob;
	var i;

	if (this[eventName]) {
		this[eventName]();
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
 * Adds a child gob. Removes it from it's former parent if necessary.
 *
 * @param  {gob} The gob to be added
 * @return {gob} The gob that was added.
 */
auk.Gob.prototype.addGob = function (gob) {
	// Remove from existing parent
	if (gob.parentGob && gob.parentGob.removeGob) {
		gob.parentGob.removeGob(gob);
	}

	// Add the gob
	gob.game = this.game;
	gob.parentGob = this;
	this.push(gob);

	if (gob.becomeChildGob) {
		gob.becomeChildGob(this);
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
		delete gob.game;
		delete gob.parentGob;
		this.splice(gobPos, 1);

		if (gob.becomeOrphanGob) {
			gob.becomeOrphanGob(this);
		}
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
 *
 * @param display   The DOM object that will become the container for the game
 * @param grid      The size of the game's grid, in pixels.
 */
auk.Game = function (grid) {

	// Global game variables
	this.grid = grid; // The size of 1 grid unit
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
