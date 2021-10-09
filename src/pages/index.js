import React, { useEffect, useRef } from 'react';
import { Application, Loader, Sprite } from 'pixi.js';

import TiledMap from '@/core/TiledLoader/TiledMap';
import keyboard from '@/core/utils/keyboard';

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
        const player = new Sprite(textures["explorer.png"]);
        player.x = 0;
        player.y = 0;
        player.vx = 0;
        player.vy = 0;
        app.stage.addChild(player);

        //Capture the keyboard arrow keys
        let left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);

        // Left arrow key `press` method
        left.press = function() {
          // Change the explorer's velocity when the key is pressed
          player.vx = -5;
          player.vy = 0;
        };

        //Left arrow key `release` method
        left.release = function() {

          //If the left arrow has been released, and the right arrow isn't down,
          //and the explorer isn't moving vertically:
          //Stop the explorer
          if (!right.isDown && player.vy === 0) {
            player.vx = 0;
          }
        };

        //Up
        up.press = function() {
          player.vy = -5;
          player.vx = 0;
        };
        up.release = function() {
          if (!down.isDown && player.vx === 0) {
            player.vy = 0;
          }
        };

        //Right
        right.press = function() {
          player.vx = 5;
          player.vy = 0;
        };
        right.release = function() {
          if (!left.isDown && player.vy === 0) {
            player.vx = 0;
          }
        };

        //Down
        down.press = function() {
          player.vy = 5;
          player.vx = 0;
        };
        down.release = function() {
          if (!up.isDown && player.vx === 0) {
            player.vy = 0;
          }
        };

        const play = (delta) => {
          // 玩家移动
          const x = player.x + player.vx;
          const y = player.y + player.vy;
          if (!map1.layers.CollisionLayer.isWalkable(x, y)) {
            return;
          }

          player.x = x;
          player.y = y;
          if (player.x < 0) {
            player.x = 0;
          }
          if (player.x > 225) {
            player.x = 225;
          }
          if (player.y < 0) {
            player.y = 0;
          }
          if (player.y > 225) {
            player.y = 225;
          }
        }

        app.ticker.add(delta => play(delta));
      });
  }, []);

  return (
    <div ref={ref}>

    </div>
  );
}
