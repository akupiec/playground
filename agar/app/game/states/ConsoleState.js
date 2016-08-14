import Phaser from 'phaser'
import {centerGameObjects} from '../utils'


export default class Console {
    constructor(game) {
        this.game = game;
        this.openConsole = false;
        this.textBuffer = '';
    }

    preload() {
        this.overlayRect = this.game.add.graphics(0, 0);
        this.overlayRect.fixedToCamera = true;

        this.overlayRect.beginFill(0xaaaaaa, 0.5);
        this.overlayRect.drawRect(0, 0, this.game.camera.width, this.game.camera.height / 2);
        this.overlayRect.endFill();
        this.overlayRect.visible = false;
    }

    create() {
        document.addEventListener("keydown", (e) => {
            if (e.keyCode == 8) { // backspace
                e.preventDefault();
                this.keyPress('', e);
            }
        });
        this.game.input.keyboard.addCallbacks(this, null, null, this.keyPress);
        this.text = this.game.add.text(5, this.game.world.centerY - 50, this.textBuffer, {
            font: '24px Arial',
            fill: '#0000000',
            align: 'center'
        });
        this.text.fixedToCamera = true;
        this.text.cameraOffset.setTo(5, 5);
    }

    keyPress(char, keyEvent) {
        if (char === '`') {
            this.openConsole = !this.openConsole;
            this.overlayRect.visible = this.openConsole;
            this.clearConsole();
            return;
        }
        if (!this.openConsole) {
            return;
        }
        if (keyEvent.keyCode === 13) {
            this.executeCmd(this.text.text);
            this.clearConsole();
            return;
        }
        if (keyEvent.keyCode === 8 && this.text.text.length > 1) {
            this.text.setText(this.text.text.slice(0, this.text.text.length - 1));
            return;
        }
        this.text.setText(this.text.text + char);

    }

    clearConsole() {
        this.text.setText('');
    }

    executeCmd(command) {
        console.log('cmd: ', command);
        console.warn('INTERFACE IMPLEMENT!');
    }

    render() {
    }
}
