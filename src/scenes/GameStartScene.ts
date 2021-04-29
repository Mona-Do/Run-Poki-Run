export default class Gamestart extends Phaser.Scene {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  startButton: Phaser.GameObjects.Image;
  constructor() {
    super('gamestart');
  }

  preload() {}

  create() {
    //add background
    this.add.image(0, 0, 'start-background').setOrigin(0);

    //add gane start option
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
      this.scene.start('gameopen');
    }
  }
}
