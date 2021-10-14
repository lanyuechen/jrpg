import { forwardRef } from 'react';
import { Viewport } from 'pixi-viewport';
import { PixiComponent, useApp } from '@inlet/react-pixi';

// create and instantiate the viewport component
// we share the ticker and interaction from app
const ViewportComponent = PixiComponent('Viewport', {
  create(props) {
    const { app, ...viewportProps } = props;

    const viewport = new Viewport({
      ticker: props.app.ticker,
      interaction: props.app.renderer.plugins.interaction,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      ...viewportProps
    });

    viewport.clamp({
      direction: 'all',
      underflow: 'center',
    });

    // activate plugins
    (props.plugins || []).forEach((plugin) => {
      viewport[plugin]();
    });

    return viewport;
  },

  applyProps(viewport, _oldProps, _newProps) {
    const { plugins: oldPlugins, children: oldChildren, ...oldProps } = _oldProps;
    const { plugins: newPlugins, children: newChildren, ...newProps } = _newProps;

    Object.keys(newProps).forEach((p) => {
      if (oldProps[p] !== newProps[p]) {
        viewport[p] = newProps[p];
      }
    });
  },

  didMount() {
    console.log('viewport mounted');
  }
});

// create a component that can be consumed
// that automatically pass down the app
export default forwardRef((props, ref) => (
  <ViewportComponent ref={ref} app={useApp()} {...props} />
));
