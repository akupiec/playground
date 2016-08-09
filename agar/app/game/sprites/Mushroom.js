import Phaser from 'phaser'


export default class extends Phaser.Sprite {

    constructor({game, x, y, asset}) {
        super(game, x, y, asset);

        this.game = game;
        this.anchor.setTo(0.5);
        this.cursors = game.input.keyboard.createCursorKeys();
        this.width /= 2;
        this.height /= 2;
    }

    update() {
        if (this.cursors.up.isDown) {
            this.y -= 10;
        }
        else if (this.cursors.down.isDown) {
            this.y += 10;
        }

        if (this.cursors.left.isDown) {
            this.x -= 10;
        }
        else if (this.cursors.right.isDown) {
            this.x += 10;
        }
    }

}
