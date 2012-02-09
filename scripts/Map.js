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
		    width = this.data.size[0],
		    height = this.data.size[1],
		    layers = this.data.terrain,
		    layerCount = this.data.terrain.length,
		    tile,
		    tileClasses,
		    tileType,
		    layer,
		    curL,
		    loopX,
		    loopY,
		    loopZ;

		for (loopZ = 0; loopZ < layerCount; loopZ += 1) {

			// Create a div for the current layer of the map
			layer = document.createElement('div');

			// Add appropriate layer classes
			layer.className = [
				'layer',
				'layer' + loopZ
			].join(' ');

			curL = layers[loopZ];

			for (loopX = 0; loopX < width; loopX += 1) {
				for (loopY = 0; loopY < height; loopY += 1) {

					// Determine the tile type
					tileType = curL[loopX][loopY];

					// break out  if there is a not tile here
					if (tileType === 0) {
						continue;
					}

					// Create a div for the tile
					tile = document.createElement('div');

					// Add all the basic classes
					tileClasses  = [
						'tile',
						'x' + loopX,
						'y' + loopY,
					];

					// Blocks
					if (tileType === 1 || tileType === 2) {
						tileClasses.push('block');
						tileClasses.push('height' + tileType);
					}

					// Ramps
					if (tileType === 'n'
					 || tileType === 'e'
					 || tileType === 's'
					 || tileType === 'w' ) {
						tileClasses.push('lowRamp');
						tileClasses.push('ascend'+tileType);
					}

					// Ramps
					if (tileType === 'N'
					 || tileType === 'E'
					 || tileType === 'S'
					 || tileType === 'W' ) {
						tileClasses.push('highRamp');
						tileClasses.push('ascend'+tileType);
					}


					// Add the classes to the tile
					tile.className = tileClasses.join(' ');

					// Add the tile to the layer
					layer.appendChild(tile);

				}
			}

			// Add the layer to the fragment
			frag.appendChild(layer);

		}

		return frag;

	};

}(window.auk = window.auk || {}));
