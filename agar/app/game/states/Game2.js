import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import {setResponsiveWidth} from '../utils'

export default class extends Phaser.State {
    init() {
    }

    preload() {
        this.map = this.game.add.tilemap('dynamicMap', 32, 32);
        this.map.addTilesetImage('tiles', 'tiles', 32, 32);
        const layer = this.map.createLayer(0);
        layer.resizeWorld();
    }

    create() {
        let banner = this.add.text(this.game.world.centerX, this.game.height - 30, 'Phaser + ES6 + Webpack')
        banner.font = 'Nunito';
        banner.fontSize = 40;
        banner.fill = '#77BFA3';
        banner.anchor.setTo(0.5);

        this.game.physics.startSystem(Phaser.Physics.P2JS);

        this.mushroom = new Mushroom({
            game: this.game,
            x: this.game.world.centerX,
            y: this.game.world.centerY,
            asset: 'mushroom'
        });
        // set the sprite width to 30% of the game width
        // setResponsiveWidth(this.mushroom, 30, this.game.world);
        this.game.add.existing(this.mushroom);


        this.game.camera.follow(this.mushroom);
    }

    render() {
        this.game.debug.cameraInfo(game.camera, 32, 32);
        this.game.debug.spriteCoords(this.mushroom, 32, 500);
        // this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
}
