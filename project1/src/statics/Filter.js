/*
	Author: LAB

	Filter class
	Used to manage static filter

    LICENSE: MIT
*/

"use strict";
var app = app || {};

app.FilterConfig = {
    noiseFade: true,
    invert: false,
    tintRed: false,
    noise: false,
    lines: false,
    bonus: false,
    redeye: false
};

app.Filter = class {

    // Cemter B and G into R
    static redMirror({
        data,
        width
    }, i, factor = 1.0) {
        data[i + 1] = data[i + 2] = data[i + width] * data[i - width] * factor;
        data[i] *= data[i];
    }

    // Shift RGB's coordinate using its data.
    static shiftRGB({
        data,
        width
    }, i) {
        data[i] *= data[i];
        data[i + 1] = data[i + width] * data[i + width]
        data[i + 2] = data[i - width] * data[i - width]
    }

    // Increase color intesity
    static tint({
        data
    }, i, r = 100, g = 0, b = 0) {
        if (r !== 0) {
            data[i] += r;
        }
        if (g !== 0) {
            data[i + 1] += g;
        }
        if (b !== 0) {
            data[i + 2] += b;
        }
    }

    // Noise filter, throw in noise
    static noise({
        data
    }, i, value = 0) {
        data[i] = data[i + 1] = data[i + 2] = value;
        data[i + 3] = 255;
    }

    // Line filter, draw line
    static line({
        data,
        width
    }, i) {
        const row = Math.floor(i / 4 / width)

        if (row % 50 == 0) {
            data[i] = data[i + 1] = data[i + 2] = data[i + 3] = 255;
            const w4 = (width * 4)
            data[i + w4] = data[i + w4 + 1] = data[i + w4 + 2] = data[i + w4 + 3] = 255;
        }
    }

    // Invert filter, invert the color
    static invert({
        data
    }, i) {
        const red = data[i]
        const green = data[i + 1]
        const blue = data[i + 2]

        data[i] = 255 - red;
        data[i + 1] = 255 - green;
        data[i + 2] = 255 - blue;
    }

}
