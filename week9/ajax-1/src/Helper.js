/*
	Author: LAB
	Helper methods singleton. Generic and not opinionated

    LICENSE: MIT
*/

"use strict";
var app = app || {};

app.Helper = {
    // Create html element. Code adapted from
    // https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
    createElement(html) {
        const template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    },

    // Toggle all toggle target based on the menu button state
    toggleUIElement(e) {

        const shouldDisable = e.target.innerText === 'x';

        e.target.innerHTML = shouldDisable
            ? '='
            : 'x';

        Array.from(document.querySelectorAll('.toggle-target')).map((target) => {
            target.classList.toggle('toggle-disabled');
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
    getMouse: ({pageX, pageY, target}) => new Vector2(pageX - target.offsetLeft, pageY - target.offsetTop),
    // Clear the canvas
    clearCanvas(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    },

    // Make gradient on ctx from stops colors
    makeGradient(ctx, stopColors) {
        const gradient = ctx.createLinearGradient(0, 0, window.innerWidth, window.innerHeight);

        const stepSize = 1 / (stopColors.length - 1)

        stopColors.forEach((c, i) => {
            gradient.addColorStop(i * stepSize, c);
        })

        return gradient;
    },

    // Create rgba color
    makeColor(r, g, b, a) {
        return `rgba(${r},${g},${b},${a})`;
    },

    // Request the user to fullscreen the visualization
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
