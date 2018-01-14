'use strict';

function randomBetween(min, max) {
    return (Math.random() * (max - min + 1) + min)
}

function drawPath(ctx, start, end) {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.closePath();
    ctx.stroke();
}

function drawRect(ctx, x, y, width, height) {
    ctx.fillRect(x, y, width, height);
}

function drawPoint(ctx, {x, y}, radius, ccw) {
    drawArc(ctx, x, y, radius, 0, Math.PI * 2, ccw)
}

function drawCircle(ctx, x, y, radius, ccw) {
    drawArc(ctx, x, y, radius, 0, Math.PI * 2, ccw)
}

function makeArc(ctx, x, y, radius, start, end, ccw) {
    ctx.beginPath();
    ctx.arc(x, y, radius, start, end, ccw);
    ctx.closePath();
}

function drawArc(ctx, x, y, radius, start, end, ccw) {
    makeArc(ctx, x, y, radius, start, end, ccw);
    ctx.fill();
    ctx.stroke();
}

function fillArc(ctx, x, y, radius, start, end, ccw) {
    makeArc(ctx, x, y, radius, start, end, ccw)
    ctx.fill();
}

function strokeArc(ctx, x, y, radius, start, end, ccw) {
    makeArc(ctx, x, y, radius, start, end, ccw)
    ctx.stroke();
}

function clearCanvas(context, canvas) {
    context.clearRect(0, 0, canvas.width, canvas.height)
}
