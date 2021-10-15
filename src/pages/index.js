import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Stage } from '@inlet/react-pixi';

import Viewport from '@/components/Viewport';
import Tilemap from '@/components/Tilemap';
import Player from '@/components/Player';
import JoyStick from '@/components/JoyStick';

export default function() {
  const ref = useRef();
  const viewportRef = useRef();
  const playerRef = useRef();
  const [textures, setTextures] = useState([]);

  const handleMove = (direction) => {
    const player = playerRef.current;
    if (direction === 'up') {
      player.playAnimation(player.states.walkUp);
      player.move(0, -5);
    } else if (direction === 'left') {
      player.playAnimation(player.states.walkLeft);
      player.move(-5, 0);
    } else if (direction === 'right') {
      player.playAnimation(player.states.walkRight);
      player.move(5, 0);
    } else if (direction === 'down') {
      player.playAnimation(player.states.walkDown);
      player.move(0, 5);
    } else {
      player.move(0, 0);
    }
  }

  const handleKeyDown = useCallback((e) => {
    const direction = e.code.toLowerCase().replace('arrow', '');

    handleMove(direction);
  }, []);

  const handleKeyUp = useCallback((e) => {
    const player = playerRef.current;
    const direction = e.code.toLowerCase().replace('arrow', '');

    player.show(player.states[direction]);
    player.move(0, 0);
  }, []);

  useEffect(() => {
    const app = ref.current.app;
    app.loader
      .add([
        'images/Iori.json',
      ])
      .load(() => {
        const _textures = app.loader.resources["images/Iori.json"].textures;
        const rs = [];
        for (let i = 0; i < 16; i++) {
          rs.push(_textures[`Iori.png${i}`]);
        }
        setTextures(rs);
      });

    window.addEventListener('keydown', handleKeyDown, false);
    window.addEventListener('keyup', handleKeyUp, false);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, false);
      window.removeEventListener('keyup', handleKeyUp, false);
    }

  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (viewportRef.current && playerRef.current) {
      viewportRef.current.follow(playerRef.current);
    }
  }, [textures]);

  return (
    <>
      <Stage
        ref={ref}
        width={window.innerWidth}
        height={window.innerHeight}
        options={{
          antialias: true,
          backgroundAlpha: 0,
        }}
      >
        <Viewport
          ref={viewportRef}
          worldWidth={640}
          worldHeight={1280}
          // plugins={['drag', 'pinch', 'wheel', 'decelerate']}
        >
          <Tilemap src="/jrpg/maps/test.tmx" />
          {textures.length > 0 && (
            <Player
              ref={playerRef}
              textures={textures}
              worldWidth={640}
              worldHeight={1280}
            />
          )}
        </Viewport>
      </Stage>
      <JoyStick
        onMove={handleMove}
        style={{
          position: 'fixed',
          left: 0,
          bottom: 0,
          width:'100vw',
          height: '30vh',
        }} />
    </>
  );
}
