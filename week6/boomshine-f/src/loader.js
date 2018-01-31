/* loader.js
variable 'app' is in global scope - i.e. a property of window.
app is our single global object literal - all other functions and properties of
the game will be properties of app. */
"use strict";

// if app exists use the existing copy
// else create a new empty object literal
var app = app || {};

window.onload = function() {
    console.log("window.onload called");
    app.sound.init();
    app.main.sound = app.sound;
    
    app.main.init();
}

window.onblur = function() {
    app.main.pauseGame();
}

window.onfocus = function() {
    app.main.resumeGame();
}

/*
	Cancel Animation is needed to prevent update call from stacking up.
*/
