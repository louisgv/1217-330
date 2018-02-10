/*
	Author: LAB

	Square module.
	Used to draw a diamond into the canvas.

    LICENSE: GPLv3
*/

"use strict";
var app = app || {};

(function() {
    const {Vector2} = app;
    app.Diamond = class {
        constructor(pos = new Vector2(), size = 10, color = 'white') {
            this.pos = pos;
            this.size = size;
            this.halfSize = size / 2;
            this.color = color;
        }

        // Set the size of the diamond
        setSize(size) {
            this.size = size;
            this.halfSize = size / 2;
        }

        // Set the desired color of the diamond
        setColor(color) {
            this.color = color;
        }

        // Draw the diamond
        draw(ctx) {
            ctx.save();

            ctx.fillStyle = this.color;
            //

            ctx.translate(this.pos.x, this.pos.y)
            ctx.rotate(45 * Math.PI / 180)
            ctx.fillRect(0, 0, this.size, this.size);

            ctx.restore();
        }
    }
}());
