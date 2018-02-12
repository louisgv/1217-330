/*
	Author: LAB

	Circle module.
    Used to model a circle

    LICENSE: MIT
*/

"use strict";
var app = app || {};

(function() {
    const {Vector2, Global, Helper} = app;

    app.Wave = class {
        constructor(config = {
            widthScale: 0,
            heightScale: 0,
            lineWidth: 9,
            color: [0, 0, 0]
        }) {
            this.config = config
        }

        // Update the width and height scale of the wave
        updateConfig(canvas) {
            this.config.widthScale = canvas.width / Global.DATA_SIZE;
            this.config.heightScale = canvas.halfHeight / Global.DATA_SIZE;
        }

        // Draw the Mirror Wave
        draw(ctx, fData, data) {
            ctx.save();
            ctx.beginPath();

            const [r, g, b] = this.config.color;

            ctx.fillStyle = Helper.makeColor(r, g, b, 0.6);
            ctx.strokeStyle = Helper.makeColor(r, g, b, 0.6);

            ctx.lineWidth = this.config.lineWidth;

            let x = 0;

            let i = 0;

            ctx.moveTo(x, ctx.canvas.halfHeight);

            for (; i < data.length; i++) {
                ctx.lineTo(x, data[i] * this.config.heightScale);
                x += this.config.widthScale;
            }

            ctx.lineTo(ctx.canvas.width, ctx.canvas.halfHeight);

            ctx.stroke();

            if (this.config.fill) {
                ctx.fill();
            }

            ctx.restore();
        }
    }
}());
