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

  platformChangeTime = 2;
  bgMusic: Phaser.Sound.BaseSound;
  speedChangeTime = 25;

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
    this.addPlatform(width, width / 2, height * 0.8, -350);

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
  addPlatform(
    platformWidth: number,
    posX: number,
    posY: number,
    speed: number
  ) {
    let platform;
    //if there is at least one platform in the pool, make the first one visible
    if (this.platformPool?.getLength()) {
      platform = this.platformPool.getFirst();
      platform.x = posX;
      platform.y = posY;
      platform.active = true;
      platform.visible = true;
      this.platformPool.remove(platform);
    } else {
      console.log('here', posY);
      platform = this.physics.add.sprite(posX, posY, 'platform');
      platform.setImmovable(true);
      platform.setVelocityX(speed);
      this.platformGroup.add(platform);
    }
    platform.displayWidth = platformWidth;
    //platform distance setting
    this.nextPlatformDistance = Phaser.Math.Between(110, 280);
  }

  update() {
    this.player.x = 300;

    // recycling platforms
    let minDistance = 1142;
    let rightmostPlatformHeight = 0;
    this.platformGroup.getChildren().forEach((platform) => {
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

    // adding new platforms
    if (minDistance > this.nextPlatformDistance) {
      // let platformRandomHeight = 10 * Phaser.Math.Between(10, -10);
      // let nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;

      // let nextPlatformHeight = Phaser.Math.Clamp(
      //   nextPlatformGap,
      //   minPlatformHeight,
      //   maxPlatformHeight
      // );

      console.log(this.timeCounter, this.platformChangeTime);
      let nextPlatformWidth = Phaser.Math.Between(100, 300);
      let minPlatformHeight = 500 * 0.65;
      let maxPlatformHeight = 500 * 0.8;
      let posY = 400;
      let posX = 1142 + nextPlatformWidth / 2;
      let speed = -350;

      if (this.timeCounter > 2) {
        posY = Phaser.Math.Between(minPlatformHeight, maxPlatformHeight);
      }

      this.addPlatform(nextPlatformWidth, posX, posY, speed);
      console.log(posY);

      // //change game speed
      // if (this.timeCounter > this.speedChangeTime) {
      //   this.addPlatform(
      //     nextPlatformWidth,
      //     1142 + nextPlatformWidth / 2,
      //     nextPlatformHeight,
      //     -500
      //   );
      // }
    }

    //jump
    this.cursors = this.input.keyboard.createCursorKeys();
    if (this.cursors.space?.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-400);
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
