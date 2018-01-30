// main.js
// Dependencies:
// Description: singleton object
// This object will be our main "controller" class and will contain references
// to most of the other objects in the game.

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

/*
 .main is an object literal that is a property of the app global
 This object literal has its own properties and methods (functions)

 */
app.main = {

    //  properties
    WIDTH: 640,
    HEIGHT: 480,

    NUM_CIRCLES_START: 5,
    //startingcircleradius
    START_RADIUS: 8,
    //pixels-per-second
    MAX_SPEED: 80,
    CIRCLE_STATE: {
        NORMAL: 0,
        EXPLODING: 1,
        MAX_SIZE: 2,
        IMPLODING: 3,
        DONE: 4
    },

    circles: [],
    numCircles: this.NUM_CIRCLES_START,

    canvas: undefined,
    ctx: undefined,
    lastTime: 0, // used by calculateDeltaTime()
    debug: true,
    paused: false,
    animationID: 0,

    // Circle property were refactored into
    // default prop of the Ball class

    // methods
    init: function() {
        console.log("app.main.init() called");
        // initialize properties
        this.canvas = document.querySelector('canvas');
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;
        this.ctx = this.canvas.getContext('2d');

        this.numCircles = this.NUM_CIRCLES_START;
        this.circles = this.makeCircles(this.numCircles);

        // start the game loop
        this.update();
    },

    update: function() {
        // 1) LOOP
        // schedule a call to update()
        this.animationID = requestAnimationFrame(() => this.update());

        // 2) PAUSED?
        // if so, bail out of loop
        if (this.paused) {
            this.drawPauseScreen(this.ctx);
            return;
        }

        // 3) HOW MUCH TIME HAS GONE BY?
        var dt = this.calculateDeltaTime();

        // 4) UPDATE
        // move circles
        this.moveCircles(dt);

        // 5) DRAW
        // i) draw background
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);

        // ii) draw circles
        this.drawCircles(this.ctx);

        // iii) draw HUD

        // iv) draw debug info
        if (this.debug) {
            // draw dt in bottom right corner
            this.fillText("dt: " + dt.toFixed(3), this.WIDTH - 150, this.HEIGHT - 10, "18pt courier", "white");
        }
    },

    moveCircles(dt) {
        this.circles.map((c) => {
            c.move(dt);

            c.bounce(this.WIDTH, this.HEIGHT);
        })
    },

    drawCircles(ctx) {
        this.circles.map((c) => c.draw(ctx))
    },

    makeCircles(num) {
        const array = [];
        // debugger;

        const minPosCoord = this.START_RADIUS * 2;

        for (let i = 0; i < num; i++) {
            const pos = new Vector2(getRandom(minPosCoord, this.WIDTH - minPosCoord), getRandom(minPosCoord, this.HEIGHT - minPosCoord));
            const speed = getRandomUnitVector();

            const fillStyle = getRandomColor();

            const circle = new Ball({pos, speed, fillStyle, radius: this.START_RADIUS, maxSpeed: this.MAX_SPEED});

            circle.state = this.CIRCLE_STATE.NORMAL;
            circle.lifeTime = 0;

            Object.seal(circle);
            array.push(circle);
        }

        return array;
    },

    drawPauseScreen(ctx) {
        ctx.save();

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        this.fillText('. . . PAUSED . . .', this.WIDTH / 2, this.HEIGHT / 2, '40pt courier', 'white');

        ctx.restore();
    },

    fillText: function(string, x, y, css, color) {
        this.ctx.save();
        // https://developer.mozilla.org/en-US/docs/Web/CSS/font
        this.ctx.font = css;
        this.ctx.fillStyle = color;
        this.ctx.fillText(string, x, y);
        this.ctx.restore();
    },

    calculateDeltaTime: function() {
        var now,
            fps;
        now = performance.now();
        fps = 1000 / (now - this.lastTime);
        fps = clamp(fps, 12, 60);
        this.lastTime = now;
        return 1 / fps;
    }

}; // end app.main
