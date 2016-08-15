import Phaser from 'phaser'
import {centerGameObjects} from '../utils'

import Player from "../sprites/Player";


export default class extends Phaser.State {
    init() {
    }

    preload() {
        const splash = this.add.sprite(this.world.centerX, this.world.centerY, 'splash');
        centerGameObjects([splash]);
    }

    create() {

        this.player = new Player({
            game: this.game,
            x: this.game.world.centerX,
            y: this.game.world.centerY,
            asset: 'mushroom',
            collideLayer: this.layer,
        });

        this.game.add.existing(this.player);
        this.game.camera.follow(this.player);
    }

    render() {
        this.player.render();
    }
}
