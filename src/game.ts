import {Node} from "./node";
import {Engine} from "./engine";

export class Game{
  private scenes_root : Node;
  public engine : Engine;
  private canvas : HTMLCanvasElement;
  public screen_rez_x : number;
  public screen_rez_y : number;

  public constructor(canvas : HTMLCanvasElement, screen_rez_x:number, screen_rez_y:number){
    this.scenes_root = new Node("null",null);
    this.canvas = canvas;
    this.engine = new Engine(this.canvas);
  }

  public createScene(name : string) : Node{
    return new Node(name,this.scenes_root);
  }

  public run(){
    this.engine.run();
  }

}
