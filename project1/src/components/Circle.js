class Circle {
    constructor(pos = new Vector2(), radius = 1, color = 'white') {
        this.pos = pos;
        this.radius = radius;
        this.color = color;
    }

    setColor(color) {
        this.color = color;
    }

    setRadius(radius) {
        this.radius = radius;
    }

    draw(ctx) {
        ctx.save();

        ctx.beginPath();
        ctx.fillStyle = this.color;

        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false);

        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}
