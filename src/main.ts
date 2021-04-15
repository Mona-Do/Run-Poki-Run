import Phaser from 'phaser';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin';

import PreloaderScene from './scenes/PreloaderScene';
import GameScene from './scenes/GameScene';
import GameoverScene from './scenes/GameOverScene';
import GameStartScene from './scenes/GameStartScene';
import GameOpenScene from './scenes/GameOpenScene';
import GameTest from './scenes/GameTest';

const config = {
  type: Phaser.AUTO,
  width: 1142,
  height: 500,
  physics: {
    default: 'arcade',
    arcade: {
      // gravity: { y: 300 },
      debug: true,
    },
  },
  dom: {
    createContainer: true,
  },
  plugins: {
    scene: [
      {
        key: 'rexUI',
        plugin: RexUIPlugin,
        mapping: 'rexUI',
      },
    ],
  },
  //backgroundColor: '#693B4C',
  scene: [
    PreloaderScene,
    GameStartScene,
    GameOpenScene,
    GameScene,
    GameTest,
    GameoverScene,
  ],
};

export default new Phaser.Game(config);
