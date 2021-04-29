// import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin';

export default class GameOpen extends Phaser.Scene {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  startButton: Phaser.GameObjects.Image;
  rexUI: any;
  deadlineText: Phaser.GameObjects.Text;
  startMusic: Phaser.Sound.BaseSound;
  hintText: Phaser.GameObjects.Text;

  constructor() {
    super('gameopen');
  }

  preload() {}

  create() {
    //add background
    this.add.image(0, 0, 'deadline-select').setOrigin(0);

    //add deadline selection
    this.hintText = this.add.text(
      571,
      270,
      'Please enter a word within 12 characters.',
      {
        fixedHeight: 26,
      }
    );
    this.hintText.setOrigin(0.5);

    this.deadlineText = this.add.text(571, 220, 'double-click', {
      fixedHeight: 28,
    });
    this.deadlineText.setOrigin(0.5);

    this.deadlineText.setInteractive().on('pointerdown', () => {
      this.rexUI.edit(this.deadlineText);
    });

    //add game start option
    this.add
      .text(571, 350, 'Press SPACE to RUN!', {
        fontSize: '20px',
        color: '0x000000',
      })
      .setOrigin(0.5);

    //add bg music
    this.startMusic = this.sound.add('start', { loop: true });
    this.startMusic.play();
  }

  update() {
    this.cursors = this.input.keyboard.createCursorKeys();
    if (this.cursors.space?.isDown) {
      this.startMusic.stop();
      this.scene.stop('gameopen');
      this.scene.start('game', { deadlineText: this.deadlineText.text });
    }
  }
}
