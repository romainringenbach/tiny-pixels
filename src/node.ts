import {Transform} from "./transform";

export abstract class Node {

  private childs : { [id: string] : Node; };
  private parent : Node | null;

  protected constructor(){
    this.transform = new Transform();
    this.childs = {};
    this.parent = null;
  }

  protected addChild(name:string,child:Node){
    if (this.childs[name] === undefined) {
      this.childs[name] = child;
    } else {
      throw new DictionnaryError("Adding node of name: "+name+" failed",DictionnaryErrorType.AlreadyPresent);
    }
  }

  private _getNode(path:string[],_path:string){
    if (path[0] === '') {
      return this.parent.getNode(path.shift(),_path+='.');
    } else {
      let child = path.shift();
      if (this.childs[child] != undefined) {
        return this.childs[child]._getNode(path,_path+=child+'.');
      } else {
        throw new DictionnaryError("Get node "+child+" at path "+_path+" failed",DictionnaryErrorType.NotPresent);
      }
    }
  }

  protected getNode(path:string){ // get node with something like name1.name2.name3... etc
    let elements = path.split('.');

    return _getNode(path,"");
  }

  private _ready(delta : number){
    for (var name in this.childs) {
      this.childs[name]._ready(delta)
    }
    this.ready(delta);
  }

  protected abstract ready(delta : number);

  private _process(delta : number){
    for (var name in this.childs) {
      this.childs[name]._process(delta)
    }
    this.process(delta);
  }

  protected abstract process(delta : number);

  private _draw(gl : any, delta : number){
    this.matrices_stack.apply(this.transform);
    for (var name in this.childs) {
      this.childs[name]._draw(delta)
    }
    this.draw(gl,delta);
    this.matrices_stack.pop();
  }

  protected abstract draw(gl : any,delta : number);

}

export class Node2D extends Node {
  public transform : Transform;
  public constructor (){
    super();
  }
  public addChild(name:string,child:Node2D){
    super.addChild(name,child);
  }
  public getNode(path:string){
    super.getNode(path);
  }
  protected ready(delta : number){}
  protected process(delta : number){}
  protected draw(gl : any,delta : number){}
}

export class Scene extends Node {
  public constructor (){
    super();
    this.parent = null;
  }
  public addChild(name:string,child:Node){
    super.addChild(name,child);
  }
  public getNode(path:string){
    super.getNode(path);
  }
  protected ready(delta : number){};
  protected process(delta : number){};
  protected draw(gl : any,delta : number){};
}
