const Mode = Object.freeze({
    STROKE: "STROKE",
    FILL: "FILL",
});

class Canvas {
    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
    }

    drawSegment(s, color) {
        this.drawLine(s.v1, s.v2, color);
    }

    drawLine(v1, v2, color) {
        this.ctx.strokeStyle = this._getStyle(color);
        this.ctx.beginPath();
        this.ctx.moveTo(v1.x, v1.y);
        this.ctx.lineTo(v2.x, v2.y);
        this.ctx.stroke();
    }

    drawCircle(center, radius, color, mode = Mode.STROKE) {
        this.ctx.beginPath();
        this.ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        switch (mode) {
            case Mode.FILL:
                this.ctx.fillStyle = this._getStyle(color);
                this.ctx.fill();
                break;
            case Mode.STROKE:
                this.ctx.strokeStyle = this._getStyle(color);
                this.ctx.stroke();
                break;
            default:
                console.error("Invalid mode");
        }
    }

    drawSquare(position, width, height, color, mode = Mode.FILL) {
        switch (mode) {
            case Mode.FILL:
                this.ctx.fillStyle = this._getStyle(color);
                this.ctx.fillRect(position.x, position.y, width, height);
                break;
            case Mode.STROKE:
                this.ctx.strokeStyle = this._getStyle(color);
                this.ctx.strokeRect(position.x, position.y, width, height);
                break;
            default:
                console.error("Invalid mode");
        }
    }

    drawText(position, text, size, color, mode = Mode.FILL) {
        this.ctx.font = `${size}px Arial`; // Could be improved to allow for more fonts
        switch (mode) {
            case Mode.FILL:
                this.ctx.fillStyle = this._getStyle(color);
                this.ctx.fillText(text, position.x, position.y);
                break;
            case Mode.STROKE:
                this.ctx.strokeStyle = this._getStyle(color);
                this.ctx.strokeText(text, position.x, position.y);
                break;
            default:
                console.error("Invalid mode");
        }
    }

    _getStyle(color) {
        return typeof color === 'string' ? color : color.toString();
    }

}

class HSLColor {
    constructor(hue, lightness = 50, saturation = 100) {
        this.hue = hue;
        this.saturation = saturation;
        this.lightness = lightness;
    }

    toString() {
        return `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`
    }

    darker(modifier) {
        this.lightness -= this.lightness * (modifier / 100);
        return this;
    }
}

class CanvasAdapter extends Canvas {
    constructor(canvas, targetWidth, targetHeight) {
        super(canvas);
        this.ratio = new Vector2D(this.width / targetWidth, this.height / targetHeight);
    }

    toCanvasVector(vector) {
        return Vector2D.multiply(vector, this.ratio);
    }

    toAdaptedVector(vector) {
        return Vector2D.divide(vector, this.ratio);
    }

    drawLine(v1, v2, color) {
        const canvasV1 = this.toCanvasVector(v1);
        const canvasV2 = this.toCanvasVector(v2);

        super.drawLine(canvasV1, canvasV2, color);
    }

    drawCircle(center, radius, color, mode = Mode.STROKE) {
        const canvasCenter = this.toCanvasVector(center);
        const canvasRadius = radius * this.ratio.x; // Naive implementation, assuming ratio.x = ratio.y
        super.drawCircle(canvasCenter, canvasRadius, color, mode);
    }

    drawSquare(position, width, height, color, mode = Mode.FILL) {
        const canvasPosition = this.toCanvasVector(position);
        const canvasWidth = width * this.ratio.x;
        const canvasHeight = height * this.ratio.y;

       super.drawSquare(canvasPosition, canvasWidth, canvasHeight, color, mode);
    }

    drawText(position, text, size, color, mode = Mode.FILL) {
        const canvasPosition = this.toCanvasVector(position);
        super.drawText(canvasPosition, text, size, color, mode);
    }
}