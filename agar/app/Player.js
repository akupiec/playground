export default class Player {
    constructor(spriteName, speed, game) {
        this.speed = speed;
        this.game = game;
        this.__paintObjToGame(spriteName);
        this.__cameraFallow(game);
    }

    destructor() {
        this.game = null;
    }

    __paintObjToGame(spriteName) {
        var g = this.game.add.group();
        g.x = 500;
        this.obj = g.create(100, 300, spriteName);
        this.obj.anchor.setTo(0.5, 0.5);
    }

    __cameraFallow() {
        this.game.camera.follow(this.obj);
    }

    move(direction) {
        switch (direction) {
            case 'up':
                this.obj.y -= this.speed;
                break;
            case 'down':
                this.obj.y += this.speed;
                break;
            case 'left':
                this.obj.x -= this.speed;
                break;
            case 'right':
                this.obj.x += this.speed;
                break;
        }
    }

    update() {
        this.obj.angle += 1;
    }
}
