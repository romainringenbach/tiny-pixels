import {CollisionNode} from "./collision_node";
import {DictionnaryErrorType,DictionnaryError} from "./error";
import {Rect} from "./maths";

export interface AcceleratingStructure {
  registerCollisionNode(node:CollisionNode) : void;
  updateNode(node:CollisionNode) : void;
  getPossibleCollidingNodeFromNode(node:CollisionNode) : number[];
  getPossibleCollidingNodeFromCoord(x:number,y:number) : number[];
  ready():void;
}



export class TileMap {

  private nodes : { [id: number] : { [id: string] : boolean; }; };
  private tiles : { [id: string] : { [id: number] : boolean; }; };
  private tiles_size : number;

  public constructor(tiles_size:number){
    this.nodes = {};
    this.tiles = {};
    if (tiles_size > 0) {
      this.tiles_size = tiles_size;
    } else {
      throw new Error("Failed to create tilemap with given tile size, value need to be > 0");
    }

  }

  private getTileByCoord(x:number,y:number) : string {
    let xt = Math.floor(x/this.tiles_size);
    let yt = Math.floor(y/this.tiles_size);

    let tile:string = xt+"x"+yt;
    return tile;
  }

  private getXYFromTileString(value:string):[number,number] {
    let elements = value.split('x');
    return [Number(elements[0]),Number(elements[1])];
  }

  public updateNode(node:CollisionNode) : void{
    if (this.nodes[node.id] != undefined) {
      let r : Rect = node.collision_shape.getBoundingRect();

      let top_left : [number,number] = this.getXYFromTileString(this.getTileByCoord(r.x,r.y));
      let bottom_right : [number,number] = this.getXYFromTileString(this.getTileByCoord(r.x+r.w,r.y+r.h));

      if (this.nodes[node.id] === undefined) {
          this.nodes[node.id] = {};
      }

      for (let k in this.nodes[node.id]) {
          this.nodes[node.id][k] = false;
      }

      for (let i = top_left[0]; i <= bottom_right[0]; i+=this.tiles_size) {
        for (let j = top_left[1]; j <= bottom_right[1]; j+=this.tiles_size) {
          let coord =  this.getTileByCoord(i,j);
          if (this.tiles[coord] === undefined) {
            this.tiles[coord] = {};
          }

          this.tiles[coord][node.id] = true;
          this.nodes[node.id][coord] = true;
        }
      }

      for (let k in this.nodes[node.id]) {
        if(this.nodes[node.id][k] == false) {
          delete this.tiles[k][node.id];
        }
        delete this.nodes[node.id][k];
      }
    } else {
      throw new DictionnaryError("Updating node of id: "+node.id+" failed",DictionnaryErrorType.NotPresent);
    }
  }

  public getPossibleCollidingNodeFromNode(node:CollisionNode) : number[]{
    if (this.nodes[node.id] != undefined) {
      let nodes:number[] = [];
      for (let k in this.nodes[node.id]) {
          for (let n in this.tiles[k]) {
              nodes.push(Number(n));
          }
      }
      return nodes;
    } else {
      throw new DictionnaryError("Updating node of id: "+node.id+" failed",DictionnaryErrorType.NotPresent);
    }
  }

  public getPossibleCollidingNodeFromCoord(x:number,y:number) : number[]{

    let nodes:number[] = [];

    let tile : string = this.getTileByCoord(x,y);

    if (this.tiles[tile] != undefined) {

      for (let n in this.tiles[this.getTileByCoord(x,y)]) {
          nodes.push(Number(n));
      }
    }
    return nodes;
  }

  public ready(): void {

  }
}
