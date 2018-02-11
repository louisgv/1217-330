/*
	Author: LAB

	Visualizer class
	Used to manage instances of all visualizer

    LICENSE: MIT
*/

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

            this.vizList = ['mirrorWave', 'mirrorBar', 'wave', 'ponchoEye'];

            // Render from bottom-up
            this.vizInstances = this
                .vizList
                .map(viz => this[viz]);
        }

        updateConfig(canvas) {
            for (let i = 0; i < this.vizInstances.length; i++) {
                this
                    .vizInstances[i]
                    .updateConfig(canvas)
            }
        }

        draw(ctx, frequencyData, waveformData) {
            for (let i = 0; i < this.vizInstances.length; i++) {
                if (this.vizInstances[i].disabled) {
                    continue;
                }
                this
                    .vizInstances[i]
                    .draw(ctx, frequencyData, waveformData)
            }
        }
    }
}());
