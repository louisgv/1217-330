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

    let canvas,
        ctx;

    let frameCounter = 1;

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

    async function handleFileDrop(fileBlob) {
        const {result} = await File.read(fileBlob);

        playStream(audioElement, result, fileBlob.name);
    }

    function init() {
        // set up canvas stuff
        audioElement = document.querySelector('audio');
        canvas = document.querySelector('canvas');
        ctx = canvas.getContext("2d");

        // call our helper function and get an analyser node
        const analyserData = Helper.getAnalyserNode(audioElement, Global.NUM_SAMPLES);

        analyserNode = analyserData.analyserNode;

        setupUI();

        setupCache();

        playRandomLocalMedia();

        // start animation loop
        update();
    }

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
            .querySelector('#shuffle-button')
            .addEventListener('click', playRandomLocalMedia);

        document
            .querySelector('#toggleui-button')
            .addEventListener('click', Helper.toggleUIElement);

        // document     .querySelector("#trackSelect")     .onchange = function(e) {
        // playStream(audioElement, e.target.value, e.target.value);     }; document
        // .querySelector('#radiusSlider')     .oninput = function(e) {         maxRadius = e
        // .target             .value
        //
        // document             .querySelector("#sliderResults")             .innerHTML =
        // maxRadius;     }; Object     .keys(FilterConfig)     .map((f) => {         document
        // .getElementById(f)             .onchange = function(e) { FilterConfig[f] =
        // e.target.checked;             };     })
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

        // Add a filter frame rate slider
        // if ((frameCounter++) % 60 !== 0) {
        //     return;
        // }
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
