import PokiSprite from '../objects/PokiSprite';

export default class GameScene extends Phaser.Scene {
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
  spikePool: Phaser.GameObjects.Group;
  spikeGroup: Phaser.GameObjects.Group;
  die: Phaser.Scenes.ScenePlugin;
  timer: Phaser.Time.TimerEvent;
  timeCounter: number = 0;
  static timeCounter: number;
  deadlineText: string;
  player: PokiSprite;

  spikePercent = 75;
  spikeShowTime = 5;
  platformChangeTime = 10;
  bgMusic: Phaser.Sound.BaseSound;

  constructor() {
    super('game');
  }

  init(data: any) {
    this.deadlineText = data.deadlineText;
  }

  refresh() {}

  preload() {}

  create() {
    //set the background color and layer
    this.cameras.main.setBackgroundColor(0x693b4c);
    const width = this.scale.width;
    const height = this.scale.height;
    this.background = this.add
      .image(40, 0, 'layer-meme')
      .setOrigin(0, 0)
      .setScrollFactor(0, 0);

    //add player
    this.player = new PokiSprite(this);

    //set the timer
    this.timeText = this.add.text(900, 20, 'Time Survived:');
    this.timeText.setScrollFactor(0, 0);
    this.timer = this.time.addEvent({
      delay: 1000, // ms
      callback: this.timerUpdate,
      callbackScope: this,
      loop: true,
    });

    //add background music
    this.bgMusic = this.sound.add('background', { loop: true });
    this.bgMusic.play();

    // create platform group - the visible parts on the screen
    this.platformGroup = this.add.group({
      removeCallback: (platform) => {
        this.platformPool.add(platform);
      },
    });
    this.physics.add.collider(this.player, this.platformGroup);

    // create platform pool - the invisible parts out of screen
    this.platformPool = this.add.group({
      removeCallback: (platform) => {
        this.platformGroup.add(platform);
      },
    });

    // add the initial platform
    this.platformVerticalLimit = [0.8, 0.4];
    this.addPlatform(width, width / 2, height * 0.8);

    //add deadline text
    this.addEscapeText();
  }

  //repeat the deadline text on the left side
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

  // Platform are added from the pool
  addPlatform(platformWidth: number, posX: number, posY: number) {
    let platform;
    //if there is at least one platform in the pool, make the first one visible
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
    //platform distance setting
    this.nextPlatformDistance = Phaser.Math.Between(110, 280);


    //create spike group and pool
    this.spikeGroup = this.add.group({
      removeCallback: (spike) => {
        this.spikePool.add(spike);
      },
    });

    this.spikePool = this.add.group({
      removeCallback: (spike) => {
        this.spikeGroup.add(spike);
      },
    });

    // // collide with spikes
    // this.physics.add.overlap(
    //   this.player,
    //   this.spikeGroup,
    //   this.player.getHurt,
    //   undefined,
    //   this
    // );

    // if (this.player.anims.play('gethurt')) {
    //   this.player.anims.play('run');
    // }

    //add spike on the platform
    if (
      this.timeCounter > this.spikeShowTime &&
      Phaser.Math.Between(1, 100) <= this.spikePercent
    ) {
      if (this.spikePool?.getLength()) {
        let spike = this.spikePool.getFirst();
        spike.x = posX - platformWidth / 2;
        // posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth);
        spike.y = posY - 15;
        spike.active = true;
        spike.visible = true;
        this.spikePool.remove(spike);
      } else {
        let spike = this.physics.add.sprite(
          posX - platformWidth / 2,
          // posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth),
          posY - 15,
          'spike-single'
        );
        spike.setImmovable(true);
        spike.setVelocityX(platform.body.velocity.x);
        // // spike.setSize(8, 2, true)
        spike.setDepth(2);
        this.spikeGroup.add(spike);
      }
    }
  }

  update() {
    this.player.x = 300;

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
    this.spikeGroup.getChildren().forEach(function (spike) {
      if (spike.x < -spike.displayWidth / 2) {
        this.spikegroup.killAndHide(spike);
        this.spikegroup.remove(spike);
      }
    }, this);

    // adding new platforms
    if (minDistance > this.nextPlatformDistance) {
      this.platformSizeRange = [100, 300];
      let nextPlatformWidth = Phaser.Math.Between(
        this.platformSizeRange[0],
        this.platformSizeRange[1]
      );

      let platformRandomHeight = 10 * Phaser.Math.Between(10, -10);
      let nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
      let minPlatformHeight = 500 * 0.6;
      let maxPlatformHeight = 500 * 0.8;
      let nextPlatformHeight = Phaser.Math.Clamp(
        nextPlatformGap,
        minPlatformHeight,
        maxPlatformHeight
      );
      this.addPlatform(
        nextPlatformWidth,
        1142 + nextPlatformWidth / 2,
        nextPlatformHeight
      );
      // if (this.timeCounter <= this.platformChangeTime) {
      //   this.addPlatform(
      //   nextPlatformWidth,
      //   1142 + nextPlatformWidth / 2,
      //   400)
      // } else {
      // this.addPlatform(
      //   nextPlatformWidth,
      //   1142 + nextPlatformWidth / 2,
      //   nextPlatformHeight
      // );
      console.log(nextPlatformHeight);
      // }
    }

    //jump
    this.cursors = this.input.keyboard.createCursorKeys();
    if (this.cursors.space?.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-400);
      //this.player.anims.play('jump', true);
    }

    //game over
    if (this.player.y > 450) {
      //this.player.anims.play('die', true);
      this.bgMusic.stop();
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
function _spike(player: PokiSprite, _spike: any): ArcadePhysicsCallback | undefined {
  throw new Error('Function not implemented.');
}

