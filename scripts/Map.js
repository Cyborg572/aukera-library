/*
 * ---------------------------------------------------------------------------
 *	Map.js
 *	This file extends the game engine to be able to use map files that are
 *	sent from the server as jSon objects
 * ---------------------------------------------------------------------------
 */

(function (auk, undefined) {

	"use strict";

	// =======================================================================
	//	Create the Map constructor
	// =======================================================================

	/*
	 * auk.Map()
	 *
	 * Constructor for Map objects
	 *
	 * @param mapData An object containing all the data for the map
	 *
	 */

	auk.Map = function (mapData) {

		// Store the mapData object internally
		this.data = mapData

		// Make some references to the import parts of the data
		this.gps = this.data.gps;

	};

	// =======================================================================
	//	Extend the constructor's prototype
	// =======================================================================

	/*
	 * {Map}.renderTerrain
	 *
	 * Returns an documentFragment containing the renered HTML for the
	 * terrain of the map
	 *
	 */

	auk.Map.prototype.renderTerrain = function () {

		// Variable declaration
		var frag = document.createDocumentFragment(),
		    width = this.data.size.x,
		    height = this.data.size.y,
		    tile,
		    tileClasses,
		    loopX,
		    loopY;

		

	};

}(window.auk = window.auk || {}));
