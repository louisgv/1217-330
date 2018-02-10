/*
	Author: LAB

	Circle module.
    Used to model a circle
*/

"use strict";
var app = app || {};

(function() {
    const {Vector2, Global, Helper} = app;

    app.MirrorWave = class {
        constructor(config = {
            widthScale: 0,
            heightScale: 0
        }) {
            this.config = config
            this.cachedPos = new Array(Global.DATA_SIZE);
        }

        updateConfig(canvas) {
            this.config.widthScale = canvas.halfWidth / Global.DATA_SIZE;
            this.config.heightScale = canvas.halfHeight / Global.NUM_SAMPLES;
        }

        draw(ctx, data) {
            ctx.save();
            ctx.beginPath();

            let x = 0;
            // debugger; data runs from 0->Global.NUM_SAMPLES-1 scale: /NUM_SAMPLES
            // *ctx.canvas.halfHeight

            let i = 0;

            for (; i < data.length; ++i) {
                const y = data[i] * this.config.heightScale;

                if (i === 0) {
                    ctx.moveTo(x, y)
                } else {
                    ctx.lineTo(x, y);
                }

                x += this.config.widthScale;
            }

            for (; i > 0; --i) {
                const y = data[i] * this.config.heightScale;

                ctx.lineTo(x, y);

                x += this.config.widthScale;
            }

            for (; i < data.length; ++i) {
                const y = -data[i] * this.config.heightScale + ctx.canvas.height;

                ctx.lineTo(x, y);

                x -= this.config.widthScale;
            }

            for (; i >= 0; --i) {
                const y = -data[i] * this.config.heightScale + ctx.canvas.height;

                ctx.lineTo(x, y);

                x -= this.config.widthScale;
            }

            ctx.closePath();

            ctx.stroke();

            ctx.fill();

            ctx.restore();
        }
    }
}());
