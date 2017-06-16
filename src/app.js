import {Application} from 'pixi.js';

// const PIXI = require('pixi.js');

export const app = new Application(256, 256, {backgroundColor : 0x1099bb});
document.body.appendChild(app.view);
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);
