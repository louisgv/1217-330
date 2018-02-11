"use strict";
var app = app || {};

(function() {
    const {
        MirrorBar,
        PonchoEye,
        MirrorWave,
        Wave,
        Helper,
        Global
    } = app;

    app.Visualizer = class {

        constructor() {
            this.mirrorBar = new MirrorBar();
            this.mirrorWave = new MirrorWave();
            this.ponchoEye = new PonchoEye();
            this.wave = new Wave();

            // Render from bottom-up
            this.vizList = [
                this.mirrorWave,
                this.mirrorBar,
                this.wave,
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

        draw(ctx, frequencyData, waveformData) {
            for (let i = 0; i < this.vizList.length; i++) {
                this
                    .vizList[i]
                    .draw(ctx, frequencyData, waveformData)
            }
        }
    }
}());
