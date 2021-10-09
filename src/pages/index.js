import React, { useEffect, useRef } from 'react';
import { Application, Loader } from 'pixi.js';

import TiledMap from '@/core/TiledMap';
import Player from '@/core/Player';

export default function() {
  const ref = useRef();
  useEffect(() => {
    const app = new Application({
      width: 512,         // default: 800
      height: 256,        // default: 600
      antialias: true,    // default: false
      backgroundAlpha: 0, // default: false
      // resolution: 1,      // default: 1
      // forceCanvas: true,  // defualt false
    });
    ref.current.appendChild(app.view);

    Loader.shared
      .add([
        // 'assets/overworld.png',
        'maps/testmap1.tmx',
        'images/treasureHunter.json',
      ])
      .use(TiledMap.middleware)
      .load((loader, resources) => {
        const textures = Loader.shared.resources["images/treasureHunter.json"].textures;

        // 创建地图
        const map1 = new TiledMap('maps/testmap1.tmx');
        app.stage.addChild(map1);

        // 创建玩家
        const player = new Player(textures["explorer.png"]);
        app.stage.addChild(player);

        const play = (delta) => {
          // 玩家移动
          const x = player.x + player.vx;
          const y = player.y + player.vy;
          if (x < 0 || x + player.width > 256 || y < 0 || y + player.height > 256) {
            return;
          }
          if (!map1.layers.CollisionLayer.isWalkable(x, y)) {
            return;
          }
          player.update();
        }

        app.ticker.add(delta => play(delta));
      });

      return () => {
        player.destroy();
      }
  }, []);

  return (
    <div ref={ref}>

    </div>
  );
}
