/*
	Author: LAB

	Circle module.
    Used to model a circle

    LICENSE: MIT
*/

"use strict";
var app = app || {};

(function() {
    const {
        Vector2,
        Triangle,
        Square,
        Diamond,
        Circle,
        Global,
        Helper
    } = app;

    app.PonchoEye = class {
        constructor(config = {
            pos: new Vector2(),
            maxRadius: 180,
            color: [
                0, 0, 0
            ],
            smShape: 'Diamond',
            mdShape: 'Diamond',
            lgShape: 'Diamond'
        }) {
            this.config = config;
            this.smCentralCache = new Array(Global.DATA_SIZE);

            this.mdCentralCache = new Array(Global.DATA_SIZE);

            this.lgCentralCache = new Array(Global.DATA_SIZE);
        }

        // Update local cache
        updateConfig(canvas) {
            if (this.config.maxRadius > canvas.halfHeight) {
                this.config.maxRadius = canvas.halfHeight;
            }
            if (this.config.maxRadius > canvas.halfWidth) {
                this.config.maxRadius = canvas.halfWidth;
            }

            this.config.pos = new Vector2(canvas.halfWidth, canvas.halfHeight);

            this.updateShapeCache();
        }

        // Update the small shape cache
        updateSmallShapeCache(shape = 'Diamond') {
            this.config.smShape = shape;
            this
                .smCentralCache
                .fill(new app[shape](this.config.pos.copy()));
        }

        // Update the medium shape cache
        updateMediumShapeCache(shape = 'Diamond') {
            this.config.mdShape = shape;
            this
                .mdCentralCache
                .fill(new app[shape](this.config.pos.copy()));
        }

        // Update the large shape cache
        updateLargeShapeCache(shape = 'Diamond') {
            this.config.lgShape = shape;
            this
                .lgCentralCache
                .fill(new app[shape](this.config.pos.copy()));
        }

        // Update the shape cache
        updateShapeCache() {
            const {smShape, mdShape, lgShape} = this.config;
            this.updateSmallShapeCache(smShape);
            this.updateMediumShapeCache(mdShape);
            this.updateLargeShapeCache(lgShape);
        }

        draw(ctx, data) {
            ctx.save();
            const [r, g, b] = this.config.color;

            for (let i = 0; i < data.length; i++) {
                if (data[i] === 0) {
                    continue;
                }

                const percent = data[i] / (Global.NUM_SAMPLES - 1);

                const circleRadius = percent * this.config.maxRadius;

                const dotSize = circleRadius * 0.1;

                this
                    .smCentralCache[i]
                    .setColor(Helper.makeColor(255 - r, 255 - g, 255 - b, .5 - percent / 5.0));
                this
                    .smCentralCache[i]
                    .setSize(circleRadius * .50);
                this
                    .smCentralCache[i]
                    .draw(ctx);

                this
                    .mdCentralCache[i]
                    .setColor(Helper.makeColor(255 - r, 255 - g, 255 - b, 1.0));
                this
                    .mdCentralCache[i]
                    .setSize(circleRadius);
                this
                    .mdCentralCache[i]
                    .draw(ctx, false, true);

                this
                    .lgCentralCache[i]
                    .setColor(Helper.makeColor(r, g, b, .10 - percent / 10.0));
                this
                    .lgCentralCache[i]
                    .setSize(circleRadius * 1.5);
                this
                    .lgCentralCache[i]
                    .draw(ctx);
            }

            ctx.restore();
        }
    }
}());
