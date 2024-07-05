class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // Rotation matrix multiplied by column vector.
    // @param angle rotation angle in rads
    // https://en.wikipedia.org/wiki/Rotation_matrix
    rotate(angle) {
        const x = this.x;
        const y = this.y;
        const cosTheta = Math.cos(angle);
        const sinTheta = Math.sin(angle);
        
        this.x = (x * cosTheta - y * sinTheta);
        this.y = (x * sinTheta + y * cosTheta);
    }

    abs() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }

    static add(v1, v2) {
        return new Vector2D(v1.x + v2.x, v1.y + v2.y);
    }

    static subs(v1, v2) {
        return new Vector2D(v1.x - v2.x, v1.y - v2.y);
    }

    static multScalar(v1, s) {
        return new Vector2D(v1.x * s, v1.y * s);
    }

    static multiply(v1, v2) {
        return new Vector2D(v1.x * v2.x, v1.y * v2.y);
    }

    static divide(v1, v2) {
        return new Vector2D(v1.x / v2.x, v1.y / v2.y);
    }

    static parallel(v) {
        return new Vector2D(-v.y, v.x);
    }

    static floor(v) {
        return new Vector2D(Math.floor(v.x), Math.floor(v.y));
    }
}

class Segment2D {
    constructor(v1, v2) {
        this.v1 = v1;
        this.v2 = v2;
    }

    length() {
        return Math.sqrt((this.v2.x - this.v1.x) ** 2 + (this.v2.y - this.v2.y) ** 2)
    }

    // Used in a previous naive implementation of ray / wall collision (https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection)
    // Implemented assuming s1 is a segment but s2 is an infinite line
    static intersection(s1, s2) {
        const denom = (s1.v1.x - s1.v2.x) * (s2.v1.y - s2.v2.y) - (s1.v1.y - s1.v2.y) * (s2.v1.x - s2.v2.x);
        if (denom === 0) {
            return;
        }
    
        const t = ((s1.v1.x - s2.v1.x) * (s2.v1.y - s2.v2.y) - (s1.v1.y - s2.v1.y) * (s2.v1.x - s2.v2.x)) / denom;
        const u = -1 * ((s1.v1.x - s1.v2.x) * (s1.v1.y - s2.v1.y) - (s1.v1.y - s1.v2.y) * (s1.v1.x - s2.v1.x)) / denom;

        if (t > 0 && t < 1 && u > 0) {
            return new Vector2D(s1.v1.x + t * (s1.v2.x - s1.v1.x), s1.v1.y + t * (s1.v2.y - s1.v1.y));
        }
    
        return;
    }
}