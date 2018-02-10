/*
	Author: LAB

	Triangle module
    Used to handle drawing a equilateral triangle

    LICENSE: GPLv3
*/

"use strict";
var app = app || {};

(function() {
    const {Vector2} = app;
    app.Triangle = class {
        constructor(pos = new Vector2(), size = 1, color = 'white') {
            this.pos = pos;
            this.size = size;
            this.color = color;
        }

        setSize(size) {
            this.size = size;
        }

        setColor(color) {
            this.color = color;
        }

        draw(ctx) {
            ctx.save();

            ctx.fillStyle = this.color;

            ctx.beginPath();

            ctx.moveTo(this.pos.x, this.pos.y + this.size);
            ctx.lineTo(this.pos.x - this.size, this.pos.y - this.size);
            ctx.lineTo(this.pos.x + this.size, this.pos.y - this.size);

            ctx.fill();
            ctx.closePath();

            ctx.restore();
        }
    }
}());
