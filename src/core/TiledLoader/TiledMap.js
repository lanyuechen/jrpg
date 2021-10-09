import * as PIXI from 'pixi.js';
import tmx from 'tmx-parser';

import TileSet from './TileSet';
import TileLayer from './TileLayer';
import CollisionLayer from './CollisionLayer';

export default class TiledMap extends PIXI.Container {
  static middleware (resource, next) {
    if (resource.extension !== 'tmx') {
      return next();
    }

    const xmlString = resource.xhr.responseText;
    tmx.parse(xmlString, resource.url, (error, map) => {
      if (error) throw error;

      resource.data = map;
      next();
    });
  }

  constructor (resourceId) {
    super();

    const resource = PIXI.Loader.shared.resources[resourceId];

    this.setDataProperties(resource.data);
    this.setDataTileSets(resource.data);
    this.setDataLayers(resource.data);
  }

  setDataProperties (data) {
    Object.keys(data).forEach(key => {
      this[key] = data[key];
    });
  }

  setDataTileSets (data) {
    this.tileSets = data.tileSets.map(d => new TileSet(d));
  }

  setDataLayers (data) {
    data.layers.forEach((layerData) => {
      if (layerData.type === 'tile') {
        this.setTileLayer(layerData);
        return;
      }

      this.layers[layerData.name] = layerData;
    })
  }

  setTileLayer (layerData) {
    if (layerData.name === 'Collisions') {
      this.layers.CollisionLayer = new CollisionLayer(layerData);
      return;
    }

    const tileLayer = new TileLayer(layerData, this.tileSets);
    this.layers[layerData.name] = tileLayer;
    this.addLayer(tileLayer);
  }

  addLayer (layer) {
    this.addChild(layer)
  }
}
