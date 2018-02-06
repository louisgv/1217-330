function tintFilter({data}, i, r = 100, g = 0, b = 0) {
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
