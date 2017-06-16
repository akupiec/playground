const PIXI = require('pixi.js');

const renderer = PIXI.autoDetectRenderer(256, 256, {antialias: true});
document.body.appendChild(renderer.view);
renderer.view.style.position = 'absolute';
renderer.view.style.display = 'block';
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

const stage = new PIXI.Container();

const style = new PIXI.TextStyle({
    fill: ['#ffffff']
});
const fpsText = new PIXI.Text('Loading...', style);
fpsText.x = 10;
fpsText.y = 10;
stage.addChild(fpsText);

const simulationText = new PIXI.Text();
simulationText.style = style;
simulationText.x = 10;
simulationText.y = 35;
stage.addChild(simulationText);

const simulationSpeed = new PIXI.Text();
simulationSpeed.style = style;
simulationSpeed.x = 10;
simulationSpeed.y = 60;
stage.addChild(simulationSpeed);


let lastCalledTime = Date.now();
let fps = 0;

function requestAnimFrame() {
    let delta = (Date.now() - lastCalledTime) / 1000;
    lastCalledTime = Date.now();
    fps = 1 / delta;
}

function renderLoop() {
    requestAnimationFrame(renderLoop); //~60fps
    requestAnimFrame();

    fpsText.text = 'FPS: ' + fps.toPrecision(2);
    renderer.render(stage);
}
renderLoop();


