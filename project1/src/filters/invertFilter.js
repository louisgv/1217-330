function invertFilter({data}, i) {
    const red = data[i]
    const green = data[i + 1]
    const blue = data[i + 2]

    data[i] = 255 - red;
    data[i + 1] = 255 - green;
    data[i + 2] = 255 - blue;
}
