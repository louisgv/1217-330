/*
	Author: LAB

	Circle module.
    Used to model a circle
*/

"use strict";
var app = app || {};

(function() {
    const {Vector2, Global, Helper} = app;

    app.MirrorBar = class {
        constructor(config = {
            spacing: 1,
            width: 0,
            height: 0,
            topSpacing: 0,
            scale: 0.45
        }) {
            this.config = config
            this.cachedPos = new Array(Global.DATA_SIZE);
        }

        updateConfig(canvas) {

            this.config.width = (canvas.halfWidth) / Global.DATA_SIZE;
            this.config.height = canvas.halfHeight / 3;
            this.config.topSpacing = -this.config.height / 2;

            for (let i = 0; i < Global.DATA_SIZE; i++) {
                const horizontalBarSpacing = i * this.config.width;

                const topBarPosition = new Vector2(
                    canvas.halfWidth - this.config.width - horizontalBarSpacing,
                    canvas.halfHeight + this.config.topSpacing
                );

                const bottomBarPosition = new Vector2(
                    canvas.halfWidth + horizontalBarSpacing,
                    canvas.halfHeight + this.config.topSpacing
                );

                this.cachedPos[i] = Object.freeze({topBarPosition, bottomBarPosition})
            }

        }

        draw(ctx, data, i, color = Helper.makeColor(255, 255, 255, .6)) {
            ctx.save();
            // TODO: Make this color tweakable
            ctx.fillStyle = color;

            const barConfig = this.config;
            // cache all multiplication, reduce calculation to add and sub

            const scaledData = data[i] * barConfig.scale;

            ctx.fillRect(
                this.cachedPos[i].topBarPosition.x,
                this.cachedPos[i].topBarPosition.y - scaledData,
                barConfig.width,
                barConfig.height
            );

            ctx.fillRect(
                this.cachedPos[i].topBarPosition.x,
                this.cachedPos[i].topBarPosition.y + scaledData,
                barConfig.width,
                barConfig.height
            );

            ctx.fillRect(
                this.cachedPos[i].bottomBarPosition.x,
                this.cachedPos[i].bottomBarPosition.y - scaledData,
                barConfig.width,
                barConfig.height
            );

            ctx.fillRect(
                this.cachedPos[i].bottomBarPosition.x,
                this.cachedPos[i].bottomBarPosition.y + scaledData,
                barConfig.width,
                barConfig.height
            );

            ctx.restore();
        }
    }
}());