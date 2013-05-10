/*jshint browser:true */

"use strict";
var auk = auk || {};

/**
 * -----------------------------------------------------------------------------
 * dom2D
 *
 * A rendering engine using 2D dom manipulations.
 * -----------------------------------------------------------------------------
 */

auk.dom2D = {};

/**
 * This a draw eventStep for Gobs. It updates the position, size, and background
 * of the Gob's HTML in accordance with it's position, size, and sprite.
 */
auk.dom2D.draw = function () {
	var data;
	var backgroundX;
	var backgroundY;

	this.html.style.left = this.x + "px";
	this.html.style.top = this.y + "px";

	/*@TODO: Come up with some checks to safely implement this
	transform = 'translate3D(' +this.x + 'px, ' + this.y + 'px, 0px)';
	if (this.rotation) {
		transform += ' rotate(' + this.rotation + 'deg)';
	}
	this.html.style.transform = transform;*/

	if (this.color) {
		this.html.style.backgroundColor = this.color;
	} else {
		this.html.style.backgroundColor = 'transparent';
	}

	if (this.sprite) {
		data = this.sprite.tick().getFrameData();
		backgroundX = '-' + data[1][0] + 'px';
		backgroundY = '-' + data[1][1] + 'px';
		this.html.style.backgroundImage = 'url(' + data[0] + ')';
		this.html.style.backgroundPosition = backgroundX + ' ' + backgroundY;
		this.html.style.width = data[1][2] + 'px';
		this.html.style.height = data[1][3] + 'px';
	}

};

/**
 * This function generates HTML that can be attached to a Gob for use in the
 * draw step.
 * @param  {int}        width  The width of the Gob
 * @param  {ing}        height The height of the Gob
 * @param  {string}     color  The Hex color of the Gob
 * @return {DomElement}        The HTML to use for this Gob
 */
auk.dom2D.generateHtml = function (width, height, color) {
	var html = document.createElement('div');
	html.style.position = 'absolute';
	html.style.backgroundRepeat = 'no-repeat';
	html.style.width = width + 'px';
	html.style.height = height + 'px';
	return html;
};

/**
 * This is an eventStep for Gobs for the becomeChild event. It attaches the
 * Gob's HTML to the parent's.
 */
auk.dom2D.attachHtml = function () {
	this.parent.html.appendChild(this.html);
};

/**
 * This is an eventStep for Gobs for the becomeOrphan event. It removes the
 * Gob's HTML from the parent's.
 */
auk.dom2D.removeHtml = function () {
	this.parent.html.removeChild(this.html);
};

/**
 * Adds the dom2D functionality to an actor
 * @param {Actor}   actor   the actor that will be receiving this functionality.
 * @param {Options} options an options object containing a sprite property.
 */
auk.dom2D.addTo = function (actor, options) {
	actor.html = auk.dom2D.generateHtml(actor.width, actor.height);
	if (actor.parent) {
		auk.dom2D.attachHtml.call(actor);
	}
	actor.addEventStep('draw', auk.dom2D.draw);
	actor.addEventStep('becomeChild', auk.dom2D.attachHtml);
	actor.addEventStep('becomeOrphan', auk.dom2D.removeHtml);
};

/**
 * Removes the dom2D functionality from an actor
 * @param {Actor}   actor   the actor that will be losing this functionality.
 */
auk.dom2D.removeFrom = function (actor) {
	delete actor.html;
	if (actor.parent) {
		auk.dom2D.removeHtml.call(actor);
	}
	actor.removeEventStep('draw', auk.dom2D.draw);
	actor.removeEventStep('becomeChild', auk.dom2D.attachHtml);
	actor.removeEventStep('becomeOrphan', auk.dom2D.removeHtml);
};
