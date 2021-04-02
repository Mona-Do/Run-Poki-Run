import Phaser from 'phaser';
import createPokiAnims from '../anims/poki.js';

export default class GameTest extends Phaser.Scene {
  background: Phaser.GameObjects.TileSprite;
  color1: Phaser.Display.Color;
  color2: Phaser.Display.Color;
  player: any;
  platformGroup: Phaser.GameObjects.Group;
  platformPool: Phaser.GameObjects.Group;
  nextPlatformDistance: number;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  spawnRange: any;
  plarformSizeRange: number[];
  platformSizeRange: number[];

  constructor() {
    super('gametest');
  }

  preload() {}

  create() {
    // this.game = new Phaser.Game(config);

    //background
    //make the layer-meme repeat
    let width = this.scale.width;
    let height = this.scale.height;
    this.background = this.add
      .tileSprite(40, 0, width, height, 'layer-meme')
      .setOrigin(0, 0)
      .setScrollFactor(0, 0);
    // this.background.setVelocityX(-350);

    //set the background color
    this.color1 = new Phaser.Display.Color(105, 59, 76);
    this.color2 = new Phaser.Display.Color(105, 70, 0);

    //player
    this.player = this.physics.add.sprite(150, 300, 'poki');
    this.player.body.setGravityY(900);
    createPokiAnims(this.anims);
    this.player.anims.play('run');


    // create group
    this.platformGroup = this.add.group({
      removeCallback: function (platform) {
        platform.scene.platformPool.add(platform);
      },
    });

    // create pool
    this.platformPool = this.add.group({
      removeCallback: function (platform) {
        platform.scene.platformGroup.add(platform);
      },
    });

    // add platform
    this.addPlatform(width, width/2);
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
        400,
        'platform'
      );
      platform.setImmovable(true);
      platform.setVelocityX(-350);
      this.platformGroup.add(platform);
    }
    platform.displayWidth = platformWidth;
    this.spawnRange = [110, 300];
    this.nextPlatformDistance = Phaser.Math.Between(
        this.spawnRange[0],
        this.spawnRange[1]
      );
  }


  update() {

    this.player.x = 200;

    // recycling platforms
    let minDistance = 1142;
    this.platformGroup.getChildren().forEach(function (platform) {
      let platformDistance = 1142 - platform.x - platform.displayWidth / 2;
      minDistance = Math.min(minDistance, platformDistance);
      if (platform.x < -platform.displayWidth / 2) {
        this.platformGroup.killAndHide(platform);
        this.platformGroup.remove(platform);
      }
    }, this);

    // adding new platforms
    if (minDistance > this.nextPlatformDistance) {
      this.platformSizeRange = [100, 250];
      var nextPlatformWidth = Phaser.Math.Between(
        this.platformSizeRange[0],
        this.platformSizeRange[1]
      );
      this.addPlatform(nextPlatformWidth, 1142 + nextPlatformWidth / 2);
    }

    //poki move
    this.cursors = this.input.keyboard.createCursorKeys();
    if (this.cursors.space?.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-400);
      //this.player.anims.play('jump', true);
    }

    if (this.player.y > 450) {
      //this.player.anims.play('die', true);
      this.scene.start('gameover');
    }
  }
}
