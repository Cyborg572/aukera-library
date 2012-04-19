(function (auk) {

	"use strict";

	// Create a test map to use until more of this project is built
	var game,
	    terrain,
	    test1,
	    test2,
	    room,
	    player;
	
	test1 = {
		name:    "test1",
		gps:     [0, 0, 0],
		size:    [15, 8],
		adjacentRooms: [
			"test2",
			"test3",
			"test4",
			"test5",
			"test6",
			"test7",
			"test8",
			"test9"
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

	// Start a game
	game = new auk.Game(document.getElementById('display'), 64, "test1");

	game.physics = new auk.Physics({gravity: 4, friction: 0.3});

	game.bucket.rooms.test1 = new auk.Room(game).init(test1);

	// Initialize the game
	game.init();

	//game.addActor(terrain);
	
	//terrain.render(game.room);

	player = game.addActor(
		(new auk.Actor(5,5,6, 'images/actor.png'))
		.add(new auk.Keybinding({
			87 : 'up',
			68 : 'right',
			83 : 'down',
			65 : 'left',
			32 : 'jump'
		}))
		.add(auk.Physics.jump, {power: 35})
		.add(auk.Physics.motor, {speed: 6})
	);

	player.updateSteps.push(function () {
		//console.log(this.game.adjacentRooms[3]);
		if (this.y < -0.5) {
			if (this.game.adjacentRooms[1]) {
				this.y = 7.5;
				this.room.removeActor(this);
				this.game.adjacentRooms[1].addActor(this);
				this.game.setRoom(this.game.adjacentRooms[1]);
			} else {
				this.y = -0.5;
			}
		}
		if (this.x > 14.5) {
			if (this.game.adjacentRooms[4]) {
				this.x = -0.5;
				this.room.removeActor(this);
				this.game.adjacentRooms[4].addActor(this);
				this.game.setRoom(this.game.adjacentRooms[4]);
			} else {
				this.x = 14.5;
			}
		}
		if (this.y > 7.5) {
			if (this.game.adjacentRooms[6]) {
				this.y = -0.5;
				this.room.removeActor(this);
				this.game.adjacentRooms[6].addActor(this);
				this.game.setRoom(this.game.adjacentRooms[6]);
			} else {
				this.y = 7.5;
			}
		}
		if (this.x < -0.5) {
			if (this.game.adjacentRooms[3]) {
				this.x = 14.5;
				this.room.removeActor(this);
				this.game.adjacentRooms[3].addActor(this);
				this.game.setRoom(this.game.adjacentRooms[3]);
			} else {
				this.x = -0.5;
			}
		}
	});

	/**
	 * Temporary camera update function
	 */
	player.updateSteps.push(function () {
		this.game.world.style[auk.transform] = "translate3D("+(-(this.x-7.5))+"em, "+(-((this.y-4)/2)+this.z)+"em, "+(-((this.y-4)/2)-this.z)+"em) rotateX(45deg)";
	});

}(window.auk = window.auk || {}));
