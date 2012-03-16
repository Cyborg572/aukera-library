/*jslint browser: true, devel: true */
/*
 * ---------------------------------------------------------------------------
 *	Keybinding.js
 *	This file extends the game engine to support keyboard events mapped to
 *	named actions. It does not allow functions to run when keys are pressed,
 *	but merely tracks and updates the keyboard state for objects that do.
 * ---------------------------------------------------------------------------
 */

(function (auk) {

	"use strict";

	// =======================================================================
	//	Private Properties
	// =======================================================================

	var bindings = [];

	// =======================================================================
	//	Private Methods
	// =======================================================================

	/*
	 * keyHandler()
	 * 
	 * An event listener that can be tied to window's keydown and keyup event
	 * to update all the bindings.
	 * 
	 * @param e: The keyboard event. 
	 */
	function keyHandler(e) {
		// Get e even if IE hides it
		e = e || window.event;

		var key = e.keyCode || e.which,
		    bindingCount = bindings.length,
		    b,
		    i;

		// Check all the binding objects to see if they want this keys state
		for (i = 0; i < bindingCount; i += 1) {
			b = bindings[i];
			if (key in b.keymap) {
				// Stop the browser from using this key
				e.preventDefault();
				// Set the keys state based on the event type
				b.setState(b.keymap[key], e.type === 'keydown');
			}
		}

	}

	// =======================================================================
	//	Create the keybinding constructor
	// =======================================================================

	/*
	 * auk.Keybinding();
	 * 
	 * Constructor for Keybinding objects
	 * 
	 * @param keymap: An object containing the named actions in the mapping, keyed
	 *             Key code.
	 */
	auk.Keybinding = function (keymap) {
		var mapLength = keymap.length,
		    key;

		// Attach the keymap to the object
		this.keymap = keymap;

		// Initialize the state object
		this.states = {};

		// Add this binding to the list
		bindings.push(this);

	};

	/*
	 * auk.Keybinding#getState()
	 * 
	 * Returns the value of the requested state.
	 * 
	 * @param state: the state command to check for
	 */
	auk.Keybinding.prototype.getState = function (state) {
		// Check if the state is even defined
		if (typeof this.states[state] === 'undefined') {
			return false;
		} else {
			// Return the actual state
			return this.states[state];
		}
		
	};

	/*
	 * auk.Keybinding#setState()
	 * 
	 * Sets the value of the requested state.
	 * 
	 * @param state: the state to set
	 * @param value: the value to set it to
	 */
	auk.Keybinding.prototype.setState = function (state, value) {
		// Only update when there's a change
		if (this.getState(state) !== value) {
			this.states[state] = value;
		}
	};

	// =======================================================================
	//	Libray initialization
	// =======================================================================

	/*
	 * auk.Keybinding.init();
	 * 
	 * A function called by the init event of the game that sets up everything
	 * this library needs in order to function.
	 */
	auk.Keybinding.init = function () {
		window.onkeydown = keyHandler;
		window.onkeyup = keyHandler;
	};

	// Add this library to the init que
	auk.modules.push(auk.Keybinding);

}(window.auk = window.auk || {}));
