import Phaser from 'phaser'
import {centerGameObjects} from '../utils'
import {MapGenerator} from "../../map/MapGenerator";


export default class extends Phaser.State {
    init() {
    }

    preload() {
        const splash = this.add.sprite(this.world.centerX, this.world.centerY, 'splash');
        centerGameObjects([splash]);
    }

    create() {
        this.game.time.events.add(1, this.generateMap, this);
    }

    render() {
        if (this.ready) {
        }
    }
}
