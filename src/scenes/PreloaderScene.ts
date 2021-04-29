export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    this.load.image('start-background', 'assets/img/start-page.png');
    this.load.image('deadline-select', 'assets/img/deadline-select.png');
    this.load.image('background', 'assets/img/background.png');
    this.load.image('platform', 'assets/img/ground.png');
    this.load.image('layer-meme', 'assets/img/layer-meme.png');

    this.load.spritesheet('poki', 'assets/img/poki.png', {
      frameWidth: 86,
      frameHeight: 64,
    });

    this.load.audio('background', ['assets/audio/background.mp3']);
    this.load.audio('start', ['assets/audio/start.mp3']);
    this.load.audio('gameover', ['assets/audio/gameover.mp3']);
  }

  create() {
    this.scene.start('gamestart');
  }
}
