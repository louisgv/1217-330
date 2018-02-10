"use strict";
var app = app || {};

(function() {
    const {Vector2, MirrorBar, Helper, Global} = app;
    app.VisualizerConfig = {
        mirrorBars: true
    };

    app.SineWaveConfig = {
        width: 0,
        updateConfig(canvas) {
            this.width = (canvas.halfWidth) / (Global.NUM_SAMPLES / 2);
            this.height = canvas.halfHeight / 3;
            this.topSpacing = -this.height / 2;
        }
    }

    app.Visualizer = class {

        constructor() {
            this.mirrorBar = new MirrorBar();
        }

        updateConfig(canvas) {
            this
                .mirrorBar
                .updateConfig(canvas);
        }

        draw(ctx, data) {
            for (let i = 0; i < data.length; i++) {

                // the higher the amplitude of the sample (bin) the taller the bar remember we have to
                // draw our bars left-to-right and top-down
                if (data[i] === 0) {
                    continue;
                }
                this
                    .mirrorBar
                    .draw(ctx, data, i)
            }

        }

        // Drawing sinewave. Adapted from mdn's source https://github.com/mdn/voice-change-o-matic
        static sineWave(ctx, data) {
            ctx.save();
            ctx.beginPath();

            const sliceWidth = ctx.canvas.halfWidth / (Global.DATA_SIZE + 1);

            const waveHeightScale = ctx.canvas.halfHeight / Global.NUM_SAMPLES;

            let x = 0;
            // debugger; data runs from 0->Global.NUM_SAMPLES-1 scale: /NUM_SAMPLES
            // *ctx.canvas.halfHeight

            ctx.moveTo(x, ctx.canvas.halfHeight);

            let i = 0;

            for (; i < data.length; ++i) {
                const y = data[i] * waveHeightScale;

                ctx.lineTo(x, y);

                x += sliceWidth;
            }

            for (; i > 0; --i) {
                const y = data[i] * waveHeightScale;

                ctx.lineTo(x, y);

                x += sliceWidth;
            }

            for (; i < data.length; ++i) {
                const y = -data[i] * waveHeightScale + ctx.canvas.height;

                ctx.lineTo(x, y);

                x -= sliceWidth;
            }

            for (; i >= 0; --i) {
                const y = -data[i] * waveHeightScale + ctx.canvas.height;

                ctx.lineTo(x, y);

                x -= sliceWidth;
            }

            ctx.closePath();

            ctx.stroke();
            ctx.fill();
            ctx.restore();
        }

    }
}());
