
function redMirrorFilter({data, width}, i) {
    data[i] *= data[i];
    const bgmixed = data[i + width] * data[i - width];
    data[i + 1] = data[i + 2] = bgmixed;
}
