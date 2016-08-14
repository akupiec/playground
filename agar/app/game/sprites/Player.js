import Phaser from 'phaser'


export default class extends Phaser.Sprite {

    constructor({game, x, y, asset, collideLayer}) {
        super(game, x, y, asset);

        this.game = game;
        this.anchor.setTo(0.5);
        this.cursors = game.input.keyboard.createCursorKeys();
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.scale.x = 0.5;
        this.scale.y = 0.5;

        this.collideLayer = collideLayer;
        this.body.setSize(this.width * 2, this.height * 2, -5, -5)
    }

    update() {
        this.body.velocity.set(0);
        this.game.physics.arcade.collide(this, this.collideLayer);

        const speed = 100;
        const speed2 = 10;
        if (this.cursors.up.isDown) {
            this.body.velocity.y -= speed;
            this.y -= speed2;
        }
        else if (this.cursors.down.isDown) {
            this.body.velocity.y += speed;
            this.y += speed2;
        }

        if (this.cursors.left.isDown) {
            this.body.velocity.x -= speed;
            this.x -= speed2;
        }
        else if (this.cursors.right.isDown) {
            this.body.velocity.x += speed;
            this.x += speed2;
        }
    }

    render() {
        this.game.debug.body(this);
    }

}
