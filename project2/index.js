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

        Interface,
        Global,
        Helper
    } = app;

    let canvas,
        ctx;

    let frameCounter = 1;

    // Handle on initialization
    function init() {
        // set up canvas stuff
        canvas = document.querySelector('canvas');
        ctx = canvas.getContext("2d");

        setupUI();

        // start animation loop
        update();
    }

    // Handle Setup UI event
    function setupUI() {

        const toggleUIButton = document.querySelector('#toggleui-button');
        toggleUIButton.addEventListener('click', Helper.toggleUIElement);

        setTimeout(() => {
            toggleUIButton.dispatchEvent(new Event('click'))
        }, 900);

    }

    // Update config of viz and update canvas width/height cache
    function setupCache() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // NOTE: Storing the half-size of the canvas into itself for reuse later.
        canvas.halfWidth = canvas.width / 2;
        canvas.halfHeight = canvas.height / 2;

    }

    // Update loop
    function update() {
        // this schedules a call to the update() method in 1/60 seconds
        requestAnimationFrame(update);

    }

    window.addEventListener('load', init);

    window.addEventListener('resize', setupCache, false);
}());
