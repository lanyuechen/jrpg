import { Sprite, AnimatedSprite } from 'pixi.js';

export default class {
  constructor(textures) {
    this.frameCounter = 0;
    this.numberOfFrames = 0;
    this.startFrame = 0;
    this.timerInterval = undefined;

    this.sprite = this.createSprite(textures);

    if (this.sprite instanceof AnimatedSprite) {
      this.sprite.show = this.show.bind(this);
      this.sprite.playAnimation = this.playAnimation.bind(this);
    }
  }

  createSprite(textures, x = 0, y = 0, width, height) {
    let sprite;
    
    if (Array.isArray(textures)) {
      sprite = new AnimatedSprite(textures);
    } else {
      sprite = new Sprite(textures);
    }
  
    sprite.x = x;
    sprite.y = y;
  
    if (width) {
      sprite.width = width;
    }
    if (height) {
      sprite.height = height;
    }
  
    return sprite;
  }

  show(frameNumber) {
    this.reset();
    this.sprite.gotoAndStop(frameNumber);
  }

  playAnimation(sequenceArray = []) {
    this.reset();

    this.sprite.fps = this.sprite.fps || 12;

    const frameRate = 1000 / this.sprite.fps;

    let endFrame = 0;

    if (!sequenceArray) {
      this.startFrame = 0;
      endFrame = this.sprite.totalFrames - 1;
    } else {
      this.startFrame = sequenceArray[0];
      endFrame = sequenceArray[1];
    }

    this.numberOfFrames = endFrame - this.startFrame;

    this.sprite.gotoAndStop(this.startFrame);

    this.frameCounter = 1;

    if (!this.sprite.animating) {
      this.timerInterval = setInterval(this.advanceFrame.bind(this), frameRate);
      this.sprite.animating = true;
    }
  }

  advanceFrame() {
    if (this.frameCounter <= this.numberOfFrames) {
      this.sprite.gotoAndStop(this.sprite.currentFrame + 1);
      this.frameCounter += 1;
    } else {
      if (this.sprite.loop) {
        this.sprite.gotoAndStop(this.startFrame);
        this.frameCounter = 1;
      }
    }
  }

  reset() {
    clearInterval(this.timerInterval);
    this.sprite.animating = false;
  }
}
