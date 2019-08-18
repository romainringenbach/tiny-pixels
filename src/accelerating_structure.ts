export interface AcceleratingStructure {
  public registerCollisionNode(node:CollisionNode) : void;
  public updateNode(node:CollisionNode) : void;
  public getPossibleCollidingNodeFromNode(node:CollisionNode) : number[];
  public getPossibleCollidingNodeFromCoord(x:number,y:number) : number[];
  public ready();
}

export class TileMap {

  private nodes : { [id: number] : number[]; };
  private tiles : { [id: number] : number[]; };
  private tiles_size : number;
  private x : number;
  private w : number;
  private h : number;
  private w : number;
  private canRegister : number;

  public constructor(){
    this.nodes = {};
    this.tiles = {};
    this.tiles_size = tiles_size;
    this.w = 0;
    this.h = 0;
  }

  private getTileByCoord(x:number,y:number) : number {

  }

  private addNode(node:CollisionNode){

  }

  private removeNode(node:CollisionNode){

  }

  public registerCollisionNode(node:CollisionNode) : void{
    if (this.nodes[node.id] === undefined) {
      this.nodes[node.id] = {};
      
    } else {
      throw new DictionnaryError("Adding node of id: "+node.id+" failed",DictionnaryErrorType.AlreadyPresent);
    }

  }

  public updateNode(node:CollisionNode) : void{
    if (this.nodes[node.id] != undefined) {
      this.nodes[node.id] = {};
    } else {
      throw new DictionnaryError("Updating node of id: "+node.id+" failed",DictionnaryErrorType.NotPresent);
    }
  }

  public getPossibleCollidingNodeFromNode(node:CollisionNode) : number[]{

  }

  public getPossibleCollidingNodeFromCoord(x:number,y:number) : number[]{

  }
}
