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

  const handleKeyDown = useCallback((e) => {
    const viewport = viewportRef.current;
    const player = playerRef.current;

    // 玩家移动
    const x = player.x + player.vx;
    const y = player.y + player.vy;
    
    if (e.code === 'ArrowUp') {
      playerRef.current.move(0, -5);
    } else if (e.code === 'ArrowLeft') {
      playerRef.current.move(-5, 0);
    } else if (e.code === 'ArrowRight') {
      playerRef.current.move(5, 0);
    } else if (e.code === 'ArrowDown') {
      playerRef.current.move(0, 5);
    }
  }, []);

  const handleKeyUp = useCallback(() => {
    playerRef.current.move(0, 0);
  }, []);

  useEffect(() => {
    const app = ref.current.app;
    app.loader
      .add([
        'images/treasureHunter.json',
      ])
      .load(() => {
        setTextures(app.loader.resources["images/treasureHunter.json"].textures)
      });

    window.addEventListener('keydown', handleKeyDown, false);
    window.addEventListener('keyup', handleKeyUp, false);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, false);
      window.removeEventListener('keyup', handleKeyUp, false);
    }

  }, []);

  useEffect(() => {
    if (viewportRef.current && playerRef.current) {
      viewportRef.current.follow(playerRef.current);
    }
  }, [textures]);

  const handleMove = (x, y) => {
    console.log(x, y);
  }

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
          <Tilemap />
          <Player
            ref={playerRef}
            texture={textures["explorer.png"]}
            worldWidth={640}
            worldHeight={1280}
          />
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
