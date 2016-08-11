import Phaser from 'phaser'
import {centerGameObjects} from "../utils";

const SPRITES_DIR = './dist/assets/sprites/';
const IMAGES_DIR = './dist/assets/images/';

var text;

export default class extends Phaser.State {
    init(nextProps) {
        this.nextProps = nextProps;
        this.stage.backgroundColor = '#5333B8';
    }

    registerLoading() {
        this.load.image('splash', IMAGES_DIR + 'splash.jpg');
        this.load.image('loaderBg', IMAGES_DIR + 'loader-bg.png');
        this.load.image('loaderBar', IMAGES_DIR + 'loader-bar.png');
        this.load.image('mushroom', IMAGES_DIR + 'mushroom2.png');
        this.load.image('tiles', SPRITES_DIR + 'Dungeon_A2.png');
        this.load.start();
    }

    create() {
        this.load.onLoadStart.add(this.loadStart, this);
        this.load.onFileComplete.add(this.fileComplete, this);
        this.load.onLoadComplete.add(this.loadComplete, this);
        this.registerLoading();
    }

    loadStart() {
        text = this.game.add.text(this.world.centerX, this.world.centerY - 50, 'Loading...', {
            font: '24px Arial',
            fill: '#0000000',
            align: 'center'
        });
    }

    fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
        text.setText("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);

        if (cacheKey === 'splash' || cacheKey === 'loaderBg') {
            const sprite = this.game.add.image(this.world.centerX, this.world.centerY, cacheKey);
            centerGameObjects([sprite]);
        }

        if (cacheKey === 'loaderBar') {
            const sprite = this.game.add.image(this.world.centerX, this.world.centerY, cacheKey);
            centerGameObjects([sprite]);
            this.load.setPreloadSprite(sprite);
        }
    }

    loadComplete() {
        this.state.start(...this.nextProps);
    }

}
