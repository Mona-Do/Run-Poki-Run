import Phaser from 'phaser';

export default class Gameover extends Phaser.Scene {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  timer: number;
  timeText: any;
  constructor() {
    super('gameover');
  }

  preload() {}

  create() {
    //add background
    this.add.image(0, 0, 'background').setOrigin(0);

    //add score board
    // this.add.rectangle(571, 250, 800, 300, 0xffffff, 1).setOrigin(0.5);
    this.add
      .text(571, 200, 'Time Survived: ' + this.timer.toString(), {
        fontSize: '32px',
      })
      .setOrigin(0.5);

    //add play again option
    this.add
      .text(571, 300, 'Press SPACE to play again!', {
        fontSize: '32px',
      })
      .setOrigin(0.5);
    this.timer = Math.round(this.time.now * 0.001);
  }

  update() {
    this.cursors = this.input.keyboard.createCursorKeys();
    if (this.cursors.space?.isDown) {
      this.scene.stop('gameover');
      this.scene.start('game');
    }
  }
}
