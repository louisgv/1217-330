/*
	Author: LAB

	Vector2 class
	Used to model basic vector, together with basic vector arithmetic
*/

"use strict";
var app = app || {};
(function() {
    app.Vector2 = class {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }

        // Mutable add
        mAdd({x, y}) {
            this.x += x;
            this.y += y;
        }

        dot({x, y}) {
            return this.x * x + this.y * y;
        }

        iSub({x, y}) {
            return new Vector2(this.x - x, this.y - y);
        }

        // Immutable add
        iAdd({x, y}) {
            return new Vector2(this.x + x, this.y + y);
        }

        mScale(x, y) {
            this.x *= x;
            this.y *= y;
        }

        // Immutable mul
        iMul(scalar) {
            return new Vector2(this.x * scalar, this.y * scalar);
        }
    }
}());
