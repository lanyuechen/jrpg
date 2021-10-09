import React, { useEffect, useRef } from 'react';

import nipple from 'nipplejs';

export default () => {
  const ref = useRef();
  useEffect(() => {
    const manager = nipple.create({
      zone: ref.current,
      mode: 'static',
      color: '#aaa',
      position: {
        left: '10%',
        bottom: '10%'
      },
    });
    
  }, []);

  return (
    <div ref={ref} style={{left: 0, top: 0, width: '100vw', height: '100vh', position: 'fixed'}} />
  );
}
