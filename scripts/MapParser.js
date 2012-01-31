/*
 * ---------------------------------------------------------------------------
 *  MapParser.js
 *
 *  This object parses maps and returns HTML output representing the map.
 *
 * ---------------------------------------------------------------------------
 */


var MapParser = {};

// Set up some default properties of maps
MapParser.sizeX = 15;
MapParser.sizeY = 8;

MapParser.parse = function (mapText) {

	var map,
	    tile,
	    tileClasses,
	    loopX,
	    loopY;

	// Create the map itself
	map = document.createElement('div');
	map.className = "map";

	// Loop through the map data, and generate nodes
	for (loopX = 0; loopX < this.sizeX; loopX++) {
		for (loopY = 0; loopY < this.sizeY; loopY++) {
			tileClasses = [
				'tile',
				'x' + loopX,
				'y' + loopY,
				'height' + mapText[loopX][loopY]
			];
			tile = document.createElement('div');
			tile.className = tileClasses.join(' ');
			map.appendChild(tile);
		}
	}

	// Return all the tiles
	return map;

}

