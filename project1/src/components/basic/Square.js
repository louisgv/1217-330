/*
	Author: LAB

	Square module.
	Used to draw square into the canvas.

    LICENSE: GPLv3
*/

"use strict";
var app = app || {};

(function() {
    const {Vector2} = app;
    app.Square = class {
        constructor(pos = new Vector2(), size = 10, color = 'white') {
            this.pos = pos;
            this.size = size;
            this.halfSize = size / 2;
            this.color = color;
        }

        setSize(size) {
            this.size = size;
            this.halfSize = size / 2;
        }

        setColor(color) {
            this.color = color;
        }

        draw(ctx) {
            ctx.save();
            ctx.fillStyle = this.color;

            ctx.fillRect(
                this.pos.x - this.halfSize,
                this.pos.y - this.halfSize,
                this.size,
                this.size
            );

            ctx.fill();
            ctx.restore();
        }
    }
}());
