// Simple representation for a 2D point
// version: 0.1.1
class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    translate({x, y}) {
        this.x += x;
        this.y += y;
    }
}
