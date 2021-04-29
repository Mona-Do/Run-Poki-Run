export default class PokiSprite extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene) {
    super(scene, 300, 300, 'poki');

    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setGravityY(900);

    this.createAnims();
    this.anims.play('run');
  }

  createAnims() {
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('poki', { start: 0, end: 4 }),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: 'gethurt',
      frames: [{ key: 'poki', frame: '5' }],
      duration: 200,
      repeat: 0,
    });
  }
}
