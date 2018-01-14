'use strict';

// Return a float between min and max
function randomBetween(min, max) {
    return (Math.random() * (max - min + 1) + min)
}

// Draw a path from start to end
function drawPath(ctx, start, end) {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.closePath();
    ctx.stroke();
}

// Draw a rectangle
function drawRect(ctx, x, y, width, height) {
    ctx.fillRect(x, y, width, height);
}

// Draw a point
function drawPoint(ctx, {x, y}, radius, ccw) {
    drawArc(ctx, x, y, radius, 0, Math.PI * 2, ccw)
}

// Draw a circle
function drawCircle(ctx, x, y, radius, ccw) {
    drawArc(ctx, x, y, radius, 0, Math.PI * 2, ccw)
}

// create an arc for the context
function makeArc(ctx, x, y, radius, start, end, ccw) {
    ctx.beginPath();
    ctx.arc(x, y, radius, start, end, ccw);
    ctx.closePath();
}

// Draw an arc, fill and stroke
function drawArc(ctx, x, y, radius, start, end, ccw) {
    makeArc(ctx, x, y, radius, start, end, ccw);
    ctx.fill();
    ctx.stroke();
}

// Fill an arc
function fillArc(ctx, x, y, radius, start, end, ccw) {
    makeArc(ctx, x, y, radius, start, end, ccw)
    ctx.fill();
}

// Stroke an arc
function strokeArc(ctx, x, y, radius, start, end, ccw) {
    makeArc(ctx, x, y, radius, start, end, ccw)
    ctx.stroke();
}

// Clear the canvas
function clearCanvas(canvas, context) {
    context.clearRect(0, 0, canvas.width, canvas.height)
}
