import * as PIXI from 'pixi.js';

export default class TileSet {
  constructor (tileSet) {
    this.setTileSetProperties(tileSet);
    this.baseTexture = PIXI.Texture.from(tileSet.image.source);
    this.setTileTextures();
  }

  setTileSetProperties (tileSet) {
    Object.keys(tileSet).forEach((key) => {
      this[key] = tileSet[key];
    });
  }

  setTileTextures () {
    this.textures = [];
    for (let y = this.margin; y < this.image.height; y += this.tileHeight + this.spacing) {
      for (let x = this.margin; x < this.image.width; x += this.tileWidth + this.spacing) {
        const tileRectangle = new PIXI.Rectangle(x, y, this.tileWidth, this.tileHeight);
        this.textures.push(new PIXI.Texture(this.baseTexture, tileRectangle));
      }
    }
  }
}
