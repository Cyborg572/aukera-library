/*
 * ---------------------------------------------------------------------------
 *	Game.js
 *	This file creates the core of the game engine, including the actor
 *	listing, and update loop. Room objects are also included here, since they
 *  are a core part of the game engine.
 * ---------------------------------------------------------------------------
 */

(function (auk) {

	"use strict";

	// "Global" variables
	auk.modules = [];

	// Temporary fix for cross-browser 3D transforms
	auk.transform = (function(){
		var test = document.getElementsByTagName('script')[0];
		
		if ("transform" in test.style) {
			return "transform";
		} else if ("WebkitTransform" in test.style) {
			return "WebkitTransform";
		} else if ("MozTransform" in test.style) {
			return "MozTransform";
		} else if ("OTransform" in test.style) {
			return "OTransform";
		} else if ("mTransform" in test.style) {
			return "mTransform";
		} else {
			alert("Your browser does not support CSS 3D transforms");
			window.location.href = "/";
		}
		
	}());

	/**
	 * Game constructor
	 *
	 * @param display the DOM object that will become the container for the game
	 * @param grid    the size of the game's grid, in pixels.
	 */
	auk.Game = function (display, grid, startRoom) {

		// Global game variables
		this.actors = []; // Stores dynamic game objects
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

		// Configure the HTML and css
		this.display = display;
		this.layers = {};
		this.display.className += " auk_display";
		this.display.style.fontSize = this.grid+'px';
		this.world = document.createElement('div');
		this.world.className = "auk_world";
		this.display.appendChild(this.world);
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
		/*for (i = 0; i < actorCount; i += 1) {
			if (this.actors[i].update) { this.actors[i].update(); }
		}*/

		this.room.update();

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
		var actorCount = room.actors.length,
		    i;

		// Remove the old room from the screen
		if (this.room.html) {
			this.world.removeChild(this.room.html);
		}

		// Remove the old adjacent rooms
		for (i = 0; i < 8; i +=1) {
			if (this.adjacentRooms[i].html) {
				this.adjacentRooms[i].html.style[auk.transform] = "";
				this.world.removeChild(this.adjacentRooms[i].html);
			}
		}

		// Load the new room.
		this.room = room;
		this.world.appendChild(this.room.html);

		// Start loading the adjacent rooms.
		this.loadAdjacentRooms();

		var transforms = [
			"Translate3D(-15em, -8em, 0)",
			"Translate3D(  0em, -8em, 0)",
			"Translate3D( 15em, -8em, 0)",
			"Translate3D(-15em,  0em, 0)",
			"Translate3D( 15em,  0em, 0)",
			"Translate3D(-15em,  8em, 0)",
			"Translate3D(  0em,  8em, 0)",
			"Translate3D( 15em,  8em, 0)"
		];

		for (i = 0; i < 8; i +=1) {
			if (this.adjacentRooms[i] && this.adjacentRooms[i].html) {
				this.world.appendChild(this.adjacentRooms[i].html);
				this.adjacentRooms[i].html.style[auk.transform] = transforms[i];
			}
		}

	};

	/**
	 * Downloads the new rooms from the server.
	 */
	auk.Game.prototype.loadAdjacentRooms = function () {
		var a = this.room.data.adjacentRooms || [false, false, false, false, false, false, false, false],
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
		return this.bucket.rooms[room] || false;
	};

	/**
	 * addActor
	 *
	 * Registers a new actor to be updated during the main loop
	 *
	 * @param actor The actor to be added
	 * @param room  (optional) The room to add the actor to
	 * @return The actor that was added.
	 */
	auk.Game.prototype.addActor = function (actor, room) {
		// Let the actor know what game it's part of
		actor.game = this;

		// Add the actor to the game
		(room || this.room).addActor(actor);

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

	// ========================================================================
	//  The Room Object
	// ========================================================================
	
	/**
	 * Room constructor function
	 * 
	 * @param game The game this room will be used in.
	 */
	auk.Room = function (game) {
		this.game = game;
		this.data = false;
		this.initialized = false;
		this.actors = [];
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
		var mCount = auk.modules.length,
		    aCount,
		    i;

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
		var actorCount = this.actors.length,
		    i;

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

}(window.auk = window.auk || {}));
