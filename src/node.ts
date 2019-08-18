import {Transform} from "./transform";
import {Engine} from "./engine";
import {DictionnaryErrorType,DictionnaryError} from "./error";

export class Node {

  private childs : { [id: string] : Node; };
  private parent : Node | null;
  public transform : Transform;
  public program : string | null;
  private signals : string[];
  private connections : { [id: string] : {[id:number] : string}; };
  public readonly id : number;

  private static nodes : Node[] = [];

  public static getNodeById(id:number):Node{
    if (id-1 >= 0 && id-1 < Node.nodes.length) {
        return Node.nodes[id-1];
    } else {
      throw new DictionnaryError("Getting node of id: "+id+" failed",DictionnaryErrorType.NotPresent);
    }

  }

  public constructor(){
    this.transform = new Transform();
    this.childs = {};
    this.parent = null;
    this.program = null;
    this.signals = [];
    this.connections = {};
    Node.nodes.push(this);
    this.id = Node.nodes.length;
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

  protected _ready(gl:any,engine: Engine){
    this.ready(gl,engine);
    for (var name in this.childs) {
      this.childs[name]._ready(gl,engine)
    }
  }

  protected ready(gl:any,engine: Engine){}

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
    if (this.program != null) {
        engine.useProgram(this.program);
    }
    this.draw(gl,engine,delta);
    engine.stackPop();
  }

  protected draw(engine: Engine ,gl : any,delta : number){}

  protected _physics_process(engine:Engine,delta:number){
    for (var name in this.childs) {
      this.childs[name]._physics_process(engine,delta)
    }
    this.physics_process(engine,delta);
  }

  protected physics_process(engine:Engine,delta:number){}



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

  protected signal(name:string){
    for (let s in this.signals) {
        if (s == name) {
            throw new DictionnaryError("Adding signal of name: "+name+" failed",DictionnaryErrorType.AlreadyPresent);
        }
    }
    this.signals.push(name);
    this.connections[name] = {};
  }

  public connect(signal:string,listener:Node,callback:string){
    if (this.connections[signal] != undefined) {
      if (this.connections[signal][listener.id] === undefined) {
        this.connections[signal][listener.id] = callback;
      } else {
        throw new DictionnaryError("Connect listener to signal of name: "+signal+" failed",DictionnaryErrorType.AlreadyPresent);
      }

    } else {
      throw new DictionnaryError("Connect to signal of name: "+signal+" failed",DictionnaryErrorType.NotPresent);
    }
  }

  public disconnect(signal:string,listener:Node){
    if (this.connections[signal] != undefined) {
      if (this.connections[signal][listener.id] != undefined) {
        delete this.connections[signal][listener.id];
      } else {
        throw new DictionnaryError("Disconnect listener to signal of name: "+signal+" failed",DictionnaryErrorType.NotPresent);
      }

    } else {
      throw new DictionnaryError("Disconnect to signal of name: "+signal+" failed",DictionnaryErrorType.NotPresent);
    }
  }

  public emitSignal(signal:string,data:object){
    if (this.connections[signal] != undefined) {

      for (let key in this.connections[signal]) {
          let n = Node.getNodeById(Number(key));
          let cb = this.connections[signal][Number(key)];
          (n as any)[cb](data);
      }

    } else {
      throw new DictionnaryError("Emit signal of name: "+signal+" failed",DictionnaryErrorType.NotPresent);
    }
  }

  public getGlobalTransform() : Transform{

    if (this.parent != null) {
      let t = this.transform.clone();
      t.apply(this.parent.getGlobalTransform());
      return t;
    } else {
      return this.transform.clone();
    }

  }

}
