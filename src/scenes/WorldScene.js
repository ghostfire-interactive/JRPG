import JSONLevelScene from './JSONLevelScene';
import Prefab from '../prefabs/Prefab';
import TextPrefab from '../prefabs/TextPrefab';
import Player from '../prefabs/world/Player';
import Door from '../prefabs/world/Door';

class WorldScene extends JSONLevelScene {
    constructor() {
        super('WorldScene');
        
        this.prefab_classes = {
            player: Player.prototype.constructor,
            door: Door.prototype.constructor
        }
    }
    
    create () {
        this.map = this.add.tilemap(this.level_data.map.key);
        
        let tileset_index = 0;
        this.tilesets = {};
        this.map.tilesets.forEach(function (tileset) {
            let map_tileset = this.map.addTilesetImage(tileset.name, this.level_data.map.tilesets[tileset_index]);
            this.tilesets[this.level_data.map.tilesets[tileset_index]] = map_tileset;
            tileset_index += 1;
        }, this);
        
        this.layers = {};
        this.map.layers.forEach(function (layer) {
            this.layers[layer.name] = this.map.createStaticLayer(layer.name, this.tilesets[layer.properties.tileset]);
            if (layer.properties.collision) {
                this.map.setCollisionByExclusion([-1]);
            }
        }, this);
        
        super.create();
        
        this.map.objects.forEach(function (object_layer) {
            object_layer.objects.forEach(this.create_object, this);
        }, this);
    }
    
    create_object (object) {
        let position = {x: object.x + (object.width / 2), y: object.y + (object.height / 2)};
        if (this.prefab_classes.hasOwnProperty(object.type)) {
            let prefab = new this.prefab_classes[object.type](this, object.name, position, object.properties);
        }
    }
}

export default WorldScene;