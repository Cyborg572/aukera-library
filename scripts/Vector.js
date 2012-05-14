/*jslint browser: true, devel: true */
/**
 * Vector.js
 * This file extends the game engine with functions and objects for dealing with
 * vector based math. The vector math relies heavily on the 3 dimensional
 * definition of vectors, and will only makes use of angles and magnitudes when
 * absolutely necessary. If an angle changes, components are recalculated
 * immediately, if a component changes, angles are recalculated the next time
 * one is requested, unless a speed limit is violated, in which the recalculate
 * instantly as well. Because of this, using limits ads an overhead, and should
 * only be used if needed. Built in limits are still probably faster than doing
 * them externally, but that's just an assumption.
 */

"use strict";
var auk = window.auk || {};

// =======================================================================
//  Create the Vector constructor
// =======================================================================

/**
 * This is the constructor function for Vector objects. Vector objects
 * handle all sorts of complex math, and can give their values as either
 * angles and magnitudes, or as a set of x, y, and z speeds. All angles
 * should be specified in degrees, and if values outside of the ranges below
 * are used, they will be normalised to fit those ranges. All vectors will
 * always have a positive heading and magnitude.
 *
 * @param speed   Either a 3-or-4-dimensional array or a single magnitude.
 * @param heading If speed is not an array, then this is the angle to use
 *                for the vectors heading. 0 - 360 degrees. If speed is an
 *                array, this is treated as limit.
 * @param pitch   If speed is not an array, then this is the angle to use
 *                for the vector's pitch. 0 - 90 degrees.
 * @param limit   This is the upper limit for the vector's magnitude.
 */
auk.Vector = function (speed, heading, pitch, limit) {
	// Determine invocation mode based on number of arguments.
	// 1 or 2 = component mode
	// 3 or 4 = angle mode
	if (arguments.length > 2) {
		// Angle-based Vector definition
		this.speed = speed;
		this.heading = heading;
		this.pitch = pitch;
		this.limit = (typeof limit === 'undefined' ? 0 : limit);
		auk.Vector._calcComponents(this);
		this.dirty = false;
	} else if (arguments.length > 0) {
		// component-based vector definition
		this.x = speed[0];
		this.y = speed[1];
		this.z = speed[2];
		this.limit = (typeof heading === 'undefined' ? 0 : heading);
		this.dirty = true;
	} else {
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.speed = 0;
		this.groundSpeed = 0;
		this.heading = 0;
		this.pitch = 0;
		this.limit = 0;
		this.dirty = false;
	}
};

// =======================================================================
//  Static Methods
// =======================================================================

/**
 * Normalizes an angle.
 *
 * For most angles, it turns the angle into a positive value between 0 and
 * 360. If the pitch argument is true, then it will normalize to a value
 * between -90 and 90.
 *
 * @param angle The angle that will be normalized.
 * @param pitch If this value is true, a range of -90 to 90 will be used
 *              instead of 0 - 360.
 */
auk.Vector.normalizeAngle = function (angle, pitch) {
	// A value between 0 and 360 is always needed
	angle %= 360;
	angle += (angle < 0 ? 360 : 0);
	// Do the pitch thing
	if (pitch && angle > 90) { angle = (angle > 270 ? 360 : 180) - angle; }
	return angle;
};

/**
 * Finds the hypotenuse of a triangle with the given side lengths.
 *
 * @param x The length of the triangle's horizontal edge
 * @param y The length of the triangle's vertical edge
 */
auk.Vector.findHypo = function (x, y) {
	return Math.sqrt( (x*x) + (y*y) );
};

/**
 * Finds the angle of a line between 0,0 and the given x/y coordinates on a
 * two dimensional plane. It does some extra work to avoid divide-by-zero.
 *
 * @param x     the x coordinate of the point
 * @param y     the y coordinate of the point
 * @param pitch if pitch is true, then return value from the atan function
 *              is left as a value between -90 and 90 instead of being
 *              mapped to a 0 - 360 angle.
 */
