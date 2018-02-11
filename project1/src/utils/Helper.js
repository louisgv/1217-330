/*
	Author: LAB
	Helper methods.

    LICENSE: GPLv3
*/

"use strict";
var app = app || {};

app.Helper = {

    toggleUIElement(e) {

        const shouldDisable = e.target.innerText === 'x';
        if (shouldDisable) {
            e.target.innerHTML = '='
        } else {
            e.target.innerHTML = 'x'
        }

        const visibility = shouldDisable
            ? 'hidden'
            : 'visible';
        const opacity = shouldDisable
            ? 0
            : 1;

        Array
            .from(document.querySelectorAll('.toggle-target'))
            .map((target) => {
                target.style.visibility = visibility
                target.style.opacity = opacity
            })
    },

    // Return a random between min and max
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    },

    // Asyncronously wait for a duration in ms
    wait: (duration) => new Promise(function(resolve, reject) {
        setTimeout(resolve, duration);
    }),

    // Get Mouse position relative to the element
    getMouse: ({pageX, pageY, target}) => new Vector2(
        pageX - target.offsetLeft,
        pageY - target.offsetTop
    ),
    // Clear the canvas
    clearCanvas(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    },

    // Return analyser node from audio element
    getAnalyserNode(audioElement, numberOfSamples) {
        let audioCtx,
            analyserNode,
            biquadFilter,
            sourceNode;
        // create new AudioContext The || is because WebAudio has not been standardized across
        // browsers yet http://webaudio.github.io/web-audio-api/#the-audiocontext-interface
        audioCtx = new(window.AudioContext || window.webkitAudioContext);

        // console.log(audioCtx); create an analyser node
        analyserNode = audioCtx.createAnalyser();

        biquadFilter = audioCtx.createBiquadFilter();
        /*
            We will request NUM_SAMPLES number of samples or "bins" spaced equally
            across the sound spectrum.

            If NUM_SAMPLES (fftSize) is 256, then the first bin is 0 Hz, the second is 172 Hz,
            the third is 344Hz. Each bin contains a number between 0-255 representing
            the amplitude of that frequency.
        */

        // fft stands for Fast Fourier Transform
        analyserNode.fftSize = numberOfSamples;

        audioCtx.createBiquadFilter();

        // this is where we hook up the <audio> element to the analyserNode
        sourceNode = audioCtx.createMediaElementSource(audioElement);
        sourceNode.connect(analyserNode);

        analyserNode.connect(biquadFilter);
        // here we connect to the destination i.e. speakers
        biquadFilter.connect(audioCtx.destination);

        return {analyserNode, biquadFilter};
    },

    // Create rgba color
    makeColor(r, g, b, a) {
        return `rgba(${r},${g},${b},${a})`;
    },

    requestFullscreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullscreen) {
            element.mozRequestFullscreen();
        } else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }
        // .. and do nothing if the method is not supported
    }
}
