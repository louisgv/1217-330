function shiftRGBFilter({data, width}, i) {    
    data[i] *= data[i];
    data[i + 1] = data[i + width] * data[i + width]
    data[i + 2] = data[i - width] * data[i - width]
}
