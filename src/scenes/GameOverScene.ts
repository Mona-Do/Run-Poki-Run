export default class Gameover extends Phaser.Scene {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  timer: number;
  timeText: any;
  timeCounter: number;
  deadlineText: any;
  overMusic: any;
  constructor() {
    super('gameover');
  }

  init(data: { timeCounter: number; deadlineText: any }) {
    this.timeCounter = data.timeCounter;
    this.deadlineText = data.deadlineText;
  }

  preload() {}

  create() {
    //background music
    this.overMusic = this.sound.add('gameover', { loop: false });
    this.overMusic.play();

    //add background
    this.add.image(0, 0, 'background').setOrigin(0);

    this.timeText = this.add
      .text(571, 200, 'Time Survived:', {
        fontSize: '32px',
      })
      .setOrigin(0.5);
    this.timeText.setText(
      `You've escaped from ${this.deadlineText} for ${this.timeCounter} seconds.`
    );

    //add play again option
    this.add
      .text(571, 300, 'Press SPACE to play again!', {
        fontSize: '28px',
        color: '0x000000',
      })
      .setOrigin(0.5);
  }

  update() {
    this.cursors = this.input.keyboard.createCursorKeys();
    if (this.cursors.space?.isDown) {
      this.scene.stop('gameover');
      this.overMusic.stop();
      this.scene.start('game');
    }
  }
}
