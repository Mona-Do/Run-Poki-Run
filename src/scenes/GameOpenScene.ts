
// import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin';

export default class GameOpen extends Phaser.Scene {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  startButton: Phaser.GameObjects.Image;
  rexUI: any;
  deadlineText: Phaser.GameObjects.Text;

  constructor() {
    super('gameopen');
  }

  preload() {}

  create() {
    this.add.image(0, 0, 'deadline-select').setOrigin(0);

    this.deadlineText = this.add.text(571, 220, 'double-click to type', {
      fixedHeight: 36,
    });
    this.deadlineText.setOrigin(0.5);

    this.deadlineText.setInteractive().on('pointerdown', () => {
      this.rexUI.edit(this.deadlineText);
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
      this.scene.start('game', { deadlineText: this.deadlineText.text });
    }
  }
}
