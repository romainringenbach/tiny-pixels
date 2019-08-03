import {Node} from "./node";
import {Engine} from "./engine";

export class Game{
  _scenes_root : Node
  engine : Engine
  _canvas : any

  constructor(canvas : any){
    this._scenes_root = new Node("null",null);
    this._canvas = canvas;
    this.engine = new Engine(this._canvas)
  }

  createScene(name : string) : Node{
    return new Node(name,this._scenes_root)
  }

  run(){
    this.engine.run()
  }

}
