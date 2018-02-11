/*
	Author: LAB

	Global singleton
	Used to share global config

    LICENSE: MIT
*/

"use strict";
var app = app || {};

app.Global = Object.freeze({
    SAMPLE_RATE: 44100,
    NUM_SAMPLES: 256,

    SAMPLE_SIZE: 44100/256,

    DATA_SIZE: 256/2, // Always half of NUM_SAMPLES

    SOUNDS: [
        'Burner.mp3',
        'Celery.mp3',
        'LetLinger.mp3',
        'TubShop.mp3',
        'Cold.mp3',
        'Lullaby.mp3'
    ]
});
