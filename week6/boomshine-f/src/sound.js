// sound.js
"use strict";
// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// define the .sound module and immediately invoke it in an IIFE
app.sound = (function() {
    console.log("sound.js module loaded");

	let bgAudio = undefined;
    let currentEffect = 0;
    let currentDirection = 1;
    let effectSounds = Array.from({
        length: 8
    }, (value, i) => `${i + 1}.mp3`);

    function init() {
        bgAudio = document.querySelector("#bgAudio");
        bgAudio.volume = 0.25;
    }

    function stopBGAudio() {
        bgAudio.pause();
        bgAudio.currentTime = 0;
    }

    function playEffect() {
        var effectSound = document.createElement('audio');
        effectSound.volume = 0.3;
        effectSound.src = "media/" + effectSounds[currentEffect];
        effectSound.play();
        currentEffect += currentDirection;
        if (currentEffect == effectSounds.length || currentEffect == -1) {
            currentDirection *= -1;
            currentEffect += currentDirection;
        }
    }

	function playBGAudio() {
		bgAudio.play();
	}

    // export a public interface to this module
    return {
		init,
		playBGAudio,
		stopBGAudio,
		playEffect
	}
}());
