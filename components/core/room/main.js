/*jshint immed:true latedef:true newcap:true strict:true globalstrict:true */
"use strict"; var auk = auk || {};

// ========================================================================
//  The Room Object
// ========================================================================

/**
 * Room constructor function
 *
 * @param game The game this room will be used in.
 */
auk.Room = function (game) {
	this.game = game; // The game this room belongs to
	this.data = false; // The room data from the server
	this.initialized = false; // Whether or not the room is initialized
	this.actors = []; // All the actors in the room

	// Stores the rooms surrounding this room.
	// TODO: Actually store the rooms surrounding this room.
	this.toThe = {
		ne: false,
		n:  false,
		nw: false,
		w:  false,
		sw: false,
		s:  false,
		se: false,
		e:  false
	};

	// Create the room HTML
	this.html = document.createElement('div');
	this.html.className = "room";
};

/**
 * Initializes a room
 *
 * @param data New map data for the room
 * @return The room itself.
 */
auk.Room.prototype.init = function (data) {
	var mCount = auk.modules.length;
	var aCount;
	var i;

	this.data = data;

	// Give all the modules a chance to parse the room.
	for (i = 0; i < mCount; i += 1) {
		if (auk.modules[i].roomInit) {
			auk.modules[i].roomInit(this);
		}
	}

	// Initialize all the actors
	aCount = this.actors.length;
	for (i = 0; i < aCount; i += 1) {
		if (this.actors[i].roomEnter) {
			this.actors[i].roomEnter();
		}
	}
	this.initialized = true;

	return this;
};

/**
 * Calls all the update functions of the actors
 */
auk.Room.prototype.update = function () {
	var actorCount = this.actors.length;
	var i;

	// Run all the update functions
	for (i = 0; i < actorCount; i += 1) {
		if (this.actors[i].update) { this.actors[i].update(); }
	}
};

/**
 * Pauses everything in a room
 */
auk.Room.prototype.freeze = function () {
};

/**
 * Starts everything in a room again
 *
 * @param game The game this room is being thawed for.
 */
auk.Room.prototype.thaw = function (game) {
};

/**
 * addActor
 *
 * Registers a new actor to be updated during the main loop. Usually called
 * after the actor has already been added to the game.
 *
 * @param actor The actor to be added
 * @return The actor that was added.
 */
auk.Room.prototype.addActor = function (actor) {
	// Let the actor know what room it's part of
	actor.room = this;

	// Actually add the actor to the game
	this.actors.push(actor);
	this.html.appendChild(actor.html);

	// Return the actor, makes for a nicer API
	return actor;
};

/**
 * Removes an actor from a room
 *
 * @param actor The actor to remove
 */
auk.Room.prototype.removeActor = function (actor) {
	this.html.removeChild(actor.html);
	this.actors.splice(this.actors.indexOf(actor), 1);
};
