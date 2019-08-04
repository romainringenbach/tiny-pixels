import {Transform} from "./transform";

export class Node {

  public transform : Transform;
  public readonly childs : any
  public parent : Node | null;

  public constructor(name : string, parent : Node | null){

    this.transform = new Transform();
    this.childs = {};
    this.parent = parent;
  }

  public addChild(name:string,child:Node){
    if (this.childs[name] === undefined) {
        this.childs[name] = child;
    } else {
      throw new DictionnaryError("Adding node of name: "+name+" failed",DictionnaryErrorType.AlreadyPresent)
    }
  }

  public process(delta : number){

  }

  public draw(delta : number){

  }

}