auk.Vector.findAngle = function (x, y, pitch) {
	var angle;
	var m = Math;
	var factor = 180/m.PI;

	if (y === 0) {
		angle = (x >= 0 ? 0 : 180);
	} else if (x === 0) {
		angle = (y > 0 ? 270 : 90);
	}else{
		angle = m.atan((y*-1)/x)*(factor) + (x > 0 || !pitch ? 0 : 180);
		angle = auk.Vector.normalizeAngle(angle, pitch);
	}
	return angle;
};

/**
 * Calculates a vectors components from it's angles and magnitude.
 *
 * @param vector the vector object who's components need calculating.
 */
auk.Vector._calcComponents = function (vector) {
	var m = Math;
	var factor = m.PI / 180;
	var v = auk.Vector;

	// Make the speed positive
	if (vector.speed < 0) {
		vector.speed *= -1;
		vector.angle += 180;
		vector.pitch *= -1;
	}

	// Apply the speed limit
	if (vector.limit > 0 && vector.speed > vector.limt) {
		vector.speed = vector.limit;
	}

	// Normalize the angles
	vector.heading = v.normalizeAngle(vector.heading);
	vector.pitch = v.normalizeAngle(vector.pitch, true);

	// Project the vector onto the x/y plane
	vector.groundSpeed = m.cos(vector.pitch * factor) * vector.speed;
	// Calculate the z speed
	vector.z = m.sin(vector.pitch * factor) * vector.speed;
	// Calculate the x speed
	vector.x = m.cos(vector.heading * factor) * vector.groundSpeed;
	// Calculate the y speed, and invert it to map from Cartesian to screen
	vector.y = (m.sin(vector.heading * factor) * vector.groundSpeed) * -1;

	return vector;

};

/**
 * Calculates the angles and magnitude of a vector from it's components
 *
 * @param vector The vector object who's angle and magnitude need
 *               calculating
 */
auk.Vector._calcAngles = function (vector) {
	var v = auk.Vector;

	// Skip everything if the vector's not dirty
	if (vector.dirty === false) { return vector; }
	
	// Find the heading and ground speed
	vector.groundSpeed = v.findHypo(vector.x, vector.y);
	vector.heading = v.findAngle(vector.x, vector.y);

	// Find the pitch and actual speed
	vector.speed = v.findHypo(vector.groundSpeed, vector.z);
	vector.pitch = v.findAngle(vector.groundSpeed, vector.z, true);

	// Check the status of the speed limit
	if (vector.limit > 0 && vector.speed > vector.limit) {
		// Apply the limit
		vector.speed = vector.limit;
		// Recalculate the components.
		v._calcComponents(vector);
	}

	// Mark these values as calculated
	vector.dirty = false;

	return vector;
};

/**
 * Set the angle and magnitude values of a vector.
 *
 * Calling this function has the overhead of recalculating all the
 * components of the vector. setSpeed, setHeading, setPitch, setLimit,
 * accelerate, rotate, and adjustLimit are all curried versions of this
 * method.
 *
 * @param speed   The amount to add to the vector's speed
 * @param heading the number of degrees to rotate the heading
 * @param pitch   the number of degrees to rotate the pitch
 * @param limit   the amount to add to the vector's speed limit
 */
