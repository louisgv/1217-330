class Square {
    constructor(pos = new Vector2(), size = 10, color = 'white') {
        this.pos = pos;
        this.size = size;
        this.halfSize = size / 2;
        this.color = color;
    }

    setSize(size) {
        this.size = size;
        this.halfSize = size / 2;
    }

    setColor(color) {
        this.color = color;
    }

    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.color;

        ctx.fillRect(this.pos.x - this.halfSize, this.pos.y - this.halfSize, size, size);

        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}
