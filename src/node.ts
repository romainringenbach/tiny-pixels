import {Transform} from "./transform";

export class Node {

  private childs : { [id: string] : Node; };
  public parent : Node | null;

  protected constructor(){
    this.transform = new Transform();
    this.childs = {};
    this.parent = null;
  }

  protected addChild(name:string,child:Node){
    if (this.childs[name] === undefined) {
        this.childs[name] = child;
    } else {
      throw new DictionnaryError("Adding node of name: "+name+" failed",DictionnaryErrorType.AlreadyPresent)
    }
  }

  protected getNode(path:string){ // get node with something like name1.name2.name3... etc

  }

  private _process(delta : number){
    for (var name in this.childs) {
      this.childs[name]._process(delta)
    }
    this.process(delta);
  }

  public process(delta : number){

  }

  private _draw(delta : number){
    this.matrices_stack.apply(this.transform);
    for (var name in this.childs) {
      this.childs[name]._draw(delta)
    }
    this.draw(delta);
    this.matrices_stack.pop();
  }

  public draw(delta : number){

  }

}

export class Node2D extends Node {
  public transform : Transform;
  public constructor (){
    super();
  }
  public addChild(name:string,child:Node2D){
    super.addChild(name,child);
  }
}

export class Scene extends Node {
  public constructor (){
    super();
    this.parent = null;
  }
  public addChild(name:string,child:Node){
    super.addChild(name,child);
  }
}
