function lineFilter({data, width}, i) {    
    const row = Math.floor(i / 4 / width)

    if (row % 50 == 0) {
        data[i] = data[i + 1] = data[i + 2] = data[i + 3] = 255;
        const w4 = (width * 4)
        data[i + w4] =
        data[i + w4 + 1] =
        data[i + w4 + 2] =
        data[i + w4 + 3] = 255;
    }
}
