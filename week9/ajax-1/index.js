"use strict";
var app = app || {};

(function() {
    const {Vector2, Diamond, Interface, Helper} = app;

    window.addEventListener('load', init);

    const files = ['random-1.txt', 'random-2.txt', 'random-3.txt', 'mac.txt', 'watch.txt'];

    const COLORS = Object.freeze([
        "rgba(0,0,0,0)",
        "white",
        "black",
        "red",
        "green",
        "blue",
        "yellow",
        "magenta"
    ]);

    let canvas;
    let ctx;

    function init() {
        canvas = document.querySelector('canvas');
        ctx = canvas.getContext('2d');

        const fileSelectEl = Interface.generateSelect(`Select file to load`, files, files[0], (e) => {
            loadData(e.target.value);
        });

        document.querySelector('#select-container').appendChild(fileSelectEl);

        loadData(files[0]);
    }

    function loadData(file) {
        const url = `./public/${file}`
        var xhr = new XMLHttpRequest();

        xhr.onload = function() {
            var response = xhr.responseText;
            var gridArray = response.split('\n');
            for (var i = 0; i < gridArray.length; i++) {
                var line = gridArray[i];
                gridArray[i] = line.split(',');
            }

            drawGrid(gridArray);
        }

        xhr.open('GET', url, true);
        // try to prevent browser caching by sending a header to the server
        xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2010 00:00:00 GMT");
        xhr.send();
    }

    function drawGrid(grid) {
        Helper.clearCanvas(ctx);

        const cellWidth = canvas.width / (grid.length - 1);

        const halfWidth = cellWidth / 2.0;

        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid[i].length; j++) {
                const value = grid[i][j];

                const diamond = new Diamond(new Vector2(j * cellWidth, i * cellWidth), halfWidth, COLORS[value]);

                diamond.draw(ctx);

                // ctx.fillRect(j * cellWidth, i * cellWidth, cellWidth, cellWidth);

                /*
                    ctx.beginPath();
                    ctx.arc(halfWidth + j*cellWidth,halfWidth + i*cellWidth,halfWidth,0,2*Math.PI);
                    ctx.fill();
                    ctx.closePath()
                */
            }
        }
    }

}());
