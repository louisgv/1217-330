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
        Circle,
        Triangle,
        Vector2,
        DropZone,
        File,
        Filter,
        FilterConfig,
        Helper
    } = app;

    let NUM_SAMPLES = 256;
    let DEFAULT_SOUND = 'media/Hazey.ogg';

    let audioElement;
    let analyserNode;
    let canvas,
        ctx;

    let maxRadius = 200;

    // create a new array of 8-bit integers (0-255)
    const data = new Uint8Array(NUM_SAMPLES / 2);

    const smCentralCache = new Array(NUM_SAMPLES / 2);
    const mdCentralCache = new Array(NUM_SAMPLES / 2);
    const lgCentralCache = new Array(NUM_SAMPLES / 2);

    const defaultConfig = {
        'Hazey.ogg' : {
            scale: 0.45,
            barColor: Helper.makeColor(255, 255, 255, .6)
        }
    }

    const barConfig = {
        spacing: 1,
        width: 0,
        height: 0,
        topSpacing: 0,
        scale: 0.45,
    }

    async function handleFileDrop(fileBlob) {
        const {result} = await File.read(fileBlob);

        playStream(audioElement, result, fileBlob.name);
    }

    function init() {
        // set up canvas stuff
        canvas = document.querySelector('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx = canvas.getContext("2d");

        DropZone.apply(canvas, handleFileDrop)

        canvas.onmousedown = (e) => {
            if (audioElement.paused) {
                audioElement.play();
            } else {
                audioElement.pause();
            }
        }

        // get reference to <audio> element on page
        audioElement = document.querySelector('audio');

        // call our helper function and get an analyser node
        analyserNode = Helper.createWebAudioContextWithAnalyserNode(audioElement, NUM_SAMPLES);

        // get sound track <select> and Full Screen button working
        // setupUI();

        setupCache();

        // load and play default sound into audio element
        playStream(audioElement, DEFAULT_SOUND, DEFAULT_SOUND);

        // start animation loop
        update();
    }

    function setupUI() {
        document.querySelector("#trackSelect").onchange = function(e) {
            playStream(audioElement, e.target.value, e.target.value);
        };

        document.querySelector('#radiusSlider').oninput = function(e) {
            maxRadius = e.target.value

            document.querySelector("#sliderResults").innerHTML = maxRadius;
        };

        Object.keys(FilterConfig).map((f) => {
            document.getElementById(f).onchange = function(e) {
                FilterConfig[f] = e.target.checked;
            };
        })
    }

    function setupCache() {
        const {width, height} = canvas;

        canvas.halfWidth = width / 2;
        canvas.halfHeight = height / 2;

        smCentralCache.fill(new Circle(new Vector2(canvas.halfWidth, canvas.halfHeight), 1, 'white'))

        mdCentralCache.fill(new Triangle(new Vector2(canvas.halfWidth, canvas.halfHeight), 1, 'white'))

        lgCentralCache.fill(new Circle(new Vector2(canvas.halfWidth, canvas.halfHeight), 1, 'white'))

        // const circle = new Circle(new Vector2(ctx.canvas.width / 2, ctx.canvas.height / 2), 1, 'white')

        barConfig.width = (canvas.halfWidth) / (NUM_SAMPLES / 2);
        barConfig.height = canvas.halfHeight/3;
        barConfig.topSpacing = -barConfig.height / 2;
    }

    function playStream(audioElement, path, name) {
        audioElement.crossOrigin = 'anonymous';
        audioElement.src = path;
        audioElement.play();
        audioElement.volume = 0.9;
        // document.querySelector('#status').innerHTML = "Now playing: " + name;
    }

    function update() {
        // this schedules a call to the update() method in 1/60 seconds
        requestAnimationFrame(update);

        /*
            Nyquist Theorem
            http://whatis.techtarget.com/definition/Nyquist-Theorem
            The array of data we get back is 1/2 the size of the sample rate
        */

        // populate the array with the frequency data
        // notice these arrays can be passed "by reference"
        analyserNode.getByteFrequencyData(data);

        // OR
        //analyserNode.getByteTimeDomainData(data);  waveform data

        // DRAW!
        // clearCanvas(ctx);

        // loop through the data and draw!
        for (let i = 0; i < data.length; i++) {

            // the higher the amplitude of the sample (bin) the taller the bar
            // remember we have to draw our bars left-to-right and top-down

            if (data[i] === 0) {
                continue;
            }
            // TODO: Make this color tweakable
            ctx.fillStyle = Helper.makeColor(255, 255, 255, .6);

            const horizontalBarSpacing = i * barConfig.width;

            const topBarPosition = new Vector2(canvas.halfWidth - barConfig.width - horizontalBarSpacing, canvas.halfHeight + barConfig.topSpacing);

            const bottomBarPosition = new Vector2(canvas.halfWidth + horizontalBarSpacing, canvas.halfHeight + barConfig.topSpacing);

            const scaledData = data[i] * barConfig.scale;

            ctx.fillRect(topBarPosition.x, topBarPosition.y - scaledData, barConfig.width, barConfig.height);

            ctx.fillRect(topBarPosition.x, topBarPosition.y + scaledData, barConfig.width, barConfig.height);

            ctx.fillRect(bottomBarPosition.x, bottomBarPosition.y - scaledData, barConfig.width, barConfig.height);

            ctx.fillRect(bottomBarPosition.x, bottomBarPosition.y + scaledData, barConfig.width, barConfig.height);

            // ctx.fillRect(ctx.canvas.width - i * (barWidth + barSpacing), topSpacing + 256 - data[i] - 20, barWidth, barHeight);

            const percent = data[i] / 255;

            const circleRadius = percent * maxRadius;

            const dotSize = circleRadius * 0.1;

            // drawCircle(i * (dotSize + barSpacing), topSpacing + 256 - data[i], ctx, makeColor(0, 255, 0, .34 - percent / 3.0), dotSize)
            //
            // drawCircle(ctx.canvas.width - i * (dotSize + barSpacing), topSpacing + 256 - data[i] - 20, ctx, makeColor(0, 255, 0, .34 - percent / 3.0), dotSize)
            //
            // drawCircle(i * (barWidth + barSpacing), topSpacing + 256 - data[i], ctx, makeColor(0, 255, 0, .34 - percent / 3.0), circleRadius * 0.1)

            smCentralCache[i].setColor(Helper.makeColor(255, 255, 255, .5 - percent / 5.0));
            smCentralCache[i].setSize(circleRadius * .50);
            smCentralCache[i].draw(ctx);

            // mdCentralCache[i].setColor(Helper.makeColor(255, 111, 111, .34 - percent / 3.0));
            // mdCentralCache[i].setSize(circleRadius);
            // mdCentralCache[i].draw(ctx);

            lgCentralCache[i].setColor(Helper.makeColor(0, 0, 0, .10 - percent / 10.0));
            lgCentralCache[i].setSize(circleRadius * 1.5);
            lgCentralCache[i].draw(ctx);
        }

        manipulatePixels()
    }

    function manipulatePixels() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < imageData.data.length; i += 4) {

            if (Random.next() > 0.90) {
                Filter.noise(imageData, i, 255);
            }
            //
            // if (FilterConfig.invert) {
            //     Filter.invert(imageData, i)
            // }
            //
            // if (FilterConfig.lines) {
            // Filter.line(imageData, i)
            // }
            //
            // if (FilterConfig.bonus) {
            // Filter.shiftRGB(imageData, i)
            // }
            //
            // if (FilterConfig.redeye) {
            //     Filter.redMirror(imageData, i)
            // }
        }

        ctx.putImageData(imageData, 0, 0)
    }

    window.addEventListener('load', init);

    window.addEventListener('resize', (e) => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        setupCache()
    }, false);
}());
