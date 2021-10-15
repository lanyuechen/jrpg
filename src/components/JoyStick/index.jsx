import React, { useEffect, useRef } from 'react';

import nipple from 'nipplejs';

export default (props) => {
  const { style, onMove } = props;
  const ref = useRef();
  useEffect(() => {
    const manager = nipple.create({
      zone: ref.current,
      mode: 'static',
      color: '#aaa',
      position: {
        left: '50%',
        bottom: '50%'
      },
    });

    manager.on('move', (evt, data) => {
      if (data.vector) {
        onMove(data.direction?.angle);
        // onMove(data.vector.x, -data.vector.y);
      }
    });

    manager.on('end', (evt, data) => {
      onMove();
    });
    
  }, [onMove]);

  return (
    <div ref={ref} style={style} />
  );
}
