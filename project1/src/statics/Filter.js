class Filter {

    static redMirror({
        data,
        width
    }, i, factor = 1.0) {
        data[i + 1] = data[i + 2] = data[i + width] * data[i - width] * factor;
        data[i] *= data[i];
    }

    static shiftRGB({
        data,
        width
    }, i) {
        data[i] *= data[i];
        data[i + 1] = data[i + width] * data[i + width]
        data[i + 2] = data[i - width] * data[i - width]
    }

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

    static noise({
        data
    }, i, value = 0) {
        data[i] = data[i + 1] = data[i + 2] = value;
        data[i + 3] = 255;
    }

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
