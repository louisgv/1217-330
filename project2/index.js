/*
	Author: LAB
	Loader module for pattar

    LICENSE: GPLv3
*/

"use strict";
var app = app || {};
(function() {

    const {Main, Keyboard, Sound} = app;

    const main = new Main();

    window.addEventListener('load', () => {
        main.sound = new Sound();
        main.keyboard = new Keyboard();

        main.init();
    });

    window.addEventListener('resize', main.setupCache, false);

    window.addEventListener('blur', main.halt, false);

    window.addEventListener('focus', main.resume, false);

    window.addEventListener('keyup', (e) => {
        switch (main.keyboard.onKeyUp(e)) {
            case 'P':
                {
                    if (main.paused) {
                        main.resume();
                    } else {
                        main.halt();
                    }
                    break;
                }
            default:
        }
    });

    window.addEventListener('keydown', (e)=> {
        main.keyboard.onKeyDown(e);
    });
}());
