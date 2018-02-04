// main.js
// Dependencies:
// Description: singleton object
// This object will be our main "controller" class and will contain references
// to most of the other objects in the game.

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

const Game = Object.freeze({
    //  properties
    WIDTH: 640,
    HEIGHT: 480,

    CIRCLE: Object.freeze({
        NUM_CIRCLES_START: 5,
        NUM_CIRCLES_END: 20,
        START_RADIUS: 18,
        MAX_RADIUS: 45,
        MIN_RADIUS: 2,
        MAX_LIFETIME: 2.5,
        MAX_SPEED: 80,
        EXPLOSION_SPEED: 60,
        IMPLOSION_SPEED: 84
    }),

    CIRCLE_STATE: Object.freeze({ // Circle enum
        NORMAL: 0,
        EXPLODING: 1,
        MAX_SIZE: 2,
        IMPLODING: 3,
        DONE: 4
    }),

    GAME_STATE: Object.freeze({ // another fake enumeration
        BEGIN: 0,
        DEFAULT: 1,
        EXPLODING: 2,
        ROUND_OVER: 3,
        REPEAT_LEVEL: 4,
        END: 5
    }),

    COLORS: [
        "#FD5B78",
        "#FF6037",
        "#FF9966",
        "#FFFF66",
        "#66FF66",
        "#50BFE6",
        "#FF6EFF",
        "#EE34D2"
    ]
})

/*
 .main is an object literal that is a property of the app global
 This object literal has its own properties and methods (functions)

 */
