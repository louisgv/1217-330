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
            this.color = color;
        }

        // Set the size of the diamond
        setSize(size) {
            this.size = size;
        }

        // Set the desired color of the diamond
        setColor(color) {
            this.color = color;
        }

        // Draw the diamond
        draw(ctx, fill = true, stroke = false) {
            ctx.save();

            ctx.fillStyle = this.color;
            ctx.strokeStyle = this.color;

            ctx.beginPath();

            ctx.moveTo(this.pos.x, this.pos.y - this.size);
            ctx.lineTo(this.pos.x + this.size, this.pos.y);
            ctx.lineTo(this.pos.x, this.pos.y + this.size);
            ctx.lineTo(this.pos.x - this.size, this.pos.y);

            ctx.closePath();

            if (fill) {
                ctx.fill();
            }

            if (stroke) {
                ctx.stroke();
            }

            ctx.restore();
        }
    }
}());
