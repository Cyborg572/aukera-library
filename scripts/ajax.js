/*jslint browser: true, devel: true */
/*
 * ---------------------------------------------------------------------------
 *	Ajax.js
 *	This file extends the game object with AJAX capabilities. 
 * ---------------------------------------------------------------------------
 */

(function (auk) {

	// ========================================================================
	// SETUP
	// ========================================================================
	
	// Make this not throw errors if there's no game objects.
	if (!auk.Game) { auk.Game = {}; }

	/*
	 * Set some default settings for the ajax requests
	 *  server =      The server to request from. Reall just a value to prepend
	 *                to the URL, so it can include directories and stuff.
	 *  queryString = A string to append to the end of the Query string. Can be
	 *                used, for example, to request JSON from a server set to
	 *                serve multiple formats.
	 */
	auk.Game.prototype.ajaxSettings = {
		server: "",
		queryString: ""
	};

	// ========================================================================
	// Add core ajax functionality
	// ========================================================================
	
	/**
	 * Ajax requests
	 * 
	 * Creates a new XMLHttpRequest object after doing all the appropriate
	 * fallback stuff, and then makes it go.
	 * 
	 * @param method   The HTTP method to use, most likely GET or POST
	 * @param url      The URL to request from
	 * @param callback A function to call with the returned data
	 * @param error    A function to call if the return is an error
	 * @param data     The data bundle to send in a post request.
	 */
	auk.ajax = function (method, url, callback, error, data) {
		var httpRequest;
		if (window.XMLHttpRequest) {
			httpRequest = new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			try {
				httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e) {
				try {
					httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (e2) {
					alert("This game cannot run with AJAX / Background Data capabilities");
				}
			}
		}
		httpRequest.onreadystatechange = function () {
			if (httpRequest.readyState === 4) {
				if (httpRequest.status === 200) {
					callback(JSON.parse(httpRequest.responseText));
				} else {
					error(httpRequest.responseText);
				}
			}
		};
		httpRequest.open(method, url);
		httpRequest.send(data || null);
		return httpRequest;
	};

	// ========================================================================
	// Extend the Game prototype
	// ========================================================================
	/**
	 * Loads something from the server
	 * 
	 * Uses a GET request to ask for an object from the server, applying
	 * whatever settings are attached to the game. Assumes the server stores
	 * things in files named with the ID in a folder named after the type (or is
	 * at least configured to handle request sent this way). There is an option
	 * to return a dummy object that will be populated when the request is
	 * fulfilled.
	 * 
	 * @param type     The Type of object to request. 
	 * @param id       An identifier for the object
	 * @param callback A function to pass the returned object to.
	 * @param error    A function to call if the request goes bad.
	 * @param dummy    If true, an empty object will be returned, and then once
	 *                 the AJAX call completes, it will be populated.
	 * @return The dummy object
	 */
	auk.Game.prototype.loadObject = function (type, id, callback, error, dummy) {
		var s = this.ajaxSettings,
		    cb = callback;

		// Give dummy a default value
		dummy = typeof dummy === 'undefined' ? false : (dummy === true ? {} : dummy);

		// Change the callback to include dummy support
		if (dummy) {
			cb = function (data) {
				for (var prop in data) {
					if (data.hasOwnProperty(prop)) {
						dummy[prop] = data[prop];
					}
				}
				callback(dummy);
			};
		}

		auk.ajax(
			'GET',
			s.server + '/' + type + '/' + id + '.json?' + s.queryString,
			cb,
			error,
			null
		);

		return dummy;

	};

	/**
	 * Loads a room from the bucket.
	 * 
	 * If the room's not in the bucket, then it checks for AJAX support and
	 * tries to load it that way. If AJAX has to be used, then a basic object
	 * with nothing but the name will be returned, and then populated later.
	 * 
	 * @param room The name of the room to load
	 */
	auk.Game.prototype.__ajax_oldLoadRoom = auk.Game.prototype.loadRoom;
	auk.Game.prototype.loadRoom = function (room) {
		var game = this;
		return game.__ajax_oldLoadRoom(room) || (auk.ajax ? game.loadObject(
			'room', room,
			function (data) {
				game.bucket.rooms[room] = data;
			},
			function (data) {
				alert("Could not load the next scene...");
			},
			{name: room}
		) : false);
	};

}(window.auk = window.auk || {}));
