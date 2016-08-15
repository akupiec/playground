import Phaser from 'phaser'

var fireButton;

const DISTANCE = 100;
const AGRO_TIME = 500;
export default class extends Phaser.Sprite {
    constructor({game, x, y, asset, collideLayer}) {
        super(game, x, y, asset);

        this.game = game;
        this.anchor.setTo(0.5);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.collideLayer = collideLayer;
        this.body.setSize(this.width, this.height, -5, -5);

        this.addWeapon(0);
        fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
        this.playerPosition = null;
        this.lastSeen = {
            time: 0,
            position: this.playerPosition,
        };
        this.initVelocityHistory();
        this.line = new Phaser.Line();
    }

    update() {
        this.game.physics.arcade.collide(this, this.collideLayer);

        const speed = 300;
        if (this.seePlayer() && this.playerInRange()) {
            this.updateWeapon();
            this.body.velocity.set(0);
            return;
        }

        if (this.seePlayer() && !this.playerInRange()) {
            this.moveToTarget(speed, this.playerPosition);
            this.lastSeen = {
                time: AGRO_TIME,
                position: Object.assign({}, this.playerPosition),
            };
            return;
        }
        if (this.lastSeen.time > 0) {
            this.lastSeen.time--;
            this.moveToTarget(speed, this.lastSeen.position);
            return;
        }
        this.body.velocity.set(0);
    }

    initVelocityHistory() {
        this.velocityHistory = new Array(20);
        this.velocityHistory.fill([0, 0]);
    }

    smoothVelocityChange(x, y) {
        this.velocityHistory.shift();
        this.velocityHistory.push([x, y]);
        let newX = 0;
        let newY = 0;
        this.velocityHistory.map((obj)=> {
            newX += obj[0];
            newY += obj[1];
        });
        this.body.velocity.set(newX / this.velocityHistory.length, newY / this.velocityHistory.length);
    }

    moveToTarget(speed, position) {
        const dY = position.y - this.position.y;
        let y = dY;
        if (Math.abs(dY) > speed) {
            y = Math.sign(y) * speed;
        }
        const dX = position.x - this.position.x;
        let x = dX;
        if (Math.abs(dX) > speed) {
            x = Math.sign(x) * speed;
        }
        if (Math.abs(x) < Math.abs(y)) {
            y = Math.sign(y) * speed;
        } else {
            x = Math.sign(x) * speed;
        }
        this.smoothVelocityChange(x, y);
        console.log(x, y);
    }

    addWeapon(type) {
        this.activeWeapon = this.game.add.weapon(10, 'bullet');
        this.activeWeapon.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
        this.activeWeapon.bulletKillDistance = DISTANCE;
        this.activeWeapon.bulletSpeed = 400;
        this.activeWeapon.fireRate = 400;
    }

    updateWeapon() {
        this.game.physics.arcade.collide(this.activeWeapon.bullets, this.collideLayer, this.weaponHitWall, null, this);

        let radAngle = Math.atan2(this.line.start.y - this.line.end.y, this.line.start.x - this.line.end.x);
        this.activeWeapon.fireAngle = (radAngle * 57.295779513) + 180;
        this.activeWeapon.fireFrom = this.position;
        this.activeWeapon.fire();
    }

    seePlayer() {
        if (!this.playerPosition) {
            return false;
        }

        this.line.start.set(this.position.x, this.position.y);
        this.line.end.set(this.playerPosition.x, this.playerPosition.y);
        const tileHits = this.collideLayer.getRayCastTiles(this.line, 4, true, false);

        return tileHits.length === 0;
    }

    playerInRange() {
        return DISTANCE >= Math.sqrt(Math.pow(this.line.end.x - this.line.start.x, 2) + Math.pow(this.line.end.y - this.line.start.y, 2));
    }

    setPlayerPosition(positon) {
        this.playerPosition = positon;
    }

    weaponHitWall(bullet, wall) {
        bullet.kill();
    }

    render() {
        this.game.debug.body(this);
        this.activeWeapon.debug();
        this.game.debug.geom(this.line);
    }

}

