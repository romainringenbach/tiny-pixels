import {Transform} from "./transform";
import {Engine} from "./engine";
import {DictionnaryErrorType,DictionnaryError} from "./error";

export class Node {

  private childs : { [id: string] : Node; };
  private parent : Node | null;
  public transform : Transform;

  public constructor(){
    this.transform = new Transform();
    this.childs = {};
    this.parent = null;
  }

  public addChild(name:string,child:Node){
    if (this.childs[name] === undefined) {
      this.childs[name] = child;
      child.parent = this;
    } else {
      throw new DictionnaryError("Adding node of name: "+name+" failed",DictionnaryErrorType.AlreadyPresent);
    }
  }

  public removeChild(name:string){
    if (this.childs[name] != undefined) {
      delete this.childs[name];
    } else {
      throw new DictionnaryError("Removing node of name: "+name+" failed",DictionnaryErrorType.NotPresent);
    }
  }

  protected _getNode(path:string[],_path:string) : Node{
    if (path[0] === '') {
      if (this.parent != null) {
        path.shift();
        return this.parent._getNode(path,_path+='.');
      } else {
        throw new DictionnaryError("Get parent at path "+_path+" failed",DictionnaryErrorType.NotPresent);
      }

    } else if (path.length > 0) {
      var child =  path.shift();
      if (this.childs[child!] != undefined) {
        return this.childs[child!]._getNode(path,_path+=child+'.');
      } else {
        throw new DictionnaryError("Get node "+child+" at path "+_path+" failed",DictionnaryErrorType.NotPresent);
      }
    } else if (path.length == 0){
      return this;
    }
    return new Node();
  }

  public getNode(path:string) : Node{ // get node with something like name1.name2.name3... etc
    var elements = path.split('.');

    return this._getNode(elements,"");
  }

  protected _ready(engine: Engine){
    for (var name in this.childs) {
      this.childs[name]._ready(engine)
    }
    this.ready(engine);
  }

  protected ready(engine: Engine){}

  protected _process(engine: Engine ,delta : number){
    for (var name in this.childs) {
      this.childs[name]._process(engine,delta)
    }
    this.process(engine,delta);
  }

  protected process(engine: Engine ,delta : number){}

  protected _draw(gl : any, engine: Engine ,delta : number){
    engine.stackApply(this.transform);
    for (var name in this.childs) {
      this.childs[name]._draw(gl,engine,delta)
    }
    this.draw(gl,engine,delta);
    engine.stackPop();
  }

  protected draw(engine: Engine ,gl : any,delta : number){}

  // Note : the node returned is parentless
  public clone() : Node {
    let n = new Node();
    n.copyFrom(this);
    return n;
  }

  protected copyFrom(node : Node) : void{
    this.transform = node.transform.clone();

    for (var name in this.childs) {
      this.childs[name].parent = null;
    }

    this.childs = {};

    for (var name in node.childs) {
      this.addChild(name,this.childs[name].clone());
    }

  }

}
