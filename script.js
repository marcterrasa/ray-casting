// Thanks to Lode Vandevenne https://lodev.org/cgtutor/raycasting.html and The Coding Train https://www.youtube.com/watch?v=vYgIKn7iDH8

const htmlCanvasMap = document.getElementById("map");
const htmlCanvasPOV = document.getElementById("pov");
const htmlInputPOV = document.getElementById("pov-slider");

const map = new GameMap();
const caster = new Caster(map, new Vector2D(map.width/2, map.height/2));

const canvasMap = new CanvasAdapter(htmlCanvasMap, map.width, map.height);
let canvasPOV = new Canvas(htmlCanvasPOV);

const keysPressed = new Set(); // stores the set of keys pressed to allow multikey

let frames = 0;
let framesLastSecond = 0;

function drawFrame() {
    frames++;
    keysInteraction();

    drawBackground();

    map.draw(canvasMap);
    caster.draw(canvasPOV, canvasMap);

    drawFPS();
    window.requestAnimationFrame(drawFrame);
}

function drawBackground() {
    // upper half
    canvasPOV.drawSquare(new Vector2D(0, 0), canvasPOV.width, canvasPOV.height * 0.5, 'black');
    // bottom half
    canvasPOV.drawSquare(new Vector2D(0, canvasPOV.height * 0.5), canvasPOV.width, canvasPOV.height * 0.5, 'green');
}

function drawFPS() {
    canvasPOV.drawText(new Vector2D(10, 30), `FPS: ${framesLastSecond}`, 20, 'gold');
}

function keysInteraction() {
    for (const key of keysPressed) {
        switch (key) {
            case 'W':
            case 'w':
            case 'ArrowUp':
                caster.move(MovementDirection.FORWARD);
                break;
            case 'S':
            case 's':
            case 'ArrowDown':
                caster.move(MovementDirection.BACKWARD);
                break;
            case 'A':
            case 'a':
            case 'ArrowLeft':
                caster.rotate(MovementDirection.LEFT);
                break;
            case 'D':
            case 'd':
            case 'ArrowRight':
                caster.rotate(MovementDirection.RIGHT);
                break;
            default:
                break;
        }
    }
}

// timeout functions
function showFPS() {
    framesLastSecond = frames;
    frames = 0;
    setTimeout(showFPS, 1000);
}

setTimeout(showFPS, 1000);

// event functions
function keyEventHandler(event, keyFn) {
    keyFn(event.key);
}

function resizeCanvas() {
    htmlCanvasPOV.width = window.innerWidth;
    htmlCanvasPOV.height = window.innerHeight;
    canvasPOV = new Canvas(htmlCanvasPOV);
}

// events
document.addEventListener('keydown', (event) => keyEventHandler(event, keysPressed.add.bind(keysPressed)));
document.addEventListener('keyup', (event) => keyEventHandler(event, keysPressed.delete.bind(keysPressed)));
window.addEventListener('resize', resizeCanvas, false);

resizeCanvas();
// start animation
window.requestAnimationFrame(drawFrame);