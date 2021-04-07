export default function createPokiAnims(anims) {
  anims.create({
    key: 'run',
    frames: anims.generateFrameNumbers('poki', { start: 0, end: 4 }),
    frameRate: 15,
    repeat: -1,
  });

  anims.create({
    key: 'gethurt',
    frames: anims.generateFrameNumbers('poki', { start: 4, end: 5 }),
    duration: 1000,
    repeat: 0,
  });
}
