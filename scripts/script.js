(function () {

	"use strict";

	// Create a test map to use until more of this project is built
	var testMap,
	    mapObj;
	
	testMap = {
		name:    "Test Map",
		gps:     [0, 0, 0],
		size:    [15, 9],
		terrain: [
			[
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 1, 1, 1, 0],
				[0, 0, 0, 0, 1, 0, 1, 0],
				[0, 0, 0, 0, 1, 1, 1, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 1, 1, 0, 0, 0, 0],
				[0, 0, 1, 1, 0, 0, 0, 0],
				[0, 0, 1, 1, 0, 0, 0, 0],
				[0, 0, 0, 1, 0, 0, 0, 0],
				[0, 0, 0, 1, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0]
			]
		]
	};

	mapObj = new auk.Map(testMap);
	document.getElementById('map').appendChild(mapObj.renderTerrain());

}());
