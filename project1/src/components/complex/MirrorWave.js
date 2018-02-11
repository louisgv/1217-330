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

    app.MirrorWave = class {
        constructor(config = {
            blankCut: true,
            stroke: true,
            fill: true,
            widthScale: 0,
            heightScale: 0,
            color: [0,0,0],
        }) {
            this.config = config
        }

        // Update the width and height scale of the wave
        updateConfig(canvas) {
            this.config.widthScale = canvas.halfWidth / Global.DATA_SIZE;
            this.config.heightScale = canvas.halfHeight / Global.NUM_SAMPLES;
        }

        // Draw a segent of the mirror wave, checking if we should cut the blank part or not
        drawSegment(ctx, freq, x, y) {
            if (this.config.blankCut && freq <= 0) {
                ctx.lineTo(ctx.canvas.halfWidth, ctx.canvas.halfHeight);
            } else {
                ctx.lineTo(x, y);
            }
        }

        // Draw the Mirror Wave
        draw(ctx, data) {
            ctx.save();
            ctx.beginPath();
            const [r,g,b] = this.config.color;

            ctx.fillStyle = Helper.makeColor(r, g, b, 0.6);
            ctx.strokeStyle = Helper.makeColor(r, g, b, 0.6);

            let x = 0;
            // *ctx.canvas.halfHeight

            let i = 0;

            ctx.moveTo(x, ctx.canvas.halfHeight)

            for (; i < data.length; ++i) {
                this.drawSegment(ctx, data[i], x, data[i] * this.config.heightScale);

                x += this.config.widthScale;
            }

            for (; i > 0; --i) {
                this.drawSegment(ctx, data[i], x, data[i] * this.config.heightScale);
                x += this.config.widthScale;
            }

            for (; i < data.length; ++i) {
                this.drawSegment(ctx, data[i], x, -data[i] * this.config.heightScale + ctx.canvas.height);
                x -= this.config.widthScale;
            }

            for (; i >= 0; --i) {
                this.drawSegment(ctx, data[i], x, -data[i] * this.config.heightScale + ctx.canvas.height);
                x -= this.config.widthScale;
            }

            ctx.closePath();

            if (this.config.stroke) {
                ctx.stroke();
            }

            if (this.config.fill) {
                ctx.fill();
            }

            ctx.restore();
        }
    }
}());
