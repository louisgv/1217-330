function createWebAudioContextWithAnalyserNode(audioElement, numberOfSamples) {
    let audioCtx, analyserNode, sourceNode;
    // create new AudioContext
    // The || is because WebAudio has not been standardized across browsers yet
    // http://webaudio.github.io/web-audio-api/#the-audiocontext-interface
    audioCtx = new(window.AudioContext || window.webkitAudioContext);

    // create an analyser node
    analyserNode = audioCtx.createAnalyser();

    /*
    We will request NUM_SAMPLES number of samples or "bins" spaced equally
    across the sound spectrum.

    If NUM_SAMPLES (fftSize) is 256, then the first bin is 0 Hz, the second is 172 Hz,
    the third is 344Hz. Each bin contains a number between 0-255 representing
    the amplitude of that frequency.
    */

    // fft stands for Fast Fourier Transform
    analyserNode.fftSize = numberOfSamples;

    // this is where we hook up the <audio> element to the analyserNode
    sourceNode = audioCtx.createMediaElementSource(audioElement);
    sourceNode.connect(analyserNode);

    // here we connect to the destination i.e. speakers
    analyserNode.connect(audioCtx.destination);
    return analyserNode;
}

function drawCentralCircle(ctx, color, circleRadius) {
    drawCircle(ctx.canvas.width / 2, ctx.canvas.height / 2, ctx, color, circleRadius)
}

function drawCircle(x, y, ctx, color, circleRadius) {

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, circleRadius, 0, 2 * Math.PI, false);

    ctx.fill();
    ctx.closePath();
}

// Clear the canvas
function clearCanvas(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

// HELPER
function makeColor(red, green, blue, alpha) {
    let color = 'rgba(' + red + ',' + green + ',' + blue + ', ' + alpha + ')';
    return color;
}

// FULL SCREEN MODE
function requestFullscreen(element) {
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
};
