import * as PIXI from 'pixi.js';

import keyboard from '@/core/utils/keyboard';
import { hitTestRectangle, randomInt, contain } from '@/core/utils/utils';

const TYPE = PIXI.utils.isWebGLSupported() ? 'WebGL' : 'canvas';

export default class App {
  constructor() {
    PIXI.utils.sayHello(TYPE);

    this.app = new PIXI.Application({
      width: 512,         // default: 800
      height: 512,        // default: 600
      antialias: true,    // default: false
      // transparent: false, // default: false
      // resolution: 1,      // default: 1
      // forceCanvas: true,  // defualt false
    });

    this.init();
  }

  init() {
    this.app.loader
      .add([
        'images/treasureHunter.json'
      ])
      .load(() => this.setup());
  }

  setup() {
    const textures = this.app.loader.resources["images/treasureHunter.json"].textures;
    //Create the `gameScene` group
    const gameScene = new PIXI.Container();
    this.app.stage.addChild(gameScene);
    this.gameScene = gameScene;

    // Dungeon
    const dungeon = new PIXI.Sprite(textures["dungeon.png"]);
    gameScene.addChild(dungeon);
    this.dungeon = dungeon;

    // Door
    const door = new PIXI.Sprite(textures["door.png"]);
    door.position.set(32, 0);
    gameScene.addChild(door);
    this.door = door;

    // Explorer
    const explorer = new PIXI.Sprite(textures["explorer.png"]);
    explorer.x = 68;
    explorer.y = gameScene.height / 2 - explorer.height / 2;
    explorer.vx = 0;
    explorer.vy = 0;
    gameScene.addChild(explorer);
    this.explorer = explorer;

    // Treasure
    const treasure = new PIXI.Sprite(textures["treasure.png"]);
    treasure.x = gameScene.width - treasure.width - 48;
    treasure.y = gameScene.height / 2 - treasure.height / 2;
    gameScene.addChild(treasure);
    this.treasure = treasure;

    // Make the blobs
    let numberOfBlobs = 6,
      spacing = 48,
      xOffset = 150,
      speed = 2,
      direction = 1;

    //An array to store all the blob monsters
    this.blobs = [];

    //Make as many blobs as there are `numberOfBlobs`
    for (let i = 0; i < numberOfBlobs; i++) {

      //Make a blob
      let blob = new PIXI.Sprite(textures["blob.png"]);

      //Space each blob horizontally according to the `spacing` value.
      //`xOffset` determines the point from the left of the screen
      //at which the first blob should be added
      let x = spacing * i + xOffset;

      //Give the blob a random y position
      let y = randomInt(0, this.app.stage.height - blob.height);

      //Set the blob's position
      blob.x = x;
      blob.y = y;

      //Set the blob's vertical velocity. `direction` will be either `1` or
      //`-1`. `1` means the enemy will move down and `-1` means the blob will
      //move up. Multiplying `direction` by `speed` determines the blob's
      //vertical direction
      blob.vy = speed * direction;

      //Reverse the direction for the next blob
      direction *= -1;

      //Push the blob into the `blobs` array
      this.blobs.push(blob);

      //Add the blob to the `gameScene`
      gameScene.addChild(blob);
    }

    // Create the health bar
    const healthBar = new PIXI.Container();
    healthBar.position.set(this.app.stage.width - 170, 4)
    gameScene.addChild(healthBar);
    this.healthBar = healthBar;

    // Create the black background rectangle
    const innerBar = new PIXI.Graphics();
    innerBar.beginFill(0x000000);
    innerBar.drawRect(0, 0, 128, 8);
    innerBar.endFill();
    healthBar.addChild(innerBar);

    // Create the front red rectangle
    let outerBar = new PIXI.Graphics();
    outerBar.beginFill(0xFF3300);
    outerBar.drawRect(0, 0, 128, 8);
    outerBar.endFill();
    healthBar.addChild(outerBar);

    healthBar.outer = outerBar;

    // Create the `gameOver` scene
    const gameOverScene = new PIXI.Container();
    this.app.stage.addChild(gameOverScene);
    this.gameOverScene = gameOverScene;

    // Make the `gameOver` scene invisible when the game first starts
    gameOverScene.visible = false;

    // Create the text sprite and add it to the `gameOver` scene
    const style = new PIXI.TextStyle({
      fontFamily: "Futura",
      fontSize: 64,
      fill: "white"
    });
    const message = new PIXI.Text("The End!", style);
    message.x = 120;
    message.y = this.app.stage.height / 2 - 32;
    gameOverScene.addChild(message);
    this.message = message;

    //Capture the keyboard arrow keys
    let left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);

