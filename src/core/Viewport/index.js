import { Viewport } from 'pixi-viewport';

export default class extends Viewport {
  constructor(options) {
    super({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      ...options,
    });

    // this
    //   .drag()
    //   .pinch()
    //   .wheel()
    //   .decelerate();

    this.clamp({
      direction: 'all',
      underflow: 'center',
    });
  }
}
