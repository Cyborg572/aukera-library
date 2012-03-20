/*
 * ---------------------------------------------------------------------------
 *	Map.js
 *	This file extends the game engine to be able to use map files that are
 *	sent from the server as jSon objects
 * ---------------------------------------------------------------------------
 */

(function (auk) {

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
		this.data = mapData;

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
		    width = this.data.size[0],
		    height = this.data.size[1],
		    terrain = this.data.terrain,
		    tile,
		    tileClasses,
		    x,
		    y,
		    z;

		for (x = 0; x < width; x += 1) {
			for (y = 0; y < height; y += 1) {

				// Determine the tile type
				z = terrain[x][y];

				// break out  if there is a not tile here
				if (z === 0) {
					continue;
				}

				// Create a div for the tile
				tile = document.createElement('div');

				// Add all the basic classes
				tileClasses  = [
					'tile',
					'block',
					'x' + x,
					'y' + y,
					'height-' + z
				];

				// Add classes for tile borders
				tileClasses.push(
					terrain[x][y-1] >= z ? 'connect-t' : '',
					terrain[x+1][y] >= z ? 'connect-r' : '',
					terrain[x][y+1] >= z ? 'connect-b' : '',
					terrain[x-1][y] >= z ? 'connect-l' : ''
				);

				// Add the classes to the tile
				tile.className = tileClasses.join(' ');

				// Throw an extra div into the tile
				tile.appendChild(document.createElement('div'));

				// Add the tile to the layer
				frag.appendChild(tile);

			}
		}

		return frag;

	};

	// ========================================================================
	//	Map library init funtion
	// =======================================================================

	/*
	 * Map.init
	 *
	 * Called during a Game objects init function to set up map support
	 *
	 * @param game: The game object to configure
	 *
	 */

	auk.modules.push(auk.Map);

	auk.Map.init = function (game) {
	};

}(window.auk = window.auk || {}));
