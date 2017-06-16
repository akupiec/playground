import {Container, TextStyle, Text} from 'pixi.js';
import {EntityManager} from './EntityManager';

export class StageManager {
    constructor(app) {
        this.app = app;
        this.entityManager = new EntityManager(app);
    }

    generateStartStage() {
        const app = this.app;
        const manager = this;
        const stage = new Container();

        const style = new TextStyle({
            fill: ['#ffffff']
        });

        const fpsText = new Text('Loading...', style);
        fpsText.x = 10;
        fpsText.y = 10;
        stage.addChild(fpsText);

        const startText = new Text('Click to start', Object.assign({}, style));
        startText.buttonMode = true;
        startText.interactive = true;
        startText.x = app.renderer.width / 2;
        startText.y = app.renderer.height / 2;
        startText
            .on('pointerover', () => {
                startText.style.fill = '#ff00ff';
            })
            .on('pointerout', () => {
                startText.style.fill = '#ffffff';
            })
            .on('pointerdown', () => {
                manager.startFirstLvl();
            });
        stage.addChild(startText);

        return stage;
    }

    setStage(stage) {
        this.app.stage = stage;
    }
    swapStage(stage) {
        this.app.stage.destroy();
        this.setStage(stage);
    }

    startFirstLvl() {
        const stage = this.generateFirstLvlStage();
        this.swapStage(stage);
    }

    generateFirstLvlStage() {
        const app = this.app;
        const manager = this;
        const stage = new Container();
        stage.addChild(manager.entityManager.generatePlayer());

        return stage;
    }
}