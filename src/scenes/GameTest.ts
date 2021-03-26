import Phaser from 'phaser';

import createPokiAnims from '../anims/poki.js';

export default class GameTest extends Phaser.Scene {
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
  platformPool: any;
  nextPlatformDistance: number;
  spawnRange: number;

  constructor() {
    super('gametest');
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

    //need to add an object pool
    this.platform = this.physics.add.staticGroup();
    this.platform.create(0, 400, 'platform');
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
    // group with all active platforms.
    //this.platform.body.setGravityY(0);
    this.platformGroup = this.add.group({
      // once a platform is removed, it's added to the pool
      defaultKey: this.platform
      // removeCallback: function (platform) {
      //   platform.scene.platformPool.add(platform);
      // },
    });
    this.platformGroup = this.physics.add.staticGroup();

    // pool
    this.platformPool = this.add.group({
      // once a platform is removed from the pool, it's added to the active platforms group
      removeCallback: function (platform) {
        this.platformGroup.add(platform);
      },
    });

    // adding a platform to the game, the arguments are platform width and x position
    this.addPlatform(this.scale.width, this.scale.width / 2);

    // setting collisions between the player and the platform group
    this.physics.add.collider(this.player, this.platformGroup);
  }

  // the core of the script: platform are added from the pool or created on the fly
  addPlatform(platformWidth, posX) {
    let platform;
    if (this.platformPool.getLength()) {
      platform = this.platformPool.getFirst();
      platform.x = posX;
      platform.active = true;
      platform.visible = true;
      this.platformPool.remove(platform);
    } else {
      platform = this.physics.add.sprite(
        posX,
        this.scale.height * 0.8,
        'platform'
      );
      platform.setImmovable(true);
      platform.setVelocityX(-100);
      this.platformGroup.add(platform);
    }
    platform.displayWidth = platformWidth;
    this.nextPlatformDistance = Phaser.Math.Between(
      (this.spawnRange = 100),
      (this.spawnRange = 350)
    );

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

    //timer
    this.timer = this.time.now * 0.001;
    this.timeText.setText('Time Survived: ' + Math.round(this.timer));
  }
}
