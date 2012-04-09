(function (auk) {

	"use strict";

	// Create a test map to use until more of this project is built
	var testMap,
	    mapObj,
	    game,
	    actor;
	
	testMap = {
		name:    "Test Map",
		gps:     [0, 0, 0],
		size:    [15, 8],
		terrain: [
			[0, 0, 0, 0, 0, 0, 1, 0],
			[0, 3, 2, 2, 1, 0, 0, 0],
			[0, 3, 2, 1, 0, 0, 0, 4],
			[0, 3, 2, 1, 0, 0, 0, 4],
			[0, 3, 2, 1, 0, 0, 0, 0],
			[0, 3, 2, 2, 1, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[1, 0, 0, 0, 0, 0, 0, 0],
			[1, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 1, 1, 1, 1, 1, 0],
			[0, 0, 1, 2, 2, 2, 1, 0],
			[0, 0, 1, 2, 3, 2, 1, 0],
			[0, 0, 1, 2, 2, 2, 1, 0],
			[0, 0, 1, 1, 1, 1, 1, 0],
			[0, 0, 0, 3, 3, 3, 0, 0]
		]
	};

	mapObj = new auk.Map(testMap);
	document.getElementById('map').appendChild(mapObj.renderTerrain());
	game = new auk.Game(document.getElementById('map'), 64);
	game.init();

	game.addActor(
		(new auk.Actor(5,5,6))
		.add(new auk.Keybinding({
			87 : 'up',
			68 : 'right',
			83 : 'down',
			65 : 'left',
			32 : 'jump'
		}))
		.add(auk.physics.jump, {power: 35})
		.add(auk.physics.motor, {speed: 6})
	);

}(window.auk = window.auk || {}));
