import Phaser from 'phaser'
import {centerGameObjects} from '../utils'
import {MapGenerator} from "../../map/MapGenerator";


export default class extends Phaser.State {
    init() {
        this.ready = false;
        this._generator = new MapGenerator();
    }

    preload() {
        const splash = this.add.sprite(this.world.centerX, this.world.centerY, 'splash');
        this.add.text(this.world.centerX - 100, this.world.centerY - 50, 'generating map...', {
            font: '24px Arial',
            fill: '#0000000',
            align: 'center'
        });
        this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg');
        this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar');
        centerGameObjects([splash, this.loaderBg, this.loaderBar]);
    }

    create() {
        this.game.time.events.add(1, this.generateMap, this);
    }

    generateMap() {
        this._generator.generate();
        this.rawData = this._generator.getMapData().getCVS();
        this.game.cache.addTilemap('dynamicMap', null, this.rawData, Phaser.Tilemap.CSV);
        this.ready = true;
    }

    render() {
        if (this.ready) {
            this.state.start('Game')
        }
    }
}
