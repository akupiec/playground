import Player from "./Player";
import MapGenerator from './MapGenerator';
import Phaser from 'Phaser';

const TITLE_SIZE = 32;
const WIDTH = 1000;
const HEIGHT = 1000;

const MAP_DATA = {
    "layers": [
        {
            data: null,
            "name": "World1",
            "opacity": 1,
            "properties": {
                "time": "1000"
            },
            "type": "tilelayer",
            "visible": true,
            "height": HEIGHT,
            "width": WIDTH,
            "x": 0,
            "y": 0
        }],
    "orientation": "orthogonal",
    "properties": {
        "mapProp": "123"
    },
    "tileheight": TITLE_SIZE,
    "tilewidth": TITLE_SIZE,
    "tilesets": [
        {
            "firstgid": 0,
            "image": "Dungeon_A2.png",
            "imageheight": 384,
            "imagewidth": 512,
            "margin": 0,
            "name": "SuperMarioBros-World1-1",
            "properties": {},
            "spacing": 0,
            "tileproperties": {
                "10": {
                    "coin": "true"
                }
            },
            "tileheight": TITLE_SIZE,
            "tilewidth": TITLE_SIZE
        }],
    "version": 1,
    "height": HEIGHT,
    "width": WIDTH
};

export default class Game {
    constructor() {
        this._game = null;
        this._cursors = null;
        this._player = null;
        this._generator = new MapGenerator();
    }

    run() {
        this._generator.generate();

        this._game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', {
            preload: this._preload.bind(this),
            create: this._create.bind(this),
            update: this._update.bind(this),
            render: this._render.bind(this)
        });
    }


    _preload() {
        this._game.stage.backgroundColor = '#007236';

        // this._game.load.image('mushroom', 'assets/sprites/mushroom2.png');
        // this._game.load.image('phaser', 'assets/sprites/sonic_havok_sanity.png');

        const DATA = this._generator.getMap();

        MAP_DATA.layers[0].data = DATA;
        this._game.load.tilemap('mario', null, MAP_DATA, Phaser.Tilemap.TILED_JSON);
        this._game.load.image('tiles', 'dist/assets/sprites/Dungeon_A2.png');
    }


    _create() {
        this._game.world.resize(32000, 32000);

        var titleMap = this._game.add.tilemap('mario');
        titleMap.addTilesetImage('SuperMarioBros-World1-1', 'tiles');
        var layer = titleMap.createLayer('World1');

        layer.resizeWorld();

        // this._game.add.tileSprite(0, 0,500, 500, 'terrain', 1);

        // for (var i = 0; i < 100; i++) {
        //     this._game.add.sprite(this._game.world.randomX, this._game.world.randomY, 'terrain', 0);
        //     this._game.add.sprite(this._game.world.randomX, this._game.world.randomY, 'mushroom');
        // }
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