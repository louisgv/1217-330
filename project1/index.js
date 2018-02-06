// An IIFE ("Iffy") - see the notes in mycourses
(function() {
    "use strict";

    let NUM_SAMPLES = 256;
    let SOUND_1 = 'media/Hazey.ogg';

    let audioElement;
    let analyserNode;
    let canvas,
        ctx;

    let maxRadius = 200;

    // create a new array of 8-bit integers (0-255)
    const data = new Uint8Array(NUM_SAMPLES / 2);

    const smCentralCache = [];
    const mdCentralCache = [];
    const lgCentralCache = [];

    let filter = {
        invert: false,
        tintRed: false,
        noise: false,
        lines: false,
        bonus: false,
        redeye: false
    }

    function init() {
        // set up canvas stuff
        canvas = document.querySelector('canvas');
        ctx = canvas.getContext("2d");

        // get reference to <audio> element on page
        audioElement = document.querySelector('audio');

        // call our helper function and get an analyser node
        analyserNode = createWebAudioContextWithAnalyserNode(audioElement, NUM_SAMPLES);

        // get sound track <select> and Full Screen button working
        setupUI();

        setupCache();

        // load and play default sound into audio element
        playStream(audioElement, SOUND_1);

        // start animation loop
        update();
    }

    function setupUI() {
        document.querySelector("#trackSelect").onchange = function(e) {
            playStream(audioElement, e.target.value);
        };

        document.querySelector("#fsButton").onclick = function() {
            requestFullscreen(canvas);
        };

        canvas.onmousedown = (e) => {
            if (audioElement.paused) {
                audioElement.play();
            } else {
                audioElement.pause();
            }
        }

        document.querySelector('#radiusSlider').oninput = function(e) {
            maxRadius = e.target.value

            document.querySelector("#sliderResults").innerHTML = maxRadius;
        };

        Object.keys(filter).map((f) => {
            document.getElementById(f).onchange = function(e) {
                filter[f] = e.target.checked;
            };
        })
    }

    function setupCache() {
        // const circle = new Circle(new Vector2(ctx.canvas.width / 2, ctx.canvas.height / 2), 1, 'white')
        for (let i = 0; i < NUM_SAMPLES / 2; i++) {
            smCentralCache.push(new Circle(new Vector2(ctx.canvas.width / 2, ctx.canvas.height / 2), 1, 'white'));
            mdCentralCache.push(new Circle(new Vector2(ctx.canvas.width / 2, ctx.canvas.height / 2), 1, 'white'));
            lgCentralCache.push(new Circle(new Vector2(ctx.canvas.width / 2, ctx.canvas.height / 2), 1, 'white'));
        }
    }

    function playStream(audioElement, path) {
        audioElement.src = path;
        audioElement.play();
        audioElement.volume = 0.2;
        document.querySelector('#status').innerHTML = "Now playing: " + path;
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
        clearCanvas(ctx);

        let barWidth = 4;
        let barSpacing = 1;
        let barHeight = 100;
        let topSpacing = 50;

        // loop through the data and draw!
        for (let i = 0; i < data.length; i++) {

            // the higher the amplitude of the sample (bin) the taller the bar
            // remember we have to draw our bars left-to-right and top-down
            // ctx.fillRect(i * (barWidth + barSpacing), topSpacing + 256 - data[i], barWidth, barHeight);
            //
            // ctx.fillRect(ctx.canvas.width - i * (barWidth + barSpacing), topSpacing + 256 - data[i] - 20, barWidth, barHeight);

            const percent = data[i] / 255;

            const circleRadius = percent * maxRadius;

            const dotSize = circleRadius * 0.1;

            ctx.fillStyle = 'rgba(0,255,0,0.6)';

            // drawCircle(i * (dotSize + barSpacing), topSpacing + 256 - data[i], ctx, makeColor(0, 255, 0, .34 - percent / 3.0), dotSize)
            //
            // drawCircle(ctx.canvas.width - i * (dotSize + barSpacing), topSpacing + 256 - data[i] - 20, ctx, makeColor(0, 255, 0, .34 - percent / 3.0), dotSize)
            //
            // drawCircle(i * (barWidth + barSpacing), topSpacing + 256 - data[i], ctx, makeColor(0, 255, 0, .34 - percent / 3.0), circleRadius * 0.1)

            smCentralCache[i].setColor(makeColor(200, 200, 0, .5 - percent / 5.0));
            smCentralCache[i].setRadius(circleRadius * .50);
            smCentralCache[i].draw(ctx);

            mdCentralCache[i].setColor(makeColor(255, 111, 111, .34 - percent / 3.0));
            mdCentralCache[i].setRadius(circleRadius);
            mdCentralCache[i].draw(ctx);

            lgCentralCache[i].setColor(makeColor(0, 0, 255, .10 - percent / 10.0));
            lgCentralCache[i].setRadius(circleRadius * 1.5);
            lgCentralCache[i].draw(ctx);

        }

        manipulatePixels()
    }

    function manipulatePixels() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const {data, width} = imageData;

        for (let i = 0; i < data.length; i += 4) {
            if (filter.tintRed) {
                tintFilter(imageData, i)
            }

            if (filter.invert) {
                invertFilter(imageData, i)
            }

            if (filter.noise && Math.random() < .10) {
                whiteNoiseFilter(imageData, i);
            }

            if (filter.lines) {
                lineFilter(imageData, i)
            }

            if (filter.bonus) {
                shiftRGBFilter(imageData, i)
            }

            if (filter.redeye) {
                redMirrorFilter(imageData, i)
            }
        }

        ctx.putImageData(imageData, 0, 0)
    }

    window.addEventListener("load", init);
}());