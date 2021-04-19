
import createPokiAnims from '../anims/poki.js';

export default class GameScene extends Phaser.Scene {
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
  spike1: Phaser.GameObjects.Image;
  timeText: Phaser.GameObjects.Text;
  setBackgroundColor: any;
  platformHeight: number[];
  platformVerticalLimit: number[];
  clock: any;
  background: any;
  spikepool: Phaser.GameObjects.Group;
  spikegroup: Phaser.GameObjects.Group;
  die: Phaser.Scenes.ScenePlugin;
  spikePercent: number;
  timer: Phaser.Time.TimerEvent;
  timeCounter: number = 0;
  static timeCounter: number;
  deadlineText: string;

  constructor() {
    super('game');
  }

  init(data: any) {
    this.deadlineText = data.deadlineText;
  }

  refresh() {}

  preload() {}

  create() {
    //background
    //make the layer-meme repeat
    let width = this.scale.width;
    let height = this.scale.height;
    this.background = this.add
      .image(40, 0, 'layer-meme')
      .setOrigin(0, 0)
      .setScrollFactor(0, 0);

    //set the background color
    this.color1 = new Phaser.Display.Color(105, 59, 76);
    this.color2 = new Phaser.Display.Color(105, 70, 0);

    //set the life bar

    //player
    this.player = this.physics.add.sprite(300, 300, 'poki');
    this.player.body.setGravityY(900);
    createPokiAnims(this.anims);
    this.player.anims.play('run');

    //set the spike behind
    // this.spike1 = this.add.image(0, 0, 'spike-behind').setOrigin(0, 0);
    // this.spike1.setScrollFactor(0, 0);
    // this.spike1.depth = 1;

    // Add escape text
    this.addEscapeText();

    //set the timer
    this.timeText = this.add.text(900, 20, 'Time Survived:');
    this.timeText.setScrollFactor(0, 0);
    this.timer = this.time.addEvent({
      delay: 1000, // ms
      callback: this.timerUpdate,
      callbackScope: this,
      loop: true,
    });

    // create platform group
    this.platformGroup = this.add.group({
      removeCallback: function (platform) {
        platform.scene.platformPool.add(platform);
      },
    });

    // create platform pool
    this.platformPool = this.add.group({
      removeCallback: function (platform: Phaser.Physics.Arcade.Sprite) {
        platform.scene.platformGroup.add(platform);
      },
    });

    // add the initial platform
    // this.platformVerticalLimit = [0.8, 0.4];
    this.addPlatform(width, width / 2, height * 0.8);
    this.physics.add.collider(this.player, this.platformGroup);
  }

  addEscapeText() {
    for (let index = 0; index < 100; index++) {
      const x = 20;
      const y = 10 + index * 20;

      this.add
        .text(x, y, this.deadlineText, {
          fontSize: '24px',
          fontStyle: 'bold',
          color: '0x000000',
        })
        .setOrigin(0)
        .setDepth(1);
    }
  }

  // Platform are added from the pool or created on the fly
  addPlatform(platformWidth: number, posX: number, posY: number) {
    let platform;
    if (this.platformPool?.getLength()) {
      platform = this.platformPool.getFirst();
      platform.x = posX;
      platform.active = true;
      platform.visible = true;
      this.platformPool.remove(platform);
    } else {
      platform = this.physics.add.sprite(posX, posY, 'platform');
      platform.setImmovable(true);
      platform.setVelocityX(-350);
      this.platformGroup.add(platform);
    }
    platform.displayWidth = platformWidth;
    this.nextPlatformDistance = Phaser.Math.Between(110, 300);

    //create spike group and pool
    this.spikegroup = this.add.group({
      removeCallback: function (spike) {
        spike.scene.spikepool.add(spike);
      },
    });
    this.spikepool = this.add.group({
      removeCallback: function (spike) {
        spike.scene.spikegroup.add(spike);
      },
    });

    // collide with spikes
    this.physics.add.overlap(
      this.player,
      this.spikegroup,
      function () {
        this.gethurt = true;
        this.player.anims.play('gethurt');
        this.player.body.setVelocityY(-100);
        this.player.setGravityY(1000);
        this.player.anims.play('run');
      },
      null,
      this
    );

    //add spike on the platform

    this.spikePercent = 25;

    if (
      this.timeCounter > 20 &&
      Phaser.Math.Between(1, 100) <= this.spikePercent
    ) {
      if (this.spikepool?.getLength()) {
        let spike = this.spikepool.getFirst();
        spike.x =
          posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth);
        spike.y = posY - 15;
        spike.active = true;
        spike.visible = true;
        this.spikepool.remove(spike);
      } else {
        let spike = this.physics.add.sprite(
          posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth),
          posY - 15,
          'spike-single'
        );
        spike.setImmovable(true);
        spike.setVelocityX(platform.body.velocity.x);
        // spike.setSize(8, 2, true)
        spike.setDepth(2);
        this.spikegroup.add(spike);
      }
    }
  }

  update() {
    this.player.x = 300;

    //make the background color change
    let hexColor = Phaser.Display.Color.Interpolate.ColorWithColor(
      this.color1,
      this.color2,
      100,
      1
    );
    this.cameras.main.setBackgroundColor(hexColor);

    // recycling platforms
    let minDistance = 1142;
    let rightmostPlatformHeight = 0;
    this.platformGroup.getChildren().forEach(function (platform) {
      let platformDistance = 1142 - platform.x - platform.displayWidth / 2;
      if (platformDistance < minDistance) {
        minDistance = platformDistance;
        rightmostPlatformHeight = platform.y;
      }

      if (platform.x < -platform.displayWidth / 2) {
        this.platformGroup.killAndHide(platform);
        this.platformGroup.remove(platform);
      }
    }, this);

    //recycle spikes
    this.spikegroup.getChildren().forEach(function (spike) {
      if (spike.x < -spike.displayWidth / 2) {
        this.spikegroup.killAndHide(spike);
        this.spikegroup.remove(spike);
      }
    }, this);

    // adding new platforms
    if (minDistance > this.nextPlatformDistance) {
      this.platformSizeRange = [100, 250];
      let nextPlatformWidth = Phaser.Math.Between(
        this.platformSizeRange[0],
        this.platformSizeRange[1]
      );

      let platformRandomHeight = 10 * Phaser.Math.Between(10, -10);
      // console.log(rightmostPlatformHeight);
      let nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
      let minPlatformHeight = 500 * 0.6;
      let maxPlatformHeight = 500 * 0.8;
      let nextPlatformHeight = Phaser.Math.Clamp(
        nextPlatformGap,
        minPlatformHeight,
        maxPlatformHeight
      );
      console.log(nextPlatformHeight);
      this.addPlatform(nextPlatformWidth, 1142 + nextPlatformWidth / 2, 400);
    }

    //poki move
    this.cursors = this.input.keyboard.createCursorKeys();
    if (this.cursors.space?.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-400);
      //this.player.anims.play('jump', true);
    }

    //poki die
    if (this.player.y > 450) {
      //this.player.anims.play('die', true);
      this.scene.start('gameover', {
        timeCounter: this.timeCounter,
        deadlineText: this.deadlineText,
      });
      this.timeCounter = 0;
    }
  }

  timerUpdate() {
    this.timeCounter += 1;
    this.timeText.setText(`Time Survived: ${this.timeCounter}`);
  }
}
