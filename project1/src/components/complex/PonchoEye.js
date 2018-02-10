/*
	Author: LAB

	Circle module.
    Used to model a circle
*/

"use strict";
var app = app || {};

(function() {
    const {Vector2, Circle, Global, Helper} = app;

    app.PonchoEye = class {
        constructor(config = {
            maxRadius: 180
        }) {
            this.config = config
            this.smCentralCache = new Array(Global.DATA_SIZE);

            this.mdCentralCache = new Array(Global.DATA_SIZE);

            this.lgCentralCache = new Array(Global.DATA_SIZE);
        }

        updateConfig(canvas) {
            this.smCentralCache.fill(
                new Circle(new Vector2(canvas.halfWidth, canvas.halfHeight), 1, 'white')
            )

            // mdCentralCache.fill(
            //     new Triangle(new Vector2(canvas.halfWidth, canvas.halfHeight), 1, 'white')
            // )

            this.lgCentralCache.fill(
                new Circle(new Vector2(canvas.halfWidth, canvas.halfHeight), 1, 'white')
            )
        }

        draw(ctx, data) {
            ctx.save();
            for (let i = 0; i < data.length; i++) {
                if (data[i] === 0) {
                    continue;
                }

                const percent = data[i] / (Global.NUM_SAMPLES-1);

                const circleRadius = percent * this.config.maxRadius;

                const dotSize = circleRadius * 0.1;

                this.smCentralCache[i].setColor(Helper.makeColor(255, 255, 255, .5 - percent / 5.0));
                this.smCentralCache[i].setSize(circleRadius * .50);
                this.smCentralCache[i].draw(ctx);

                // mdCentralCache[i].setColor(Helper.makeColor(255, 111, 111, .34 - percent / 3.0));
                // mdCentralCache[i].setSize(circleRadius); mdCentralCache[i].draw(ctx);

                this.lgCentralCache[i].setColor(Helper.makeColor(0, 0, 0, .10 - percent / 10.0));
                this.lgCentralCache[i].setSize(circleRadius * 1.5);
                this.lgCentralCache[i].draw(ctx);
            }

            ctx.restore();
        }
    }
}());
