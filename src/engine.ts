
import {MatricesStack} from "./matrices_stack";
import {Node} from "./node";
import {Program} from "./program";
import {Mat4} from "./maths";
import {Error} from "./error";

export class Engine {

    private programs : { [id: string] : Program; };
    private matrices_stack : MatricesStack;
    private gl_ctx : any;
    private current_scene : Node | null;
    private last_call : number

    public constructor(canvas : any){
      this.programs = {};
      this.matrices_stack = new MatricesStack();
      this.gl_ctx = canvas.getContext("webgl");
      this.current_scene = null;
      this.last_call = -1;
    }

    public addProgram(name: string,vertex_source: string,fragment_source: string){
      if (this.programs[name] === undefined) {
        this.programs[name] = new Program(vertex_source,fragment_source);
        this.programs[name]._create(this.gl_ctx);
      } else {
        throw new DictionnaryError("Adding program of name: "+name+" failed",DictionnaryErrorType.AlreadyPresent)
      }
    }

    public launchScene(scene : Node){
      this.current_scene = scene;
    }


    private _process(node : Node,delta : number,){
      let child_names = node.childs.keys();
      for (var name in child_names) {
        this._process(node.childs[name],delta);
      }
      node.process(delta);
    }

    private process(delta:number){
      this._process(this.current_scene,delta);
    }

    private _draw(node : Node,delta : number,){
      let child_names = node.childs.keys();
      this.matrices_stack.apply(node.transform);
      for (var name in child_names) {
        this._draw(node.childs[name],delta);
      }
      node.draw(delta);
      this.matrices_stack.pop();
    }

    private draw(delta:number){
      this.matrices_stack._push(Mat4.orthographic(0, this.gl_ctx.canvas.width, this.gl_ctx.canvas.height, 0, -1, 1));
      this._draw(this.current_scene,delta);
    }

    private oneIter(){
      if (this.current_scene != null) {
          let delta = 0;
          if (this.last_call == -1) {
              this.last_call == Date.now();
          } else {
              let now = Date.now();
              delta = now - this.last_call;
              this.last_call == now;
          }
          process(delta);
          draw(delta);
      }
    }

    public run(){
      let engine = this;
      window.requestAnimationFrame(engine.oneIter);
    }
}
