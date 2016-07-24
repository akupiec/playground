import MapGenerator from "./MapGenerator";

module.exports = class Game {
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
        // this.drawGraphConnections();
        // this.drawRoomConnection();
        // this.drawCorridorsRectangles();
        this.render();
    }

    drawRoomConnection() {
        this.graphics.lineStyle(4, 0xffffff, 1);
        this._generator._corridorOutlines.map((corridor) => {
            if (corridor) {
                corridor.map((line) => {
                    this.graphics.moveTo(...line.p0.getRaw());
                    this.graphics.lineTo(...line.p1.getRaw());
                })
            }
        });
    }

    drawGraphConnections() {
        this.graphics.lineStyle(4, 0xffd900, 1);
        this._generator._edges.map((edge) => {
            const a = edge[0].getCenter();
            const b = edge[1].getCenter();
            this.graphics.drawCircle(a.x, a.y, 3);
            this.graphics.drawCircle(b.x, b.y, 3);
            this.graphics.moveTo(a.x, a.y);
            this.graphics.lineTo(b.x, b.y);
        });
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
            color = room.isCorridorRoom() ? 0xaa00aa : color;
            color = room.isCorridor() ? 0xaaaaaa : color;
            this.graphics.beginFill(color);
            this.graphics.drawRect(rect.x, rect.y, rect.width, rect.height);
            this.graphics.endFill();
        });


    }

    drawCorridorsRectangles() {
        this._generator._corridors.map((room) => {
            const rect = room.getBounds();
            let color = 0xFF00FF;
            this.graphics.beginFill(color);
            this.graphics.drawRect(rect.x, rect.y, rect.width, rect.height);
            this.graphics.endFill();
        });
    }

    render() {
        this.stage.addChild(this.graphics);
        requestAnimationFrame(render.bind(this));
        function render() {
            this.renderer.render(this.stage);
        }
    }
}