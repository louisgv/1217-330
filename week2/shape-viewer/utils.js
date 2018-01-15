// create an arc for the context
function makeArc(ctx, x, y, radius, start, end, ccw) {
    ctx.beginPath();
    ctx.arc(x, y, radius, start, end, ccw);
    ctx.closePath();
}

// create a circle in the context
function makeCircle(ctx, x, y, radius, ccw) {
    makeArc(ctx, x, y, radius, 0, Math.PI * 2, ccw)
}

// Fill an arc
function fillArc(ctx, x, y, radius, start, end, ccw) {
    makeArc(ctx, x, y, radius, start, end, ccw)
    ctx.fill();
}

// Draw a circle
function fillCircle(ctx, x, y, radius, ccw) {
    fillArc(ctx, x, y, radius, 0, Math.PI * 2, ccw)
}

// Fill an equilateral triangle
function makeEquilateralTriangle(ctx, size, center) {
    const p1 = new Vector2(center.x, center.y - size);
    const p2 = new Vector2(center.x - size, center.y + size);
    const p3 = new Vector2(center.x + size, center.y + size);

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);

    ctx.closePath();
}
