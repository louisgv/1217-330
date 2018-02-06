function blackNoiseFilter({data}, i) {
    data[i] = data[i + 1] = data[i + 2] = 0;
    data[i + 3] = 255;
}

function grayNoiseFilter({data}, i) {
    data[i] = data[i + 1] = data[i + 2] = 128;
    data[i + 3] = 255;
}

function whiteNoiseFilter({data}, i) {
    data[i] = data[i + 1] = data[i + 2] = 255;
    data[i + 3] = 255;
}
