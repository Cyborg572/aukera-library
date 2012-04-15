/*
 * ---------------------------------------------------------------------------
 *	Game.js
 *	This file creates the core of the game engine, including the actor
 *	listing, and update loop.
 * ---------------------------------------------------------------------------
 */

(function (auk) {

	"use strict";

	// "Global" variables
	auk.modules = [];

	/**
	 * Game constructor
	 *
	 * @param display the DOM object that will become the container for the game
	 * @param grid    the size of the game's grid, in pixels.
	 */
	auk.Game = function (display, grid, startRoom) {

		// Global game variables
		this.actors = []; // Stores dynamic game objects
		this.display = display; // The HTML to render the game in
		this.grid = grid; // The size of 1 grid unit
		// Storage for game objects not in use.
		this.bucket = {
			rooms:{}
		};
		// Eight adjacent rooms, false means there's nothing loaded there yet.
		this.adjacentRooms = [
			false, false, false, false, false, false, false, false
		];

		this.room = startRoom; // The first room to load

		// Set the display's font size to the grid size so em units work as an
		// automatic converter from grid units to px.
		this.display.style.fontSize = this.grid+'px';

	};

	/*
	 * Update function
	 *
	 * This function runs through all the actors in the game, and calls their
	 * update function. When it's done it calls itself again with a 0 timeout.
	 */
	auk.Game.prototype.update = function () {
		var actorCount = this.actors.length,
			that = this,
		    i;

		// Run all the update functions
		for (i = 0; i < actorCount; i += 1) {
			if (this.actors[i].update) { this.actors[i].update(); }
		}

		// Run update again as soon as possible
		setTimeout(function() {that.update();}, 30);
	};

	/*
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

		// Set the first room
		this.setRoom(this.loadRoom(this.room));

		// Start the main loop
		this.update();

	};

	/**
	 * Sets the room that game will use.
	 * 
	 * @param room An object with all the room data.
	 */
	auk.Game.prototype.setRoom = function (room) {
		var actorCount = this.actors.length,
		    i;
		this.room = room;

		// Start loading the adjacent rooms.
		this.loadAdjacentRooms();

		// Run all the roomEnter functions
		for (i = 0; i < actorCount; i += 1) {
			if (this.actors[i].roomEnter) { this.actors[i].roomEnter(this); }
		}
	};

	/**
	 * Downloads the new rooms from the server.
	 */
	auk.Game.prototype.loadAdjacentRooms = function () {
		var a = this.room.adjacentRooms || [false, false, false, false, false, false, false, false],
		    i;

		for (i = 0; i < 8; i +=1) {
			this.adjacentRooms[i] = a[i] ? this.loadRoom(a[i]) : false;
		}
	};

	/**
	 * Loads a room from the bucket.
	 * 
	 * @param room The name of the room to load
	 */
	auk.Game.prototype.loadRoom = function (room) {
		var game = this;
		return game.bucket.rooms[room] || false;
	};

	/*
	 * addActor
	 *
	 * Registers a new actor to be updated during the main loop
	 *
	 * @param actor: the actor to be added
	 * @return The actor that was added.
	 */
	auk.Game.prototype.addActor = function (actor) {
		// Let the actor know what game it's part of
		actor.game = this;

		// Actually add the actor to the game
		this.actors.push(actor);
		this.display.appendChild(actor.html);

		// Return the actor, makes for a nicer API
		return actor;
	};

	/*
	 * removeActor
	 *
	 * Removes an actor from the game
	 *
	 * @param actor: the actor to remove from the game
	 */
	auk.Game.prototype.removeActor = function (actor) {
		
	};

}(window.auk = window.auk || {}));
