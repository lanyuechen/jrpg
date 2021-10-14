import { forwardRef } from 'react';
import { Sprite } from 'pixi.js';
import { PixiComponent, useTick } from '@inlet/react-pixi';

const PlayerComponent = PixiComponent('Player', {
  create(props) {
    const { texture, worldWidth, worldHeight } = props;
    const player = new Sprite(texture);

    player.x = 0;
    player.y = 0;
    player.vx = 0;
    player.vy = 0;

    player.move = (x, y) => {
      player.vx = x;
      player.vy = y;
    };

    player.update = () => {
      const x = player.x + player.vx;
      const y = player.y + player.vy;

      if (
        x < 0 ||
        y < 0 ||
        x + player.width > worldWidth ||
        y + player.height > worldHeight
      ) {
        return;
      }
      player.x = x;
      player.y = y;
    };
    
    return player;
  },

  applyProps(player, oldProps, newProps) {
    Object.keys(newProps).forEach((p) => {
      if (oldProps[p] !== newProps[p]) {
        player[p] = newProps[p];
      }
    });
  },

  didMount() {
    console.log('player mounted');
  }
});

export default forwardRef((props, ref) => {
  useTick((delta) => {
    if (ref.current) {
      ref.current.update();
    }
  });

  return (
    <PlayerComponent ref={ref} {...props} />
  );
});