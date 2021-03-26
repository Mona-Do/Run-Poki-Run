import Phaser from 'phaser';

import createPokiAnims from '../anims/poki.js';

export default class Game extends Phaser.Scene {
  color1: Phaser.Display.Color;
  color2: Phaser.Display.Color;
  w: number;
  h: number;
  scrollX: number;
  rightEdge: number;
  platformGroup: Phaser.GameObjects.Group;
  platformPosition: number;
  timer: number;
  timeText: Phaser.GameObjects.Text;
  spike1: any;

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
    // this.platform.create(0, 400, 'platform');
    // this.platform.create(400, 400, 'platform');
    // this.platform.create(900, 400, 'platform');
    // this.platform.create(1300, 400, 'platform');
    // this.platform.create(1800, 400, 'platform');
    // this.platform.create(2400, 400, 'platform');

    //set the spike behind
    this.spike1 = this.add.image(0, 0, 'spike-behind').setOrigin(0, 0);
    this.spike1.setScrollFactor(0, 0);

    //player
    this.player = this.physics.add.sprite(150, 300, 'poki');
    // this.player.body.setGravityY(0);
    this.player.body.setVelocityX(250);
    this.physics.add.collider(this.player, this.platform);
    createPokiAnims(this.anims);
    this.player.anims.play('run');

    //set camera
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, 500);
    this.w = this.cameras.main.width;
    this.h = this.cameras.main.height;

    //platform group
    this.platformGroup = this.physics.add.staticGroup({
      defaultKey: 'platform',
    });

    this.time.addEvent({
      delay: 300,
      loop: true,
      callback: () => {
        // this.platformPosition = ;

        const x = [400, 1300, 2400][Phaser.Math.Between(0, 2)];
        const y = 400;
        const z = Phaser.Math.Between(0.3, 1);
        this.platformGroup
          .get(x, y)
          .setActive(true)
          .setVisible(true)
          .setScale(z, 1);
      },
    });
    this.physics.add.collider(this.player, this.platformGroup);

    //set the timer
    //make it stick on the top right
    this.timeText = this.add.text(900, 20, 'Time Survived:');
    this.timeText.setScrollFactor(0, 0);
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

    if (this.cursors.space?.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-200);
      //this.player.anims.play('jump', true);
    }

    if (this.player.y > 450) {
      //this.player.anims.play('die', true);
      this.scene.start('gameover');
    }

    //object
    this.platformGroup.incX(-8);
    this.platformGroup.getChildren().forEach((platform) => {
      if (platform.active && this.platform.x < 0) {
        this.platformGroup.killAndHide(platform);
      }
    });

    //timer
    this.timer = this.time.now * 0.001;
    this.timeText.setText('Time Survived: ' + Math.round(this.timer));
  }
}
