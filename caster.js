
const ROTATION_ANGLE = Math.PI / 180;

const MovementDirection = Object.freeze({
    FORWARD: 1,
    BACKWARD: -1,
    LEFT: -1,
    RIGHT: 1,
});

const ROTATION_START = Object.freeze({
    NORTH: new Vector2D(0, -1),
    SOUTH: new Vector2D(0, 1),
    WEST: new Vector2D(-1, 0),
    EAST: new Vector2D(1, 0),
});

class Caster {
    constructor(map, position, direction = ROTATION_START.WEST) {
        this.map = map;
        this.position = position;
        this.direction = direction;
        this.movementSpeed = 0.05; // currently hardcoded
    }

    rotate(movementDirection) {
        this.direction.rotate(movementDirection * ROTATION_ANGLE);
    }

    move(movementDirection) {
        const amount = movementDirection * this.movementSpeed;
        const nextPosition = Vector2D.add(this.position, Vector2D.multScalar(this.direction, amount));
        if (this.map.isInsideMap(nextPosition) && !this.map.isWall(nextPosition)) {
            this.position = nextPosition;
        }
    }

    draw(canvasPov, canvasMap) {
        const pov = Math.E ** htmlInputPOV.value - 1; // allows pov input to be exponential
        const cameraWidth = canvasPov.width;
        const plane = Vector2D.multScalar(Vector2D.parallel(this.direction), pov);

        for (let x = 0; x < cameraWidth; x++) {
            const cameraX = 2 * x / (cameraWidth - 1) - 1;
            const ray = Vector2D.add(this.direction, Vector2D.multScalar(plane, cameraX));
            const hit = map.calculateWallHit(this.position, ray);

            if (hit) {
                // To calculate the height I followed https://permadi.com/tutorial/raycast/rayc9.html and did some calculation of my own.
                // 
                //                                           Actual Height
                // Height calculated as Projected Height = ----------------- * Distance to Projection Plane
                //                                          Distance to Wall
                //
                // For our case, inside of the map, everything is a cube of 1x1x1, so actual height is 1 and the distance to the wall
                // is provided on the hit calculation. 
                // 
                // Distance to projection plane is more tricky because I did not calculate the POV by approaching the plane
                // but by making it wider instead. But with our current information we can apply trigonometry to find out 
                // what would be the distance if we would have moved the plane instead of making it wider, leaving us with distance = 1/|p|.
                // 
                // Then, we have to map the height to the canvas height, which multiplied by the ratio of canvas.width / canvas.height to 
                // make squares look squared and by 2 to make walls look twice as tall as wide.
                // 
                // Finally, there is a 2 on the denom that I figure out via trial and error that I don't understand where it comes from, but it is needed.
                // 
                //                           1               1       2 * canvasHeight * (canvasWidth / canvasHeight)
                // Projected Height = ----------------- * ------- * ------------------------------------------------
                //                    Distance to Wall     | p |                          2 <- magic two
                // 
                const height = (canvasPov.width) / (hit.distance * plane.abs()); // simplified
                const squareY = (canvasPov.height - height) / 2; // draw square centered on the canvas
                canvasPov.drawSquare(new Vector2D(x, squareY), 1, height, hit.color);
                canvasMap.drawLine(this.position, hit.contactPoint, 'white');
            }
        }
    }

}