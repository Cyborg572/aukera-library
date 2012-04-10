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

	auk.Map = function () {
		// Create a div to hold the tiles.
		this.html = document.createElement('div');
	};

	// =======================================================================
	//	Extend the constructor's prototype
	// =======================================================================

	/**
	 * Returns an documentFragment containing the renered HTML for the
	 * terrain of the map
	 *
	 * @param room The room whose terrain needs rendering.
	 */

	auk.Map.prototype.render = function (room) {

		// Variable declaration
		var frag = document.createDocumentFragment(),
		    m = Math,
		    width = room.size[0],
		    height = room.size[1],
		    terrain = room.terrain,
		    tile,
		    tileCap,
		    tileWalls = {},
		    tileClasses,
		    adjacentZ,
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
				//tile.style.left = x + 'em';
				//tile.style.top = y + 'em';
				//tile.style.zIndex = y;
				//tileCap.style.top = (-z/2) + 'em';
				//tileCap.style.bottom = (z/2) + 'em';
				tile.style.webkitTransform = "translate3D("+x+"em, "+y+"em, 0px)";
				tileCap.style.webkitTransform = "translate3D(0px, 0px, "+(z/2)+"em)";

				// Add all the basic classes
				tileClasses  = ['tile'];

				// Check adjacent tiles and add walls and borders
				
				// North
				adjacentZ = terrain[x][y-1] || 0;
				if (adjacentZ < z) {
					tileWalls.north = document.createElement('div');
					tileWalls.north.className = 'wall wall-N';
					tile.appendChild(tileWalls.north);
					tileWalls.north.style.height = (z - adjacentZ) / 2 + 'em';
					tileWalls.north.style.webkitTransform = "translate3D(0, 0, " + adjacentZ/2 + "em) rotateX(90deg)";
				} else if (adjacentZ === z) {
					tileClasses.push('connect-n');
				}

				// East
				adjacentZ = x < width-1 ? terrain[x+1][y] : 0;
				if (adjacentZ < z) {
					tileWalls.east = document.createElement('div');
					tileWalls.east.className = 'wall wall-E';
					tile.appendChild(tileWalls.east);
					tileWalls.east.style.width = (z - adjacentZ) / 2 + 'em';
					tileWalls.east.style.webkitTransform = "translate3D(0, 0, " + adjacentZ/2 + "em) rotateY(90deg)";
				} else if (adjacentZ === z) {
					tileClasses.push('connect-e');
				}

				// South
				adjacentZ = terrain[x][y+1] || 0;
				if (adjacentZ < z) {
					tileWalls.south = document.createElement('div');
					tileWalls.south.className = 'wall wall-S';
					tile.appendChild(tileWalls.south);
					tileWalls.south.style.height = (z - adjacentZ) / 2 + 'em';
					tileWalls.south.style.webkitTransform = "translate3D(0, 0, " + adjacentZ/2 + "em) rotateX(-90deg)";
				} else if (adjacentZ === z) {
					tileClasses.push('connect-s');
				}

				// West
				adjacentZ = x > 0 ? terrain[x-1][y] : 0;
				if (adjacentZ < z) {
					tileWalls.west = document.createElement('div');
					tileWalls.west.className = 'wall wall-W';
					tile.appendChild(tileWalls.west);
					tileWalls.west.style.width = (z - adjacentZ) / 2 + 'em';
					tileWalls.west.style.webkitTransform = "translate3D(0, 0, " + adjacentZ/2 + "em) rotateY(-90deg)";
				} else if (adjacentZ === z) {
					tileClasses.push('connect-w');
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
	//	Map library 'event' handlers
	// ========================================================================

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
		game.terrain = new auk.Map();
		game.display.appendChild(game.terrain.html);
	};


	auk.Map.roomEnter = function (game) {
		game.terrain.html.innerHTML = "";
		if (game.room.terrain) {
			game.terrain.html.appendChild(game.terrain.render(game.room));
		}
	};

}(window.auk = window.auk || {}));