    // Left arrow key `press` method
    left.press = function() {

      // Change the explorer's velocity when the key is pressed
      explorer.vx = -5;
      explorer.vy = 0;
    };

    //Left arrow key `release` method
    left.release = function() {

      //If the left arrow has been released, and the right arrow isn't down,
      //and the explorer isn't moving vertically:
      //Stop the explorer
      if (!right.isDown && explorer.vy === 0) {
        explorer.vx = 0;
      }
    };

    //Up
    up.press = function() {
      explorer.vy = -5;
      explorer.vx = 0;
    };
    up.release = function() {
      if (!down.isDown && explorer.vx === 0) {
        explorer.vy = 0;
      }
    };

    //Right
    right.press = function() {
      explorer.vx = 5;
      explorer.vy = 0;
    };
    right.release = function() {
      if (!left.isDown && explorer.vy === 0) {
        explorer.vx = 0;
      }
    };

    //Down
    down.press = function() {
      explorer.vy = 5;
      explorer.vx = 0;
    };
    down.release = function() {
      if (!up.isDown && explorer.vx === 0) {
        explorer.vy = 0;
      }
    };
  
    //set the game state to `play`
    this.state = this.play;
  
    //Start the game loop
    this.app.ticker.add(delta => this.gameLoop(delta));
  }

  gameLoop(delta){

    //Update the current game state:
    this.state(delta);
  }

  play(delta) {
    //use the explorer's velocity to make it move
    this.explorer.x += this.explorer.vx;
    this.explorer.y += this.explorer.vy;
  
    //Contain the explorer inside the area of the dungeon
    contain(this.explorer, {x: 28, y: 10, width: 488, height: 480});
    //contain(explorer, stage);
  
    //Set `explorerHit` to `false` before checking for a collision
    let explorerHit = false;
  
    //Loop through all the sprites in the `enemies` array
    this.blobs.forEach((blob) => {
  
      //Move the blob
      blob.y += blob.vy;
  
      //Check the blob's screen boundaries
      let blobHitsWall = contain(blob, {x: 28, y: 10, width: 488, height: 480});
  
      //If the blob hits the top or bottom of the stage, reverse
      //its direction
      if (blobHitsWall === "top" || blobHitsWall === "bottom") {
        blob.vy *= -1;
      }
  
      //Test for a collision. If any of the enemies are touching
      //the explorer, set `explorerHit` to `true`
      if(hitTestRectangle(this.explorer, blob)) {
        explorerHit = true;
      }
    });
  
    //If the explorer is hit...
    if(explorerHit) {
  
      //Make the explorer semi-transparent
      this.explorer.alpha = 0.5;
  
      //Reduce the width of the health bar's inner rectangle by 1 pixel
      this.healthBar.outer.width -= 1;
  
    } else {
  
      //Make the explorer fully opaque (non-transparent) if it hasn't been hit
      this.explorer.alpha = 1;
    }
  
    //Check for a collision between the explorer and the treasure
    if (hitTestRectangle(this.explorer, this.treasure)) {
  
      //If the treasure is touching the explorer, center it over the explorer
      this.treasure.x = this.explorer.x + 8;
      this.treasure.y = this.explorer.y + 8;
    }
  
    //Does the explorer have enough health? If the width of the `innerBar`
    //is less than zero, end the game and display "You lost!"
    if (this.healthBar.outer.width < 0) {
      this.state = this.end;
      this.message.text = "You lost!";
    }
  
    //If the explorer has brought the treasure to the exit,
    //end the game and display "You won!"
    if (hitTestRectangle(this.treasure, this.door)) {
      this.state = this.end;
      this.message.text = "You won!";
    } 
  }
  
  end() {
    this.gameScene.visible = false;
    this.gameOverScene.visible = true;
  }
}