app.main = {
    circles: [],
    numCircles: Game.NUM_CIRCLES_START,

    canvas: undefined,
    ctx: undefined,
    lastTime: 0, // used by calculateDeltaTime()
    debug: true,
    paused: false,
    animationID: 0,
    gameState: undefined,
    roundScore: 0,
    totalScore: 0,

    sound: undefined,
    myKeys: undefined,
    Emitter: undefined,

    pulsar: undefined,
    exhaust: undefined,
    advanceLevelButton: {
        pos: new Vector2(295, 215),
        size: new Vector2(50, 50)
    },

    // Circle property were refactored into
    // default prop of the Ball class

    // methods
    init() {
        console.log("app.main.init() called");
        // initialize properties
        this.canvas = document.querySelector('canvas');
        this.canvas.width = Game.WIDTH;
        this.canvas.height = Game.HEIGHT;
        this.ctx = this.canvas.getContext('2d');

        this.numCircles = Game.CIRCLE.NUM_CIRCLES_START;
        this.circles = this.makeCircles(this.numCircles);

        this.gameState = Game.GAME_STATE.BEGIN;

        this.canvas.addEventListener('mousedown', (e) => this.doMousedown(e));

        this.initExhaust();
        this.initPulsar();

        this.reset();

        // start the game loop
        this.update();
    },

    initPulsar() {
        this.pulsar = new this.Emitter();
        this.pulsar.red = 255;
        this.pulsar.minXspeed = this.pulsar.minYspeed = -0.25;
        this.pulsar.maxXspeed = this.pulsar.maxYspeed = 0.25;

        this.pulsar.lifetime = 500;
        this.pulsar.expansionRate = 0.05;
        this.pulsar.numParticles = 100;
        this.pulsar.xRange = 1;
        this.pulsar.yRange = 1;
        this.pulsar.useCircles = false;
        this.pulsar.useSquares = true;

        this.pulsar.createParticles(new Vector2(540, 100));
    },

    initExhaust() {
        this.exhaust = new this.Emitter();
        this.exhaust.numParticles = 100;
        this.exhaust.red = 255;
        this.exhaust.green = 150;
        this.exhaust.createParticles(new Vector2(100, 100))
    },

    stopBGAudio() {
        this.sound.stopBGAudio()
    },

    pauseGame() {
        this.paused = true;
        cancelAnimationFrame(this.animationID);
        this.update();

        this.sound.stopBGAudio();
    },

    resumeGame() {
        cancelAnimationFrame(this.animationID);
        this.paused = false;
        this.update();
        this.sound.playBGAudio();
    },

    reset() {
        document.querySelector('#button1').style.display = 'none';

        this.numCircles += 5;
        this.roundScore = 0;
        this.circles = this.makeCircles(this.numCircles);
    },

    doMousedown(e) {
        this.sound.playBGAudio();

        if (this.paused) {
            this.paused = false;
            this.update();
            return;
        }

        if (this.gameState === Game.GAME_STATE.EXPLODING) {
            return;
        }

        const mouse = getMouse(e);

        if (this.gameState === Game.GAME_STATE.ROUND_OVER && isPointInRectangle(mouse, this.advanceLevelButton)) {

            this.gameState = Game.GAME_STATE.DEFAULT;
            this.reset();
        }

        this.checkCircleClicked(mouse);
    },

    // mouse is a Vector2
    checkCircleClicked(mouse) {
        for (let i = this.circles.length - 1; i >= 0; i--) {
            const circle = this.circles[i];

            if (circle.isPointInside(mouse)) {
                // circle.fillStyle = 'red';

                circle.speed.mScale(0, 0);
                circle.state = Game.CIRCLE_STATE.EXPLODING;
                this.gameState = Game.GAME_STATE.EXPLODING;
                this.roundScore++;

                this.sound.playEffect();
                break;
            }
        }
    },

    checkForCollisions() {
        if (this.gameState !== Game.GAME_STATE.EXPLODING) {
            return;
        }
        // filter out only exploding circle
        const livingCircles = this.circles.filter((c) => c.state !== Game.CIRCLE_STATE.DONE);

        const explodingCircles = livingCircles.filter((c) => c.state !== Game.CIRCLE_STATE.NORMAL);

        const notExplodingCircles = livingCircles.filter((c) => c.state === Game.CIRCLE_STATE.NORMAL);

        for (let i = 0; i < explodingCircles.length; i++) {
            const c1 = explodingCircles[i];

            for (let j = 0; j < notExplodingCircles.length; j++) {
                const c2 = notExplodingCircles[j]

                if (c1 === c2) {
                    continue;
                }

                if (c1.isIntersectWith(c2)) {
                    c2.state = Game.CIRCLE_STATE.EXPLODING;
                    c2.speed.mScale(0, 0);
                    this.roundScore++;

                    this.sound.playEffect();
                }
            }
        }

        if (explodingCircles.length === 0) {
            this.gameState = Game.GAME_STATE.ROUND_OVER;
            this.totalScore += this.roundScore
            this.sound.stopBGAudio();
        }

    },

    update() {
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
        this.checkForCollisions();

        // 5) DRAW
        // i) draw background
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, Game.WIDTH, Game.HEIGHT);

        // ii) draw circles
        this.ctx.globalAlpha = 0.9;
        this.drawCircles(this.ctx);

        // iii) draw HUD
        this.ctx.globalAlpha = 1.0;
        this.drawHUD(this.ctx);

        if (this.gameState === Game.GAME_STATE.BEGIN || this.gameState === Game.GAME_STATE.ROUND_OVER) {
            const {KEY_UP, KEY_SHIFT} = this.myKeys.KEYBOARD;
            if (this.myKeys.keydown[KEY_UP] && this.myKeys.keydown[KEY_SHIFT]) {
                this.totalScore++;
                this.sound.playEffect();
            }
        }

        // iv) draw debug info
        if (this.debug) {
            // draw dt in bottom right corner
            this.fillText(this.ctx, "dt: " + dt.toFixed(3), Game.WIDTH - 150, Game.HEIGHT - 10, "18pt courier", "white");
        }
    },

    moveCircles(dt) {
        for (let i = 0; i < this.circles.length; i++) {
            const c = this.circles[i];

            switch (c.state) {
                case Game.CIRCLE_STATE.DONE:
                    break;
                case Game.CIRCLE_STATE.EXPLODING:
                    {
                        c.radius += Game.CIRCLE.EXPLOSION_SPEED * dt;

                        if (c.radius >= Game.CIRCLE.MAX_RADIUS) {
                            c.state = Game.CIRCLE_STATE.MAX_SIZE;
                            console.log(`Circle #${i} hits CIRCLE.MAX_RADIUS`);
                        }
                        break;
                    }
                case Game.CIRCLE_STATE.MAX_SIZE:
                    {
                        c.lifeTime += dt;

                        if (c.lifeTime >= Game.CIRCLE.MAX_LIFETIME) {
                            c.state = Game.CIRCLE_STATE.IMPLODING;
                            console.log(`Circle #${i} hits CIRCLE.MAX_LIFETIME`);
                        }
                        break;
                    }
                case Game.CIRCLE_STATE.IMPLODING:
                    {
                        c.radius -= Game.CIRCLE.IMPLOSION_SPEED * dt;
                        if (c.radius <= Game.CIRCLE.MIN_RADIUS) {
                            console.log(`Circle #${i} hits CIRCLE.MIN_RADIUS and is gone`);

                            c.state = Game.CIRCLE_STATE.DONE;
                        }
                        break;
                    }
                default:
                    {
                        c.move(dt);

                        if (c.bounce(Game.WIDTH, Game.HEIGHT)) {
                            c.move(dt);
                        }
                    }
            }
        }
    },

    drawHUD(ctx) {
        ctx.save();

        this.fillText(this.ctx, `This Round: ${this.roundScore} of ${this.numCircles}`, 20, 20, '14pt courier', '#ddd');

        this.fillText(this.ctx, `Total Score: ${this.totalScore}`, Game.WIDTH - 200, 20, '14pt courier', '#ddd');

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        switch (this.gameState) {
            case Game.GAME_STATE.BEGIN:
                {
                    this.fillText(this.ctx, `To begin, click a circle`, Game.WIDTH / 2, Game.HEIGHT / 2, '30pt courier', 'white');

                    this.exhaust.updateAndDraw(this.ctx, new Vector2(100, 100))

                    this.pulsar.updateAndDraw(this.ctx, new Vector2(540, 100))

                    break;
                }
            case Game.GAME_STATE.ROUND_OVER:
                {
                    this.fillText(this.ctx, `Round Over`, Game.WIDTH / 2, Game.HEIGHT / 2 - 40, '30pt courier', 'red');
                    this.fillText(this.ctx, `Click to Continue`, Game.WIDTH / 2, Game.HEIGHT / 2, '30pt courier', 'red');
                    this.fillText(this.ctx, `Next round there are ${this.numCircles + 5} circles`, Game.WIDTH / 2, Game.HEIGHT / 2 + 40, '14pt courier', 'white');

                    document.querySelector('#button1').style.display = 'inline';

                    ctx.fillStyle = 'yellow';
                    const {pos, size} = this.advanceLevelButton;
                    ctx.fillRect(pos.x, pos.y, size.x, size.y);

                    break;
                }
            default:
        }

        ctx.restore();
    },

    drawCircles(ctx) {
        if (this.gameState === Game.GAME_STATE.ROUND_OVER) {
            ctx.globalAlpha = 0.25;
        }

        for (let i = 0; i < this.circles.length; i++) {
            const c = this.circles[i];

            if (c.state === Game.CIRCLE_STATE.DONE)
                continue;

            c.draw(ctx)
            if (c.pulsar) {
                c.pulsar.updateAndDraw(ctx, c.pos)
            }
        }
    },

    createCirclePulsar(pos) {
        const pulsar = new this.Emitter();
        pulsar.red = 255;
        pulsar.green = Math.floor(getRandom(0, 255));
        pulsar.blue = Math.floor(getRandom(0, 255));

        pulsar.minXspeed = pulsar.minYspeed = -0.25;
        pulsar.maxXspeed = pulsar.maxYspeed = 0.25;

        pulsar.lifeTime = 500;
        pulsar.expansionRate = 0.05;
        pulsar.numParticles = 100;

        pulsar.xRange = 1;
        pulsar.yRange = 1;

        pulsar.useCircles = false;
        pulsar.useSquares = true;
        pulsar.createParticles(pos);
        return pulsar;
    },

    makeCircles(num) {
        const array = [];
        // debugger;

        const radius = Game.CIRCLE.START_RADIUS;

        const minPosCoord = radius * 2;

        const maxSpeed = Game.CIRCLE.MAX_SPEED;

        for (let i = 0; i < num; i++) {

            const pos = new Vector2(getRandom(minPosCoord, Game.WIDTH - minPosCoord), getRandom(minPosCoord, Game.HEIGHT - minPosCoord));
            const speed = getRandomUnitVector();

            const fillStyle = Game.COLORS[i % Game.COLORS.length];

            const circle = new Ball({pos, speed, fillStyle, radius, maxSpeed});

            circle.state = Game.CIRCLE_STATE.NORMAL;
            circle.lifeTime = 0;

            circle.pulsar = this.createCirclePulsar(pos);

            Object.seal(circle);
            array.push(circle);
        }

        return array;
    },

    drawPauseScreen(ctx) {
        ctx.save();

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, Game.WIDTH, Game.HEIGHT);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        this.fillText(this.ctx, '. . . PAUSED . . .', Game.WIDTH / 2, Game.HEIGHT / 2, '40pt courier', 'white');

        ctx.restore();
    },

    fillText: function(ctx, string, x, y, css, color) {
        ctx.save();
        // https://developer.mozilla.org/en-US/docs/Web/CSS/font
        ctx.font = css;
        ctx.fillStyle = color;
        ctx.fillText(string, x, y);
        ctx.restore();
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
