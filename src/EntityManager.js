import {Graphics} from 'pixi.js';

export class EntityManager {
    constructor(app) {
        // this.app = app;
    }

    generatePlayer() {
        // const app = this.app;
        // const manager = this;

        const graphics = new Graphics();
        graphics.lineStyle(2, 0x0000FF, 1);
        graphics.beginFill(0xFF700B, 1);
        graphics.drawRect(50, 250, 120, 120);
        graphics.endFill();

        return graphics;
    }
}