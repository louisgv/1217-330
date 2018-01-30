class Ball {
    constructor({
        pos = new Vector2(100, 100),
        radius = 40,
        speed = new Vector2(200, 160),
        fillStyle = 'red',
        maxSpeed = 80
    }) {
        this.pos = pos;
        this.radius = radius;
        this.speed = speed;
        this.fillStyle = fillStyle;
        this.maxSpeed = maxSpeed;
    }

    move(dt) {
        this.pos.mAdd(this.speed.iMul(dt * this.maxSpeed))
    }

    bounce(width, height) {
        if (this.hitBorder(this.pos.x, width)) {
            this.speed.mScale(-1, 1);
        }

        if (this.hitBorder(this.pos.y, height)) {
            this.speed.mScale(1, -1);
        }
    }

    hitBorder(side, limit) {
        return side < this.radius || side > limit - this.radius;
    }

    isPointInside(point) {
        const diff = point.iSub(this.pos);

        return diff.dot(diff) <= this.radius * this.radius;
    }

    draw(ctx) {
        ctx.save();
        ctx.beginPath();

        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, false);

        ctx.closePath();

        ctx.fillStyle = this.fillStyle;

        ctx.fill();
        ctx.restore();
    }
}
