// import 'pixi'
// import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import GameState2 from './states/Game2'
import MapGeneratorState from './states/MapGenerator'

class Game extends Phaser.Game {

    constructor() {
        let width = document.documentElement.clientWidth > 768 ? 768 : document.documentElement.clientWidth;
        let height = document.documentElement.clientHeight > 1024 ? 1024 : document.documentElement.clientHeight;

        super(width, height, Phaser.AUTO, 'content', null);

        this.state.add('Boot', BootState, false);
        this.state.add('Splash', SplashState, false);
        this.state.add('Game', GameState2, false);
        this.state.add('Generator', MapGeneratorState, false);

        this.state.start('Boot', true, false, ['Generator']);
    }
}

window.game = new Game();
