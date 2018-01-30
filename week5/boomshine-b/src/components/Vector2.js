class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    // Mutable add
    mAdd({x, y}) {
        this.x += x;
        this.y += y;
    }

    // Immutable add
    iAdd({x, y}) {
        return new Vector2(this.x + x, this.y + y);
    }

    mScale(x, y) {
        this.x *= x;
        this.y *= y;
    }

    // Immutable mul
    iMul(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }
}
