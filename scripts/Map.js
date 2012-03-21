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

				// break out  if there is not a tile here
				if (z === 0) {
					continue;
				}

				// Create a div for the tile and the cap
				tile = document.createElement('div');
				tileCap = document.createElement('div');
				// Put the cap into the tile
				tile.appendChild(tileCap);

				// Adjust the styles to position the tiles
				tile.style.left = x + 'em';
				tile.style.top = y + 'em';
				tile.style.zIndex = y;
				tileCap.style.top = '-' + z + 'px';
				tileCap.style.bottom = z + 'px';

				// Add all the basic classes
				tileClasses  = ['tile'];
				// Add classes for tile borders
				tileClasses.push(
					Math.abs(z - terrain[x][y-1]) < 5 ? 'connect-t' : '',
					Math.abs(z - terrain[x+1][y]) < 5 ? 'connect-r' : '',
					Math.abs(z - terrain[x][y+1]) < 5 ? 'connect-b' : '',
					Math.abs(z - terrain[x-1][y]) < 5 ? 'connect-l' : ''
				);

				// Add a wall div if the bottom face of the tile is visible.
				if (z - terrain[x][y+1] > 4) {
					tileWall = document.createElement('div');
					tileWall.className = 'wall';
					tile.appendChild(tileWall);
					tileWall.style.height = z + 'px';
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
