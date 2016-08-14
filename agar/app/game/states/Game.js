import Phaser from 'phaser'
import Player from '../sprites/Player'
import ConsoleState from './ConsoleState';

const SPRITE_DATA = require('../../map/lvl0_tile.json');


export default class extends Phaser.State {
    init() {
        this._decoree = new ConsoleState(this.game);
        // this._decoree.executeCmd = this.executeCmd;
    }

    preload() {
        this._decoree.preload();
        this.map = this.game.add.tilemap('dynamicMap', 32, 32);
        this.map.addTilesetImage('tiles', 'tiles', 32, 32);
        this.map.setCollision(SPRITE_DATA[0].wall);
        this.layer = this.map.createLayer(0);
        this.layer.resizeWorld();
        this.layer.debug = true;
    }

    create() {
        this._decoree.create();

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
        this._decoree.render();
        this.player.render();
        // this.game.debug.cameraInfo(game.camera, 32, 32);
        // this.game.debug.spriteCoords(this.player, 32, 500);
        // this.game.debug.spriteInfo(this.player, 32, 32)
    }
}
