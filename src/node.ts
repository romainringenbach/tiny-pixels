import {Transform} from "./transform";
import {Engine} from "./engine";

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
      if (this.parent != null) {
          return this.parent.getNode(path.shift(),_path+='.');
      } else {
        throw new DictionnaryError("Get node "+child+" at path "+_path+" failed",DictionnaryErrorType.NotPresent);
      }

    } else {
      let child = path.shift();
      if (this.childs[child] != undefined) {
        return this.childs[child]._getNode(path,_path+=child+'.');
      } else {
        throw new DictionnaryError("Get node "+child+" at path "+_path+" failed",DictionnaryErrorType.NotPresent);
      }
    }
  }

  public getNode(path:string){ // get node with something like name1.name2.name3... etc
    let elements = path.split('.');

    return _getNode(path,"");
  }

  private _ready(engine: Engine ,delta : number){
    for (var name in this.childs) {
      this.childs[name]._ready(engine,delta)
    }
    this.ready(engine,delta);
  }

  protected abstract ready(engine: Engine ,delta : number);

  private _process(engine: Engine ,delta : number){
    for (var name in this.childs) {
      this.childs[name]._process(engine,delta)
    }
    this.process(engine,delta);
  }

  protected abstract process(engine: Engine ,delta : number);

  private _draw(gl : any, engine: Engine ,delta : number){
    this.matrices_stack.apply(this.transform);
    for (var name in this.childs) {
      this.childs[name]._draw(gl,engine,delta)
    }
    this.draw(gl,engine,delta);
    this.matrices_stack.pop();
  }

  protected abstract draw(engine: Engine ,gl : any,delta : number);

}

export class Node2D extends Node {
  public transform : Transform;
  public constructor (){
    super();
  }
  public addChild(name:string,child:Node2D){
    super.addChild(name,child);
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
  protected ready(delta : number){};
  protected process(delta : number){};
  protected draw(gl : any,delta : number){};
}
