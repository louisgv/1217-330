class Square {
    constructor(pos = new Vector2(), size = new Vector2(), color = 'white') {
        this.pos = pos;
        this.size = size;
        this.color = color;
    }

    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.color;

        ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);

        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}
