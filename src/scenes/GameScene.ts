import PokiSprite from '../objects/PokiSprite';

export default class GameScene extends Phaser.Scene {
  platformGroup: Phaser.GameObjects.Group;
  platformPool: Phaser.GameObjects.Group;
  nextPlatformDistance: number;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  timeText: Phaser.GameObjects.Text;
  platformHeight: number[];
  background: Phaser.GameObjects.TileSprite;
  die: Phaser.Scenes.ScenePlugin;
  timer: Phaser.Time.TimerEvent;
  timeCounter: number = 0;
  deadlineText: string;
  player: PokiSprite;

  bgMusic: Phaser.Sound.BaseSound;
  jumpMusic: Phaser.Sound.BaseSound;
  overMusic: Phaser.Sound.BaseSound;
  speedControl: Phaser.Time.TimerEvent;
  speedChange: number = -350;

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
      .tileSprite(40, 0, 1142, 500, 'layer-meme')
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
    let platform: Phaser.Physics.Arcade.Sprite;
    //if there is at least one platform in the pool, make the first one visible
    if (this.platformPool?.getLength()) {
      platform = this.platformPool.getFirst();
      platform.setPosition(posX, posY);
      platform.setVelocityX(speed);
      platform.active = true;
      platform.visible = true;
      this.platformPool.remove(platform);
    } else {
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
    this.background.tilePositionX += 3.5;

    // recycling platforms
    let minDistance = 1142;
    this.platformGroup.getChildren().forEach((platform) => {
      let platformDistance =
        1142 -
        platform.body.gameObject.x -
        platform.body.gameObject.displayWidth / 2;
      if (platformDistance < minDistance) {
        minDistance = platformDistance;
      }

      if (
        platform.body.gameObject.x <
        -platform.body.gameObject.displayWidth / 2
      ) {
        this.platformGroup.killAndHide(platform);
        this.platformGroup.remove(platform);
      }
    }, this);

    // adding new platforms
    if (minDistance > this.nextPlatformDistance) {
      let nextPlatformWidth = Phaser.Math.Between(100, 300);
      const minPlatformHeight = 500 * 0.65;
      const maxPlatformHeight = 500 * 0.8;
      let posY = 400;
      let posX = 1142 + nextPlatformWidth / 2;
      let speed = -350;

      if (this.timeCounter > 10 && this.timeCounter <= 20) {
        posY = Phaser.Math.Between(minPlatformHeight, maxPlatformHeight);
        speed = -350;
      }
      if (this.timeCounter > 20) {
        posY = Phaser.Math.Between(minPlatformHeight, maxPlatformHeight);
        this.speedControl = this.time.addEvent({
          delay: 5000, // ms
          callback: this.speedUpdate,
          callbackScope: this,
          loop: true,
        });
        speed = this.speedChange;
      }
      console.log(speed);

      this.addPlatform(nextPlatformWidth, posX, posY, speed);
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

  speedUpdate() {
    this.speedChange += -5;
  }
}
