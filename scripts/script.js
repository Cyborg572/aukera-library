(function (auk) {

	"use strict";

	// Create a test map to use until more of this project is built
	var rooms = {},
	    terrain,
	    game,
	    player;
	
	auk.rooms = {};
	
	auk.rooms.test1 = {
		name:    "test1",
		gps:     [0, 0, 0],
		size:    [15, 8],
		adjacentRooms: [
			false,
			false,
			false,
			'test2',
			false,
			false,
			'test2',
			false
		],
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

	auk.rooms.test2 = {
		name:    "test2",
		gps:     [0, 0, 0],
		size:    [15, 8],
		adjacentRooms: [
			false,
			'test1',
			false,
			false,
			'test1',
			false,
			false,
			false
		],
		terrain: [
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 3, 3, 3, 3, 0, 0],
			[0, 0, 2, 2, 2, 2, 0, 0],
			[0, 0, 1, 1, 1, 1, 0, 0],
			[0, 0, 2, 2, 2, 2, 0, 0],
			[0, 0, 3, 3, 3, 3, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0,-1,-1,-1,-1,-1, 0],
			[0, 0,-1,-2,-2,-2,-1, 0],
			[0, 0,-1,-2,-3,-2,-1, 0],
			[0, 0,-1,-2,-2,-2,-1, 0],
			[0, 0,-1,-1,-1,-1,-1, 0],
			[0, 0, 0, 0, 0, 0, 0, 0]
		]
	};

	// Start a game
	game = new auk.Game(document.getElementById('display'), 64, auk.rooms.test1);

	// Initialize the game
	game.init();

	terrain = new auk.Terrain(game.room.size[0], game.room.size[1], game.room.terrain);

	game.addActor(terrain);
	terrain.render(game.room);

	player = game.addActor(
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

	player.updateSteps.push(function () {
		//console.log(this.game.adjacentRooms[3]);
		if (this.y < 0) {
			if (this.game.adjacentRooms[1]) {
				this.y = 7;
				this.game.setRoom(this.game.adjacentRooms[1]);
			} else {
				this.y = 0;
			}
		}
		if (this.x > 14) {
			if (this.game.adjacentRooms[4]) {
				this.x = 0;
				this.game.setRoom(this.game.adjacentRooms[4]);
			} else {
				this.x = 14;
			}
		}
		if (this.y > 7) {
			if (this.game.adjacentRooms[6]) {
				this.y = 0;
				this.game.setRoom(this.game.adjacentRooms[6]);
			} else {
				this.y = 7;
			}
		}
		if (this.x < 0) {
			if (this.game.adjacentRooms[3]) {
				this.x = 14;
				this.game.setRoom(this.game.adjacentRooms[3]);
			} else {
				this.x = 0;
			}
		}
	});

}(window.auk = window.auk || {}));
