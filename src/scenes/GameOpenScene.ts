import Phaser from 'phaser';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin';

export default class GameOpen extends Phaser.Scene {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  startButton: Phaser.GameObjects.Image;
  rexUI: any;
  constructor() {
    super('gameopen');
  }

  preload() {}

  create() {
    this.add.image(0, 0, 'deadline-select').setOrigin(0);

    const text = this.add.text(571, 220, 'click to type in', {
      fixedHeight: 36,
    });
    text.setOrigin(0.5);

    text.setInteractive().on('pointerdown', () => {
      this.rexUI.edit(text);
    });

    this.add
      .text(571, 350, 'Press SPACE to RUN!', {
        fontSize: '20px',
      })
      .setOrigin(0.5);
  }

  update() {
    this.cursors = this.input.keyboard.createCursorKeys();
    if (this.cursors.space?.isDown) {
      this.scene.stop('gameopen');
      this.scene.start('game');
    }
  }
}