auk.Vector.prototype.set = function (speed, heading, pitch, limit) {
	var v = auk.Vector;
	this.speed = (typeof speed === 'undefined' ? this.speed : speed);
	this.heading = (typeof heading === 'undefined' ? this.heading : v.normalizeAngle(heading));
	this.pitch = (typeof pitch === 'undefined' ? this.pitch : v.normalizeAngle(pitch, true));
	this.limit = (typeof limit === 'undefined' ? this.limit : limit);
	v._calcComponents(this);
	
	// Enable chaining
	return this;
};
auk.Vector.prototype.setSpeed = function (speed) {
	return this.set(speed, undefined, undefined, undefined);
};
auk.Vector.prototype.setHeading = function (heading) {
	return this.set(undefined, heading, undefined, undefined);
};
auk.Vector.prototype.setPitch = function (pitch) {
	return this.set(undefined, undefined, pitch, undefined);
};
auk.Vector.prototype.setLimit = function (limit) {
	return this.set(undefined, undefined, undefined, limit);
};
auk.Vector.prototype.adjust = function(speed, heading, pitch, limit) {
	return this.set(
		this.speed + (speed || 0),
		this.heading + (heading || 0),
		this.pitch + (pitch || 0),
		this.limit + (limit || 0)
	);
};
auk.Vector.prototype.accelerate = function(speed) {
	return this.set(this.speed + (speed || 0), undefined, undefined, undefined);
};
auk.Vector.prototype.rotate = function(heading, pitch) {
	return this.set(
		undefined,
		this.heading + (heading || 0),
		this.pitch + (pitch || 0),
		undefined
	);
};
auk.Vector.prototype.adjustLimit = function(limit) {
	return this.adjust(undefined, undefined, undefined, this.limit + (limit || 0));
};

/**
 * Getters for speeds and angles.
 *
 * These all return the property in the function name. If the vector is
 * dirty, the speed and angles are recalculated before the value is returned
 */
auk.Vector.prototype.getSpeed = function () {
	if (this.dirty) { auk.Vector._calcAngles(this); }
	return this.speed;
};
auk.Vector.prototype.getLandSpeed = function () {
	if (this.dirty) { auk.Vector._calcAngles(this); }
	return this.landSpeed;
};
auk.Vector.prototype.getHeading = function () {
	if (this.dirty) { auk.Vector._calcAngles(this); }
	return this.heading;
};
auk.Vector.prototype.getPitch = function () {
	if (this.dirty) { auk.Vector._calcAngles(this); }
	return this.pitch;
};

/**
 * Sets the individual components of the vector.
 *
 * If the vector has an active limit, all the angles and magnitudes will
 * be recalculated so the speed limit can be checked, and if it's exceeded
 * these components will be recalculated with the capped speed. If there's
 * no active limit, the vector will just be marked as dirty.
 *
 * @param x the new X component, or an array containing all three components
 * @param y the new Y component, if x is not an array.
 * @param z the new Z component, if x is not an array.
 */
auk.Vector.prototype.setComponents = function (x, y, z) {
	if (arguments.length > 1) {
		this.x = x;
		this.y = y;
		this.z = z;
	} else {
		this.x = x[0];
		this.y = x[1];
		this.z = x[2];
	}
	// Check if speed limits come into play
	if (this.limit > 0) {
		auk.Vector._calcAngles(this);
	} else {
		this.dirty = true;
	}

	// Enable chaining
	return this;
};

/**
 * Does component-based vector addition
 *
 * While technically this function expects a vector object, any object with
 * x, y, and z properties will work. This means simple forces don't need the
 * overhead of a full vector object.
 *
 * @param vector a vector object, or any object with x,y, and z properties.
 */
auk.Vector.prototype.add = function (vector) {
	this.setComponents(
		this.x + vector.x,
		this.y + vector.y,
		this.z + vector.z
	);

	// Enable Chaining
	return this;
};

/**
 * Does component-based vector subtraction
 *
 * While technically this function expects a vector object, any object with
 * x, y, and z properties will work. This means simple forces don't need the
 * overhead of a full vector object.
 *
 * @param vector a vector object, or any object with x,y, and z properties.
 */
auk.Vector.prototype.subtract = function (vector) {
	this.setComponents(
		this.x - vector.x,
		this.y - vector.y,
		this.z - vector.z
	);

	// Enable Chaining
	return this;
};

/**
 * Returns the vector's components
 *
 * @param object If true, an object will be returned with x, y, and z
 *               properties, otherwise, an array is returned
 */
auk.Vector.prototype.getComponents = function (object) {
	return (object ? {x: this.x, y: this.y, z: this.z } : [this.x, this.y, this.z]);
};