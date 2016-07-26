import {MapGenerator} from "./MapGenerator";

export class Game {
    constructor() {
        this._generator = new MapGenerator();
        this.stage = new PIXI.Container();
        this.graphics = new PIXI.Graphics();
    }

    run() {
        this.renderer = PIXI.autoDetectRenderer(1000, 1000, {backgroundColor: 0x1099bb});
        document.body.appendChild(this.renderer.view);

        this._generator.generate();

        this.drawWorldBound();
        this.drawRooms();
        this.drawDoors();
        this.render();
        this.drawNums();
    }

    drawWorldBound() {
        this.graphics.beginFill(0x0000FF);
        this.graphics.drawCircle(this._generator._worldBound.x, this._generator._worldBound.y, this._generator._worldBound.r);
        this.graphics.endFill();
    }

    drawRooms() {
        this._generator.getRooms().map((room) => {
            const rect = room.getBounds();
            let color = 0x000000;
            color = room.isMain() ? 0xFF0000 : color;
            color = room.isStart() || room.isEnd() ? 0xaaaaaa : color;
            color = room.isSecret() ? 0x00FFaa : color;
            this.graphics.beginFill(color);
            this.graphics.drawRect(rect.x, rect.y, rect.width, rect.height);
            this.graphics.endFill();
        });
    }

    drawNums() {
        this._generator._getMainRooms().map((room) => {
            var countingText = new PIXI.Text(room.getOrder(), {font: '15px Arvo', fill: '#ffffff', strokeThickness: 7});
            const center = room.getCenter();
            countingText.position.x = center.x;
            countingText.position.y = center.y;
            this.stage.addChild(countingText);
        });
    }

    drawDoors() {
        this._generator.getRooms().map((room) => {
            room.getDoors().map((door) => {
                var line = door.getLine();
                this.graphics.lineStyle(4, 0x00ffd9, 1);
                this.graphics.moveTo(line.p0.x, line.p0.y);
                this.graphics.lineTo(line.p1.x, line.p1.y);
            })
        })
    }

    render() {
        this.stage.addChild(this.graphics);
        requestAnimationFrame(render.bind(this));
        function render() {
            this.renderer.render(this.stage);
        }
    }
};
