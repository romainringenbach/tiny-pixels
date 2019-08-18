import {CollisionNode} from "./collision_node";
import {DictionnaryErrorType,DictionnaryError} from "./error";

export interface AcceleratingStructure {
  registerCollisionNode(node:CollisionNode) : void;
  updateNode(node:CollisionNode) : void;
  getPossibleCollidingNodeFromNode(node:CollisionNode) : number[];
  getPossibleCollidingNodeFromCoord(x:number,y:number) : number[];
  ready():void;
}

export class TileMap {

  private nodes : { [id: number] : number[]; };
  private tiles : { [id: number] : number[]; };
  private tiles_size : number;
  private x : number;
  private y : number;
  private w : number;
  private h : number;

  public constructor(){
    this.nodes = {};
    this.tiles = {};
    this.tiles_size = 0;
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
  }

  private getTileByCoord(x:number,y:number) : number {
    return 0;
  }

  private addNode(node:CollisionNode){

  }

  private removeNode(node:CollisionNode){

  }

  public registerCollisionNode(node:CollisionNode) : void{
    if (this.nodes[node.id] === undefined) {
      this.nodes[node.id] = [];

    } else {
      throw new DictionnaryError("Adding node of id: "+node.id+" failed",DictionnaryErrorType.AlreadyPresent);
    }

  }

  public updateNode(node:CollisionNode) : void{
    if (this.nodes[node.id] != undefined) {
      this.nodes[node.id] = [];
    } else {
      throw new DictionnaryError("Updating node of id: "+node.id+" failed",DictionnaryErrorType.NotPresent);
    }
  }

  public getPossibleCollidingNodeFromNode(node:CollisionNode) : number[]{
    return [];
  }

  public getPossibleCollidingNodeFromCoord(x:number,y:number) : number[]{
    return [];
  }

  public ready(): void {

  }
}
