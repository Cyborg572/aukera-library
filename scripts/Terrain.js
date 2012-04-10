/**
 * Terrain Rendering and management
 * 
 * This file extends the game engine to be able to render terrain included in
 * room objects. It half-emulates an actor in order to listen to the events
 * that it needs.
 */

(function (auk) {

	"use strict";

	// =======================================================================
	//	Create the Terrain constructor
	// =======================================================================

	/**
	 * Constructor for Terrain objects
	 *
	 * @param mapData An object containing all the data for the map
	 */

	auk.Terrain = function (width, height, startTerrain) {
		var tile,
		    x,
		    y;

		// Store the important information
		this.width = width;
		this.height = height;
		this.startTerrain = startTerrain;

		// Add the tiles array
		this.tiles = [];
		// Create a div to hold the tile html.
		this.html = document.createElement('div');

		// Create the necessary tile objects.
		for (x = 0; x < width; x += 1) {
			this.tiles[x] = [];
			for (y = 0; y < height; y += 1) {
				this.tiles[x][y] = new auk.Terrain.Tile(x, y);
				this.html.appendChild(this.tiles[x][y].html);
			}
		}
	};

	// =======================================================================
	//	Extend the constructor's prototype
	// =======================================================================

	/**
	 * Handles changing rooms
	 * 
	 * The game object calls this function whenver the room changes, giving
	 * the terrain a chance to adjust.
	 * 
	 * @param game The game object itself
	 */
	auk.Terrain.prototype.roomEnter = function (game) {
		// Just adjust all the heights
		this.render(game.room);
	};

	/**
	 * Returns an documentFragment containing the renered HTML for the
	 * terrain of the map
	 *
	 * @param room The room whose terrain needs rendering.
	 */
	auk.Terrain.prototype.render = function (room) {

		// Variable declaration
		var frag = document.createDocumentFragment(),
		    width = this.width,
		    height = this.height,
		    terrain = room.terrain,
		    tile,
		    adjacents = [],
		    x,
		    y,
		    z;

		for (x = 0; x < width; x += 1) {
			for (y = 0; y < height; y += 1) {

				// Grab the tile
				tile = this.tiles[x][y];

				// Get the tile's height, using || to fall back on 0.
				z = ( terrain[x] || [] )[y] || 0;

				// Get the adjacent heights, using ||'s to fall back to 0.
				adjacents[0] = ( terrain[x]     || [] )[y - 1] || 0;
				adjacents[1] = ( terrain[x + 1] || [] )[y]     || 0;
				adjacents[2] = ( terrain[x]     || [] )[y + 1] || 0;
				adjacents[3] = ( terrain[x - 1] || [] )[y]     || 0;

				// Set the tile's height
				tile.setHeight(z, adjacents);

				// Add all the basic classes
				tile.html.className = 'tile';
				tile.html.className += adjacents[0] === z ? ' connect-n' : '';
				tile.html.className += adjacents[1] === z ? ' connect-e' : '';
				tile.html.className += adjacents[2] === z ? ' connect-s' : '';
				tile.html.className += adjacents[3] === z ? ' connect-w' : '';

			}
		}

		return frag;

	};

	// =======================================================================
	//	Create the Tile constructor
	// =======================================================================

	/**
	 * Creates a Tile object
	 * 
	 * The tile object keeps track of a single tile of the terrain, and contains
	 * convenience functions for adjusting the height and whatnot.
	 */
	auk.Terrain.Tile = function (x, y) {

		// Create all the tile parts
		this.html = document.createElement('div');
		this.cap = document.createElement('div');
		this.walls = [
			document.createElement('div'),
			document.createElement('div'),
			document.createElement('div'),
			document.createElement('div')
		];

		// Configure each part
		this.html.className = "tile";
		this.html.style.webkitTransform = "translate3D("+x+"em, "+y+"em, 0px)";

		this.cap.className = "cap";
		this.cap.style.webkitTransitionDelay = (x/20) + "s";

		this.walls[0].className = "wall wall-N";
		this.walls[0].style.webkitTransitionDelay = (x/20) + "s";

		this.walls[1].className = "wall wall-E";
		this.walls[1].style.webkitTransitionDelay = (x/20) + "s";

		this.walls[2].className = "wall wall-S";
		this.walls[2].style.webkitTransitionDelay = (x/20) + "s";

		this.walls[3].className = "wall wall-W";
		this.walls[3].style.webkitTransitionDelay = (x/20) + "s";

		// Assemble it
		this.html.appendChild(this.walls[0]);
		this.html.appendChild(this.walls[1]);
		this.html.appendChild(this.walls[2]);
		this.html.appendChild(this.walls[3]);
		this.html.appendChild(this.cap);

	};

	/**
	 * Adjusts the height of the tile
	 * 
	 * Moves the cap and changes the widths and heights and positions of all
	 * the tile walls so that everything's at the right height an meets up with
	 * the adjacent cells properly.
	 * 
	 * @param h The height to set the tile to
	 * @param a An array containing the heights of the adjacent tiles
	 */
	auk.Terrain.Tile.prototype.setHeight = function (h, a) {
		// Move the Cap to the right height
		this.cap.style.webkitTransform = "translate3D(0px, 0px, "+(h/2)+"em)";

		// Adjust the walls
		// North
		if (h > a[0]) {
			this.walls[0].style.height = (h - a[0]) / 2 + 'em';
			this.walls[0].style.webkitTransform = "translate3D(0, 0, " + a[0]/2 + "em) rotateX(90deg)";
		} else {
			this.walls[0].style.height = 0;
		}

		// East
		if (h > a[1]) {
			this.walls[1].style.width = (h - a[1]) / 2 + 'em';
			this.walls[1].style.webkitTransform = "translate3D(0, 0, " + a[1]/2 + "em) rotateY(90deg)";
		} else {
			this.walls[1].style.width = 0;
			this.walls[1].style.webkitTransform = "translate3D(0, 0, 0) rotateY(90deg)";
		}

		// South
		if (h > a[2]) {
			this.walls[2].style.height = (h - a[2]) / 2 + 'em';
			this.walls[2].style.webkitTransform = "translate3D(0, 0, " + a[2]/2 + "em) rotateX(-90deg)";
		} else {
			this.walls[2].style.height = 0;
			this.walls[2].style.webkitTransform = "translate3D(0, 0, 0) rotateX(-90deg)";
		}

		// West
		if (h > a[3]) {
			this.walls[3].style.width = (h - a[3]) / 2 + 'em';
			this.walls[3].style.webkitTransform = "translate3D(0, 0, " + a[3]/2 + "em) rotateY(-90deg)";
		} else {
			this.walls[3].style.width = 0;
			this.walls[3].style.webkitTransform = "translate3D(0, 0, 0) rotateY(-90deg)";
		}

	};

}(window.auk = window.auk || {}));
