import Phaser from 'phaser';

import createPokiAnims from '../anims/poki.js';

export default class Game extends Phaser.Scene {
  color1: Phaser.Display.Color;
  color2: Phaser.Display.Color;
  w: number;
  h: number;
  spike1: Phaser.Physics.Arcade.StaticGroup;
  startY: any;
  platformGroup: Phaser.GameObjects.Group;
  constructor() {
    super('game');
  }

  player;
  platform;
  cursors;
  background;
  hexColor;

  preload() {}

  create() {
    //background
    //make the layer-meme repeat
    let width = this.scale.width;
    let height = this.scale.height;
    this.background = this.add
      .tileSprite(40, 0, width, height, 'layer-meme')
      .setOrigin(0, 0)
      .setScrollFactor(0, 0);

    //set the background color
    this.color1 = new Phaser.Display.Color(105, 59, 76);
    this.color2 = new Phaser.Display.Color(105, 70, 0);

    //platform
    this.platform = this.physics.add.staticGroup();

    //need to add an object pool
    this.platform.create(0, 400, 'platform');
    this.platform.create(400, 400, 'platform');
    this.platform.create(900, 400, 'platform');
    this.platform.create(1300, 400, 'platform');
    this.platform.create(1800, 400, 'platform');
    this.platform.create(2400, 400, 'platform');

    //set the spike behind
    //this.spike1 = this.physics.add.staticGroup();
    //this.spike1.create(0, 0, 'spike-behind');

    //player
    this.player = this.physics.add.sprite(100, 300, 'poki');
    this.player.body.setGravityY(300);
    this.player.body.setVelocityX(250);
    this.physics.add.collider(this.player, this.platform);
    createPokiAnims(this.anims);
    this.player.anims.play('run');

    //set camera
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, 500);
    this.w = this.cameras.main.width;
    this.h = this.cameras.main.height;

    this.platformGroup = this.add.group();

  }

  addPlatform(){

  }

  update() {
    //make the background scroll
    this.background.setTilePosition(this.cameras.main.scrollX);

    //make the background color change
    let hexColor = Phaser.Display.Color.Interpolate.ColorWithColor(
      this.color1,
      this.color2,
      -this.h * 2,
      this.player.x
    );
    this.cameras.main.setBackgroundColor(hexColor);

    //poki move
    this.cursors = this.input.keyboard.createCursorKeys();

    if (this.cursors.space?.isDown && this.player.body.touching .down) {
      this.player.setVelocityY(-200);
      //this.player.anims.play('jump', true);
    }

    if (this.player.y > 450) {
      //this.player.anims.play('die', true);
      this.scene.start('gameover');
    }
  }
}
