/*
 * ---------------------------------------------------------------------------
 *	Game.js
 *	This file creates the core of the game engine, including the actor
 *	listing, and update loop.
 * ---------------------------------------------------------------------------
 */

(function (auk, undefined) {

	"use strict;"

	// "Global" variables
	auk.modules = [];

	/*
	 * Game constructor
	 *
	 * @param display: DOM object that will become the container for the game
	 *
	 */
	auk.Game = function (display) {

		// Global game variables
		this.actors = [];
		this.display = display;

	}

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
			this.actors[i].update(this);
		}

		// Run update again as soon as possible
		setTimeout(function() {that.update()}, 0);
	}

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
			auk.modules[i].init(this);
		}

		// Start the main loop
		this.update();

	}

	/*
	 * addActor
	 *
	 * Registers a new actor to be updated during the main loop
	 *
	 * @param actor: the actor to be added
	 */
	auk.Game.prototype.addActor = function (actor) {
		this.actors.push(actor);
		this.display.appendChild(actor.html);
	}

	/*
	 * removeActor
	 *
	 * Removes an actor from the game
	 *
	 * @param actor: the actor to remove from the game
	 */
	auk.Game.prototype.removeActor = function (actor) {
		
	}

}(window.auk = window.auk || {}));
