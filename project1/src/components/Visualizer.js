"use strict";
var app = app || {};

(function() {
    const {
        Vector2,
        MirrorBar,
        PonchoEye,
        MirrorWave,
        Helper,
        Global
    } = app;

    app.VisualizerConfig = {
        mirrorBars: true
    };

    app.Visualizer = class {

        constructor() {
            this.mirrorBar = new MirrorBar();
            this.mirrorWave = new MirrorWave();
            this.ponchoEye = new PonchoEye();

            // Render from bottom-up
            this.vizList = [
                this.mirrorWave,
                this.mirrorBar,
                this.ponchoEye,
            ]
        }

        updateConfig(canvas) {
            for (let i = 0; i < this.vizList.length; i++) {
                this
                    .vizList[i]
                    .updateConfig(canvas)
            }
        }

        draw(ctx, data) {
            for (let i = 0; i < this.vizList.length; i++) {
                this
                    .vizList[i]
                    .draw(ctx, data)
            }
        }
    }
}());
