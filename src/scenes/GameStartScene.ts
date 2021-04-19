import Phaser from 'phaser';

export default class Gamestart extends Phaser.Scene {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  startButton: Phaser.GameObjects.Image;
  constructor() {
    super('gamestart');
  }

  preload() {}

  create() {
    //add play again option
    this.add.image(0, 0, 'start-background').setOrigin(0);
    // this.startButton = this.add.image(571, 250, 'start-btn').setDepth(1);
    // this.startButton.setInteractive();
    this.add
      .text(571, 250, 'Press SPACE to start!', {
        fontSize: '20px',
      })
      .setOrigin(0.5);
  }

  update() {
    this.cursors = this.input.keyboard.createCursorKeys();
    if (this.cursors.space?.isDown) {
      this.scene.stop('gamestart');
      this.scene.start('game');
    }
  }
}
