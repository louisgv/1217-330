"use strict";
var app = app || {};

app.Global = {
    SAMPLE_RATE: 44100,
    NUM_SAMPLES: 256,

    SAMPLE_SIZE: 44100/256,

    DATA_SIZE: 256/2, // Always half of NUM_SAMPLES

    DEFAULT_SOUND: 'media/Cold.mp3'
};
