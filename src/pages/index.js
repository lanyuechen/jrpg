import React, { useEffect, useRef } from 'react';
import { Application, Loader } from 'pixi.js';

import TiledMap from '@/core/TiledMap';
import Player from '@/core/Player';
import JoyStick from '@/components/JoyStick';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

console.log('===', WIDTH, HEIGHT)

export default function() {
  const ref = useRef();
  const store = useRef({});
  useEffect(() => {
    const app = new Application({
      width: WIDTH,         // default: 800
      height: HEIGHT,       // default: 600
      antialias: true,    // default: false
      backgroundAlpha: 0, // default: false
      // resolution: 1,      // default: 1
      // forceCanvas: true,  // defualt false
    });
    ref.current.appendChild(app.view);

    Loader.shared
      .add([
        // 'assets/overworld.png',
        'maps/test.tmx',
        'images/treasureHunter.json',
      ])
      .use(TiledMap.middleware)
      .load((loader, resources) => {
        const textures = Loader.shared.resources["images/treasureHunter.json"].textures;

        // 创建地图
        const map1 = new TiledMap('maps/test.tmx');
        app.stage.addChild(map1);

        // 创建玩家
        const player = new Player(textures["explorer.png"]);
        store.current.player = player;
        app.stage.addChild(player);

        const play = (delta) => {
          // 玩家移动
          const x = player.x + player.vx;
          const y = player.y + player.vy;
          if (x < 0 || x + player.width > WIDTH || y < 0 || y + player.height > HEIGHT) {
            return;
          }
          if (map1.layers.CollisionLayer) {
            if (
              !map1.layers.CollisionLayer.isWalkable(x, y) ||
              !map1.layers.CollisionLayer.isWalkable(x + player.width, y) ||
              !map1.layers.CollisionLayer.isWalkable(x, y + player.height) ||
              !map1.layers.CollisionLayer.isWalkable(x + player.width, y + player.height)
            ) {
              return;
            }
          }
          player.update();
        }

        app.ticker.add(delta => play(delta));
      });

    return () => {
      player.destroy();
    }
  }, []);

  const handleMove = (x, y) => {
    store.current.player.vx = x * 5;
    store.current.player.vy = y * 5;
  }

  return (
    <div>
      <div ref={ref} style={{height: 0}} />
      <JoyStick
        onMove={handleMove}
        style={{
          position: 'fixed',
          left: 0,
          bottom: 0,
          width:'100vw',
          height: '30vh',
        }} />
    </div>
  );
}
