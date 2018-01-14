'use strict';

window.addEventListener('load', main);

// Main function
function main() {

    const canvas = document.querySelector('canvas');

    const context = canvas.getContext('2d');

    draw(canvas, context);

    canvas.addEventListener('click', ()=>{
        clearCanvas(canvas, context)
        draw(canvas, context)
    })

    setInterval(() => {
        clearCanvas(canvas, context)
        draw(canvas, context)
    }, 450);
}

function draw(canvas, context) {
    const horizonRatio = 3 / 4; // = sky / (sky+ ground)

    const horizonY = canvas.height * horizonRatio;

    drawGround(context, {
        color: 'black',
        y: horizonY,
        width: canvas.width,
        height: canvas.height * (1 - horizonRatio)
    })

    drawSky(context, {
        color: 'red',
        width: canvas.width,
        height: canvas.height * horizonRatio
    })

    drawHorizon(context, {
        y: horizonY,
        width: canvas.width,
        skyColor: 'red',
        groundColor: 'black',
        bubbleCount: 9
    })

    drawTree(context, {
        color: 'black',
        x: canvas.width / 7.29,
        y: canvas.height * 3.6 / 4.5,
        height: canvas.height / 2,
        fruitWidth: 18,
        fruitCount: 9
    })

    drawSmileyFace(context, {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: canvas.width / 4,
        strokeWidth: 2.7,
        faceColor: 'white',
        eyeColor: 'black',
        mouthColor: 'black'
    })
}

// Draw the face
function drawSmileyFace(ctx, {
    x,
    y,
    radius,
    strokeWidth,
    outlineColor,
    faceColor,
    eyeColor,
    mouthColor
}) {
    ctx.lineWidth = strokeWidth;

    ctx.fillStyle = faceColor;

    // Overall face
    drawCircle(ctx, x, y, radius)

    // Smile
    ctx.fillStyle = mouthColor;

    fillArc(ctx, x, y, radius / 1.17, Math.PI * 0.1, Math.PI)

    ctx.fillStyle = faceColor;
    fillArc(ctx, x + radius / 18, y - radius / 5.4, radius / 1.08, Math.PI * 0.1, Math.PI)

    ctx.strokeStyle = eyeColor;
    ctx.fillStyle = eyeColor;

    // Left eye
    drawCircle(ctx, x - radius / 2, y - radius / 9, radius / 4.5)

    // Right eye
    drawCircle(ctx, x + radius / 2, y + radius / 3.6, radius / 9)
}

// Draw the random tree
function drawTree(ctx, {
    color,
    x,
    y,
    height,
    fruitWidth,
    fruitCount
}) {

    ctx.strokeStyle = color;
    ctx.lineWidth = fruitWidth / 3;

    const topPos = new Vector2(x, y - height)
    drawPath(ctx, new Vector2(x, y), topPos)

    const fruits = [];

    const xMax = fruitWidth * 2;
    const yMax = fruitWidth;

    const branchStep = height / fruitCount;

    for (let i = 2; i <= fruitCount; i++) {
        const start = new Vector2(x, y - height + i * branchStep);

        const sign = Math.random() > 0.5
            ? 1
            : -1;

        const xDelta = sign * randomBetween(yMax, xMax)

        const yDelta = Math.random() * yMax

        const end = new Vector2(start.x - xDelta, start.y - yDelta);

        drawPath(ctx, start, end)
        fruits.push(end)
    }

    drawPoint(ctx, topPos, fruitWidth, 0, Math.PI)

    fruits.map((f) => {
        const fWidth = randomBetween(fruitWidth/3, fruitWidth/2);
        drawPoint(ctx, f, fWidth, 0, Math.PI)
    })
}

// Draw the horizon between sky and ground
function drawHorizon(ctx, {y, width, skyColor, groundColor, bubbleCount}) {
    ctx.fillStyle = skyColor;

    const bubbleStep = width / bubbleCount;

    const bubbleRadius = bubbleStep / 4;

    const bubbleHalfRadius = bubbleStep * 3 / 4;

    // const bubbleHalfRadius = bubbleStep / 2;

    for (let i = 0; i < bubbleCount; ++i) {
        fillArc(ctx, bubbleRadius + bubbleStep * i, y - 1, bubbleRadius, 0, Math.PI)
    }

    ctx.fillStyle = groundColor;

    for (let i = 0; i < bubbleCount; ++i) {
        fillArc(ctx, bubbleHalfRadius + bubbleStep * i, y + 1, bubbleRadius, 0, Math.PI, true)
    }
}

// Draw the sky
function drawSky(ctx, {color, width, height}) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
}

// Draw the ground
function drawGround(ctx, {color, y, width, height}) {
    ctx.fillStyle = color;
    ctx.fillRect(0, y, width, height);
}
