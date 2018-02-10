/*
	Author: LAB

	Circle module.
    Used to model a circle

    LICENSE: GPLv3
*/

"use strict";
var app = app || {};

(function() {
    const {Vector2, Global, Helper} = app;

    app.MirrorWave = class {
        constructor(config = {
            blankCut: true,
            fill: true,
            widthScale: 0,
            heightScale: 0
        }) {
            this.config = config
            this.cachedPos = new Array(Global.DATA_SIZE);
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

            let x = 0;
            // debugger; data runs from 0->Global.NUM_SAMPLES-1 scale: /NUM_SAMPLES
            // *ctx.canvas.halfHeight

            let i = 0;

            for (; i < data.length; ++i) {
                if (i==0) {
                    ctx.moveTo(x, data[i] * this.config.heightScale)
                } else {
                    this.drawSegment(ctx, data[i], x, data[i] * this.config.heightScale);
                }
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

            ctx.stroke();

            if (this.config.fill) {
                ctx.fill();
            }

            ctx.restore();
        }
    }
}());
