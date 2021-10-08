import React, { useEffect, useRef } from 'react';
import App from '@/core';

export default function() {
  const ref = useRef();
  useEffect(() => {
    const app = new App();
    ref.current.appendChild(app.app.view);
  }, []);

  return (
    <div ref={ref}>
      hello world
    </div>
  );
}
