import Phaser from 'phaser';

import PreloaderScene from './scenes/PreloaderScene';
import GameScene from './scenes/GameScene';
import GameoverScene from './scenes/GameOverScene';
import GameStartScene from './scenes/GameStartScene';

const config = {
  type: Phaser.AUTO,
  width: 1142,
  height: 500,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  //backgroundColor: '#693B4C',
  scene: [PreloaderScene, GameStartScene, GameScene, GameoverScene],
};

export default new Phaser.Game(config);
