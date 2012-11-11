/*jshint immed:true latedef:true newcap:true strict:true globalstrict:true */
"use strict"; var auk = auk || {};

/**
 * The Sprite constructor builds an object that provides image data a display
 * can use, in the form of an image and a region of the image to use.
 * @param {image} image         The image to use for this sprite
 * @param {int}   frameDuration How many 'ticks' a frame lives for
 * @param {Array} frames        Contains arrays of offsets and dimensions for
 *                              each frame in the animation.
 * @param {bool}  loop          true loops the animation, false plays once and
 *                              stops.
 */
auk.Sprite = function (image, frameDuration, frames, loop) {
	this.timeElapsed = 0;
	this.currentFrame = 0;
	this.frameDuration = frameDuration;
	this.image = image;
	this.frames = frames;
	this.frameCount = frames.length;
	this.loop = typeof loop === 'undefined' ? true : loop;
};
auk.Sprite.prototype = {};

/**
 * Sets the frame to jump to, and resets the internal timer
 * @param {int} frame the frame to jump to.
 */
auk.Sprite.prototype.setFrame = function(frame) {
	this.currentFrame = frame;
	this.timeElapsed = 0;
	return this;
};

/**
 * Gets the index of the current frame of animation.
 * @return {int} The current frame's index.
 */
auk.Sprite.prototype.getFrame = function () {
	return this.currentFrame;
};

/**
 * Advances the sprite's internal timer. Once the timer hits the value of
 * frameDuration, it advances the frame and resets.
 */
auk.Sprite.prototype.tick = function () {
	this.timeElapsed += 1;
	if (this.timeElapsed > this.frameDuration) {
		this.timeElapsed = 0;
		this.currentFrame += 1;
		if (this.currentFrame >= this.frameCount) {
			this.currentFrame = 0;
		}
	}
	return this;
};

/**
 * Fetches the data for the current frame of animation.
 * @return {Array} The sprite's image, and an array with offset information for
 *                 the current frame.
 */
auk.Sprite.prototype.getFrameData = function () {
	return [this.image, this.frames[this.currentFrame]];
};


//------------------------------------------------------------------------------
// Add support to Gobs
//------------------------------------------------------------------------------

/**
 * Set the Gob's sprite
 * @param {sprite} sprite The sprite to use for this Gob
 */
auk.Gob.prototype.setSprite = function (sprite) {
	this.sprite = sprite;
	return this;
};

/**
 * Return the sprite currently in use by this Gob
 * @return {sprite} The sprite
 */
auk.Gob.prototype.getSprite = function () {
	return this.sprite;
};
