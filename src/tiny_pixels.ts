
import {MatricesStack} from "./matrices_stack";
import {Program} from "./program";
import {Mat4} from "./maths";
import {Error} from "./error";
import {Engine} from "./engine"

export * from "./node";
export * from "./program";
export * from "./maths";
export * from "./error";

export class TinyPixels extends Node implements Engine {

    private canvas : HTMLCanvasElement
    private programs : { [id: string] : Program; };
    private matrices_stack : MatricesStack;
    private gl_ctx : any;
    private current_scene : string | null;
    private last_call : number

    public constructor(canvas : HTMLCanvasElement){
      this.programs = {};
      this.matrices_stack = new MatricesStack();
      this.canvas = canvas;
      this.gl_ctx = this.canvas.getContext("webgl");
      this.current_scene = null;
      this.last_call = -1;
    }

    public addProgram(name: string,program:Program){
      if (this.programs[name] === undefined) {
        this.programs[name] = program;
        this.programs[name].create(this.gl_ctx);
      } else {
        throw new DictionnaryError("Adding program of name: "+name+" failed",DictionnaryErrorType.AlreadyPresent)
      }
    }

    public setCurrentProgram(name:string){

    }

    public addScene(name:string,scene:Scene){
      super.addChild(name,scene);
    }

    public launchScene(name:string){
      if (this.childs[name] != undefined) {
          this.current_scene = name;
      } else {
        throw new DictionnaryError("launch scene : "+name+" failed",DictionnaryErrorType.NotPresent)
      }

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
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);
          this.childs[this.current_scene]._process(this,delta);
          this.matrices_stack.push(Mat4.orthographic(0, this.gl_ctx.canvas.width, this.gl_ctx.canvas.height, 0, -1, 1));
          this.childs[this.current_scene]._draw(this.gl_ctx,this,delta);
          this.matrices_stack.pop()
      }
    }

    public run(){
      this._ready();

      let engine = this;
      window.requestAnimationFrame(engine.oneIter);
    }
}
