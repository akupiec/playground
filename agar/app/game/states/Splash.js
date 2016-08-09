import Phaser from 'phaser'
import {centerGameObjects} from '../utils'

const SPRITES_DIR = './dist/assets/sprites/';
const IMAGES_DIR = './dist/assets/images/';

export default class extends Phaser.State {
    init() {
    }

    preload() {
        const splash = this.add.sprite(this.world.centerX, this.world.centerY, 'splash');
        this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg');
        this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar');
        centerGameObjects([splash, this.loaderBg, this.loaderBar]);

        this.load.setPreloadSprite(this.loaderBar);
        //
        // load your assets
        //
        this.load.image('mushroom', IMAGES_DIR + 'mushroom2.png');
        this.load.image('a', IMAGES_DIR + 'phaser-es6-webpack.png');
        this.load.image('tiles', SPRITES_DIR + 'Dungeon_A2.png');

    }

    create() {
        this.state.start('Generator')
    }

}
