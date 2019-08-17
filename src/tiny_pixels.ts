
import {MatricesStack} from "./matrices_stack";
import {Program} from "./program";
import {Mat4} from "./maths";
import {DictionnaryErrorType,DictionnaryError} from "./error";
import {Engine} from "./engine"
import {Camera} from "./camera"
import {Transform} from "./transform"
import {Node} from "./node"
import {Inputs} from "./inputs"

export {MatricesStack} from "./matrices_stack";
export {Program} from "./program";
export {Mat4} from "./maths";
export {DictionnaryErrorType,DictionnaryError} from "./error";
export {ProgramErrorType,ProgramError} from "./error";
export {Engine} from "./engine"
export {Camera} from "./camera"
export {Transform} from "./transform"
export {Node} from "./node"
export {Inputs} from "./inputs"

export class TinyPixels extends Node implements Engine {

    private canvas : HTMLCanvasElement
    private programs : { [id: string] : Program; };
    private current_program : string | null;
    private matrices_stack : MatricesStack;
    private gl_ctx : any;
    private current_scene : string | null;
    private last_call : number
    public readonly camera : Camera;
    private scenes : { [id: string] : Node; };
    public readonly inputs : Inputs;

    public constructor(canvas : HTMLCanvasElement, inputs:Inputs){
      super();
      this.programs = {};
      this.current_program = null;
      this.matrices_stack = new MatricesStack();
      this.canvas = canvas;
      this.gl_ctx = this.canvas.getContext("webgl");
      this.current_scene = null;
      this.last_call = -1;
      this.camera = new Camera();
      this.scenes = {};
      this.inputs = inputs;
    }

    public addProgram(name: string,program:Program){
      if (this.programs[name] === undefined) {
        this.programs[name] = program;
        this.programs[name].create(this.gl_ctx);
      } else {
        throw new DictionnaryError("Adding program of name: "+name+" failed",DictionnaryErrorType.AlreadyPresent);
      }
    }

    public programExist(name:string) : boolean {
      return (this.programs[name] != undefined)
    }

    public useProgram(name:string){
      if (this.programs[name] != undefined) {
        this.current_program = name;
        this.programs[name].use(this.gl_ctx,this.camera.projection_matrix,this.camera.view_matrix,this.matrices_stack.cursor);
      } else {
        throw new DictionnaryError("Using program "+name+" failed",DictionnaryErrorType.NotPresent);
      }
    }

    public getAttributeLocation(name:string) : any {
      if (this.current_program != null) {
        return this.programs[this.current_program].getAttributeLocation(name);
      } else {
        throw new DictionnaryError("Current program not set up",DictionnaryErrorType.NotPresent);
      }
    }

    public getUniformLocation(name:string) : any {
      if (this.current_program != null) {
        return this.programs[this.current_program].getUniformLocation(name);
      } else {
        throw new DictionnaryError("Current program not set up",DictionnaryErrorType.NotPresent);
      }
    }

    public addNodeAsScene(name:string,child:Node){
      if (this.scenes[name] === undefined) {
        this.scenes[name] = child;
      } else {
        throw new DictionnaryError("Adding scene of name: "+name+" failed",DictionnaryErrorType.AlreadyPresent);
      }
    }

    public launchNodeAsScene(name:string){
      if (this.scenes[name] != undefined) {
          super.removeChild(this.current_scene!);
          this.current_scene = name;
          super.addChild(this.current_scene!,this.scenes[name]);
      } else {
        throw new DictionnaryError("launch scene : "+name+" failed",DictionnaryErrorType.NotPresent);
      }

    }

    public getCurrentScene():string|null {
      return this.current_scene;
    }

    public addChild(name:string,child:Node){}

    public remove(name:string){}

    public stackApply(transform:Transform) : void{
      this.matrices_stack.apply(transform)
    }
    public stackPop() : void{
      this.matrices_stack.pop()
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
          this.gl_ctx.clearColor(0, 0, 0, 0);
          this.gl_ctx.clear(this.gl_ctx.COLOR_BUFFER_BIT);
          this._process(this,delta);
          this._draw(this.gl_ctx,this,delta);
          this.matrices_stack.pop()
      }
    }

    public run(){
      this._ready(this.gl_ctx,this);
      let engine = this;
      window.requestAnimationFrame(engine.oneIter);
    }
}
