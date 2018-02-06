class Triangle {
    constructor(pos = new Vector2(), size = 1, color = 'white') {
        this.pos = pos;
        this.size = size;
        this.color = color;

        this.p1 = new Vector2(pos.x, pos.y + size);
        this.p2 = new Vector2(pos.x - size, pos.y - size);
        this.p3 = new Vector2(pos.x + size, pos.y - size);
    }

    draw(ctx) {
        ctx.save();

        ctx.fillStyle = this.color;

        ctx.beginPath();

        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.lineTo(this.p3.x, this.p3.y);

        ctx.closePath();

        ctx.restore();
    }
}
