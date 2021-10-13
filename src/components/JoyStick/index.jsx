import React, { useEffect, useRef } from 'react';

import nipple from 'nipplejs';

export default (props) => {
  const { style, onMove } = props;
  const ref = useRef();
  useEffect(() => {
    const manager = nipple.create({
      zone: ref.current,
      mode: 'dynamic',
      color: '#aaa',
      position: {
        left: '50%',
        bottom: '50%'
      },
    });

    manager.on('move', (evt, data) => {
      if (data.vector) {
        onMove(data.vector.x, -data.vector.y);
      }
    });

    manager.on('end', (evt, data) => {
      onMove(0, 0);
    });
    
  }, []);

  return (
    <div ref={ref} style={style} />
  );
}
