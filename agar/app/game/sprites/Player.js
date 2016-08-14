import Phaser from 'phaser'

var fireButton;

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
        this.body.setSize(this.width * 2, this.height * 2, -5, -5);

        this.addWeapon(0);
        fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        this.game.input.keyboard.addCallbacks(this, null, null, this.keyPress);
    }

    update() {
        this.body.velocity.set(0);
        this.game.physics.arcade.collide(this, this.collideLayer);

        const speed = 600;
        const speed2 = 0;
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

        this.updateWeapon();
    }

    addWeapon(type) {
        this.activeWeapon = this.game.add.weapon(30, 'bullet');
        this.activeWeapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
        // this.activeWeapon.bulletDistance = 2000;
        this.activeWeapon.bulletSpeed = 1200;
        this.activeWeapon.fireRate = 200;
    }

    updateWeapon() {
        this.game.physics.arcade.collide(this.activeWeapon.bullets, this.collideLayer, this.weaponHitWall, null, this);

        if (fireButton.isDown) {
            this.activeWeapon.fire();
        }

        if (this.cursors.up.isDown || this.cursors.down.isDown || this.cursors.left.isDown || this.cursors.right.isDown) {
            const x = this.body.velocity.x;
            const y = this.body.velocity.y;
            var radAngle = Math.atan2(y, x);
            this.activeWeapon.fireAngle = (radAngle * 57.295779513);
            this.activeWeapon.fireFrom = this.position;
        }
    }

    weaponHitWall(bullet, wall) {
        bullet.kill();
    }

    render() {
        this.game.debug.body(this);
        this.activeWeapon.debug();
    }

}
