import { Sprite } from 'pixi.js';

export default class Player extends Sprite {
  constructor(texture) {
    super(texture);

    this.init();
  }

  init() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;

    this.move = this.move.bind(this);
    this.stop = this.stop.bind(this);

    window.addEventListener('keydown', this.move, false);
    window.addEventListener('keyup', this.stop, false);
  }

  destroy() {
    window.removeEventListener('keydown', this.move, false);
    window.removeEventListener('keyup', this.stop, false);
    super.destroy();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  stop() {
    this.vx = 0;
    this.vy = 0;
  }

  move(e) {
    if (e.code === 'ArrowUp') {
      this.moveUp();
    } else if (e.code === 'ArrowLeft') {
      this.moveLeft();
    } else if (e.code === 'ArrowRight') {
      this.moveRight();
    } else if (e.code === 'ArrowDown') {
      this.moveDown();
    }
  }

  moveUp() {
    this.vx = 0;
    this.vy = -5;
  }

  moveDown() {
    this.vx = 0;
    this.vy = 5;
  }

  moveRight() {
    this.vx = 5;
    this.vy = 0;
  }

  moveLeft() {
    this.vx = -5;
    this.vy = 0;
  }
}
