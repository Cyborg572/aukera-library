(function () {

	"use strict";

	// Create a test map to use until more of this project is built
	var testMap,
	    mapObj;
	
	testMap = {
		name:    "Test Map",
		gps:     [0, 0, 0],
		size:    [15, 8],
		terrain: [
			[
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 1, 1, 1, 0],
				[0, 0, 0, 0, 1, 2, 1, 0],
				[0, 0, 0, 0, 1,'W', 1, 0],
				[0, 0, 0, 'e', 0,'w', 0, 0],
				[0, 0, 0, 'E', 0, 0, 0, 0],
				[0, 0, 1, 2, 0, 0, 0, 0],
				[0, 0, 1, 2, 0, 0, 0, 0],
				[0, 0, 1, 2, 0, 0, 0, 0],
				[0, 's', 'S', 2, 'N', 'n', 0, 0],
				[0, 's', 'S', 2, 'N', 'n', 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0]
			]
		]
	};

	mapObj = new auk.Map(testMap);
	document.getElementById('map').appendChild(mapObj.renderTerrain());

}());
