/**
 * a vector 2 class
 * @constructor
 * @memberof zen3d
 * @param {number} [x=0]
 * @param {number} [y=0]
 */
function Vector2(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

Object.assign(Vector2.prototype, /** @lends zen3d.Vector2.prototype */{

    /**
     * 
     */
    set: function(x, y) {
        this.x = x || 0;
        this.y = y || 0;

        return this;
    },

    /**
     * 
     */
    lerpVectors: function(v1, v2, ratio) {
        return this.subVectors(v2, v1).multiplyScalar(ratio).add(v1);
    },

    /**
     * 
     */
    min: function(v) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);

        return this;
    },

    /**
     * 
     */
    max: function(v) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);

        return this;
    },

    /**
     * 
     */
    getLength: function() {
        return Math.sqrt(this.getLengthSquared());
    },

    /**
     * 
     */
    getLengthSquared: function() {
        return this.x * this.x + this.y * this.y;
    },

    /**
     * 
     */
    normalize: function(thickness) {
        thickness = thickness || 1;
        var length = this.getLength();
        if (length != 0) {
            var invLength = thickness / length;
            this.x *= invLength;
            this.y *= invLength;
            return this;
        }
    },

    /**
     * 
     */
    subtract: function(a, target) {
        if (!target) {
            target = new Vector2();
        }
        target.set(this.x - a.x, this.y - a.y);
        return target;
    },

    /**
     * 
     */
    sub: function(v) {
        this.x -= v.x;
        this.y -= v.y;

        return this;
    },

    /**
     * 
     */
    copy: function(v) {
        this.x = v.x;
        this.y = v.y;

        return this;
    },

    /**
     * 
     */
    addVectors: function(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;

        return this;
    },

    /**
     * 
     */
    subVectors: function(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;

        return this;
    },

    /**
     * 
     */
    multiplyScalar: function(scalar) {
        this.x *= scalar;
        this.y *= scalar;

        return this;
    },

    /**
     * 
     */
    distanceToSquared: function(v) {
        var dx = this.x - v.x,
            dy = this.y - v.y;

        return dx * dx + dy * dy;
    },

    /**
     * 
     */
    distanceTo: function(v) {
        return Math.sqrt(this.distanceToSquared(v));
    },

    /**
     * 
     */
    fromArray: function(array, offset) {
        if (offset === undefined) offset = 0;

        this.x = array[offset];
        this.y = array[offset + 1];

        return this;
    },

    /**
     * 
     */
    add: function(v) {
        this.x += v.x;
        this.y += v.y;

        return this;
    },

    /**
     * 
     */
    angle: function () {

		// computes the angle in radians with respect to the positive x-axis

		var angle = Math.atan2( this.y, this.x );

		if ( angle < 0 ) angle += 2 * Math.PI;

		return angle;

	},

    /**
     * 
     */
    clone: function() {
        return new Vector2(this.x, this.y);
    }

});

export {Vector2};