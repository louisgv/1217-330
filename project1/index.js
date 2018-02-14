/*
	Author: LAB
	Main routine for vize

    LICENSE: GPLv3
*/

// An IIFE ("Iffy") - see the notes in mycourses
"use strict";
var app = app || {};
(function() {

    const {
        Random,

        DropZone,
        File,
        Filter,
        FilterConfig,

        Visualizer,
        VisualizerUI,

        Global,
        Helper
    } = app;

    let audioElement;

    let analyserNode;

    let biquadFilter;

    let audioCtx;

    let canvas,
        ctx;

    let frameCounter = 1;

    // type - freq - label (opt)
    const biquadFilterList = [
        [
            'lowshelf', 45, 'a', 1.0
        ],
        [
            'lowshelf', 450, 'b', 1.0
        ],
        [
            'lowshelf', 4500, 'c', -1.0
        ]
    ]

    const visualizerInstance = new Visualizer();

    const visualizerUIInstance = new VisualizerUI(visualizerInstance);

    // TODO: have this a local variable for the circle class create a new array of 8-bit
    // integers (0-255)
    const frequencyData = new Uint8Array(Global.DATA_SIZE);
    const waveformData = new Uint8Array(Global.DATA_SIZE);

    const defaultConfig = {
        'Hazey.ogg': {
            scale: 0.45,
            barColor: Helper.makeColor(255, 255, 255, .6)
        }
    }

    // Handle on file drop
    async function handleFileDrop(fileBlob) {
        const {result} = await File.read(fileBlob);

        playStream(audioElement, result, fileBlob.name);
    }

    // Handle on initialization
    function init() {
        // set up canvas stuff
        audioElement = document.querySelector('audio');
        canvas = document.querySelector('canvas');
        ctx = canvas.getContext("2d");

        // call our helper function and get an analyser node
        const analyserData = Helper.getAnalyserData(
            audioElement,
            Global.NUM_SAMPLES,
            biquadFilterList
        );

        audioCtx = analyserData.audioCtx;
        analyserNode = analyserData.analyserNode;
        biquadFilter = analyserData.biquadFilter;

        setupUI();

        setupCache();

        playRandomLocalMedia();

        // start animation loop
        update();
    }

    // Handle Setup UI event
    function setupUI() {

        visualizerUIInstance.mount(document.querySelector('#visualizer-ui'))

        DropZone.apply(canvas, handleFileDrop);

        canvas.addEventListener('pointerdown', (e) => {
            if (audioElement.paused) {
                audioElement.play();
            } else {
                audioElement.pause();
            }
        });

        audioElement.addEventListener('ended', playRandomLocalMedia);

        document
            .querySelector('#fullscreen-button')
            .addEventListener('click', () => Helper.requestFullscreen(canvas));

        document
            .querySelector('#shuffle-button')
            .addEventListener('click', playRandomLocalMedia);

        document
            .querySelector('#toggleui-button')
            .addEventListener('click', Helper.toggleUIElement);

        const bassSlider = document.querySelector('#bass-slider');

        bassSlider.addEventListener('change', (e) => {
            const audioCtxNewTime = audioCtx.currentTime + 1;

            const newGainValue = e.target.value * (72) - 36;

            biquadFilterList.map(([,, label, scale]) => {
                biquadFilter[label]
                    .gain
                    .setValueAtTime(newGainValue * scale, audioCtxNewTime);
            });
        });

        document
            .querySelector('#bass-reset')
            .addEventListener('click', (e) => {
                bassSlider.value = 0.5;
                bassSlider.dispatchEvent(new Event('change'))
            });
    }

    // Update config of viz and update canvas width/height cache
    function setupCache() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // NOTE: Storing the half-size of the canvas into itself for reuse later.
        canvas.halfWidth = canvas.width / 2;
        canvas.halfHeight = canvas.height / 2;

        visualizerInstance.updateConfig(canvas);
    }

    function playStream(audioElement, path, name) {
        audioElement.crossOrigin = 'anonymous';
        audioElement.src = path;
        audioElement.play();
        audioElement.volume = 0.9;
        document
            .querySelector('#song-name')
            .innerHTML = name.split('.')[0];
    }

    function playRandomLocalMedia() {
        playLocalMedia(audioElement, Global.SOUNDS[Helper.getRandomInt(0, Global.SOUNDS.length)]);
    }

    function playLocalMedia(audioElement, file) {
        playStream(audioElement, 'media/' + file, file)
    }

    function update() {
        // this schedules a call to the update() method in 1/60 seconds
        requestAnimationFrame(update);

        if (audioElement.paused) {
            return;
        }

        // waveform data DRAW! Helper.clearCanvas(ctx); loop through the data and draw!
        analyserNode.getByteFrequencyData(frequencyData);

        analyserNode.getByteTimeDomainData(waveformData);

        visualizerInstance.draw(ctx, frequencyData, waveformData);

        // Add a filter frame rate slider if ((frameCounter++) % 60 !== 0) {     return; }
        //
        // frameCounter = 1;

        manipulatePixels();
    }

    function manipulatePixels() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < imageData.data.length; i += 4) {

            if (FilterConfig.noiseFade && Random.next() > 0.90) {
                Filter.noise(imageData, i, 255);
            }

            // if (FilterConfig.invert) {     Filter.invert(imageData, i) }
            //
            // if (FilterConfig.lines) { Filter.line(imageData, i) }
            //
            // if (FilterConfig.bonus) { Filter.shiftRGB(imageData, i) }
            //
            // if (FilterConfig.redeye) {     Filter.redMirror(imageData, i) }
        }

        ctx.putImageData(imageData, 0, 0)
    }

    window.addEventListener('load', init);

    window.addEventListener('resize', setupCache, false);
}());
