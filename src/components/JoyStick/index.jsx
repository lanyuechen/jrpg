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
        left: '50%',
        top: '50%'
      },
    });
    
  }, []);

  return (
    <div ref={ref} style={{width: '100%', height: 300, position: 'relative'}} />
  );
}
