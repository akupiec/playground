import Player from "./Player";
import Phaser from 'Phaser';

export default class Game {
    constructor() {
        this._game = null;
        this._cursors = null;
        this._player = null;
    }

    run() {
        this._game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', {
            preload: this._preload.bind(this),
            create: this._create.bind(this),
            update: this._update.bind(this),
            render: this._render.bind(this)
        });
    }

    _preload() {
        this._game.stage.backgroundColor = '#007236';

        this._game.load.image('mushroom', 'assets/sprites/mushroom2.png');
        this._game.load.image('phaser', 'assets/sprites/sonic_havok_sanity.png');
    }

    _create() {
        this._game.world.resize(1200, 800);

        for (var i = 0; i < 100; i++) {
            this._game.add.sprite(this._game.world.randomX, this._game.world.randomY, 'mushroom');
        }
        this._cursors = this._game.input.keyboard.createCursorKeys();

        this._player = new Player('phaser', 5, this._game);
    }


    _update() {
        this._player.update();

        if (this._cursors.up.isDown) {
            // game.camera.y -= 4;
            this._player.move('up');
        }
        else if (this._cursors.down.isDown) {
            this._player.y += 4;
            // game.camera.y += 4;
            this._player.move('down');
        }

        if (this._cursors.left.isDown) {
            if (this._cursors.left.shiftKey) {
                this._game.world.rotation -= 0.05;
            }
            else {
                this._player.x -= 4;
                this._player.move('left');
                // game.camera.x -= 4;
            }
        }
        else if (this._cursors.right.isDown) {
            if (this._cursors.right.shiftKey) {
                this._game.world.rotation += 0.05;
            }
            else {
                this._player.move('right');
                // game.camera.x += 4;
            }
        }
    }

    _render() {
        this._game.debug.cameraInfo(this._game.camera, 32, 32);
    }

}