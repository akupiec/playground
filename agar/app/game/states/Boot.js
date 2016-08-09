import Phaser from 'phaser'

const IMAGES_DIR = './dist/assets/images/';

export default class extends Phaser.State {
    init() {
        this.stage.backgroundColor = '#5333B8';
        this.fontsReady = false;
    }

    preload() {
        this.add.text(this.world.centerX, this.world.centerY, 'loading...', {
            font: '24px Arial',
            fill: '#0000000',
            align: 'center'
        });
        this.load.image('splash', IMAGES_DIR + 'splash.jpg');
        this.load.image('loaderBg', IMAGES_DIR + 'loader-bg.png');
        this.load.image('loaderBar', IMAGES_DIR + 'loader-bar.png');
        this.fontsReady = true;
    }

    render() {
        if (this.fontsReady) {
            this.state.start('Splash')
        }
    }

    fontsLoaded() {
        this.fontsReady = true;
    }

}
