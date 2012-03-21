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
		    m = Math,
		    width = this.data.size[0],
		    height = this.data.size[1],
		    terrain = this.data.terrain,
		    tile,
		    tileCap,
		    tileWall,
		    tileClasses,
		    x,
		    y,
		    z;

		for (x = 0; x < width; x += 1) {
			for (y = 0; y < height; y += 1) {

				// Determine the tiles height
				z = terrain[x][y];

				// Create a div for the tile and the cap
				tile = document.createElement('div');
				tileCap = document.createElement('div');
				// Put the cap into the tile
				tile.appendChild(tileCap);

				// Adjust the styles to position the tiles
				tile.style.left = x + 'em';
				tile.style.top = y + 'em';
				tile.style.zIndex = y;
				tileCap.style.top = '-' + (z/2) + 'em';
				tileCap.style.bottom = (z/2) + 'em';

				// Add all the basic classes
				tileClasses  = ['tile'];

				// Add classes for tile borders
				tileClasses.push(
					(terrain[x][y-1] || 0) === z ? 'connect-t' : '',
					(x < width-1 ? terrain[x+1][y] : 0) === z ? 'connect-r' : '',
					(terrain[x][y+1] || 0) === z ? 'connect-b' : '',
					(x > 0 ? terrain[x-1][y] : 0) === z ? 'connect-l' : ''
				);

				// Add a wall div if the bottom face of the tile is visible.
				if (terrain[x][y+1] || 0 < z) {
					tileWall = document.createElement('div');
					tileWall.className = 'wall';
					tile.appendChild(tileWall);
					tileWall.style.height = (z/2) + 'em';
				}

				// Add the classes to the tile
				tile.className = tileClasses.join(' ');
				tileCap.className = 'cap';
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
